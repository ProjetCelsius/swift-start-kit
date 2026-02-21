import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, ChevronLeft, Copy, Mail, Link2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import {
  PERCEPTION_AFFIRMATIONS,
  POPULATION_PROFILES,
  SURVEY_TEMPLATE,
  getRecommendedRespondents,
} from '@/data/bloc4Data'

const STORAGE_KEY = 'boussole_bloc4'

interface Bloc4State {
  selfScores: (number | null)[]
  predScores: (number | null)[]
  population: number[]
  manualMode: boolean
  surveyCount: string
  distinguishLevels: boolean
  surveyMessage: string
  dgEmail: string
  linkGenerated: boolean
}

const defaultState: Bloc4State = {
  selfScores: Array(8).fill(null),
  predScores: Array(8).fill(null),
  population: [20, 20, 20, 20, 20],
  manualMode: false,
  surveyCount: '',
  distinguishLevels: false,
  surveyMessage: SURVEY_TEMPLATE,
  dgEmail: '',
  linkGenerated: false,
}

function loadState(): Bloc4State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
  } catch { return defaultState }
}

// ── Perception Slider ────────────────────────────────────
function PerceptionSlider({ value, onChange, color }: {
  value: number | null; onChange: (v: number) => void; color: string
}) {
  const displayValue = value ?? 5
  const touched = value !== null

  return (
    <div className="mt-4">
      <div className="text-center mb-3">
        <span
          className="text-4xl font-bold inline-block transition-all duration-200"
          style={{ color: touched ? color : 'var(--color-gris-300)' }}
        >
          {displayValue}
        </span>
      </div>
      <div className="relative px-1">
        <input
          type="range"
          min={1}
          max={10}
          value={displayValue}
          onChange={e => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${((displayValue - 1) / 9) * 100}%, var(--color-gris-200) ${((displayValue - 1) / 9) * 100}%, var(--color-gris-200) 100%)`,
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px; height: 24px;
            border-radius: 50%;
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            cursor: grab;
          }
          input[type="range"]::-moz-range-thumb {
            width: 24px; height: 24px;
            border-radius: 50%;
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            cursor: grab;
          }
          input[type="range"]:active::-webkit-slider-thumb { cursor: grabbing; }
          input[type="range"]:active::-moz-range-thumb { cursor: grabbing; }
        `}</style>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>Pas du tout d'accord</span>
        <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>Tout à fait d'accord</span>
      </div>
    </div>
  )
}

