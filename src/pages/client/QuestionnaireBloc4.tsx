import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Rocket, CheckCircle, Minus, HelpCircle, XCircle, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import {
  PERCEPTION_AFFIRMATIONS,
  POPULATION_PROFILES,
} from '@/data/bloc4Data'
import { useQuestionnaire } from '@/hooks/useQuestionnaire'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useDemoIfAvailable } from '@/hooks/useDemo'

const STORAGE_KEY = 'boussole_bloc4'

const PROFILE_ICONS: Record<string, ReactNode> = {
  Rocket: <Rocket size={20} />,
  CheckCircle: <CheckCircle size={20} />,
  Minus: <Minus size={20} />,
  HelpCircle: <HelpCircle size={20} />,
  XCircle: <XCircle size={20} />,
}

interface Bloc4State {
  selfScores: (number | null)[]
  predScores: (number | null)[]
  population: number[]
  manualMode: boolean
}

const defaultState: Bloc4State = {
  selfScores: Array(8).fill(null),
  predScores: Array(8).fill(null),
  population: [20, 20, 20, 20, 20],
  manualMode: false,
}

function loadState(): Bloc4State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
  } catch { return defaultState }
}

// ── Perception Slider ────────────────────────
function PerceptionSlider({ value, onChange, color }: {
  value: number | null; onChange: (v: number) => void; color: string
}) {
  const displayValue = value ?? 5
  const touched = value !== null
  const pct = ((displayValue - 1) / 9) * 100
  const sliderId = `slider-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span
          className="font-display"
          style={{ fontSize: '2rem', fontWeight: 600, color: touched ? color : 'var(--color-border-active)', transition: 'color 0.2s' }}
        >
          {displayValue}
        </span>
      </div>
      {!touched && (
        <p style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-texte-muted)', marginBottom: 8 }}>
          Déplacez le curseur
        </p>
      )}
      <div style={{ position: 'relative', padding: '0 2px' }}>
        <input
          type="range" min={1} max={10} value={displayValue}
          onChange={e => onChange(parseInt(e.target.value))}
          className={`perception-slider-${sliderId}`}
          style={{
            width: '100%', height: 4, borderRadius: 3, appearance: 'none', cursor: 'pointer',
            background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--color-subtle) ${pct}%, var(--color-subtle) 100%)`,
            outline: 'none',
          }}
        />
        <style>{`
          .perception-slider-${sliderId}::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px; height: 20px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 6px rgba(27,67,50,0.2);
            cursor: grab;
          }
          .perception-slider-${sliderId}::-moz-range-thumb {
            width: 20px; height: 20px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 6px rgba(27,67,50,0.2);
            cursor: grab; border: none;
          }
          .perception-slider-${sliderId}:active::-webkit-slider-thumb { cursor: grabbing; }
          .perception-slider-${sliderId}:active::-moz-range-thumb { cursor: grabbing; }
        `}</style>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-texte-muted)' }}>Pas du tout d'accord</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-texte-muted)' }}>Tout à fait d'accord</span>
      </div>
    </div>
  )
}

