import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemo } from './useDemo'

export interface TourStep {
  route: string
  role: 'client' | 'admin'
  demoStep: 1 | 2 | 3 | 4 | 5 | 6
  tooltipTitle: string
  tooltipText: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    route: '/login',
    role: 'client',
    demoStep: 6,
    tooltipTitle: 'Connexion client',
    tooltipText: "Le responsable RSE reçoit un lien magique par email pour accéder à son espace. Pas de mot de passe à retenir.",
  },
  {
    route: '/setup/demo-duval',
    role: 'admin',
    demoStep: 1,
    tooltipTitle: 'Paramétrage du diagnostic',
    tooltipText: "L'analyste Celsius paramètre le diagnostic avec le client : profil entreprise, démarche actuelle, configuration du sondage et de l'entretien DG.",
  },
  {
    route: '/client/dashboard',
    role: 'client',
    demoStep: 3,
    tooltipTitle: 'Vue d\'ensemble client',
    tooltipText: "Le client retrouve sa vue d'ensemble : avancement du questionnaire, sondage, documents, et accès à toutes les étapes du diagnostic.",
  },
  {
    route: '/client/dashboard',
    role: 'client',
    demoStep: 5,
    tooltipTitle: 'Phase d\'analyse',
    tooltipText: "L'analyste Celsius travaille sur le diagnostic. Le client suit l'avancement depuis sa vue d'ensemble.",
  },
  {
    route: '/admin/dashboard',
    role: 'admin',
    demoStep: 6,
    tooltipTitle: 'Tableau de bord analyste',
    tooltipText: "L'analyste Celsius voit tous ses diagnostics en cours, les statistiques, et peut en créer de nouveaux.",
  },
  {
    route: '/admin/diagnostic/demo-duval',
    role: 'admin',
    demoStep: 6,
    tooltipTitle: 'Éditeur d\'analyse',
    tooltipText: "L'analyste consulte les réponses, lance la génération IA, édite les sections, puis publie le diagnostic.",
  },
  {
    route: '/client/synthesis',
    role: 'client',
    demoStep: 6,
    tooltipTitle: 'Synthèse du diagnostic',
    tooltipText: "Le client découvre son score de maturité, son Profil Climat, et les 3 insights clés.",
  },
  {
    route: '/client/diagnostic/1',
    role: 'client',
    demoStep: 6,
    tooltipTitle: "9 sections d'analyse",
    tooltipText: "Chaque section est personnalisée : recommandations, écarts de perception, échéancier réglementaire, feuille de route. Le client navigue librement.",
  },
]

interface GuidedTourState {
  active: boolean
  currentStep: number // 0-indexed
  startTour: () => void
  endTour: () => void
  goToStep: (idx: number) => void
  nextStep: () => void
  prevStep: () => void
  tourStep: TourStep | null
}

const GuidedTourContext = createContext<GuidedTourState | undefined>(undefined)

export function GuidedTourProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const demo = useDemo()

  const applyStep = useCallback((idx: number) => {
    const step = TOUR_STEPS[idx]
    if (!step) return

    // Enable demo mode
    if (!demo.enabled) demo.setEnabled(true)

    // Set role
    demo.setRole(step.role)

    // Set demo step (diagnostic state)
    demo.setStep(step.demoStep)

    // Navigate
    // For step 0 (login), we need special handling since login redirects when authenticated
    if (idx === 0) {
      // Don't actually navigate to /login since demo mode auto-authenticates
      // Instead navigate to dashboard with a note that this would be login
      navigate('/login')
    } else {
      navigate(step.route)
    }
  }, [demo, navigate])

  const startTour = useCallback(() => {
    setActive(true)
    setCurrentStep(0)
    applyStep(0)
  }, [applyStep])

  const endTour = useCallback(() => {
    setActive(false)
    setCurrentStep(0)
    // Restore to delivered state
    demo.setStep(6)
    demo.setRole('client')
    navigate('/client/dashboard')
  }, [demo, navigate])

  const goToStep = useCallback((idx: number) => {
    if (idx < 0 || idx >= TOUR_STEPS.length) return
    setCurrentStep(idx)
    applyStep(idx)
  }, [applyStep])

  const nextStep = useCallback(() => {
    if (currentStep >= TOUR_STEPS.length - 1) {
      endTour()
      return
    }
    const next = currentStep + 1
    setCurrentStep(next)
    applyStep(next)
  }, [currentStep, applyStep, endTour])

  const prevStep = useCallback(() => {
    if (currentStep <= 0) return
    const prev = currentStep - 1
    setCurrentStep(prev)
    applyStep(prev)
  }, [currentStep, applyStep])

  return (
    <GuidedTourContext.Provider value={{
      active,
      currentStep,
      startTour,
      endTour,
      goToStep,
      nextStep,
      prevStep,
      tourStep: active ? TOUR_STEPS[currentStep] : null,
    }}>
      {children}
    </GuidedTourContext.Provider>
  )
}

export function useGuidedTour() {
  const ctx = useContext(GuidedTourContext)
  if (!ctx) throw new Error('useGuidedTour must be used within GuidedTourProvider')
  return ctx
}
