// pixxxx.de – Shared TypeScript Types

import type { User, Photo, PhotoCategory, JobType } from "@prisma/client"

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

export type PublicUser = Pick<
  User,
  "id" | "username" | "displayName" | "avatarUrl" | "city" | "countryCode" | "isVerified" | "isPro" | "xpPoints"
>

export type UserLevel = {
  name: string
  minXp: number
  maxXp: number
  color: string
}

export const USER_LEVELS: UserLevel[] = [
  { name: "Einsteiger",      minXp: 0,    maxXp: 99,   color: "#888780" },
  { name: "Enthusiast",      minXp: 100,  maxXp: 499,  color: "#1D9E75" },
  { name: "Fotograf",        minXp: 500,  maxXp: 999,  color: "#185FA5" },
  { name: "Pro-Fotograf",    minXp: 1000, maxXp: 2999, color: "#D85A30" },
  { name: "Expert",          minXp: 3000, maxXp: 7999, color: "#7F77DD" },
  { name: "Meister",         minXp: 8000, maxXp: Infinity, color: "#EF9F27" },
]

export function getUserLevel(xp: number): UserLevel {
  return USER_LEVELS.findLast((l) => xp >= l.minXp) ?? USER_LEVELS[0]
}

// ─────────────────────────────────────────────
// PHOTO
// ─────────────────────────────────────────────

export type PhotoWithUser = Photo & {
  user: PublicUser
  isLiked?: boolean
  isSaved?: boolean
  myRating?: PhotoRatingInput | null
}

export type PhotoRatingInput = {
  composition: number  // 1-5
  light: number
  technique: number
  impact: number
}

export type PhotoRatingAvg = {
  composition: number
  light: number
  technique: number
  impact: number
  overall: number
  count: number
}

export const PHOTO_CATEGORIES: { value: PhotoCategory; label: string }[] = [
  { value: "LANDSCAPE",    label: "Landschaft" },
  { value: "PORTRAIT",     label: "Portrait" },
  { value: "STREET",       label: "Street" },
  { value: "ARCHITECTURE", label: "Architektur" },
  { value: "WILDLIFE",     label: "Wildlife" },
  { value: "ASTRO",        label: "Astro" },
  { value: "MACRO",        label: "Makro" },
  { value: "SPORT",        label: "Sport" },
  { value: "TRAVEL",       label: "Reise" },
  { value: "ABSTRACT",     label: "Abstrakt" },
]

// ─────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────

export type UploadPhotoInput = {
  title: string
  description?: string
  category: PhotoCategory
  tags: string[]
  locationId?: string
  // EXIF (auto-filled on client, user can override)
  camera?: string
  lens?: string
  aperture?: number
  shutterSpeed?: string
  iso?: number
  focalLength?: number
}

export type UploadSignedUrlResponse = {
  uploadUrl: string   // PUT to this URL
  r2Key: string       // save this as photo.r2Key
  thumbKey: string
}

// ─────────────────────────────────────────────
// FEED
// ─────────────────────────────────────────────

export type FeedSort = "newest" | "top_rated" | "trending" | "following"

export type FeedFilter = {
  category?: PhotoCategory
  countryCode?: string
  minRating?: number
  sort: FeedSort
}

export type CursorPage<T> = {
  items: T[]
  nextCursor?: string
  total?: number
}

// ─────────────────────────────────────────────
// LOCATION
// ─────────────────────────────────────────────

export type LocationWithCount = {
  id: string
  name: string
  slug: string
  lat: number
  lng: number
  countryCode: string
  region?: string | null
  description?: string | null
  bestSeason?: string | null
  bestTime?: string | null
  tags: string[]
  avgRating: number
  photoCount: number
}

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FREELANCE:   "Freelance",
  FULLTIME:    "Festanstellung",
  PROJECT:     "Projekt",
  INTERNSHIP:  "Praktikum",
}

export const DACH_COUNTRIES = [
  { code: "DE", label: "Deutschland" },
  { code: "AT", label: "Österreich" },
  { code: "CH", label: "Schweiz" },
]

// ─────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────

export type ApiSuccess<T> = { success: true; data: T }
export type ApiError = { success: false; error: string; code?: string }
export type ApiResponse<T> = ApiSuccess<T> | ApiError
