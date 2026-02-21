import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight, Check } from 'lucide-react'
import celsiusLogo from '@/assets/celsius-logo.png'

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
      'Aucun budget dédié',
      'Moins de 50 000 €',
      '50 000 € à 200 000 €',
      '200 000 € à 500 000 €',
      '500 000 € à 1 M€',
      'Plus de 1 M€',
    ],
  },
  {
    key: 'dg3',
    label: 'DG3. Sur quel horizon attendez-vous un retour sur investissement ?',
    options: [
      'Moins de 1 an',
      '1 à 2 ans',
      '2 à 5 ans',
      '5 à 10 ans',
      'Pas de ROI attendu, c\'est un investissement de conviction',
    ],
  },
  {
    key: 'dg4',
    label: 'DG4. Quel est le principal bénéfice attendu de votre démarche climat ?',
    options: [
      'Réduction des coûts opérationnels',
      'Conformité réglementaire',
      'Attractivité employeur',
      'Avantage concurrentiel / image',
      'Accès à de nouveaux marchés',
      'Conviction et responsabilité sociétale',
    ],
  },
] as const

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

  // ── DONE ──
  if (phase === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-md text-center animate-fade-in">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-2xl font-bold mb-3">Merci.</h1>
          <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
            Vos réponses ont été transmises à l'équipe Celsius.
          </p>
        </div>
      </div>
    )
  }

  // ── FORM ──
  if (phase === 'form') {
    return (
      <div className="min-h-screen p-6 flex justify-center" style={{ backgroundColor: 'white' }}>
        <div className="max-w-lg w-full animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <img src={celsiusLogo} alt="Celsius" className="h-7 object-contain" />
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-gris-100)', color: 'var(--color-texte-secondary)' }}>
              ~3 min
            </span>
          </div>

          {/* DG1-DG4: Radio cards */}
          {DG_QUESTIONS.map(q => (
            <div key={q.key} className="mb-8">
              <p className="text-sm font-semibold mb-3 leading-relaxed">{q.label}</p>
              <div className="space-y-2">
                {q.options.map(opt => {
                  const isSelected = answers[q.key] === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(q.key, opt)}
                      className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 active:scale-[0.98] flex items-center gap-3"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-celsius-50)' : 'white',
                        borderColor: isSelected ? '#1B5E3B' : 'var(--color-border)',
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{
                          borderColor: isSelected ? '#1B5E3B' : 'var(--color-gris-300)',
                          backgroundColor: isSelected ? '#1B5E3B' : 'transparent',
                        }}
                      >
                        {isSelected && <Check size={12} color="white" />}
                      </div>
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* DG5: Slider */}
          <div className="mb-8">
            <p className="text-sm font-semibold mb-3 leading-relaxed">
              DG5. Estimez-vous que votre entreprise met les moyens suffisants pour sa transition climat ?
            </p>
            <div className="text-center mb-2">
              <span
                className="text-3xl font-bold transition-colors"
                style={{ color: sliderTouched ? '#1B5E3B' : 'var(--color-gris-300)' }}
              >
                {sliderDisplay}
              </span>
            </div>
            <div className="px-1">
              <input
                type="range" min={1} max={10} value={sliderDisplay}
                onChange={e => setSlider(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1B5E3B 0%, #1B5E3B ${((sliderDisplay - 1) / 9) * 100}%, #E8E8E4 ${((sliderDisplay - 1) / 9) * 100}%, #E8E8E4 100%)`,
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
                  background: #1B5E3B; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: grab;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 22px; height: 22px; border-radius: 50%;
                  background: #1B5E3B; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: grab;
                }
              `}</style>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>Pas du tout</span>
              <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>Tout à fait</span>
            </div>
          </div>

          <button
            onClick={() => setPhase('done')}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40"
            style={{ backgroundColor: '#1B5E3B' }}
          >
            Envoyer mes réponses <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── WELCOME ──
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
      <div className="max-w-md w-full text-center animate-fade-in">
        <img src={celsiusLogo} alt="Celsius" className="h-10 mx-auto mb-8 object-contain" />

        <h1 className="text-2xl font-bold mb-2">Questionnaire direction</h1>
        <p className="text-lg font-semibold mb-4" style={{ color: '#1B5E3B' }}>{config.companyName}</p>

        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-texte-secondary)' }}>
          {config.clientName} vous a invité(e) à répondre à 5 questions. Durée : 3 minutes.
        </p>

        <button
          onClick={() => setPhase('form')}
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: '#1B5E3B' }}
        >
          Démarrer <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
