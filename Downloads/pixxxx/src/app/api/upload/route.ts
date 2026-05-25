// src/app/api/upload/route.ts
// Returns a signed Cloudflare R2 URL so clients can upload directly.
// After upload, client calls trpc.photos.create() to save metadata.

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createUploadSignedUrl, generatePhotoKeys } from "@/lib/storage"
import { isAcceptedPhotoType, MAX_UPLOAD_BYTES } from "@/lib/image"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

const schema = z.object({
  contentType:   z.string(),
  fileSizeBytes: z.number().int().positive(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { contentType, fileSizeBytes } = parsed.data

  if (!isAcceptedPhotoType(contentType)) {
    return NextResponse.json({ error: "Dateityp nicht unterstützt" }, { status: 400 })
  }

  if (fileSizeBytes > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: `Maximale Dateigröße: ${process.env.MAX_UPLOAD_SIZE_MB ?? 100} MB` }, { status: 400 })
  }

  const photoId = uuidv4()
  const keys = generatePhotoKeys(session.user.id, photoId)

  try {
    const uploadUrl = await createUploadSignedUrl(keys.original, contentType)
    return NextResponse.json({
      uploadUrl,
      photoId,
      r2Key:     keys.original,
      thumbKey:  keys.thumb800,
      thumbSmKey: keys.thumb400,
    })
  } catch (err) {
    console.error("R2 signed URL error:", err)
    return NextResponse.json({ error: "Upload konnte nicht vorbereitet werden" }, { status: 500 })
  }
}
