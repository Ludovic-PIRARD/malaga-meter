import { motion } from 'framer-motion'
import { dayWindowLabel } from '../lib/day'
import { isLiveBackend } from '../lib/supabase'

type Props = {
  dayKey: string
  leaderName: string
  leaderScore: number
  totalDrinks: number
}

export function Hero({ dayKey, leaderName, leaderScore, totalDrinks }: Props) {
  return (
    <header className="relative isolate min-h-[88svh] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,196,58,0.55),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(26,138,168,0.45),transparent_40%),linear-gradient(180deg,#04718f_0%,#0a5f7a_45%,#043047_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.12\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 text-white">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-[var(--citrus)]"
        >
          Live trip board · Málaga
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.2rem,12vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em]"
        >
          Malaga Meter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-5 max-w-xl text-lg text-white/85"
        >
          Track the crew from sober saint to legendary wreck. Everyone with the
          link can update anyone — drinks reset each noon, Madrid time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href="#board"
            className="rounded-full bg-[var(--citrus)] px-5 py-3 text-sm font-bold text-[var(--ink)] transition hover:brightness-95"
          >
            Open the board
          </a>
          <span className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm backdrop-blur">
            Leading: {leaderName} · {leaderScore}/10 · {totalDrinks} drinks
          </span>
        </motion.div>

        <p className="mt-8 text-xs text-white/65">
          Cycle {dayWindowLabel(dayKey)}
          {!isLiveBackend && (
            <>
              {' '}
              · Preview mode (local only). Add free Supabase keys to go live.
            </>
          )}
          {isLiveBackend && <> · Live sync on</>}
        </p>
      </div>
    </header>
  )
}
