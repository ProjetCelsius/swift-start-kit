// ============================================
// BOUSSOLE CLIMAT — Hook: useDiagnostic
// Fetches and manages diagnostic state from Supabase
// Falls back to demo data when Supabase is not configured
// ============================================

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Diagnostic, DiagnosticStatus, AnalysisStep } from '@/types/database'

interface UseDiagnosticOptions {
  diagnosticId?: string
}

interface DiagnosticState {
  diagnostic: Diagnostic | null
  loading: boolean
  error: string | null
  updateStatus: (status: DiagnosticStatus, analysisStep?: AnalysisStep) => Promise<void>
  unlock: () => Promise<void>
  refresh: () => Promise<void>
}

export function useDiagnostic({ diagnosticId }: UseDiagnosticOptions = {}): DiagnosticState {
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDiagnostic = useCallback(async () => {
    if (!diagnosticId || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('diagnostics')
        .select(`
          *,
          organization:organizations(*),
          analyst:profiles!diagnostics_analyst_id_fkey(*),
          client:profiles!diagnostics_client_user_id_fkey(*)
        `)
        .eq('id', diagnosticId)
        .single()

      if (fetchError) throw fetchError
      setDiagnostic(data as unknown as Diagnostic)
      setError(null)
    } catch (err) {
      console.error('Fetch diagnostic error:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [diagnosticId])

  useEffect(() => {
    fetchDiagnostic()
  }, [fetchDiagnostic])

  // Subscribe to realtime updates on this diagnostic
  useEffect(() => {
    if (!diagnosticId || !isSupabaseConfigured()) return

    const channel = supabase
      .channel(`diagnostic-${diagnosticId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'diagnostics', filter: `id=eq.${diagnosticId}` },
        (payload) => {
          setDiagnostic(prev => prev ? { ...prev, ...payload.new } as Diagnostic : null)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [diagnosticId])

  const updateStatus = useCallback(async (status: DiagnosticStatus, analysisStep?: AnalysisStep) => {
    if (!diagnosticId || !isSupabaseConfigured()) return

    const update: Partial<Diagnostic> = { status }
    if (analysisStep !== undefined) update.analysis_step = analysisStep

    const { error: updateError } = await supabase
      .from('diagnostics')
      .update(update)
      .eq('id', diagnosticId)

    if (updateError) {
      console.error('Update status error:', updateError)
      throw updateError
    }
  }, [diagnosticId])

  const unlock = useCallback(async () => {
    if (!diagnosticId || !isSupabaseConfigured()) return

    const { error: updateError } = await supabase
      .from('diagnostics')
      .update({
        status: 'delivered' as DiagnosticStatus,
        unlocked_at: new Date().toISOString(),
      })
      .eq('id', diagnosticId)

    if (updateError) throw updateError
  }, [diagnosticId])

  return {
    diagnostic,
    loading,
    error,
    updateStatus,
    unlock,
    refresh: fetchDiagnostic,
  }
}
