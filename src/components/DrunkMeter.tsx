import { motion } from 'framer-motion'
import { drunkLabel } from '../lib/people'

type Props = {
  value: number
  onChange: (value: number) => void
}

function hueFor(level: number): string {
  // 0 = calm teal → 10 = hot citrus/red
  const t = level / 10
  const h = 190 - t * 170
  const s = 70 + t * 20
  const l = 42 + t * 8
  return `hsl(${h} ${s}% ${l}%)`
}

export function DrunkMeter({ value, onChange }: Props) {
  const fill = `${(value / 10) * 100}%`

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Drunkness
          </p>
          <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-none text-[var(--ink)]">
            {value}
            <span className="text-lg text-[var(--muted)]">/10</span>
          </p>
        </div>
        <motion.p
          key={value}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-full bg-[var(--sun)]/90 px-3 py-1 text-sm font-semibold text-[var(--ink)]"
        >
          {drunkLabel(value)}
        </motion.p>
      </div>

      <div className="relative h-4 overflow-hidden rounded-full bg-[var(--sea-deep)]/15">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: hueFor(value) }}
          animate={{ width: fill }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        />
      </div>

      <input
        aria-label="Drunkness level"
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--sea)]"
      />

      <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--muted)]">
        <span>Sober</span>
        <span>Wrecked</span>
      </div>
    </div>
  )
}
