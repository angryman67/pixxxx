// src/lib/trpc/routers/locations.ts

import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../router"

export const locationsRouter = createTRPCRouter({

  list: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional(),
      search:      z.string().optional(),
      limit:       z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.location.findMany({
        where: {
          isApproved: true,
          ...(input.countryCode && { countryCode: input.countryCode }),
          ...(input.search && { name: { contains: input.search, mode: "insensitive" } }),
        },
        orderBy: { photoCount: "desc" },
        take: input.limit,
        select: {
          id: true, name: true, slug: true, lat: true, lng: true,
          countryCode: true, region: true, description: true,
          bestSeason: true, bestTime: true, tags: true, avgRating: true, photoCount: true,
        },
      })
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.location.findUnique({
        where: { slug: input.slug },
        include: {
          photos: {
            where: { isPublic: true },
            orderBy: { avgRating: "desc" },
            take: 12,
            include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
          },
        },
      })
    }),

  submit: protectedProcedure
    .input(z.object({
      name:        z.string().min(2).max(100),
      lat:         z.number().min(-90).max(90),
      lng:         z.number().min(-180).max(180),
      countryCode: z.string().length(2),
      region:      z.string().max(100).optional(),
      description: z.string().max(2000).optional(),
      bestSeason:  z.string().max(50).optional(),
      bestTime:    z.string().max(80).optional(),
      accessNotes: z.string().max(1000).optional(),
      tags:        z.array(z.string()).max(10).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      return ctx.db.location.create({
        data: { ...input, slug, submittedBy: ctx.session.user.id, isApproved: false },
      })
    }),
})

// ─────────────────────────────────────────────────────────────────
// src/lib/trpc/routers/jobs.ts

import { z as zz } from "zod"
import { createTRPCRouter as ctr, publicProcedure as pp, protectedProcedure as prot } from "../router"
import { TRPCError } from "@trpc/server"

export const jobsRouter = ctr({

  list: pp
    .input(zz.object({
      countryCode: zz.string().length(2).optional(),
      type:        zz.enum(["FREELANCE","FULLTIME","PROJECT","INTERNSHIP"]).optional(),
      cursor:      zz.string().uuid().optional(),
      limit:       zz.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const now = new Date()
      const jobs = await ctx.db.job.findMany({
        where: {
          isActive: true,
          expiresAt: { gt: now },
          ...(input.countryCode && { countryCode: input.countryCode }),
          ...(input.type && { type: input.type }),
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { poster: { select: { id: true, username: true, displayName: true } } },
      })
      const nextCursor = jobs.length > input.limit ? jobs.pop()!.id : undefined
      return { items: jobs, nextCursor }
    }),

  create: prot
    .input(zz.object({
      title:       zz.string().min(5).max(120),
      company:     zz.string().min(2).max(100),
      type:        zz.enum(["FREELANCE","FULLTIME","PROJECT","INTERNSHIP"]),
      city:        zz.string().max(100).optional(),
      countryCode: zz.string().length(2),
      remote:      zz.boolean().default(false),
      description: zz.string().min(50).max(5000),
      payFrom:     zz.number().int().positive().optional(),
      payTo:       zz.number().int().positive().optional(),
      payUnit:     zz.enum(["day","month","year","project"]).optional(),
      skills:      zz.array(zz.string()).max(15).default([]),
      durationDays: zz.number().int().min(7).max(180).default(30),
    }))
    .mutation(async ({ ctx, input }) => {
      const { durationDays, ...data } = input
      const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      return ctx.db.job.create({
        data: { ...data, postedBy: ctx.session.user.id, expiresAt },
      })
    }),

  delete: prot
    .input(zz.object({ id: zz.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.db.job.findUnique({ where: { id: input.id } })
      if (!job || job.postedBy !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" })
      await ctx.db.job.update({ where: { id: input.id }, data: { isActive: false } })
      return { success: true }
    }),
})
