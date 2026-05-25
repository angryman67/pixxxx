// src/lib/image.ts
// Server-side image processing: thumbnails via Sharp, EXIF via exifr

import sharp from "sharp"
import { readExif } from "exifr"

export type ExtractedExif = {
  camera?: string       // e.g. "NIKON CORPORATION NIKON D850"
  lens?: string         // e.g. "14.0-24.0 mm f/2.8"
  aperture?: number     // e.g. 2.8
  shutterSpeed?: string // e.g. "1/250"
  iso?: number
  focalLength?: number  // mm
  flashUsed?: boolean
  width?: number
  height?: number
  shotAt?: Date
  lat?: number
  lng?: number
}

// Extract EXIF metadata from a Buffer (called server-side after upload webhook)
export async function extractExif(buffer: Buffer): Promise<ExtractedExif> {
  try {
    const exif = await readExif(buffer, {
      pick: [
        "Make", "Model", "LensModel", "FNumber", "ExposureTime",
        "ISO", "FocalLength", "Flash", "DateTimeOriginal",
        "ImageWidth", "ImageHeight", "latitude", "longitude",
      ],
    })

    if (!exif) return {}

    const camera = [exif.Make, exif.Model].filter(Boolean).join(" ") || undefined
    const aperture = exif.FNumber ? Number(exif.FNumber) : undefined
    const iso = exif.ISO ? Number(exif.ISO) : undefined
    const focalLength = exif.FocalLength ? Math.round(Number(exif.FocalLength)) : undefined

    // Convert ExposureTime fraction to string e.g. 0.004 → "1/250"
    let shutterSpeed: string | undefined
    if (exif.ExposureTime) {
      const t = Number(exif.ExposureTime)
      shutterSpeed = t >= 1 ? `${t}s` : `1/${Math.round(1 / t)}`
    }

    return {
      camera,
      lens: exif.LensModel || undefined,
      aperture,
      shutterSpeed,
      iso,
      focalLength,
      flashUsed: exif.Flash ? Boolean(exif.Flash) : undefined,
      width: exif.ImageWidth || undefined,
      height: exif.ImageHeight || undefined,
      shotAt: exif.DateTimeOriginal ? new Date(exif.DateTimeOriginal) : undefined,
      lat: exif.latitude || undefined,
      lng: exif.longitude || undefined,
    }
  } catch {
    return {}
  }
}

export type ProcessedImage = {
  thumb800: Buffer  // JPEG 800px wide
  thumb400: Buffer  // JPEG 400px wide (feed thumbnail)
  width: number
  height: number
  fileSizeBytes: number
}

// Generate thumbnails from an uploaded image buffer
export async function processImage(buffer: Buffer): Promise<ProcessedImage> {
  const image = sharp(buffer)
  const meta = await image.metadata()

  const width = meta.width ?? 0
  const height = meta.height ?? 0

  const [thumb800, thumb400] = await Promise.all([
    sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer(),
    sharp(buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer(),
  ])

  return {
    thumb800,
    thumb400,
    width,
    height,
    fileSizeBytes: buffer.length,
  }
}

// Check if a mime type is an accepted photo format
export function isAcceptedPhotoType(mime: string): boolean {
  return [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
    // RAW formats – these need to be converted before sharp can process
    "image/x-nikon-nef",
    "image/x-canon-cr3",
    "image/x-canon-cr2",
    "image/x-sony-arw",
  ].includes(mime)
}

export const MAX_UPLOAD_BYTES =
  Number(process.env.MAX_UPLOAD_SIZE_MB ?? 100) * 1024 * 1024
