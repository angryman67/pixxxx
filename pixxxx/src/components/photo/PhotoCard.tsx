"use client"
// src/components/photo/PhotoCard.tsx

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Heart, MessageCircle, Bookmark, Share2, Star, MapPin } from "lucide-react"
import { r2Url } from "@/lib/storage"
import { clsx } from "clsx"
import type { PhotoWithUser } from "@/types"

interface PhotoCardProps {
  photo: PhotoWithUser
  onLike?: (photoId: string) => void
  onSave?: (photoId: string) => void
}

export function PhotoCard({ photo, onLike, onSave }: PhotoCardProps) {
  const [liked, setLiked] = useState(photo.isLiked ?? false)
  const [saved, setSaved] = useState(photo.isSaved ?? false)
  const [likeCount, setLikeCount] = useState(photo.likeCount)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    const next = !liked
    setLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    onLike?.(photo.id)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    setSaved((s) => !s)
    onSave?.(photo.id)
  }

  const thumbUrl = r2Url(photo.thumbKey)
  const rating = Number(photo.avgRating)

  return (
    <article className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Link href={`/u/${photo.user.username}`}>
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-medium text-orange-800 flex-shrink-0">
            {photo.user.avatarUrl
              ? <Image src={photo.user.avatarUrl} alt="" width={32} height={32} className="rounded-full object-cover" />
              : photo.user.displayName.slice(0, 2).toUpperCase()
            }
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/u/${photo.user.username}`} className="text-sm font-medium hover:underline truncate block">
            {photo.user.displayName}
          </Link>
          <div className="text-xs text-neutral-500 flex items-center gap-1">
            {photo.location && (
              <>
                <MapPin size={10} />
                <span className="truncate">{photo.location.name}</span>
              </>
            )}
          </div>
        </div>
        {photo.user.isPro && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 font-medium">PRO</span>
        )}
      </div>

      {/* Image */}
      <Link href={`/photos/${photo.id}`}>
        <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={thumbUrl}
            alt={photo.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* EXIF overlay */}
          {(photo.aperture || photo.shutterSpeed || photo.iso) && (
            <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 flex-wrap">
              {photo.category && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/50 text-white/85 border border-white/15">
                  {photo.category.charAt(0) + photo.category.slice(1).toLowerCase()}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/50 text-white/85 border border-white/15">
                {[photo.aperture && `f/${photo.aperture}`, photo.shutterSpeed, photo.iso && `ISO ${photo.iso}`].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Caption */}
      <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
        <Link href={`/photos/${photo.id}`} className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 hover:text-neutral-900 dark:hover:text-white">
          {photo.title}
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2">
        <button
          onClick={handleLike}
          className={clsx("flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors",
            liked ? "text-orange-600" : "text-neutral-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
          )}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart size={14} className={liked ? "fill-current" : ""} />
          {likeCount}
        </button>

        <Link
          href={`/photos/${photo.id}#comments`}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <MessageCircle size={14} />
          {photo.commentCount}
        </Link>

        <button
          onClick={handleSave}
          className={clsx("flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors",
            saved ? "text-blue-600" : "text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          )}
          aria-label={saved ? "Gespeichert" : "Speichern"}
        >
          <Bookmark size={14} className={saved ? "fill-current" : ""} />
        </button>

        <button className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Teilen">
          <Share2 size={14} />
        </button>

        {/* Star rating */}
        <div className="flex items-center gap-1 ml-1">
          <Star size={12} className={rating >= 1 ? "text-amber-400 fill-amber-400" : "text-neutral-300"} />
          <span className="text-xs text-neutral-500">{rating > 0 ? rating.toFixed(1) : "–"}</span>
        </div>
      </div>
    </article>
  )
}
