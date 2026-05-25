// src/lib/trpc/router.ts
// Root tRPC router – combines all sub-routers

import { initTRPC, TRPCError } from "@trpc/server"
import { type NextRequest } from "next/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// ─── Context ────────────────────────────────

export async function createTRPCContext(req: NextRequest) {
  const session = await auth()
  return { db, session, req }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

// ─── tRPC init ──────────────────────────────

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// Middleware: require authenticated session
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({ ctx: { ...ctx, session: ctx.session } })
})

export const protectedProcedure = t.procedure.use(enforceAuth)

// ─── Sub-routers (import & attach below) ────

import { photosRouter } from "./routers/photos"
import { usersRouter } from "./routers/users"
import { locationsRouter } from "./routers/locations"
import { jobsRouter } from "./routers/jobs"
import { feedRouter } from "./routers/feed"

export const appRouter = createTRPCRouter({
  photos:    photosRouter,
  users:     usersRouter,
  locations: locationsRouter,
  jobs:      jobsRouter,
  feed:      feedRouter,
})

export type AppRouter = typeof appRouter
