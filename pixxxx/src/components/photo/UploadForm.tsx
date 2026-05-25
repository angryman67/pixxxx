"use client"
// src/components/photo/UploadForm.tsx
// Drag & drop upload with automatic EXIF extraction

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Camera, X, Check, Loader2 } from "lucide-react"
import { clsx } from "clsx"
import { PHOTO_CATEGORIES, type UploadPhotoInput } from "@/types"

type UploadStep = "select" | "exif" | "meta" | "uploading" | "done" | "error"

export function UploadForm() {
  const [step, setStep]       = useState<UploadStep>("select")
  const [file, setFile]       = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError]     = useState<string | null>(null)

  const [meta, setMeta] = useState<Partial<UploadPhotoInput>>({
    category: "LANDSCAPE",
    tags: [],
  })
  const [exif, setExif] = useState<Record<string, string>>({})

  const onDrop = useCallback(async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStep("exif")

    // Extract EXIF client-side using exifr
    try {
      const { readExif } = await import("exifr")
      const raw = await readExif(f, {
        pick: ["Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength", "DateTimeOriginal"],
      })
      if (raw) {
        const entries: Record<string, string> = {}
        if (raw.Make || raw.Model) entries.camera = [raw.Make, raw.Model].filter(Boolean).join(" ")
        if (raw.LensModel) entries.lens = raw.LensModel
        if (raw.FNumber) entries.aperture = `f/${raw.FNumber}`
        if (raw.ExposureTime) {
          const t = Number(raw.ExposureTime)
          entries.shutterSpeed = t >= 1 ? `${t}s` : `1/${Math.round(1 / t)}`
        }
        if (raw.ISO) entries.iso = String(raw.ISO)
        if (raw.FocalLength) entries.focalLength = `${Math.round(raw.FocalLength)}mm`
        setExif(entries)
        setMeta((m) => ({
          ...m,
          camera:       entries.camera,
          lens:         entries.lens,
          aperture:     raw.FNumber ? Number(raw.FNumber) : undefined,
          shutterSpeed: entries.shutterSpeed,
          iso:          raw.ISO ? Number(raw.ISO) : undefined,
          focalLength:  raw.FocalLength ? Math.round(Number(raw.FocalLength)) : undefined,
        }))
      }
    } catch {
      // EXIF extraction failed – continue without it
    }
    setStep("meta")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".tiff", ".webp", ".nef", ".cr3", ".cr2", ".arw"] },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  })

  const handleSubmit = async () => {
    if (!file) return
    setStep("uploading")
    setProgress(0)
    setError(null)

    try {
      // Step 1: Get signed upload URL
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, fileSizeBytes: file.size }),
      })
      if (!sigRes.ok) throw new Error(await sigRes.text())
      const { uploadUrl, photoId, r2Key, thumbKey, thumbSmKey } = await sigRes.json()

      setProgress(20)

      // Step 2: Upload directly to R2
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
      setProgress(80)

      // Step 3: Save metadata via tRPC
      // (replace with your tRPC client call)
      await fetch("/api/trpc/photos.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId, r2Key, thumbKey, thumbSmKey,
          width: 0, height: 0,   // server fills these after Sharp processing
          mimeType: file.type,
          fileSizeBytes: file.size,
          ...meta,
        }),
      })
      setProgress(100)
      setStep("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler")
      setStep("error")
    }
  }

  if (step === "select") {
    return (
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 text-neutral-400" size={36} />
        <p className="font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          {isDragActive ? "Loslassen zum Hochladen" : "Bild hierher ziehen oder klicken"}
        </p>
        <p className="text-sm text-neutral-500">JPG, PNG, TIFF, RAW (NEF, CR3) · max. 100 MB</p>
      </div>
    )
  }

  if (step === "uploading") {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin mx-auto mb-4 text-orange-500" size={40} />
        <p className="font-medium mb-2">Wird hochgeladen...</p>
        <div className="w-64 mx-auto h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-neutral-500 mt-2">{progress}%</p>
      </div>
    )
  }

  if (step === "done") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <p className="font-medium text-lg mb-1">Bild hochgeladen!</p>
        <p className="text-sm text-neutral-500">Dein Foto ist jetzt in der Community sichtbar.</p>
      </div>
    )
  }

  // Meta form (step === "meta" or "error")
  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
          <img src={preview} alt="Vorschau" className="w-full h-full object-contain" />
          <button
            onClick={() => { setFile(null); setPreview(null); setStep("select") }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
            aria-label="Entfernen"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Auto-detected EXIF */}
      {Object.keys(exif).length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(exif).map(([k, v]) => (
            <div key={k} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2 text-center">
              <div className="text-sm font-medium truncate">{v}</div>
              <div className="text-xs text-neutral-500 capitalize">{k}</div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata fields */}
      <div>
        <label className="text-xs text-neutral-500 block mb-1">Titel *</label>
        <input
          type="text"
          placeholder="z. B. Morgennebel im Allgäu"
          value={meta.title ?? ""}
          onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Kategorie</label>
          <select
            value={meta.category}
            onChange={(e) => setMeta((m) => ({ ...m, category: e.target.value as UploadPhotoInput["category"] }))}
            className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900"
          >
            {PHOTO_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Kamera</label>
          <input
            type="text"
            placeholder="Nikon D850"
            value={meta.camera ?? ""}
            onChange={(e) => setMeta((m) => ({ ...m, camera: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-500 block mb-1">Beschreibung</label>
        <textarea
          placeholder="Story hinter dem Bild, Location-Tipps, Equipment..."
          value={meta.description ?? ""}
          onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!meta.title}
        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <Camera size={16} />
        Bild veröffentlichen
      </button>
    </div>
  )
}
