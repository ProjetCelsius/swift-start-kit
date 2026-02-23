// ============================================
// BOUSSOLE CLIMAT — Hook: useAnalytics
// Tracks user events for analytics
// ============================================

import { useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { EventType } from '@/types/database'

// Session ID persists for the browser tab lifetime
const SESSION_ID = crypto.randomUUID()

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function useAnalytics(diagnosticId?: string) {
  const location = useLocation()
  const pageEnteredAt = useRef(Date.now())

  // Track page views automatically
  useEffect(() => {
    pageEnteredAt.current = Date.now()

    if (!isSupabaseConfigured) return

    // Fire-and-forget, no await
    supabase.from('analytics_events').insert({
      diagnostic_id: diagnosticId || null,
      session_id: SESSION_ID,
      event_type: 'page_view' as EventType,
      page_path: location.pathname,
      device_type: getDeviceType(),
    }).then()

    // On unmount (page leave), log duration
    return () => {
      const duration = Date.now() - pageEnteredAt.current
      if (duration > 1000 && isSupabaseConfigured) {
        supabase.from('analytics_events').insert({
          diagnostic_id: diagnosticId || null,
          session_id: SESSION_ID,
          event_type: 'page_view' as EventType,
          page_path: location.pathname,
          duration_ms: duration,
          device_type: getDeviceType(),
          event_data: { action: 'page_leave' },
        }).then()
      }
    }
  }, [location.pathname, diagnosticId])

  const track = useCallback((eventType: EventType, data?: Record<string, unknown>) => {
    if (!isSupabaseConfigured) return

    supabase.from('analytics_events').insert({
      diagnostic_id: diagnosticId || null,
      session_id: SESSION_ID,
      event_type: eventType,
      page_path: location.pathname,
      event_data: data || null,
      device_type: getDeviceType(),
    }).then()
  }, [diagnosticId, location.pathname])

  return { track }
}
