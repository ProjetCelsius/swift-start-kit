import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (supabaseUrl && supabaseKey) {
      _supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    } else {
      // Create a dummy client that won't crash — dev mode with mock data
      _supabase = createClient('http://localhost:54321', 'placeholder', {
        auth: { storage: localStorage, persistSession: false },
      })
    }
  }
  return _supabase
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop]
  },
})

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey)
}
