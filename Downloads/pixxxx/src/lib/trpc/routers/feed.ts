// src/lib/trpc/routers/feed.ts
// Cursor-paginated photo feed with filtering & sorting

import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../router"

const feedFilterSchema = z.object({
  category:    z.enum(["LANDSCAPE","PORTRAIT","STREET","ARCHITECTURE","WILDLIFE","ASTRO","MACRO","SPORT","TRAVEL","ABSTRACT"]).optional(),
  countryCode: z.string().length(2).optional(),
  minRating:   z.number().min(0).max(5).optional(),
  sort:        z.enum(["newest", "top_rated", "trending", "following"]).default("newest"),
  cursor:      z.string().uuid().optional(),
  limit:       z.number().int().min(1).max(50).default(20),
})

const USER_SELECT = {
  id: true, username: true, displayName: true,
  avatarUrl: true, isVerified: true, isPro: true,
  city: true, countryCode: true,
}

export const feedRouter = createTRPCRouter({

  // ── Main paginated feed ────────────────────────────────────────
  getPhotos: publicProcedure
    .input(feedFilterSchema)
    .query(async ({ ctx, input }) => {
      const { category, countryCode, minRating, sort, cursor, limit } = input

      const where: Record<string, unknown> = {
        isPublic: true,
        ...(category    && { category }),
        ...(countryCode && { location: { countryCode } }),
        ...(minRating   && { avgRating: { gte: minRating } }),
      }

      // For "following" feed, require auth and filter by followed users
      if (sort === "following" && ctx.session?.user?.id) {
        const follows = await ctx.db.follow.findMany({
          where: { followerId: ctx.session.user.id },
          select: { followingId: true },
        })
        where.userId = { in: follows.map((f) => f.followingId) }
      }

      const orderBy =
        sort === "top_rated" ? { avgRating: "desc" as const } :
        sort === "trending"  ? { likeCount: "desc" as const } :
                               { createdAt: "desc" as const }

      const photos = await ctx.db.photo.findMany({
        where,
        orderBy,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          user: { select: USER_SELECT },
          location: { select: { id: true, name: true, countryCode: true } },
        },
      })

      let nextCursor: string | undefined
      if (photos.length > limit) {
        nextCursor = photos.pop()!.id
      }

      // Batch-check likes for authenticated user
      const viewerId = ctx.session?.user?.id
      let likedIds = new Set<string>()
      let savedIds = new Set<string>()
      if (viewerId && photos.length > 0) {
        const [likes, saves] = await Promise.all([
          ctx.db.like.findMany({
            where: { userId: viewerId, photoId: { in: photos.map((p) => p.id) } },
            select: { photoId: true },
          }),
          ctx.db.savedPhoto.findMany({
            where: { userId: viewerId, photoId: { in: photos.map((p) => p.id) } },
            select: { photoId: true },
          }),
        ])
        likedIds = new Set(likes.map((l) => l.photoId))
        savedIds = new Set(saves.map((s) => s.photoId))
      }

      return {
        items: photos.map((p) => ({
          ...p,
          isLiked: likedIds.has(p.id),
          isSaved: savedIds.has(p.id),
        })),
        nextCursor,
      }
    }),

  // ── Trending tags ──────────────────────────────────────────────
  getTrendingTags: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      // Aggregate all tags from last 7 days and count frequency
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const photos = await ctx.db.photo.findMany({
        where: { createdAt: { gte: since }, isPublic: true },
        select: { tags: true },
        take: 500,
      })

      const tagCounts: Record<string, number> = {}
      photos.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] ?? 0) + 1 }))

      return Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, input.limit)
        .map(([tag, count]) => ({ tag, count }))
    }),

  // ── Photo of the week ──────────────────────────────────────────
  getFeaturedPhoto: publicProcedure.query(async ({ ctx }) => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return ctx.db.photo.findFirst({
      where: { createdAt: { gte: since }, isPublic: true },
      orderBy: { avgRating: "desc" },
      include: { user: { select: USER_SELECT } },
    })
  }),

  // ── User discovery (who to follow) ────────────────────────────
  getSuggestedUsers: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      const existing = await ctx.db.follow.findMany({
        where: { followerId: ctx.session.user.id },
        select: { followingId: true },
      })
      const excludeIds = [ctx.session.user.id, ...existing.map((f) => f.followingId)]

      return ctx.db.user.findMany({
        where: { id: { notIn: excludeIds } },
        orderBy: { xpPoints: "desc" },
        take: input.limit,
        select: USER_SELECT,
      })
    }),
})
