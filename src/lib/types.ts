export type DailyStat = {
  personId: string
  dayKey: string
  drunkness: number
  drinks: number
  updatedAt: string
}

export type MediaItem = {
  id: string
  personId: string
  dayKey: string
  kind: 'image' | 'video'
  url: string
  path: string
  createdAt: string
}

export type ToastPayload = {
  id: string
  message: string
}
