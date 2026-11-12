import { useCallback, useEffect, useMemo, useState } from 'react'
import { Hero } from './components/Hero'
import { HistoryStrip } from './components/HistoryStrip'
import { PersonPanel } from './components/PersonPanel'
import { ToastStack } from './components/ToastStack'
import { getDayKey, msUntilNextNoon } from './lib/day'
import { PEOPLE } from './lib/people'
import {
  loadBoard,
  subscribeBoard,
  uploadMedia,
  upsertStat,
} from './lib/store'
import type { DailyStat, MediaItem, ToastPayload } from './lib/types'

function blankStat(personId: string, dayKey: string): DailyStat {
  return {
    personId,
    dayKey,
    drunkness: 0,
    drinks: 0,
    updatedAt: new Date().toISOString(),
  }
}

export default function App() {
  const [dayKey, setDayKey] = useState(() => getDayKey())
  const [stats, setStats] = useState<DailyStat[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [history, setHistory] = useState<DailyStat[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastPayload[]>([])
  const [loading, setLoading] = useState(true)

  const pushToast = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  const refresh = useCallback(async (key = dayKey) => {
    const board = await loadBoard(key)
    setStats(board.stats)
    setMedia(board.media)
    setHistory(board.history)
    setLoading(false)
  }, [dayKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    return subscribeBoard(dayKey, () => {
      void refresh()
    })
  }, [dayKey, refresh])

  useEffect(() => {
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = getDayKey()
        setDayKey(next)
        pushToast('New noon cycle — counters reset, history kept.')
        void refresh(next)
        schedule()
      }, msUntilNextNoon() + 500)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [pushToast, refresh])

  const byPerson = useMemo(() => {
    const map = new Map(stats.map((s) => [s.personId, s]))
    return PEOPLE.map((person) => ({
      person,
      stat: map.get(person.id) ?? blankStat(person.id, dayKey),
      media: media.filter((m) => m.personId === person.id),
    }))
  }, [stats, media, dayKey])

  const leader = useMemo(() => {
    const ranked = [...byPerson].sort(
      (a, b) =>
        b.stat.drunkness - a.stat.drunkness ||
        b.stat.drinks - a.stat.drinks,
    )
    return ranked[0]
  }, [byPerson])

  const totalDrinks = byPerson.reduce((sum, row) => sum + row.stat.drinks, 0)

  async function setDrunkness(personId: string, name: string, value: number) {
    const current = stats.find((s) => s.personId === personId)
    const next = await upsertStat(personId, dayKey, {
      drunkness: value,
      drinks: current?.drinks,
    })
    setStats((prev) => {
      const others = prev.filter((s) => s.personId !== personId)
      return [...others, next]
    })
    if (value >= 8) pushToast(`${name} hit ${value}/10 — chaos ascending.`)
  }

  async function setDrinks(personId: string, name: string, value: number) {
    const current = stats.find((s) => s.personId === personId)
    const next = await upsertStat(personId, dayKey, {
      drinks: value,
      drunkness: current?.drunkness,
    })
    setStats((prev) => {
      const others = prev.filter((s) => s.personId !== personId)
      return [...others, next]
    })
    if (value > (current?.drinks ?? 0)) {
      pushToast(`${name}: another one down.`)
    }
  }

  async function onUpload(personId: string, file: File) {
    const item = await uploadMedia(personId, dayKey, file)
    setMedia((prev) => [item, ...prev])
    pushToast('Evidence uploaded.')
  }

  return (
    <div className="min-h-svh">
      <Hero
        dayKey={dayKey}
        leaderName={leader?.person.name ?? '—'}
        leaderScore={leader?.stat.drunkness ?? 0}
        totalDrinks={totalDrinks}
      />

      <main id="board" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--ink)]">
              The crew
            </h2>
            <p className="text-[var(--muted)]">
              Anyone can edit any meter. Expand a person to attach photos or
              videos.
            </p>
          </div>
          {loading && (
            <p className="text-sm text-[var(--muted)]">Syncing…</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byPerson.map(({ person, stat, media: personMedia }) => (
            <PersonPanel
              key={person.id}
              person={person}
              stat={stat}
              media={personMedia}
              expanded={expandedId === person.id}
              onExpand={() =>
                setExpandedId((id) => (id === person.id ? null : person.id))
              }
              onDrunkness={(value) =>
                void setDrunkness(person.id, person.name, value)
              }
              onDrinks={(value) => void setDrinks(person.id, person.name, value)}
              onUpload={(file) => onUpload(person.id, file)}
            />
          ))}
        </div>
      </main>

      <HistoryStrip history={history} />
      <ToastStack toasts={toasts} />
    </div>
  )
}
