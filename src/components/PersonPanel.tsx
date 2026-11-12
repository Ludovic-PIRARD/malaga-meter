import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Person } from '../lib/people'
import type { DailyStat, MediaItem } from '../lib/types'
import { ConfettiBurst } from './ConfettiBurst'
import { DrinkCounter } from './DrinkCounter'
import { DrunkMeter } from './DrunkMeter'
import { MediaGallery } from './MediaGallery'

type Props = {
  person: Person
  stat: DailyStat
  media: MediaItem[]
  expanded: boolean
  onExpand: () => void
  onDrunkness: (value: number) => void
  onDrinks: (value: number) => void
  onUpload: (file: File) => Promise<void>
}

export function PersonPanel({
  person,
  stat,
  media,
  expanded,
  onExpand,
  onDrunkness,
  onDrinks,
  onUpload,
}: Props) {
  const [burst, setBurst] = useState(false)
  const hot = stat.drunkness >= 8

  useEffect(() => {
    if (stat.drunkness < 8) return
    setBurst(true)
    const t = window.setTimeout(() => setBurst(false), 1000)
    return () => window.clearTimeout(t)
  }, [stat.drunkness])

  return (
    <motion.article
      layout
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/60 bg-[var(--panel)] p-4 backdrop-blur-md transition ${
        hot ? 'meter-glow' : ''
      } ${expanded ? 'sm:col-span-2' : ''}`}
    >
      <ConfettiBurst show={burst} />

      <button
        type="button"
        onClick={onExpand}
        className="mb-4 flex w-full items-start justify-between gap-3 text-left"
      >
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            {person.name}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {stat.drinks} drink{stat.drinks === 1 ? '' : 's'} · tap for media
          </p>
        </div>
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl font-[family-name:var(--font-display)] text-xl font-extrabold ${
            hot
              ? 'bg-[var(--sun)] text-[var(--ink)]'
              : 'bg-[var(--sea)] text-white'
          }`}
        >
          {stat.drunkness}
        </span>
      </button>

      <div className="space-y-5">
        <DrunkMeter value={stat.drunkness} onChange={onDrunkness} />
        <DrinkCounter value={stat.drinks} onChange={onDrinks} />
        {expanded && (
          <MediaGallery
            items={media}
            personName={person.name}
            onUpload={onUpload}
          />
        )}
      </div>
    </motion.article>
  )
}
