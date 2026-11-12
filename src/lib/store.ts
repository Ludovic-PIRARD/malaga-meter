import { PEOPLE } from './people'
import { getDayKey } from './day'
import { isLiveBackend, supabase } from './supabase'
import type { DailyStat, MediaItem } from './types'

const LOCAL_KEY = 'malaga-meter-v1'

type LocalDb = {
  stats: DailyStat[]
  media: MediaItem[]
}

function emptyStats(dayKey: string): DailyStat[] {
  return PEOPLE.map((p) => ({
    personId: p.id,
    dayKey,
    drunkness: 0,
    drinks: 0,
    updatedAt: new Date().toISOString(),
  }))
}

function readLocal(): LocalDb {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return { stats: [], media: [] }
    return JSON.parse(raw) as LocalDb
  } catch {
    return { stats: [], media: [] }
  }
}

function writeLocal(db: LocalDb) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(db))
  window.dispatchEvent(new CustomEvent('malaga-local-sync'))
}

function ensureLocalDay(dayKey: string): LocalDb {
  const db = readLocal()
  const missing = PEOPLE.filter(
    (p) => !db.stats.some((s) => s.personId === p.id && s.dayKey === dayKey),
  )
  if (missing.length) {
    db.stats.push(
      ...missing.map((p) => ({
        personId: p.id,
        dayKey,
        drunkness: 0,
        drinks: 0,
        updatedAt: new Date().toISOString(),
      })),
    )
    writeLocal(db)
  }
  return db
}

function mapStat(row: {
  person_id: string
  day_key: string
  drunkness: number
  drinks: number
  updated_at: string
}): DailyStat {
  return {
    personId: row.person_id,
    dayKey: row.day_key,
    drunkness: row.drunkness,
    drinks: row.drinks,
    updatedAt: row.updated_at,
  }
}

function mapMedia(row: {
  id: string
  person_id: string
  day_key: string
  kind: 'image' | 'video'
  url: string
  path: string
  created_at: string
}): MediaItem {
  return {
    id: row.id,
    personId: row.person_id,
    dayKey: row.day_key,
    kind: row.kind,
    url: row.url,
    path: row.path,
    createdAt: row.created_at,
  }
}

export async function loadBoard(dayKey = getDayKey()): Promise<{
  stats: DailyStat[]
  media: MediaItem[]
  history: DailyStat[]
}> {
  if (!isLiveBackend || !supabase) {
    const db = ensureLocalDay(dayKey)
    return {
      stats: db.stats.filter((s) => s.dayKey === dayKey),
      media: db.media.filter((m) => m.dayKey === dayKey),
      history: db.stats.filter((s) => s.dayKey !== dayKey),
    }
  }

  const [{ data: statsRows }, { data: mediaRows }, { data: historyRows }] =
    await Promise.all([
      supabase
        .from('daily_stats')
        .select('*')
        .eq('day_key', dayKey),
      supabase.from('media').select('*').eq('day_key', dayKey).order('created_at'),
      supabase.from('daily_stats').select('*').neq('day_key', dayKey),
    ])

  let stats = (statsRows ?? []).map(mapStat)
  const missing = PEOPLE.filter((p) => !stats.some((s) => s.personId === p.id))
  if (missing.length) {
    const inserts = missing.map((p) => ({
      person_id: p.id,
      day_key: dayKey,
      drunkness: 0,
      drinks: 0,
    }))
    await supabase.from('daily_stats').upsert(inserts)
    stats = [...stats, ...emptyStats(dayKey).filter((s) => missing.some((m) => m.id === s.personId))]
  }

  return {
    stats,
    media: (mediaRows ?? []).map(mapMedia),
    history: (historyRows ?? []).map(mapStat),
  }
}

export async function upsertStat(
  personId: string,
  dayKey: string,
  patch: Partial<Pick<DailyStat, 'drunkness' | 'drinks'>>,
): Promise<DailyStat> {
  const next: DailyStat = {
    personId,
    dayKey,
    drunkness: patch.drunkness ?? 0,
    drinks: patch.drinks ?? 0,
    updatedAt: new Date().toISOString(),
  }

  if (!isLiveBackend || !supabase) {
    const db = ensureLocalDay(dayKey)
    const idx = db.stats.findIndex(
      (s) => s.personId === personId && s.dayKey === dayKey,
    )
    if (idx >= 0) {
      next.drunkness = patch.drunkness ?? db.stats[idx].drunkness
      next.drinks = patch.drinks ?? db.stats[idx].drinks
      db.stats[idx] = next
    } else {
      db.stats.push(next)
    }
    writeLocal(db)
    return next
  }

  const { data: existing } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('person_id', personId)
    .eq('day_key', dayKey)
    .maybeSingle()

  const payload = {
    person_id: personId,
    day_key: dayKey,
    drunkness: patch.drunkness ?? existing?.drunkness ?? 0,
    drinks: patch.drinks ?? existing?.drinks ?? 0,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('daily_stats')
    .upsert(payload)
    .select()
    .single()

  if (error) throw error
  return mapStat(data)
}

export async function uploadMedia(
  personId: string,
  dayKey: string,
  file: File,
): Promise<MediaItem> {
  const kind: 'image' | 'video' = file.type.startsWith('video/')
    ? 'video'
    : 'image'
  const ext = file.name.split('.').pop() || (kind === 'video' ? 'mp4' : 'jpg')
  const id = crypto.randomUUID()
  const path = `${dayKey}/${personId}/${id}.${ext}`

  if (!isLiveBackend || !supabase) {
    const url = URL.createObjectURL(file)
    const item: MediaItem = {
      id,
      personId,
      dayKey,
      kind,
      url,
      path,
      createdAt: new Date().toISOString(),
    }
    const db = ensureLocalDay(dayKey)
    db.media.unshift(item)
    writeLocal(db)
    return item
  }

  const { error: upErr } = await supabase.storage
    .from('media')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (upErr) throw upErr

  const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
  const { data, error } = await supabase
    .from('media')
    .insert({
      id,
      person_id: personId,
      day_key: dayKey,
      kind,
      url: pub.publicUrl,
      path,
    })
    .select()
    .single()
  if (error) throw error
  return mapMedia(data)
}

export function subscribeBoard(
  dayKey: string,
  onChange: () => void,
): () => void {
  const client = supabase
  if (!isLiveBackend || !client) {
    const handler = () => onChange()
    window.addEventListener('malaga-local-sync', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('malaga-local-sync', handler)
      window.removeEventListener('storage', handler)
    }
  }

  const channel = client
    .channel(`malaga-${dayKey}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'daily_stats' },
      () => onChange(),
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'media' },
      () => onChange(),
    )
    .subscribe()

  return () => {
    void client.removeChannel(channel)
  }
}
