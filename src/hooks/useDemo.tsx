import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { MAISON_DUVAL_FULL, buildDiagnosticAtStep, type DemoDiagnostic, type DemoStep, type DemoRole } from '@/data/demoData'

interface DemoState {
  enabled: boolean
  role: DemoRole
  currentStep: DemoStep
  diagnostic: DemoDiagnostic
  setEnabled: (v: boolean) => void
  setRole: (r: DemoRole) => void
  advanceStep: () => void
  resetDemo: () => void
  setStep: (step: DemoStep) => void
  // Backward compat aliases
  activeDiagnostic: DemoDiagnostic
  activeDiagnosticId: string
  diagnostics: DemoDiagnostic[]
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
  const [currentStep, setCurrentStep] = useState<DemoStep>((initial?.currentStep as DemoStep) ?? 6)

  const diagnostic = buildDiagnosticAtStep(MAISON_DUVAL_FULL, currentStep)

  // Persist state
  useEffect(() => {
    localStorage.setItem('demo-state', JSON.stringify({ enabled, role, currentStep }))
  }, [enabled, role, currentStep])

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

  const advanceStep = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, 6) as DemoStep)
  }, [])

  const resetDemo = useCallback(() => {
    setCurrentStep(1)
  }, [])

  const setStep = useCallback((step: DemoStep) => {
    setCurrentStep(step)
  }, [])

  return (
    <DemoContext.Provider value={{
      enabled,
      role,
      currentStep,
      diagnostic,
      setEnabled,
      setRole,
      advanceStep,
      resetDemo,
      setStep,
      // Backward compat
      activeDiagnostic: diagnostic,
      activeDiagnosticId: diagnostic.id,
      diagnostics: [diagnostic],
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
