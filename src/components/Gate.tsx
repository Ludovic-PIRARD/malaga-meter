import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { unlockWithPassword } from '../lib/auth'

type Props = {
  onUnlocked: () => void
}

export function Gate({ onUnlocked }: Props) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await unlockWithPassword(password.trim())
      onUnlocked()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not unlock. Check the trip code.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,196,58,0.45),transparent_42%),linear-gradient(180deg,#04718f_0%,#043047_100%)]"
      />
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => void onSubmit(e)}
        className="relative w-full max-w-md rounded-[1.8rem] border border-white/25 bg-white/90 p-7 shadow-2xl backdrop-blur"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--sea)]">
          Private trip board
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)]">
          Malaga Meter
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Enter the trip code to unlock the board. Without it, the page and
          data stay closed.
        </p>

        <label className="mt-6 block text-sm font-medium text-[var(--ink)]">
          Trip code
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--sea)]/25 bg-white px-4 py-3 outline-none ring-[var(--sea)] focus:ring-2"
            placeholder="••••••••"
            required
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full rounded-full bg-[var(--citrus)] px-5 py-3 text-sm font-bold text-[var(--ink)] transition hover:brightness-95 disabled:opacity-50"
        >
          {busy ? 'Unlocking…' : 'Unlock board'}
        </button>

        </motion.form>
    </div>
  )
}
