// src/lib/auth.ts
// NextAuth v5 configuration

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // Magic Link via email (no password needed)
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from:   process.env.RESEND_FROM_EMAIL!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
    async signIn({ user }) {
      // Auto-create username from email on first sign-in
      if (!user.id) return true
      const existing = await db.user.findUnique({
        where: { id: user.id },
        select: { username: true },
      })
      if (existing && !existing.username && user.email) {
        const base = user.email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase().slice(0, 25)
        const username = `${base}_${Math.random().toString(36).slice(2, 6)}`
        await db.user.update({ where: { id: user.id }, data: { username } })
      }
      return true
    },
  },
  pages: {
    signIn:  "/auth/signin",
    error:   "/auth/error",
    verifyRequest: "/auth/verify",
  },
})
