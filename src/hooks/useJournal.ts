// ============================================
// BOUSSOLE CLIMAT — Hook: useJournal
// Journal entries with realtime updates
// ============================================

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { JournalEntry, JournalReply } from '@/types/database'

interface JournalEntryWithReplies extends JournalEntry {
  replies: JournalReply[]
  author: { first_name: string; last_name: string; role: string; photo_url: string | null }
}

interface UseJournalResult {
  entries: JournalEntryWithReplies[]
  loading: boolean
  error: string | null
  addEntry: (content: string, stepChange?: string) => Promise<void>
  addReply: (entryId: string, content: string) => Promise<void>
}

export function useJournal(diagnosticId: string): UseJournalResult {
  const [entries, setEntries] = useState<JournalEntryWithReplies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select(`
          *,
          author:profiles!journal_entries_author_id_fkey(first_name, last_name, role, photo_url),
          replies:journal_replies(
            *,
            author:profiles!journal_replies_author_id_fkey(first_name, last_name, role, photo_url)
          )
        `)
        .eq('diagnostic_id', diagnosticId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setEntries((data || []) as unknown as JournalEntryWithReplies[])
      setError(null)
    } catch (err) {
      console.error('Fetch journal error:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [diagnosticId])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Realtime on new entries and replies
  useEffect(() => {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel(`journal-${diagnosticId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'journal_entries', filter: `diagnostic_id=eq.${diagnosticId}` },
        () => fetchEntries()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'journal_replies' },
        () => fetchEntries()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [diagnosticId, fetchEntries])

  const addEntry = useCallback(async (content: string, stepChange?: string) => {
    if (!isSupabaseConfigured) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error: insertError } = await supabase
      .from('journal_entries')
      .insert({
        diagnostic_id: diagnosticId,
        author_id: user.id,
        content,
        step_change: stepChange || null,
      })

    if (insertError) throw insertError
    // Realtime will trigger refresh
  }, [diagnosticId])

  const addReply = useCallback(async (entryId: string, content: string) => {
    if (!isSupabaseConfigured) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error: insertError } = await supabase
      .from('journal_replies')
      .insert({
        journal_entry_id: entryId,
        author_id: user.id,
        content,
      })

    if (insertError) throw insertError
  }, [])

  return { entries, loading, error, addEntry, addReply }
}