// ── Population Donut ─────────────────────────────────────
function PopulationDonut({ values }: { values: number[] }) {
  const data = POPULATION_PROFILES.map((p, i) => ({ name: p.label, value: values[i] }))
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            strokeWidth={2}
            stroke="white"
          >
            {POPULATION_PROFILES.map((p, i) => (
              <Cell key={i} fill={p.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────
export default function QuestionnaireBloc4() {
  const navigate = useNavigate()
  const [state, setState] = useState<Bloc4State>(loadState)
  const [phase, setPhase] = useState<'self' | 'transition' | 'pred' | 'population' | 'survey' | 'done'>('self')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)
  const [copied, setCopied] = useState(false)

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 500)
    return () => clearTimeout(t)
  }, [state])

  // Company size from Bloc 1
  const effectif = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('boussole_bloc1') ?? '{}')?.company?.effectif ?? ''
    } catch { return '' }
  }, [])

  const update = useCallback(<K extends keyof Bloc4State>(key: K, value: Bloc4State[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])

  function setScore(isSelf: boolean, index: number, value: number) {
    setState(prev => {
      const arr = [...(isSelf ? prev.selfScores : prev.predScores)]
      arr[index] = value
      return { ...prev, [isSelf ? 'selfScores' : 'predScores']: arr }
    })
  }

  function nextQuestion() {
    if (questionIndex < 7) {
      setQuestionIndex(questionIndex + 1)
      setFadeKey(k => k + 1)
    } else if (phase === 'self') {
      setPhase('transition')
    } else if (phase === 'pred') {
      setPhase('population')
    }
  }

  function prevQuestion() {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
      setFadeKey(k => k + 1)
    }
  }

  function startPrediction() {
    setPhase('pred')
    setQuestionIndex(0)
    setFadeKey(k => k + 1)
  }

  // Population coupled sliders
  function updatePopulation(index: number, newValue: number) {
    setState(prev => {
      const old = [...prev.population]
      const oldVal = old[index]
      const diff = newValue - oldVal
      old[index] = newValue

      // Distribute diff proportionally among others
      const otherIndices = [0, 1, 2, 3, 4].filter(i => i !== index)
      const otherSum = otherIndices.reduce((s, i) => s + old[i], 0)

      if (otherSum === 0) {
        // Distribute equally
        const each = Math.floor(-diff / 4)
        otherIndices.forEach(i => { old[i] = Math.max(0, each) })
      } else {
        let remaining = -diff
        otherIndices.forEach((i, idx) => {
          if (idx === otherIndices.length - 1) {
            old[i] = Math.max(0, old[i] + remaining)
          } else {
            const share = Math.round((old[i] / otherSum) * (-diff))
            old[i] = Math.max(0, old[i] + share)
            remaining -= share
          }
        })
      }

      // Normalize to 100
      const total = old.reduce((s, v) => s + v, 0)
      if (total !== 100 && total > 0) {
        const factor = 100 / total
        let sum = 0
        old.forEach((v, i) => {
          if (i < 4) {
            old[i] = Math.round(v * factor)
            sum += old[i]
          } else {
            old[i] = 100 - sum
          }
        })
      }

      return { ...prev, population: old }
    })
  }

  function updatePopulationManual(index: number, value: number) {
    setState(prev => {
      const arr = [...prev.population]
      arr[index] = Math.max(0, Math.min(100, value))
      return { ...prev, population: arr }
    })
  }

  function generateLink() {
    update('linkGenerated', true)
  }

  function copyLink() {
    navigator.clipboard.writeText('https://boussole-climat.app/sondage/abc123')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isSelf = phase === 'self'
  const scores = isSelf ? state.selfScores : state.predScores
  const currentScore = scores[questionIndex]
  const sliderColor = isSelf ? '#1B5E3B' : '#E8734A'
  const popTotal = state.population.reduce((s, v) => s + v, 0)

  // ── DONE ──
  if (phase === 'done') {
    return (
      <div className="max-w-[640px] animate-fade-in">
        <div
          className="rounded-xl p-8 text-center"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
            style={{ backgroundColor: 'var(--color-celsius-100)' }}
          >
            🎉
          </div>
          <h2 className="text-xl font-bold mb-3">Questionnaire terminé !</h2>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-texte-secondary)' }}>
            Vos réponses sont enregistrées. Les résultats seront révélés dans votre diagnostic, une fois croisés avec les réponses de vos équipes.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
        >
          Retour au tableau de bord <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  // ── SURVEY ──
  if (phase === 'survey') {
    const rec = getRecommendedRespondents(effectif)
    return (
      <div className="max-w-[640px] animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Lancer le sondage</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-texte-secondary)' }}>
          Envoyez le questionnaire de perception à vos collaborateurs. Nous recommandons {rec}.
        </p>

        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre estimé de collaborateurs à sonder</label>
              <input
                type="number" min="1" value={state.surveyCount}
                onChange={e => update('surveyCount', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="Ex: 25"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Distinguer direction / managers / terrain</label>
              <button
                onClick={() => update('distinguishLevels', !state.distinguishLevels)}
                className="w-12 h-6 rounded-full transition-colors duration-200 relative"
                style={{ backgroundColor: state.distinguishLevels ? 'var(--color-celsius-900)' : 'var(--color-gris-300)' }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-200"
                  style={{ left: state.distinguishLevels ? '26px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message d'invitation</label>
              <textarea
                value={state.surveyMessage}
                onChange={e => update('surveyMessage', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none focus:outline-none"
                style={{ borderColor: 'var(--color-border)', minHeight: '140px' }}
              />
            </div>
          </div>
        </div>

        {!state.linkGenerated ? (
          <button
            onClick={generateLink}
            className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
          >
            <Link2 size={18} /> Générer le lien de sondage
          </button>
        ) : (
          <div className="animate-fade-in">
            <div
              className="rounded-xl p-4 mb-4 flex items-center gap-3"
              style={{ backgroundColor: 'var(--color-celsius-50)', border: '1px solid var(--color-celsius-100)' }}
            >
              <Link2 size={16} style={{ color: 'var(--color-celsius-900)' }} />
              <code className="text-xs flex-1 truncate" style={{ color: 'var(--color-celsius-900)' }}>
                https://boussole-climat.app/sondage/abc123
              </code>
            </div>
            <div className="flex gap-3 mb-6">
              <button
                onClick={copyLink}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all"
                style={{
                  borderColor: 'var(--color-celsius-900)',
                  color: copied ? 'white' : 'var(--color-celsius-900)',
                  backgroundColor: copied ? 'var(--color-celsius-900)' : 'transparent',
                }}
              >
                <Copy size={14} /> {copied ? 'Copié !' : 'Copier le lien'}
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all"
                style={{ borderColor: 'var(--color-corail-500)', color: 'var(--color-corail-500)' }}
              >
                <Mail size={14} /> Envoyer par email
              </button>
            </div>

            {/* DG questionnaire */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
            >
              <h3 className="text-sm font-semibold mb-3">Envoyer le questionnaire DG</h3>
              <div className="flex gap-2">
                <input
                  type="email" value={state.dgEmail}
                  onChange={e => update('dgEmail', e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                  placeholder="email@entreprise.com"
                />
                <button
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0"
                  style={{ backgroundColor: 'var(--color-celsius-900)' }}
                >
                  Envoyer
                </button>
              </div>
            </div>

            <button
              onClick={() => setPhase('done')}
              className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
            >
              Terminer <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── POPULATION MAP ──
  if (phase === 'population') {
    return (
      <div className="max-w-[640px] animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Carte de votre population</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-texte-secondary)' }}>
          Estimez la répartition de vos collaborateurs entre ces 5 profils.
        </p>

        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          {/* Profiles explanation */}
          <div className="space-y-3 mb-6">
            {POPULATION_PROFILES.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-lg shrink-0">{p.icon}</span>
                <div>
                  <span className="text-sm font-semibold" style={{ color: p.color }}>{p.label}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-texte-secondary)' }}>{p.description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mode toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => update('manualMode', !state.manualMode)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-texte-secondary)',
              }}
            >
              {state.manualMode ? 'Mode curseurs' : 'Saisir manuellement'}
            </button>
          </div>

          {/* Donut */}
          <PopulationDonut values={state.population} />

          {/* Sliders or inputs */}
          <div className="space-y-4 mt-4">
            {POPULATION_PROFILES.map((p, i) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span>{p.icon}</span> {p.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: p.color }}>
                    {state.population[i]}%
                  </span>
                </div>
                {state.manualMode ? (
                  <input
                    type="number" min={0} max={100}
                    value={state.population[i]}
                    onChange={e => updatePopulationManual(i, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                ) : (
                  <input
                    type="range" min={0} max={100}
                    value={state.population[i]}
                    onChange={e => updatePopulation(i, parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${p.color} 0%, ${p.color} ${state.population[i]}%, var(--color-gris-200) ${state.population[i]}%, var(--color-gris-200) 100%)`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {state.manualMode && popTotal !== 100 && (
            <p className="text-xs mt-3 font-medium" style={{ color: 'var(--color-rouge-500)' }}>
              Total : {popTotal}% — le total doit faire 100%
            </p>
          )}
        </div>

        <button
          onClick={() => setPhase('survey')}
          disabled={state.manualMode && popTotal !== 100}
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40"
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
        >
          Continuer <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  // ── TRANSITION ──
  if (phase === 'transition') {
    return (
      <div className="max-w-[640px] animate-fade-in">
        <div
          className="rounded-xl p-10 text-center"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="text-xl font-bold mb-3">Changement de perspective</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-texte-secondary)' }}>
            Maintenant, imaginez que vos collaborateurs (hors direction) répondent aux mêmes questions.
            Selon vous, que diraient-ils ?
          </p>
          <button
            onClick={startPrediction}
            className="px-8 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2 transition-all hover:scale-[1.01]"
            style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── PAGINATED SLIDER QUESTIONS (self / pred) ──
  return (
    <div className="max-w-[640px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Bloc 4 : La perception</h1>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: 'var(--color-celsius-50)', color: 'var(--color-celsius-900)' }}
        >
          <Clock size={12} /> ~15 min
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: 'var(--color-texte-secondary)' }}>
          Question {questionIndex + 1}/8 — {isSelf ? 'Votre avis' : 'Prédiction'}
        </span>
        {!isSelf && (
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-corail-500)', letterSpacing: '0.05em' }}
          >
            Prédiction
          </span>
        )}
      </div>
      <div className="h-1.5 rounded-full mb-8" style={{ backgroundColor: 'var(--color-gris-200)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((questionIndex + 1) / 8) * 100}%`,
            backgroundColor: sliderColor,
          }}
        />
      </div>

      {/* Question */}
      <div key={fadeKey} className="animate-fade-in">
        <div
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: sliderColor, letterSpacing: '0.05em' }}>
            P{questionIndex + 1}
          </p>
          <p className="text-lg font-semibold leading-relaxed mb-6">
            {PERCEPTION_AFFIRMATIONS[questionIndex]}
          </p>

          <PerceptionSlider
            value={currentScore}
            onChange={v => setScore(isSelf, questionIndex, v)}
            color={sliderColor}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {questionIndex > 0 && (
            <button
              onClick={prevQuestion}
              className="px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-colors"
              style={{ color: 'var(--color-texte-secondary)', backgroundColor: 'var(--color-gris-100)' }}
            >
              <ChevronLeft size={16} /> Précédente
            </button>
          )}
          <button
            onClick={nextQuestion}
            disabled={currentScore === null}
            className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
            style={{ backgroundColor: sliderColor, boxShadow: 'var(--shadow-card)' }}
          >
            {questionIndex < 7 ? 'Suivante' : 'Continuer'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
