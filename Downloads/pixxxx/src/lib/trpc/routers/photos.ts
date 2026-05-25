// src/lib/trpc/routers/photos.ts

import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../router"
import { TRPCError } from "@trpc/server"
import { createUploadSignedUrl, deleteFromR2, generatePhotoKeys, r2Url } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

const ratingSchema = z.object({
  composition: z.number().int().min(1).max(5),
  light:       z.number().int().min(1).max(5),
  technique:   z.number().int().min(1).max(5),
  impact:      z.number().int().min(1).max(5),
})

export const photosRouter = createTRPCRouter({

  // ── Get signed upload URL (step 1 of upload flow) ──────────────
  getUploadUrl: protectedProcedure
    .input(z.object({
      contentType: z.string(),
      fileSizeBytes: z.number().max(100 * 1024 * 1024),
    }))
    .mutation(async ({ ctx, input }) => {
      const photoId = uuidv4()
      const userId = ctx.session.user.id
      const keys = generatePhotoKeys(userId, photoId)

      const uploadUrl = await createUploadSignedUrl(keys.original, input.contentType)

      return { uploadUrl, photoId, r2Key: keys.original, thumbKey: keys.thumb800, thumbSmKey: keys.thumb400 }
    }),

  // ── Save photo metadata after successful R2 upload (step 2) ────
  create: protectedProcedure
    .input(z.object({
      photoId:     z.string().uuid(),
      title:       z.string().min(1).max(120),
      description: z.string().max(2000).optional(),
      category:    z.enum(["LANDSCAPE","PORTRAIT","STREET","ARCHITECTURE","WILDLIFE","ASTRO","MACRO","SPORT","TRAVEL","ABSTRACT"]),
      tags:        z.array(z.string()).max(10).default([]),
      locationId:  z.string().uuid().optional(),
      r2Key:       z.string(),
      thumbKey:    z.string(),
      thumbSmKey:  z.string().optional(),
      width:       z.number().int(),
      height:      z.number().int(),
      fileSizeBytes: z.number().int().optional(),
      mimeType:    z.string(),
      // EXIF
      camera:       z.string().max(80).optional(),
      lens:         z.string().max(80).optional(),
      aperture:     z.number().optional(),
      shutterSpeed: z.string().max(20).optional(),
      iso:          z.number().int().optional(),
      focalLength:  z.number().int().optional(),
      flashUsed:    z.boolean().optional(),
      shotAt:       z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.create({
        data: {
          id: input.photoId,
          userId: ctx.session.user.id,
          ...input,
        },
      })

      // Award XP for uploading
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { xpPoints: { increment: 10 } },
      })

      return photo
    }),

  // ── Get single photo with user + stats ─────────────────────────
  getById: publicProcedure
    .input(z.object({
      id:     z.string().uuid(),
      viewerId: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true, isPro: true, city: true, countryCode: true }
          },
          location: true,
          _count: { select: { comments: true, likes: true, ratings: true } },
        },
      })

      if (!photo || (!photo.isPublic && photo.userId !== ctx.session?.user?.id)) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      // Increment view count (fire & forget)
      ctx.db.photo.update({ where: { id: input.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

      // Check if viewer has liked / saved / rated
      let isLiked = false, isSaved = false, myRating = null
      const viewerId = input.viewerId ?? ctx.session?.user?.id
      if (viewerId) {
        const [like, save, rating] = await Promise.all([
          ctx.db.like.findUnique({ where: { photoId_userId: { photoId: input.id, userId: viewerId } } }),
          ctx.db.savedPhoto.findUnique({ where: { photoId_userId: { photoId: input.id, userId: viewerId } } }),
          ctx.db.photoRating.findUnique({ where: { photoId_userId: { photoId: input.id, userId: viewerId } } }),
        ])
        isLiked = !!like
        isSaved = !!save
        myRating = rating
      }

      return { ...photo, isLiked, isSaved, myRating }
    }),

  // ── Like / Unlike ──────────────────────────────────────────────
  toggleLike: protectedProcedure
    .input(z.object({ photoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const key = { photoId: input.photoId, userId: ctx.session.user.id }
      const existing = await ctx.db.like.findUnique({ where: { photoId_userId: key } })

      if (existing) {
        await ctx.db.like.delete({ where: { photoId_userId: key } })
        await ctx.db.photo.update({ where: { id: input.photoId }, data: { likeCount: { decrement: 1 } } })
        return { liked: false }
      } else {
        await ctx.db.like.create({ data: key })
        await ctx.db.photo.update({ where: { id: input.photoId }, data: { likeCount: { increment: 1 } } })
        return { liked: true }
      }
    }),

  // ── Rate a photo ───────────────────────────────────────────────
  rate: protectedProcedure
    .input(z.object({ photoId: z.string().uuid() }).merge(ratingSchema))
    .mutation(async ({ ctx, input }) => {
      const { photoId, ...scores } = input
      const userId = ctx.session.user.id

      // Can't rate your own photo
      const photo = await ctx.db.photo.findUnique({ where: { id: photoId }, select: { userId: true } })
      if (photo?.userId === userId) throw new TRPCError({ code: "FORBIDDEN", message: "Cannot rate your own photo" })

      await ctx.db.photoRating.upsert({
        where: { photoId_userId: { photoId, userId } },
        create: { photoId, userId, ...scores },
        update: scores,
      })

      // Recalculate avg rating
      const agg = await ctx.db.photoRating.aggregate({
        where: { photoId },
        _avg: { composition: true, light: true, technique: true, impact: true },
        _count: true,
      })

      const avg = ((agg._avg.composition ?? 0) + (agg._avg.light ?? 0) + (agg._avg.technique ?? 0) + (agg._avg.impact ?? 0)) / 4

      await ctx.db.photo.update({
        where: { id: photoId },
        data: { avgRating: Math.round(avg * 100) / 100, ratingCount: agg._count },
      })

      // Award XP for rating
      await ctx.db.user.update({ where: { id: userId }, data: { xpPoints: { increment: 2 } } })

      return { avgRating: avg, ratingCount: agg._count }
    }),

  // ── Delete own photo ───────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findUnique({ where: { id: input.id } })
      if (!photo || photo.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" })
      }

      await ctx.db.photo.delete({ where: { id: input.id } })
      await deleteFromR2(photo.r2Key).catch(() => {})
      await deleteFromR2(photo.thumbKey).catch(() => {})
      if (photo.thumbSmKey) await deleteFromR2(photo.thumbSmKey).catch(() => {})

      return { success: true }
    }),
})
