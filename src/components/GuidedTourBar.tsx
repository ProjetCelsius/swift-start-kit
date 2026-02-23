import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useGuidedTour, TOUR_STEPS } from '@/hooks/useGuidedTour'

const STEP_TITLES = [
  'Login',
  'Lancement',
  'Questionnaire',
  'Sondage',
  'Documents',
  'Analyse',
  'Admin Dashboard',
  'Éditeur analyste',
  'Synthèse livrée',
  'Sections',
]

export default function GuidedTourBar() {
  const { active, currentStep, nextStep, prevStep, goToStep, endTour } = useGuidedTour()

  if (!active) return null

  const isFirst = currentStep === 0
  const isLast = currentStep === TOUR_STEPS.length - 1

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#fff',
        borderTop: '1px solid #E5E1D8',
        padding: '12px 24px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        {/* Left: status + step title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1B4332',
              animation: 'tourPulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase' as const, color: '#1B4332',
            }}>
              VISITE GUIDÉE
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2A2A28' }}>
            Étape {currentStep + 1}/10 — {STEP_TITLES[currentStep]}
          </span>
        </div>

        {/* Center: step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {TOUR_STEPS.map((_, i) => {
            const isPast = i < currentStep
            const isCurrent = i === currentStep
            return (
              <button
                key={i}
                onClick={() => goToStep(i)}
                title={STEP_TITLES[i]}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: isCurrent ? '2px solid #1B4332' : 'none',
                  backgroundColor: isPast ? '#1B4332' : isCurrent ? 'transparent' : '#E5E1D8',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                  animation: isCurrent ? 'tourPulse 2s ease-in-out infinite' : 'none',
                  boxSizing: 'border-box' as const,
                }}
              />
            )
          })}
        </div>

        {/* Right: nav buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 260, justifyContent: 'flex-end' }}>
          <button
            onClick={prevStep}
            disabled={isFirst}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8,
              border: '1px solid #E5E1D8',
              backgroundColor: '#fff',
              color: isFirst ? '#D0CFC8' : '#7A766D',
              fontSize: '0.8rem', fontWeight: 500,
              cursor: isFirst ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <ChevronLeft size={14} /> Précédent
          </button>
          <button
            onClick={nextStep}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 16px', borderRadius: 8,
              border: 'none',
              backgroundColor: '#1B4332',
              color: '#fff',
              fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {isLast ? (
              <>Terminer <Check size={14} /></>
            ) : (
              <>Suivant <ChevronRight size={14} /></>
            )}
          </button>
          <button
            onClick={endTour}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: 8,
              border: 'none', backgroundColor: 'transparent',
              color: '#B0AB9F', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            title="Quitter la visite"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tourPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
