// Placeholder pages — will be fleshed out in subsequent commits

import { useParams } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useDiagnosticReading } from '@/hooks/useDiagnosticReading'

const sectionComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  '1': lazy(() => import('./diagnostic/DiagnosticSection1')),
  '2': lazy(() => import('./diagnostic/DiagnosticSection2')),
  '3': lazy(() => import('./diagnostic/DiagnosticSection3')),
  '4': lazy(() => import('./diagnostic/DiagnosticSection4')),
  '5': lazy(() => import('./diagnostic/DiagnosticSection5')),
  '6': lazy(() => import('./diagnostic/DiagnosticSection6')),
  '7': lazy(() => import('./diagnostic/DiagnosticSection7')),
  '8': lazy(() => import('./diagnostic/DiagnosticSection8')),
  '9': lazy(() => import('./diagnostic/DiagnosticSection9')),
}

export function QuestionnairePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Questionnaire</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Sélectionnez un bloc dans la sidebar pour commencer.
      </p>
    </div>
  )
}


export function SondagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sondage interne</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Le suivi des réponses au sondage apparaîtra ici.
      </p>
    </div>
  )
}

export function DiagnosticSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const { progress, markAsRead } = useDiagnosticReading()
  const Section = sectionId ? sectionComponents[sectionId] : null
  const state = sectionId ? progress[sectionId] : undefined

  // Auto-mark as read after 3 seconds
  useEffect(() => {
    if (!sectionId || state === 'lu' || state === 'locked') return
    const timer = setTimeout(() => {
      markAsRead(sectionId)
    }, 3000)
    return () => clearTimeout(timer)
  }, [sectionId, state, markAsRead])

  // If locked, show locked message
  if (state === 'locked') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔒</span>
          <h1 className="text-2xl font-bold">Section verrouillée</h1>
        </div>
        <p style={{ color: 'var(--color-texte-secondary)' }}>
          Lisez les sections précédentes pour débloquer celle-ci.
        </p>
      </div>
    )
  }

  if (!Section) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔒</span>
          <h1 className="text-2xl font-bold">Section verrouillée</h1>
        </div>
        <p style={{ color: 'var(--color-texte-secondary)' }}>
          Cette section sera déverrouillée après votre appel de restitution avec votre analyste.
        </p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-celsius-900)' }} />
        </div>
      }
    >
      <Section />
    </Suspense>
  )
}

export function JournalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Journal de bord</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Les notes de votre analyste apparaîtront ici au fil de l'analyse.
      </p>
    </div>
  )
}

export function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messagerie</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Échangez avec votre analyste.
      </p>
    </div>
  )
}

export function AidePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Aide</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Besoin d'aide ? Contactez votre analyste via la messagerie ou planifiez un appel.
      </p>
    </div>
  )
}
