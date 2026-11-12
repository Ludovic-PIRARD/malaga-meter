import { useRef, useState } from 'react'
import type { MediaItem } from '../lib/types'

type Props = {
  items: MediaItem[]
  personName: string
  onUpload: (file: File) => Promise<void>
}

const MAX_IMAGE_MB = 8
const MAX_VIDEO_MB = 40

export function MediaGallery({ items, personName, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    const file = files[0]
    const mb = file.size / (1024 * 1024)
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')
    if (!isVideo && !isImage) {
      setError('Photos or videos only.')
      return
    }
    if (isImage && mb > MAX_IMAGE_MB) {
      setError(`Keep photos under ${MAX_IMAGE_MB} MB (free plan).`)
      return
    }
    if (isVideo && mb > MAX_VIDEO_MB) {
      setError(`Keep videos under ${MAX_VIDEO_MB} MB (free plan).`)
      return
    }
    setError(null)
    setBusy(true)
    try {
      await onUpload(file)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          {personName} archive
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-[var(--sea)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--sea-mid)] disabled:opacity-60"
        >
          {busy ? 'Uploading…' : 'Add photo / video'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--sea)]/30 bg-white/40 px-3 py-6 text-center text-sm text-[var(--muted)]">
          No chaos captured yet. Drop evidence.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="overflow-hidden rounded-2xl bg-[var(--sea-deep)]/10"
            >
              {item.kind === 'video' ? (
                <video
                  src={item.url}
                  controls
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Upload for ${personName}`}
                  className="aspect-square h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
