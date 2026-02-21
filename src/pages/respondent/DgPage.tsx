import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight, Check, CheckCircle } from 'lucide-react'

// Mock data — fetched via token in production
function useDgConfig(_token: string) {
  return {
    companyName: 'Acme Corp',
    clientName: 'Marie Dupont',
  }
}

const DG_QUESTIONS = [
  {
    key: 'dg1',
    label: 'DG1. Quel est le niveau de portage climat dans votre gouvernance ?',
    options: [
      'Pas de portage formel du sujet climat',
      'Un référent est identifié sans mandat formel',
      'Le sujet est traité en comité de direction régulièrement',
      'Le climat est intégré dans la stratégie avec objectifs liés à la rémunération',
    ],
  },
  {
    key: 'dg2',
    label: 'DG2. Quel budget annuel est consacré à la transition climat ?',
    options: [
      'Moins de 20 000 €',
      '20 000 € à 50 000 €',
      '50 000 € à 100 000 €',
      '100 000 € à 300 000 €',
      'Plus de 300 000 €',
      'Je ne sais pas',
    ],
  },
  {
    key: 'dg3',
    label: 'DG3. Sur quel horizon attendez-vous un retour sur investissement ?',
    options: [
      'Moins de 1 an',
      '1 à 3 ans',
      '3 à 5 ans',
      'Plus de 5 ans',
      'Pas une question de ROI, c\'est un investissement de conviction',
    ],
  },
  {
    key: 'dg4',
    label: 'DG4. Quel est le principal bénéfice attendu de votre démarche climat ?',
    options: [
      'Conformité réglementaire',
      'Réduction des coûts opérationnels',
      'Image et réputation',
      'Attractivité employeur',
      'Conviction et responsabilité sociétale',
      'Accès à de nouveaux marchés',
    ],
  },
] as const

// ── Logo Block ───────────────────────────────
function LogoBlock() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, backgroundColor: '#1B4332',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 500, color: '#fff', fontSize: '0.85rem',
      }}>
        BC
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1rem', color: '#2A2A28' }}>
          Boussole Climat
        </div>
        <div className="label-uppercase" style={{ fontSize: '0.6rem', marginTop: 1 }}>par Celsius</div>
      </div>
    </div>
  )
}

// ── Radio Card ───────────────────────────────
function RadioCard({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '14px 18px', borderRadius: 10,
        border: `1px solid ${selected ? '#1B4332' : '#EDEAE3'}`,
        backgroundColor: selected ? '#F7F5F0' : '#fff',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? '#1B4332' : '#E5E1D8'}`,
        backgroundColor: selected ? '#1B4332' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <Check size={10} color="white" />}
      </div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 400, color: '#2A2A28' }}>
        {label}
      </span>
    </button>
  )
}

export default function DgPage() {
  const { token } = useParams<{ token: string }>()
  const config = useDgConfig(token ?? '')

  const [phase, setPhase] = useState<'welcome' | 'form' | 'done'>('welcome')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [slider, setSlider] = useState<number | null>(null)

  function selectAnswer(key: string, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const sliderDisplay = slider ?? 5
  const sliderTouched = slider !== null
  const allRadiosAnswered = DG_QUESTIONS.every(q => answers[q.key])
  const canSubmit = allRadiosAnswered && sliderTouched

  const shell = (children: React.ReactNode) => (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F5F0', display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 540, width: '100%' }}>{children}</div>
      <style>{`
        .dg-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: #1B4332; border: 2px solid white; box-shadow: 0 1px 3px rgba(42,42,40,.12); cursor: grab;
        }
        .dg-slider::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #1B4332; border: 2px solid white; box-shadow: 0 1px 3px rgba(42,42,40,.12); cursor: grab;
        }
      `}</style>
    </div>
  )

  // ── DONE ──
  if (phase === 'done') {
    return shell(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }} className="animate-fade-in">
          <CheckCircle size={48} color="#1B4332" style={{ margin: '0 auto 16px' }} />
          <h1 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: 8 }}>Merci.</h1>
          <p style={{ fontSize: '0.85rem', color: '#B0AB9F' }}>
            Vos réponses ont été transmises à l'équipe Celsius.
          </p>
        </div>
      </div>
    )
  }

  // ── FORM ──
  if (phase === 'form') {
    return shell(
      <div style={{ paddingTop: 16 }} className="animate-fade-in">
        <LogoBlock />

        {DG_QUESTIONS.map(q => (
          <div key={q.key} style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 10, lineHeight: 1.5, color: '#2A2A28' }}>
              {q.label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map(opt => (
                <RadioCard
                  key={opt}
                  selected={answers[q.key] === opt}
                  label={opt}
                  onClick={() => selectAnswer(q.key, opt)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* DG5 Slider */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 10, lineHeight: 1.5, color: '#2A2A28' }}>
            DG5. Estimez-vous que votre entreprise met les moyens suffisants pour sa transition climat ?
          </p>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span
              className="font-display"
              style={{ fontSize: '1.5rem', fontWeight: 600, color: sliderTouched ? '#1B4332' : '#E5E1D8', transition: 'color 0.2s' }}
            >
              {sliderDisplay}
            </span>
          </div>
          <input
            type="range" min={1} max={10} value={sliderDisplay}
            onChange={e => setSlider(parseInt(e.target.value))}
            className="dg-slider"
            style={{
              width: '100%', height: 4, borderRadius: 2, appearance: 'none', cursor: 'pointer', outline: 'none',
              background: `linear-gradient(to right, #1B4332 0%, #1B4332 ${((sliderDisplay - 1) / 9) * 100}%, #F0EDE6 ${((sliderDisplay - 1) / 9) * 100}%, #F0EDE6 100%)`,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.7rem', color: '#B0AB9F' }}>Pas du tout</span>
            <span style={{ fontSize: '0.7rem', color: '#B0AB9F' }}>Tout à fait</span>
          </div>
        </div>

        <button
          onClick={() => setPhase('done')}
          disabled={!canSubmit}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 8, backgroundColor: '#1B4332',
            color: '#fff', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: canSubmit ? 1 : 0.4, fontFamily: 'var(--font-sans)',
          }}
        >
          Envoyer mes réponses <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  // ── WELCOME ──
  return shell(
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ width: '100%', textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LogoBlock />
        </div>

        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: 4 }}>
          Questionnaire direction
        </h1>
        <p className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: '#1B4332', marginBottom: 16 }}>
          {config.companyName}
        </p>
        <p style={{ fontSize: '0.88rem', color: '#7A766D', lineHeight: 1.5, marginBottom: 28 }}>
          {config.clientName} vous a invité(e) à répondre à 5 questions. Durée : 3 minutes.
        </p>

        <button
          onClick={() => setPhase('form')}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 8, backgroundColor: '#1B4332',
            color: '#fff', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'var(--font-sans)',
          }}
        >
          Démarrer <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
