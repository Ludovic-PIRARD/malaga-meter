import { motion } from 'framer-motion'

type Props = {
  value: number
  onChange: (value: number) => void
}

export function DrinkCounter({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          Drinks today
        </p>
        <motion.p
          key={value}
          initial={{ scale: 0.85, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--ink)]"
        >
          {value}
        </motion.p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Remove drink"
          disabled={value <= 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-11 w-11 rounded-2xl bg-[var(--sea-deep)]/10 text-xl font-bold text-[var(--sea-deep)] transition hover:bg-[var(--sea-deep)]/20 disabled:opacity-40"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Add drink"
          onClick={() => onChange(value + 1)}
          className="h-11 w-11 rounded-2xl bg-[var(--citrus)] text-xl font-bold text-[var(--ink)] transition hover:brightness-95"
        >
          +
        </button>
      </div>
    </div>
  )
}
