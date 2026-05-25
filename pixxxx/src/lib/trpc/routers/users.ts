// src/lib/trpc/routers/users.ts

import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../router"
import { TRPCError } from "@trpc/server"

export const usersRouter = createTRPCRouter({

  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username },
        include: {
          _count: { select: { photos: true, followers: true, following: true } },
        },
      })
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      // Never return email
      const { email, ...safe } = user
      return safe
    }),

  getPhotos: publicProcedure
    .input(z.object({ userId: z.string().uuid(), cursor: z.string().uuid().optional(), limit: z.number().default(18) }))
    .query(async ({ ctx, input }) => {
      const photos = await ctx.db.photo.findMany({
        where: { userId: input.userId, isPublic: true },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      })
      const nextCursor = photos.length > input.limit ? photos.pop()!.id : undefined
      return { items: photos, nextCursor }
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().min(1).max(60).optional(),
      bio:         z.string().max(500).optional(),
      city:        z.string().max(100).optional(),
      countryCode: z.string().length(2).optional(),
      gearJson:    z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      })
    }),

  toggleFollow: protectedProcedure
    .input(z.object({ targetUserId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const followerId = ctx.session.user.id
      const followingId = input.targetUserId
      if (followerId === followingId) throw new TRPCError({ code: "BAD_REQUEST" })

      const key = { followerId, followingId }
      const existing = await ctx.db.follow.findUnique({ where: { followerId_followingId: key } })

      if (existing) {
        await ctx.db.follow.delete({ where: { followerId_followingId: key } })
        return { following: false }
      } else {
        await ctx.db.follow.create({ data: key })
        return { following: true }
      }
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [totalViews, totalLikes, newFollowers, avgRating] = await Promise.all([
      ctx.db.photo.aggregate({ where: { userId }, _sum: { viewCount: true } }),
      ctx.db.photo.aggregate({ where: { userId }, _sum: { likeCount: true } }),
      ctx.db.follow.count({ where: { followingId: userId, createdAt: { gte: since30 } } }),
      ctx.db.photo.aggregate({ where: { userId, ratingCount: { gt: 0 } }, _avg: { avgRating: true } }),
    ])

    return {
      totalViews:   totalViews._sum.viewCount ?? 0,
      totalLikes:   totalLikes._sum.likeCount ?? 0,
      newFollowers,
      avgRating:    Number(avgRating._avg.avgRating ?? 0).toFixed(1),
    }
  }),
})
