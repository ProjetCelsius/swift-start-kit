import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, CheckCircle } from 'lucide-react'

const RSE_QUESTIONS = [
  {
    key: 'rse1',
    label: '1. Quel est le niveau de portage climat dans votre gouvernance ?',
    options: [
      'Pas de portage formel du sujet climat',
      'Un référent est identifié sans mandat formel',
      'Le sujet est traité en comité de direction régulièrement',
      'Le climat est intégré dans la stratégie avec objectifs liés à la rémunération',
    ],
  },
  {
    key: 'rse2',
    label: '2. Quel budget annuel est consacré à la transition climat ?',
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
    key: 'rse3',
    label: '3. Sur quel horizon attendez-vous un retour sur investissement ?',
    options: [
      'Moins de 1 an',
      '1 à 3 ans',
      '3 à 5 ans',
      'Plus de 5 ans',
      'Pas une question de ROI, c\'est un investissement de conviction',
    ],
  },
  {
    key: 'rse4',
    label: '4. Quel est le principal bénéfice attendu de votre démarche climat ?',
    options: [
      'Conformité réglementaire',
      'Réduction des coûts opérationnels',
      'Image et réputation',
      'Attractivité employeur',
      'Conviction et responsabilité sociétale',
      'Accès à de nouveaux marchés',
    ],
  },
]

function RadioCard({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10,
        border: `1px solid ${selected ? '#1B4332' : '#EDEAE3'}`,
        backgroundColor: selected ? '#E8F0EB' : '#FFFFFF',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = '#F7F5F0' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = '#FFFFFF' }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? '#1B4332' : '#E5E1D8'}`,
        backgroundColor: selected ? '#1B4332' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <Check size={10} color="white" />}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#2A2A28' }}>
        {label}
      </span>
    </button>
  )
}

export default function QuestionnaireRsePage() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('rse-questionnaire-answers')
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [slider, setSlider] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('rse-questionnaire-slider')
      return saved ? parseInt(saved) : null
    } catch { return null }
  })
  const [submitted, setSubmitted] = useState(() => localStorage.getItem('rse-questionnaire-done') === 'true')

  function selectAnswer(key: string, value: string) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    localStorage.setItem('rse-questionnaire-answers', JSON.stringify(next))
  }

  function handleSlider(val: number) {
    setSlider(val)
    localStorage.setItem('rse-questionnaire-slider', String(val))
  }

  const sliderDisplay = slider ?? 5
  const sliderTouched = slider !== null
  const allRadiosAnswered = RSE_QUESTIONS.every(q => answers[q.key])
  const canSubmit = allRadiosAnswered && sliderTouched
  const answeredCount = RSE_QUESTIONS.filter(q => answers[q.key]).length + (sliderTouched ? 1 : 0)

  function handleSubmit() {
    localStorage.setItem('rse-questionnaire-done', 'true')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={48} color="#1B4332" style={{ margin: '0 auto 16px' }} />
          <h1 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, color: '#2A2A28', marginBottom: 8 }}>
            Questionnaire complété
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', marginBottom: 24 }}>
            Vos réponses ont été enregistrées et seront intégrées à votre diagnostic.
          </p>
          <button
            onClick={() => navigate('/client/entretiens')}
            style={{
              padding: '10px 24px', borderRadius: 8, backgroundColor: '#1B4332', color: '#fff',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem',
              border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            Retour aux entretiens <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/client/entretiens')}
        className="flex items-center gap-2 mb-6"
        style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} /> Retour aux entretiens
      </button>

      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 16,
        padding: '24px 28px', marginBottom: 24,
      }}>
        <div className="label-uppercase mb-2" style={{ fontSize: '0.5rem', letterSpacing: '0.1em' }}>
          QUESTIONNAIRE RESPONSABLE RSE
        </div>
        <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: '#2A2A28', marginBottom: 6 }}>
          Votre vision stratégique
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', lineHeight: 1.5 }}>
          5 questions pour compléter le volet direction de votre diagnostic. Vos réponses sont sauvegardées automatiquement.
        </p>

        {/* Progress */}
        <div className="flex items-center gap-3 mt-4">
          <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E1D8', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, #B87333, #1B4332)',
              width: `${(answeredCount / 5) * 100}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: '#7A766D' }}>
            {answeredCount}/5
          </span>
        </div>
      </div>

      {/* Questions */}
      {RSE_QUESTIONS.map(q => (
        <div key={q.key} style={{
          backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14,
          padding: '20px 24px', marginBottom: 16,
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, marginBottom: 12, lineHeight: 1.5, color: '#2A2A28' }}>
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

      {/* DG5-style Slider */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, marginBottom: 12, lineHeight: 1.5, color: '#2A2A28' }}>
          5. Estimez-vous que votre entreprise met les moyens suffisants pour sa transition climat ?
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
          onChange={e => handleSlider(parseInt(e.target.value))}
          className="rse-slider"
          style={{
            width: '100%', height: 4, borderRadius: 2, appearance: 'none', cursor: 'pointer', outline: 'none',
            background: `linear-gradient(to right, #1B4332 0%, #1B4332 ${((sliderDisplay - 1) / 9) * 100}%, #F0EDE6 ${((sliderDisplay - 1) / 9) * 100}%, #F0EDE6 100%)`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>Pas du tout</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>Tout à fait</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 10, backgroundColor: '#1B4332',
          color: '#fff', fontWeight: 600, fontSize: '0.88rem', border: 'none', cursor: canSubmit ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: canSubmit ? 1 : 0.4, fontFamily: 'var(--font-sans)',
          marginBottom: 32, transition: 'opacity 0.2s',
        }}
      >
        Envoyer mes réponses <ChevronRight size={16} />
      </button>

      <style>{`
        .rse-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: #1B4332; border: 2px solid white; box-shadow: 0 1px 3px rgba(42,42,40,.12); cursor: grab;
        }
        .rse-slider::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #1B4332; border: 2px solid white; box-shadow: 0 1px 3px rgba(42,42,40,.12); cursor: grab;
        }
      `}</style>
    </div>
  )
}
