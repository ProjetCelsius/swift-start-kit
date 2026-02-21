import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { MATURITY_DIMENSIONS, getAllQuestions } from '@/data/maturityQuestions'
import { gradeInfo } from '@/types'

const STORAGE_KEY = 'boussole_bloc2'

function loadState(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function computeDimensionScore(answers: Record<string, number>, dimIndex: number) {
  const dim = MATURITY_DIMENSIONS[dimIndex]
  const sum = dim.questions.reduce((acc, q) => acc + (answers[q.key] ?? 1), 0)
  return ((sum - 5) / 15) * 100
}

// ── Transition Card ──────────────────────────────────────
function TransitionCard({ title, subtitle, remaining, onContinue }: {
  title: string; subtitle: string; remaining: number; onContinue: () => void
}) {
  return (
    <div className="max-w-[640px] animate-fade-in">
      <div
        className="rounded-xl p-10 text-center"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: 'var(--color-celsius-100)', color: 'var(--color-celsius-900)' }}
        >
          <Check size={28} />
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm mb-1" style={{ color: 'var(--color-texte-secondary)' }}>{subtitle}</p>
        <p className="text-xs mb-8" style={{ color: 'var(--color-gris-400)' }}>
          Encore {remaining} question{remaining > 1 ? 's' : ''}.
        </p>
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
        >
          Continuer <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Feedback / Results ───────────────────────────────────
function FeedbackView({ answers }: { answers: Record<string, number> }) {
  const navigate = useNavigate()

  const dimensionScores = MATURITY_DIMENSIONS.map((dim, i) => {
    const score = computeDimensionScore(answers, i)
    const grade = gradeInfo(score)
    return { dim, score, grade, label: dim.label }
  })

  const radarData = dimensionScores.map(d => ({
    dimension: d.label.replace('et ', '&\n'),
    score: Math.round(d.score),
    fullMark: 100,
  }))

  const globalScore = dimensionScores.reduce((a, d) => a + d.score, 0) / 4
  const globalGrade = gradeInfo(globalScore)

  const best = dimensionScores.reduce((a, b) => a.score > b.score ? a : b)
  const worst = dimensionScores.reduce((a, b) => a.score < b.score ? a : b)

  return (
    <div className="max-w-[640px] animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Votre profil de maturité climat</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-texte-secondary)' }}>
        Synthèse de vos réponses aux 20 questions du Bloc 2.
      </p>

      {/* Global grade */}
      <div
        className="rounded-xl p-6 mb-6 text-center"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
          Score global
        </p>
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-4xl font-bold text-white"
          style={{ backgroundColor: globalGrade.color }}
        >
          {globalGrade.letter}
        </div>
        <p className="text-lg font-semibold">{globalGrade.label}</p>
      </div>

      {/* Radar chart */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: 'var(--color-texte)' }} />
              <Radar
                dataKey="score"
                stroke="#1B5E3B"
                fill="#1B5E3B"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ r: 4, fill: '#1B5E3B' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dimension scores */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="space-y-3">
          {dimensionScores.map(d => (
            <div key={d.dim.id} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: d.grade.color }}
              >
                {d.grade.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{d.label}</p>
                <div className="h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--color-gris-200)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(d.score)}%`, backgroundColor: d.grade.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: d.grade.color }}>
                {Math.round(d.score)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretation */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-celsius-50)', border: '1px solid var(--color-celsius-100)' }}
      >
        <p className="text-sm leading-relaxed">
          Vous êtes en phase de <strong style={{ color: globalGrade.color }}>{globalGrade.label}</strong>.
          Votre <strong>{best.label}</strong> est votre point fort,{' '}
          <strong>{worst.label}</strong> est votre principal axe de progression.
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--color-texte-secondary)' }}>
          Ce profil est provisoire. Il sera affiné lors de l'analyse par votre analyste.
        </p>
      </div>

      <button
        onClick={() => navigate('/questionnaire/3')}
        className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
      >
        Passer au Bloc 3 <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────
export default function QuestionnaireBloc2() {
  const allQuestions = useMemo(() => getAllQuestions(), [])
  const [answers, setAnswers] = useState<Record<string, number>>(loadState)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTransition, setShowTransition] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [fadeKey, setFadeKey] = useState(0)

  // Auto-save
  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    const t = setTimeout(save, 500)
    return () => clearTimeout(t)
  }, [save])

  const current = allQuestions[currentIndex]
  const totalQuestions = allQuestions.length
  const selected = answers[current?.question.key]

  function selectOption(level: number) {
    setAnswers(prev => ({ ...prev, [current.question.key]: level }))
  }

  function goNext() {
    const nextIndex = currentIndex + 1
    // Check for dimension transition points: after Q5 (index 4), Q10 (9), Q15 (14)
    if (nextIndex < totalQuestions && current.dimensionIndex !== allQuestions[nextIndex].dimensionIndex) {
      setShowTransition(true)
      setCurrentIndex(nextIndex)
      return
    }
    if (nextIndex >= totalQuestions) {
      setShowFeedback(true)
      return
    }
    setCurrentIndex(nextIndex)
    setFadeKey(k => k + 1)
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setFadeKey(k => k + 1)
    }
  }

  function continueFromTransition() {
    setShowTransition(false)
    setFadeKey(k => k + 1)
  }

  // ── Feedback view ──
  if (showFeedback) {
    return <FeedbackView answers={answers} />
  }

  // ── Transition view ──
  if (showTransition) {
    const prevDim = MATURITY_DIMENSIONS[allQuestions[currentIndex - 1]?.dimensionIndex ?? 0]
    const nextDim = MATURITY_DIMENSIONS[current.dimensionIndex]
    const remaining = totalQuestions - currentIndex

    let subtitle = `Passons à ${nextDim.label}.`
    if (currentIndex === 10) subtitle = 'Mi-parcours. Plus que 2 dimensions.'
    if (currentIndex === 15) subtitle = `Dernière dimension : ${nextDim.label}.`

    return (
      <div className="max-w-[640px]">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-gris-200)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(currentIndex / totalQuestions) * 100}%`, backgroundColor: 'var(--color-celsius-900)' }}
            />
          </div>
        </div>
        <TransitionCard
          title={`${prevDim.label} : terminée`}
          subtitle={subtitle}
          remaining={remaining}
          onContinue={continueFromTransition}
        />
      </div>
    )
  }

  // ── Question view ──
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <div className="max-w-[640px]">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Bloc 2 : Votre maturité climat</h1>
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
          Question {currentIndex + 1}/{totalQuestions}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
          {current.dimensionLabel}
        </span>
      </div>
      <div className="h-1.5 rounded-full mb-8" style={{ backgroundColor: 'var(--color-gris-200)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: 'var(--color-celsius-900)' }}
        />
      </div>

      {/* Question */}
      <div key={fadeKey} className="animate-fade-in">
        <h2 className="text-lg font-semibold mb-6">
          Q{currentIndex + 1}. {current.question.title}
        </h2>

        <div className="space-y-3 mb-8">
          {current.question.options.map(opt => {
            const isSelected = selected === opt.level
            return (
              <button
                key={opt.level}
                onClick={() => selectOption(opt.level)}
                className="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: isSelected ? 'var(--color-celsius-50)' : 'var(--color-blanc)',
                  borderColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-border)',
                  boxShadow: isSelected ? 'none' : undefined,
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{
                      backgroundColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-gris-200)',
                      color: isSelected ? 'white' : 'var(--color-gris-400)',
                    }}
                  >
                    {isSelected ? <Check size={14} /> : opt.level}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texte)' }}>
                    {opt.text}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-colors"
              style={{ color: 'var(--color-texte-secondary)', backgroundColor: 'var(--color-gris-100)' }}
            >
              <ChevronLeft size={16} /> Précédente
            </button>
          )}
          <button
            onClick={goNext}
            disabled={selected === undefined}
            className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
            style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
          >
            {currentIndex < totalQuestions - 1 ? 'Question suivante' : 'Voir mes résultats'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