// ── Population Donut ─────────────────────────
function PopulationDonut({ values }: { values: number[] }) {
  const data = POPULATION_PROFILES.map((p, i) => ({ name: p.label, value: values[i] }))
  return (
    <div style={{ width: 200, height: 200, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={2} stroke="white">
            {POPULATION_PROFILES.map((p, i) => <Cell key={i} fill={p.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Main Component ───────────────────────────
export default function QuestionnaireBloc4() {
  const navigate = useNavigate()
  const demo = useDemoIfAvailable()
  const diagnosticId = demo?.diagnostic?.id ?? 'demo'
  const { setResponse: sbSetResponse } = useQuestionnaire({ diagnosticId, block: 4, localStorageKey: STORAGE_KEY })
  const { track } = useAnalytics(diagnosticId)

  useEffect(() => { track('block_start', { block: 4 }) }, [])

  const [state, setState] = useState<Bloc4State>(loadState)
  const [phase, setPhase] = useState<'intro' | 'self' | 'transition' | 'pred' | 'population' | 'done'>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)



  const update = useCallback(<K extends keyof Bloc4State>(key: K, value: Bloc4State[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])

  function setScore(isSelf: boolean, index: number, value: number) {
    setState(prev => {
      const arr = [...(isSelf ? prev.selfScores : prev.predScores)]
      arr[index] = value
      sbSetResponse(isSelf ? `self_${index}` : `pred_${index}`, value)
      return { ...prev, [isSelf ? 'selfScores' : 'predScores']: arr }
    })
  }

  function nextQuestion() {
    if (questionIndex < 7) { setQuestionIndex(questionIndex + 1); setFadeKey(k => k + 1) }
    else if (phase === 'self') setPhase('transition')
    else if (phase === 'pred') setPhase('population')
  }

  function prevQuestion() {
    if (questionIndex > 0) { setQuestionIndex(questionIndex - 1); setFadeKey(k => k + 1) }
  }

  function startPrediction() {
    setPhase('pred'); setQuestionIndex(0); setFadeKey(k => k + 1)
  }

  function updatePopulation(index: number, newValue: number) {
    setState(prev => {
      const old = [...prev.population]
      const diff = newValue - old[index]
      old[index] = newValue
      const otherIndices = [0, 1, 2, 3, 4].filter(i => i !== index)
      const otherSum = otherIndices.reduce((s, i) => s + old[i], 0)
      if (otherSum > 0) {
        let remaining = -diff
        otherIndices.forEach((i, idx) => {
          if (idx === otherIndices.length - 1) { old[i] = Math.max(0, old[i] + remaining) }
          else { const share = Math.round((old[i] / otherSum) * (-diff)); old[i] = Math.max(0, old[i] + share); remaining -= share }
        })
      }
      const total = old.reduce((s, v) => s + v, 0)
      if (total !== 100 && total > 0) {
        const factor = 100 / total; let sum = 0
        old.forEach((v, i) => { if (i < 4) { old[i] = Math.round(v * factor); sum += old[i] } else { old[i] = 100 - sum } })
      }
      return { ...prev, population: old }
    })
  }

  function updatePopulationManual(index: number, value: number) {
    setState(prev => { const arr = [...prev.population]; arr[index] = Math.max(0, Math.min(100, value)); return { ...prev, population: arr } })
  }




  const isSelf = phase === 'self'
  const scores = isSelf ? state.selfScores : state.predScores
  const currentScore = scores[questionIndex]
  const sliderColor = isSelf ? '#1B4332' : '#B87333'
  const popTotal = state.population.reduce((s, v) => s + v, 0)

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div style={{ maxWidth: 680 }} className="animate-fade-in">
        <div style={{ marginBottom: 32 }}>
          <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 8 }}>
            Bloc 4 — La perception
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', margin: 0 }}>
              Comment le climat est-il perçu en interne ?
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 12px', borderRadius: 20,
              border: '1px solid var(--color-border)',
              fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-texte-secondary)',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              <Clock size={11} /> ~15 min
            </span>
          </div>
          <div style={{ borderBottom: '1px solid var(--color-border)' }} />
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-texte)', lineHeight: 1.6, maxWidth: 560, marginBottom: 32 }}>
          Vous allez d'abord répondre pour vous-même, puis estimer ce que diraient vos équipes.
          Les résultats seront confrontés aux réponses réelles via le sondage interne.
        </p>
        <button
          onClick={() => setPhase('self')}
          style={{
            padding: '12px 28px', borderRadius: 8, backgroundColor: 'var(--color-primary)',
            color: '#fff', fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          Commencer <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  // ── DONE ──
  if (phase === 'done') {
    // Save responses to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return (
      <div style={{ maxWidth: 680 }} className="animate-fade-in">
        <div style={{
          backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
          borderRadius: 14, padding: 40, textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', backgroundColor: '#E8F0EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <CheckCircle size={26} style={{ color: '#1B4332' }} />
          </div>
          <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: 8 }}>
            Perception RSE terminée
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-texte-secondary)', lineHeight: 1.6, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
            Vos réponses sont enregistrées. Les résultats seront confrontés aux réponses de vos équipes dans votre diagnostic.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340, margin: '0 auto' }}>
            <button
              onClick={() => navigate('/client/sondage')}
              style={{
                padding: '14px 28px', borderRadius: 9, backgroundColor: '#1B4332',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2D6A4F')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
            >
              Lancer le sondage interne →
            </button>
            <button
              onClick={() => navigate('/client/entretiens')}
              style={{
                padding: '14px 28px', borderRadius: 9, backgroundColor: 'transparent',
                color: '#1B4332', fontWeight: 500, fontSize: '0.9rem',
                border: '1.5px solid #1B4332', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8F0EB')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Remplir l'entretien direction →
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-texte-muted)', marginTop: 16, fontStyle: 'italic' }}>
            Ces étapes peuvent être faites dans n'importe quel ordre.
          </p>
        </div>
      </div>
    )
  }


  // ── POPULATION MAP ──
  if (phase === 'population') {
    return (
      <div style={{ maxWidth: 680 }} className="animate-fade-in">
        <p className="label-uppercase" style={{ marginBottom: 8 }}>CARTOGRAPHIE DE VOS ÉQUIPES</p>
        <h1 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: 24 }}>
          Répartition de vos collaborateurs
        </h1>

        {/* Profile cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
          {POPULATION_PROFILES.map(p => (
            <div key={p.id} style={{
              width: 120, textAlign: 'center', padding: 12,
              backgroundColor: 'var(--color-blanc)', borderRadius: 12,
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ color: p.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                {PROFILE_ICONS[p.iconName]}
              </div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: p.color, marginBottom: 2 }}>{p.label}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-texte-muted)', lineHeight: 1.3 }}>{p.description}</p>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
          borderRadius: 14, padding: 24, marginBottom: 24,
        }}>
          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              onClick={() => update('manualMode', !state.manualMode)}
              style={{
                fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-texte-secondary)',
                background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              {state.manualMode ? 'Mode curseurs' : 'Saisir manuellement'}
            </button>
          </div>

          <PopulationDonut values={state.population} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            {POPULATION_PROFILES.map((p, i) => (
              <div key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 500 }}>
                    <span style={{ color: p.color }}>{PROFILE_ICONS[p.iconName]}</span> {p.label}
                  </span>
                  <span className="font-display" style={{ fontSize: '1rem', fontWeight: 500, color: p.color }}>
                    {state.population[i]}%
                  </span>
                </div>
                {state.manualMode ? (
                  <input
                    type="number" min={0} max={100}
                    value={state.population[i]}
                    onChange={e => updatePopulationManual(i, parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%', height: 48, padding: '0 14px', borderRadius: 8,
                      border: '1px solid var(--color-border)', fontSize: '0.85rem',
                      fontFamily: 'var(--font-sans)', outline: 'none',
                    }}
                  />
                ) : (
                  <input
                    type="range" min={0} max={100}
                    value={state.population[i]}
                    onChange={e => updatePopulation(i, parseInt(e.target.value))}
                    style={{
                      width: '100%', height: 4, borderRadius: 3, appearance: 'none', cursor: 'pointer',
                      background: `linear-gradient(to right, ${p.color} 0%, ${p.color} ${state.population[i]}%, var(--color-subtle) ${state.population[i]}%, var(--color-subtle) 100%)`,
                      outline: 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {state.manualMode && popTotal !== 100 && (
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#DC4A4A', marginTop: 12 }}>
              Total : {popTotal}% — le total doit faire 100%
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          <button
            onClick={() => setPhase('done')}
            disabled={state.manualMode && popTotal !== 100}
            style={{
              flex: 1, padding: '14px 28px', borderRadius: 8,
              backgroundColor: 'var(--color-primary)', color: '#fff',
              fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: (state.manualMode && popTotal !== 100) ? 0.4 : 1,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── TRANSITION ──
  if (phase === 'transition') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }} className="animate-fade-in">
        <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: 12 }}>
          Et vos collaborateurs ?
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-texte-secondary)', marginBottom: 32, lineHeight: 1.5 }}>
          Selon vous, que répondraient vos collaborateurs (hors direction) aux mêmes questions ?
        </p>
        <button
          onClick={startPrediction}
          style={{
            padding: '12px 28px', borderRadius: 8, backgroundColor: 'var(--color-primary)',
            color: '#fff', fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          Continuer <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  // ── PAGINATED SLIDER QUESTIONS ──
  const progress = ((questionIndex + 1) / 8) * 100

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Standardized header */}
      <div style={{ marginBottom: 24 }}>
        <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', margin: 0 }}>
            Bloc 4 — La perception
          </h1>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 12px', borderRadius: 20,
            border: '1px solid var(--color-border)',
            fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-texte-secondary)',
            whiteSpace: 'nowrap',
          }}>
            <Clock size={11} /> ~15 min
          </span>
        </div>
        <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: 16 }} />
      </div>

      {/* Progress + Part indicator */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-texte)' }}>
            Question {questionIndex + 1} / 8
          </span>
          <span style={{
            fontSize: '0.52rem', fontWeight: 600, textTransform: 'uppercase' as const,
            letterSpacing: '0.08em',
            color: isSelf ? 'var(--color-primary)' : 'var(--color-accent-warm)',
            borderLeft: `3px solid ${isSelf ? 'var(--color-primary)' : 'var(--color-accent-warm)'}`,
            paddingLeft: 8,
          }}>
            {isSelf ? 'Partie A — Votre regard' : 'Partie B — Votre prédiction'}
          </span>
        </div>
        <div style={{ height: 3, backgroundColor: 'var(--color-subtle)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: sliderColor, borderRadius: 2, transition: 'width 0.4s ease-out' }} />
        </div>
      </div>

      {/* Question */}
      <div key={fadeKey} className="animate-fade-in">
        <div style={{
          backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
          borderRadius: 14, padding: 24, marginBottom: 32,
        }}>
          <p className="label-uppercase" style={{ marginBottom: 12, color: sliderColor }}>
            P{questionIndex + 1}
          </p>
          <p className="font-display" style={{ fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.5, maxWidth: 560 }}>
            {PERCEPTION_AFFIRMATIONS[questionIndex]}
          </p>
          <PerceptionSlider
            value={currentScore}
            onChange={v => setScore(isSelf, questionIndex, v)}
            color={sliderColor}
          />
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          {questionIndex > 0 && (
            <button
              onClick={prevQuestion}
              style={{
                padding: '12px 20px', borderRadius: 8,
                border: '1px solid var(--color-border)', backgroundColor: 'transparent',
                color: 'var(--color-texte)', fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <ChevronLeft size={16} /> Précédent
            </button>
          )}
          <button
            onClick={nextQuestion}
            disabled={currentScore === null}
            style={{
              flex: 1, padding: '12px 28px', borderRadius: 8,
              backgroundColor: sliderColor, color: '#fff',
              fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: currentScore === null ? 0.4 : 1,
              pointerEvents: currentScore === null ? 'none' : 'auto',
              transition: 'opacity 0.2s',
            }}
          >
            {questionIndex < 7 ? 'Suivant →' : 'Continuer'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
