export type Person = {
  id: string
  name: string
  sortOrder: number
}

export const PEOPLE: Person[] = [
  { id: 'antoine', name: 'Antoine', sortOrder: 1 },
  { id: 'arthur', name: 'Arthur', sortOrder: 2 },
  { id: 'sergent', name: 'Sergent', sortOrder: 3 },
  { id: 'bilal', name: 'Bilal', sortOrder: 4 },
  { id: 'bruno', name: 'Bruno', sortOrder: 5 },
  { id: 'charli', name: 'Charli', sortOrder: 6 },
  { id: 'mikus', name: 'Mikus', sortOrder: 7 },
  { id: 'jules', name: 'Jules', sortOrder: 8 },
  { id: 'ludo', name: 'Ludo', sortOrder: 9 },
  { id: 'max', name: 'Max', sortOrder: 10 },
  { id: 'ledoc', name: 'LeDoc', sortOrder: 11 },
]

export const DRUNK_LABELS = [
  'Sober saint',
  'Tipple tease',
  'Warm glow',
  'Giddy',
  'Buzzed',
  'Proper merry',
  'Wobbly',
  'Karaoke danger',
  'Lost in Málaga',
  'Absolute unit',
  'Legendary wreck',
] as const

export function drunkLabel(level: number): string {
  const clamped = Math.max(0, Math.min(10, Math.round(level)))
  return DRUNK_LABELS[clamped]
}
