// ============================================
// BOUSSOLE CLIMAT — Hook: useQuestionnaire
// Saves questionnaire responses to Supabase with debounce
// Falls back to localStorage when Supabase is not configured
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { QuestionnaireResponse } from '@/types/database'

interface UseQuestionnaireOptions {
  diagnosticId: string
  block: 1 | 2 | 3 | 4
  localStorageKey?: string // for backward compat with existing localStorage
}

interface QuestionnaireState {
  responses: Record<string, any>
  setResponse: (questionKey: string, value: number | string | Record<string, unknown>) => void
  loading: boolean
  saving: boolean
  error: string | null
  completedCount: number
  totalCount: number
}

const DEBOUNCE_MS = 500

export function useQuestionnaire({
  diagnosticId,
  block,
  localStorageKey,
}: UseQuestionnaireOptions): QuestionnaireState {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pendingRef = useRef<Map<string, any>>(new Map())

  // ─── Load initial data ────────────────────────
  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        // Load from Supabase
        try {
          const { data, error: fetchError } = await supabase
            .from('questionnaire_responses')
            .select('*')
            .eq('diagnostic_id', diagnosticId)
            .eq('block', block)

          if (fetchError) throw fetchError

          const loaded: Record<string, any> = {}
          ;(data || []).forEach((r: QuestionnaireResponse) => {
            loaded[r.question_key] = r.response_value ?? r.response_text ?? r.response_json
          })
          setResponses(loaded)
        } catch (err) {
          console.error('Load questionnaire error:', err)
          setError((err as Error).message)
          // Fallback to localStorage
          if (localStorageKey) {
            try {
              const raw = localStorage.getItem(localStorageKey)
              if (raw) setResponses(JSON.parse(raw))
            } catch {}
          }
        }
      } else {
        // Demo mode: load from localStorage
        if (localStorageKey) {
          try {
            const raw = localStorage.getItem(localStorageKey)
            if (raw) setResponses(JSON.parse(raw))
          } catch {}
        }
      }
      setLoading(false)
    }
    load()
  }, [diagnosticId, block, localStorageKey])

  // ─── Debounced save to Supabase ───────────────
  const flushPending = useCallback(async () => {
    const entries = Array.from(pendingRef.current.entries())
    if (entries.length === 0) return

    pendingRef.current.clear()
    setSaving(true)

    try {
      if (isSupabaseConfigured()) {
        // Upsert each pending response
        const upserts = entries.map(([questionKey, value]) => {
          const row: any = {
            diagnostic_id: diagnosticId,
            block,
            question_key: questionKey,
          }
          if (typeof value === 'number') {
            row.response_value = value
          } else if (typeof value === 'string') {
            row.response_text = value
          } else {
            row.response_json = value
          }
          return row
        })

        const { error: upsertError } = await supabase
          .from('questionnaire_responses')
          .upsert(upserts, { onConflict: 'diagnostic_id,question_key' })

        if (upsertError) throw upsertError
      }

      // Always save to localStorage as backup
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, JSON.stringify(responses))
      }

      setError(null)
    } catch (err) {
      console.error('Save questionnaire error:', err)
      setError((err as Error).message)
      // Still save to localStorage as fallback
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, JSON.stringify(responses))
      }
    } finally {
      setSaving(false)
    }
  }, [diagnosticId, block, responses, localStorageKey])

  // ─── Set a single response ────────────────────
  const setResponse = useCallback((questionKey: string, value: number | string | Record<string, unknown>) => {
    setResponses(prev => ({ ...prev, [questionKey]: value }))
    pendingRef.current.set(questionKey, value)

    // Debounce
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(flushPending, DEBOUNCE_MS)
  }, [flushPending])

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      // Sync flush
      if (pendingRef.current.size > 0 && localStorageKey) {
        try {
          const current = JSON.parse(localStorage.getItem(localStorageKey) || '{}')
          pendingRef.current.forEach((val, key) => { current[key] = val })
          localStorage.setItem(localStorageKey, JSON.stringify(current))
        } catch {}
      }
    }
  }, [localStorageKey])

  const completedCount = Object.keys(responses).filter(k => responses[k] !== undefined && responses[k] !== null).length

  return {
    responses,
    setResponse,
    loading,
    saving,
    error,
    completedCount,
    totalCount: 0, // Set per block in the component
  }
}
