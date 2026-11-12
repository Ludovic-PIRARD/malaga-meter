import { formatDayKey } from '../lib/day'
import { PEOPLE } from '../lib/people'
import type { DailyStat } from '../lib/types'

type Props = {
  history: DailyStat[]
}

type DaySummary = {
  dayKey: string
  champion: string
  drinks: number
  drunkness: number
}

function summarise(history: DailyStat[]): DaySummary[] {
  const byDay = new Map<string, DailyStat[]>()
  for (const row of history) {
    const list = byDay.get(row.dayKey) ?? []
    list.push(row)
    byDay.set(row.dayKey, list)
  }

  return [...byDay.entries()]
    .map(([dayKey, rows]) => {
      const ranked = [...rows].sort(
        (a, b) =>
          b.drunkness - a.drunkness || b.drinks - a.drinks || a.personId.localeCompare(b.personId),
      )
      const top = ranked[0]
      const name =
        PEOPLE.find((p) => p.id === top?.personId)?.name ?? top?.personId ?? '—'
      return {
        dayKey,
        champion: name,
        drinks: rows.reduce((sum, r) => sum + r.drinks, 0),
        drunkness: top?.drunkness ?? 0,
      }
    })
    .sort((a, b) => b.dayKey.localeCompare(a.dayKey))
}

export function HistoryStrip({ history }: Props) {
  const days = summarise(history)
  if (!days.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--ink)]">
          Previous days
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          History appears after the first noon reset in Madrid time.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--ink)]">
        Previous days
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Champions of each noon-to-noon cycle.
      </p>
      <ul className="mt-6 space-y-3">
        {days.map((day) => (
          <li
            key={day.dayKey}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/55 px-4 py-3 backdrop-blur"
          >
            <div>
              <p className="font-semibold text-[var(--ink)]">
                {formatDayKey(day.dayKey)}
              </p>
              <p className="text-sm text-[var(--muted)]">
                Crown: {day.champion} ({day.drunkness}/10)
              </p>
            </div>
            <p className="rounded-full bg-[var(--sea)]/10 px-3 py-1 text-sm font-medium text-[var(--sea-deep)]">
              {day.drinks} group drinks
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
