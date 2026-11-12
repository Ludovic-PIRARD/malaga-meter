import { supabase, isLiveBackend } from './supabase'

export const tripEmail =
  (import.meta.env.VITE_TRIP_EMAIL as string | undefined) ||
  'ludovic.pirard9@gmail.com'

const LOCAL_UNLOCK_KEY = 'malaga-meter-unlocked'

export async function getSessionUnlocked(): Promise<boolean> {
  if (!isLiveBackend || !supabase) {
    return localStorage.getItem(LOCAL_UNLOCK_KEY) === '1'
  }
  const { data } = await supabase.auth.getSession()
  return Boolean(data.session)
}

export async function unlockWithPassword(password: string): Promise<void> {
  if (!isLiveBackend || !supabase) {
    // Local preview only — live data still requires Supabase Auth.
    if (password.length < 4) throw new Error('Wrong trip code.')
    localStorage.setItem(LOCAL_UNLOCK_KEY, '1')
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: tripEmail,
    password,
  })
  if (error) throw new Error(error.message)
}

export async function lockBoard(): Promise<void> {
  if (!isLiveBackend || !supabase) {
    localStorage.removeItem(LOCAL_UNLOCK_KEY)
    return
  }
  await supabase.auth.signOut()
}

export function onAuthChange(callback: (unlocked: boolean) => void): () => void {
  if (!isLiveBackend || !supabase) {
    return () => undefined
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(Boolean(session))
  })
  return () => data.subscription.unsubscribe()
}
