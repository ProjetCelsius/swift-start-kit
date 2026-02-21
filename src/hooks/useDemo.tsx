import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { DEMO_DIAGNOSTICS, type DemoDiagnostic, type DemoStatus, type DemoRole } from '@/data/demoData'

interface DemoState {
  enabled: boolean
  role: DemoRole
  activeDiagnosticId: string
  activeDiagnostic: DemoDiagnostic
  diagnostics: DemoDiagnostic[]
  setEnabled: (v: boolean) => void
  setRole: (r: DemoRole) => void
  setActiveDiagnosticId: (id: string) => void
  setDiagnosticStatus: (status: DemoStatus) => void
}

const DemoContext = createContext<DemoState | undefined>(undefined)

function getInitialState() {
  try {
    const saved = localStorage.getItem('demo-state')
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const initial = getInitialState()
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const urlDemo = params?.get('demo') === 'true'

  const [enabled, setEnabled] = useState(initial?.enabled ?? urlDemo ?? false)
  const [role, setRole] = useState<DemoRole>(initial?.role ?? 'client')
  const [activeDiagnosticId, setActiveDiagnosticId] = useState<string>(initial?.activeDiagnosticId ?? DEMO_DIAGNOSTICS[0].id)
  const [diagnostics, setDiagnostics] = useState<DemoDiagnostic[]>(DEMO_DIAGNOSTICS)

  const activeDiagnostic = diagnostics.find(d => d.id === activeDiagnosticId) ?? diagnostics[0]

  // Persist state
  useEffect(() => {
    localStorage.setItem('demo-state', JSON.stringify({ enabled, role, activeDiagnosticId }))
  }, [enabled, role, activeDiagnosticId])

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setEnabled((v: boolean) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const setDiagnosticStatus = useCallback((status: DemoStatus) => {
    setDiagnostics(prev => prev.map(d => {
      if (d.id !== activeDiagnosticId) return d
      // Map status to appropriate state
      const unlocked = status === 'delivered'
      const sectionStatus = status === 'delivered' ? 'validated' : 'empty'
      return {
        ...d,
        status,
        diagnosticUnlocked: unlocked,
        diagnosticSections: Array(9).fill({ status: sectionStatus }),
      }
    }))
  }, [activeDiagnosticId])

  return (
    <DemoContext.Provider value={{
      enabled,
      role,
      activeDiagnosticId,
      activeDiagnostic,
      diagnostics,
      setEnabled,
      setRole,
      setActiveDiagnosticId,
      setDiagnosticStatus,
    }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}

export function useDemoIfAvailable() {
  return useContext(DemoContext)
}
