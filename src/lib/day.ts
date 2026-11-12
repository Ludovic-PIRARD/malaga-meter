const TZ = 'Europe/Madrid'

function madridParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour === '24' ? '0' : map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function shiftCalendarDay(
  year: number,
  month: number,
  day: number,
  delta: number,
): string {
  const shifted = new Date(Date.UTC(year, month - 1, day + delta))
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
}

/** Noon-to-noon cycle in Europe/Madrid. Before 12:00, the active day is yesterday. */
export function getDayKey(date = new Date()): string {
  const { year, month, day, hour } = madridParts(date)
  if (hour < 12) return shiftCalendarDay(year, month, day, -1)
  return `${year}-${pad(month)}-${pad(day)}`
}

export function formatDayKey(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d, 12))
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function dayWindowLabel(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, d, 10))
  const end = new Date(Date.UTC(y, m - 1, d + 1, 10))
  const fmt = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  })
  return `${fmt.format(start)} → ${fmt.format(end)} (Madrid)`
}

export function msUntilNextNoon(date = new Date()): number {
  const { hour, minute, second } = madridParts(date)
  const elapsedToday = hour * 3600 + minute * 60 + second
  const noon = 12 * 3600
  const secondsToNoon =
    elapsedToday < noon ? noon - elapsedToday : 24 * 3600 - elapsedToday + noon
  return secondsToNoon * 1000
}
