// src/lib/storage.ts
// Cloudflare R2 – photo upload helpers (S3-compatible)

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.R2_PUBLIC_URL!

// Generate a signed PUT URL so the client can upload directly to R2
// (avoids routing the file through your server)
export async function createUploadSignedUrl(
  key: string,
  contentType: string,
  expiresIn = 300 // 5 minutes
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(R2, command, { expiresIn })
}

// Generate a signed GET URL for private files (if you add privacy later)
export async function createDownloadSignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return getSignedUrl(R2, command, { expiresIn })
}

// Delete a file from R2 (e.g. when a photo is deleted)
export async function deleteFromR2(key: string): Promise<void> {
  await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

// Build the public CDN URL for a given R2 key
export function r2Url(key: string): string {
  return `${PUBLIC_URL}/${key}`
}

// Generate deterministic R2 keys for a photo
export function generatePhotoKeys(userId: string, photoId: string) {
  const base = `photos/${userId}/${photoId}`
  return {
    original: `${base}/original`,
    thumb800: `${base}/thumb_800`,
    thumb400: `${base}/thumb_400`,
  }
}
