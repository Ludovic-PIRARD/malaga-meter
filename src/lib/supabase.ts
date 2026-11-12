import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isLiveBackend = Boolean(
  url &&
    anon &&
    !url.includes('YOUR_PROJECT') &&
    !anon.includes('YOUR_ANON'),
)

export const supabase: SupabaseClient | null = isLiveBackend
  ? createClient(url!, anon!)
  : null
