// ============================================
// BOUSSOLE CLIMAT — Supabase Client (typed)
// ============================================

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// In demo mode (no env vars), we don't create a real client
// The app falls back to mock data via useDemo hook
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'http://localhost:54321')

export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'placeholder'
)

// ─── Helper: call Edge Function ────────────────
export async function callEdgeFunction<T = unknown>(
  name: string,
  body: Record<string, unknown>,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke(name, { body })
    if (error) {
      console.error(`Edge function ${name} error:`, error)
      return { data: null, error: error.message }
    }
    return { data: data as T, error: null }
  } catch (err) {
    console.error(`Edge function ${name} exception:`, err)
    return { data: null, error: (err as Error).message }
  }
}
