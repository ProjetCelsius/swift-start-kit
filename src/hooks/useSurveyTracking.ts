// ============================================
// BOUSSOLE CLIMAT — Hook: useSurveyTracking
// Realtime tracking of survey responses
// ============================================

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface SurveyStats {
  totalResponses: number
  targetCount: number
  completionRate: number
  profileDistribution: Record<string, number>
  dailyCounts: Array<{ date: string; count: number }>
  loading: boolean
}

export function useSurveyTracking(diagnosticId: string, targetCount: number = 20): SurveyStats {
  const [totalResponses, setTotalResponses] = useState(0)
  const [profileDistribution, setProfileDistribution] = useState<Record<string, number>>({})
  const [dailyCounts, setDailyCounts] = useState<Array<{ date: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  // Initial fetch
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        // Count total
        const { count } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .eq('diagnostic_id', diagnosticId)

        setTotalResponses(count || 0)

        // Profile distribution
        const { data: responses } = await supabase
          .from('survey_responses')
          .select('s9_profile, created_at')
          .eq('diagnostic_id', diagnosticId)

        if (responses) {
          // Profiles
          const dist: Record<string, number> = {}
          responses.forEach(r => {
            dist[r.s9_profile] = (dist[r.s9_profile] || 0) + 1
          })
          setProfileDistribution(dist)

          // Daily counts
          const dayCounts: Record<string, number> = {}
          responses.forEach(r => {
            const day = r.created_at.split('T')[0]
            dayCounts[day] = (dayCounts[day] || 0) + 1
          })
          setDailyCounts(
            Object.entries(dayCounts)
              .map(([date, count]) => ({ date, count }))
              .sort((a, b) => a.date.localeCompare(b.date))
          )
        }
      } catch (err) {
        console.error('Survey tracking error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [diagnosticId])

  // Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel(`survey-${diagnosticId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'survey_responses',
          filter: `diagnostic_id=eq.${diagnosticId}`,
        },
        (payload) => {
          setTotalResponses(prev => prev + 1)
          const profile = (payload.new as any).s9_profile
          setProfileDistribution(prev => ({
            ...prev,
            [profile]: (prev[profile] || 0) + 1,
          }))
          const day = (payload.new as any).created_at.split('T')[0]
          setDailyCounts(prev => {
            const existing = prev.find(d => d.date === day)
            if (existing) {
              return prev.map(d => d.date === day ? { ...d, count: d.count + 1 } : d)
            }
            return [...prev, { date: day, count: 1 }]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [diagnosticId])

  return {
    totalResponses,
    targetCount,
    completionRate: targetCount > 0 ? Math.round((totalResponses / targetCount) * 100) : 0,
    profileDistribution,
    dailyCounts,
    loading,
  }
}
