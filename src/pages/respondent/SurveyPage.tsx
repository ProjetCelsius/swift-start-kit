import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PERCEPTION_AFFIRMATIONS } from '@/data/bloc4Data'
import { POPULATION_PROFILES } from '@/data/bloc4Data'
import celsiusLogo from '@/assets/celsius-logo.png'

const ROLE_OPTIONS = ['Direction', 'Manager', 'Collaborateur']

// Mock data — in production, fetched from backend via token
function useSurveyConfig(_token: string) {
  return {
    companyName: 'Acme Corp',
    message: 'Dans le cadre de notre démarche climat, nous souhaitons recueillir votre perception sur notre engagement environnemental.',
    distinguishLevels: true,
  }
}

// ── Mini slider (compact) ────────────────────────────────
function CompactSlider({ value, onChange, label, index }: {
  value: number | null; onChange: (v: number) => void; label: string; index: number
}) {
  const display = value ?? 5
  const touched = value !== null
  return (
    <div className="py-4">
      <p className="text-sm font-medium mb-3 leading-relaxed">
        <span className="font-bold" style={{ color: 'var(--color-celsius-900)' }}>S{index}.</span> {label}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-xs shrink-0 w-16 text-right" style={{ color: 'var(--color-gris-400)' }}>Pas du tout</span>
        <div className="flex-1 relative">
          <input
            type="range" min={1} max={10} value={display}
            onChange={e => onChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1B5E3B 0%, #1B5E3B ${((display - 1) / 9) * 100}%, #E8E8E4 ${((display - 1) / 9) * 100}%, #E8E8E4 100%)`,
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
              background: #1B5E3B; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: grab;
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px; height: 20px; border-radius: 50%;
              background: #1B5E3B; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: grab;
            }
          `}</style>
        </div>
        <span className="text-xs shrink-0 w-16" style={{ color: 'var(--color-gris-400)' }}>Tout à fait</span>
        <span
          className="text-lg font-bold w-8 text-center shrink-0 transition-colors"
          style={{ color: touched ? '#1B5E3B' : 'var(--color-gris-300)' }}
        >
          {display}
        </span>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────
export default function SurveyPage() {
  const { token } = useParams<{ token: string }>()
  const config = useSurveyConfig(token ?? '')

  const [phase, setPhase] = useState<'welcome' | 'questions' | 'profile' | 'open' | 'done'>('welcome')
  const [role, setRole] = useState('')
  const [scores, setScores] = useState<(number | null)[]>(Array(8).fill(null))
  const [page, setPage] = useState(0) // 0=Q1-3, 1=Q4-6, 2=Q7-8
  const [profile, setProfile] = useState('')
  const [openAnswer, setOpenAnswer] = useState('')
  const [fadeKey, setFadeKey] = useState(0)

  const pages = [[0, 1, 2], [3, 4, 5], [6, 7]]

  function setScore(i: number, v: number) {
    setScores(prev => { const a = [...prev]; a[i] = v; return a })
  }

  const currentQuestions = pages[page]
  const allAnswered = currentQuestions.every(i => scores[i] !== null)

  function nextPage() {
    if (page < 2) {
      setPage(page + 1)
      setFadeKey(k => k + 1)
    } else {
      setPhase('profile')
    }
  }

  function prevPage() {
    if (page > 0) {
      setPage(page - 1)
      setFadeKey(k => k + 1)
    }
  }

  // ── DONE ──
  if (phase === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-md text-center animate-fade-in">
          <div className="text-5xl mb-6">🙏</div>
          <h1 className="text-2xl font-bold mb-3">Merci pour votre participation.</h1>
          <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
            Vos réponses ont été enregistrées de manière anonyme.
          </p>
        </div>
      </div>
    )
  }

  // ── OPEN QUESTION ──
  if (phase === 'open') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-lg w-full animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
            S10 — Optionnel
          </p>
          <p className="text-lg font-semibold mb-4 leading-relaxed">
            Si vous aviez un message à faire passer à la direction sur le sujet climat, ce serait quoi ?
          </p>
          <textarea
            value={openAnswer}
            onChange={e => setOpenAnswer(e.target.value)}
            placeholder="Votre message (optionnel)..."
            className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none transition-colors mb-6"
            style={{ borderColor: 'var(--color-border)', minHeight: '120px' }}
            onFocus={e => e.target.style.borderColor = '#1B5E3B'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
          <button
            onClick={() => setPhase('done')}
            className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ backgroundColor: '#1B5E3B' }}
          >
            Terminer <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── PROFILE ──
  if (phase === 'profile') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-lg w-full animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
            S9
          </p>
          <p className="text-lg font-semibold mb-6">
            Comment vous positionnez-vous vis-à-vis de la démarche climat de votre entreprise ?
          </p>
          <div className="space-y-2 mb-6">
            {POPULATION_PROFILES.map(p => {
              const isSelected = profile === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className="w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 active:scale-[0.98]"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-celsius-50)' : 'white',
                    borderColor: isSelected ? '#1B5E3B' : 'var(--color-border)',
                  }}
                >
                  <span className="mr-2">{p.iconName}</span>
                  <span className="font-semibold text-sm">{p.label}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-texte-secondary)' }}>— {p.description}</span>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setPhase('open')}
            disabled={!profile}
            className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40"
            style={{ backgroundColor: '#1B5E3B' }}
          >
            Suivant <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTIONS (2-3 per screen) ──
  if (phase === 'questions') {
    const progress = ((page + 1) / 3) * 100
    return (
      <div className="min-h-screen p-6 flex justify-center" style={{ backgroundColor: 'white' }}>
        <div className="max-w-lg w-full">
          {/* Progress */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>
              {page * 3 + 1}–{Math.min((page + 1) * 3, 8)} / 8
            </span>
          </div>
          <div className="h-1 rounded-full mb-6" style={{ backgroundColor: 'var(--color-gris-200)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: '#1B5E3B' }} />
          </div>

          <div key={fadeKey} className="animate-fade-in">
            <div className="divide-y" style={{ borderColor: 'var(--color-border-light)' }}>
              {currentQuestions.map(i => (
                <CompactSlider
                  key={i}
                  index={i + 1}
                  value={scores[i]}
                  onChange={v => setScore(i, v)}
                  label={PERCEPTION_AFFIRMATIONS[i]}
                />
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              {page > 0 && (
                <button
                  onClick={prevPage}
                  className="px-5 py-3 rounded-xl font-medium text-sm transition-colors"
                  style={{ color: 'var(--color-texte-secondary)', backgroundColor: 'var(--color-gris-100)' }}
                >
                  ← Précédent
                </button>
              )}
              <button
                onClick={nextPage}
                disabled={!allAnswered}
                className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40"
                style={{ backgroundColor: '#1B5E3B' }}
              >
                Suivant <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── WELCOME ──
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
      <div className="max-w-md w-full text-center animate-fade-in">
        <img src={celsiusLogo} alt="Celsius" className="h-10 mx-auto mb-8 object-contain" />

        <h1 className="text-2xl font-bold mb-2">Sondage climat</h1>
        <p className="text-lg font-semibold mb-4" style={{ color: '#1B5E3B' }}>{config.companyName}</p>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
          {config.message}
        </p>
        <p className="text-xs mb-8 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: 'var(--color-gris-100)', color: 'var(--color-texte-secondary)' }}>
          Ce questionnaire est anonyme. Vos réponses seront agrégées. Durée : 5 minutes.
        </p>

        {config.distinguishLevels && (
          <div className="mb-6 text-left">
            <label className="block text-sm font-medium mb-1">Vous êtes...</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}
            >
              <option value="">Sélectionner</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        <button
          onClick={() => setPhase('questions')}
          disabled={config.distinguishLevels && !role}
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40"
          style={{ backgroundColor: '#1B5E3B' }}
        >
          Démarrer <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
