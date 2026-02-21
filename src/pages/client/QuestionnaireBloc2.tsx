import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Clock } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { maturityQuestions } from '@/data/maturityQuestions'
import { computeDimensionScores, computeGlobalScore, computeProfilClimat } from '@/utils/maturityScoring'

const STORAGE_KEY = 'boussole_bloc2'
const TOTAL = 20

function loadState(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

// ── Dimension transition SVG icons ───────────
function DimensionIcon({ index }: { index: number }) {
  const icons = [
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 4L6 12v12c0 11 8 18 18 22 10-4 18-11 18-22V12L24 4z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="28" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="20" y="18" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="32" y="8" width="8" height="34" rx="2" stroke="currentColor" strokeWidth="2"/></svg>,
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/><path d="M18 30l4-12 12-4-4 12-12 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2"/><path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  ]
  return <div style={{ color: 'var(--color-primary)' }}>{icons[index] ?? icons[0]}</div>
}

// ── Main Component ───────────────────────────
export default function QuestionnaireBloc2() {
  const [answers, setAnswers] = useState<Record<number, number>>(loadState)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'question' | 'transition' | 'feedback'>('question')
  const [fadeKey, setFadeKey] = useState(0)

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])
  useEffect(() => { const t = setTimeout(save, 500); return () => clearTimeout(t) }, [save])

  const question = maturityQuestions[currentIndex]
  const selected = answers[question?.id]

  function selectOption(level: number) {
    setAnswers(prev => ({ ...prev, [question.id]: level }))
  }

  function goNext() {
    const nextIdx = currentIndex + 1
    if (nextIdx < TOTAL && question.dimensionIndex !== maturityQuestions[nextIdx].dimensionIndex) {
      setCurrentIndex(nextIdx)
      setPhase('transition')
      return
    }
    if (nextIdx >= TOTAL) {
      setPhase('feedback')
      return
    }
    setCurrentIndex(nextIdx)
    setFadeKey(k => k + 1)
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setFadeKey(k => k + 1)
    }
  }

  // ── FEEDBACK ──────────────────────────────
  if (phase === 'feedback') {
    return <FeedbackScreen answers={answers} />
  }

  // ── TRANSITION ────────────────────────────
  if (phase === 'transition') {
    const prevDimIndex = maturityQuestions[currentIndex - 1]?.dimensionIndex ?? 0
    const remaining = TOTAL - currentIndex
    const dimNames = ['Gouvernance', 'Mesure & données', 'Stratégie', 'Culture & engagement']

    const titles = [
      `Gouvernance climat : terminée`,
      `Mi-parcours`,
      `Dernière dimension`,
    ]
    const subtitles = [
      `Passons à Mesure et données. Encore ${remaining} questions.`,
      `Plus que 2 dimensions. Vous êtes sur la bonne voie.`,
      `Culture et engagement. 5 dernières questions.`,
    ]

    return (
      <div style={{ maxWidth: 680 }} className="animate-fade-in">
        {/* Progress bar */}
        <div style={{ height: 3, backgroundColor: 'var(--color-subtle)', borderRadius: 2, marginBottom: 48 }}>
          <div style={{ height: '100%', width: `${(currentIndex / TOTAL) * 100}%`, backgroundColor: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.7s ease' }} />
        </div>

        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <DimensionIcon index={prevDimIndex} />

          {/* Dimension dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '20px 0' }}>
            {dimNames.map((name, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: i < prevDimIndex + 1 ? 'var(--color-primary)' : i === prevDimIndex + 1 ? 'var(--color-accent-warm)' : 'var(--color-border-active)',
                animation: i === prevDimIndex + 1 ? 'pulse-dot 2s ease-in-out infinite' : undefined,
              }} title={name} />
            ))}
          </div>

          <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--color-texte)', marginBottom: 8 }}>
            {titles[prevDimIndex] ?? titles[0]}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-texte-secondary)', marginBottom: 32 }}>
            {subtitles[prevDimIndex] ?? subtitles[0]}
          </p>
          <button
            onClick={() => { setPhase('question'); setFadeKey(k => k + 1) }}
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

        <style>{`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    )
  }

  // ── QUESTION ──────────────────────────────
  const progress = ((currentIndex + 1) / TOTAL) * 100

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Standardized header */}
      <div style={{ marginBottom: 32 }}>
        <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', margin: 0 }}>
            Bloc 2 — Votre maturité
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
        <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', marginBottom: 16 }}>
          Évaluez le niveau de maturité de votre organisation sur les dimensions clés.
        </p>
        <div style={{ borderBottom: '1px solid var(--color-border)' }} />
      </div>

      {/* Progress indicator */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-texte)' }}>
            Question {currentIndex + 1} / {TOTAL}
          </span>
          {/* Dimension label with copper left border */}
          <span style={{
            fontSize: '0.52rem', fontWeight: 600, textTransform: 'uppercase' as const,
            letterSpacing: '0.08em', color: 'var(--color-accent-warm)',
            borderLeft: '3px solid var(--color-accent-warm)', paddingLeft: 8,
          }}>
            {question.dimension}
          </span>
        </div>
        <div style={{ height: 3, backgroundColor: 'var(--color-subtle)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.4s ease-out' }} />
        </div>
      </div>

      {/* Question content */}
      <div key={fadeKey} className="animate-fade-in">
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 20, lineHeight: 1.4 }}>
          {question.title}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {question.options.map(opt => {
            const isSelected = selected === opt.level
            return (
              <button
                key={opt.level}
                onClick={() => selectOption(opt.level)}
                style={{
                  width: '100%', textAlign: 'left', padding: '16px 20px',
                  borderRadius: 10,
                  border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: isSelected ? 'var(--color-fond)' : 'var(--color-blanc)',
                  cursor: 'pointer', outline: 'none',
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-border-active)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = ''
                  }
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-texte-muted)'}`,
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--color-texte-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 500,
                  transition: 'all 0.2s',
                }}>
                  {isSelected ? <Check size={12} /> : opt.level}
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--color-texte)', margin: 0 }}>
                  {opt.text}
                </p>
                {isSelected && (
                  <div style={{ position: 'absolute', top: 12, right: 16, color: 'var(--color-primary)' }}>
                    <Check size={16} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              style={{
                padding: '12px 20px', borderRadius: 8,
                border: '1px solid var(--color-border)', backgroundColor: 'transparent',
                color: 'var(--color-texte)', fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'border-color 0.2s',
              }}
            >
              <ChevronLeft size={16} /> Précédent
            </button>
          )}
          <button
            onClick={goNext}
            disabled={selected === undefined}
            style={{
              flex: 1, padding: '12px 28px', borderRadius: 8,
              backgroundColor: 'var(--color-primary)', color: '#fff',
              fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: selected === undefined ? 0.4 : 1,
              transition: 'background-color 0.2s, opacity 0.2s',
              pointerEvents: selected === undefined ? 'none' : 'auto',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            {currentIndex < TOTAL - 1 ? 'Suivant' : 'Voir mes résultats'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Feedback Screen ──────────────────────────
function FeedbackScreen({ answers }: { answers: Record<number, number> }) {
  const navigate = useNavigate()
  const dimensionScores = computeDimensionScores(answers)
  const global = computeGlobalScore(dimensionScores)
  const profil = computeProfilClimat(answers)

  const best = dimensionScores.reduce((a, b) => a.score > b.score ? a : b)
  const worst = dimensionScores.reduce((a, b) => a.score < b.score ? a : b)

  const radarData = dimensionScores.map(d => ({
    dimension: d.name,
    score: Math.round(d.score),
    fullMark: 100,
  }))

  return (
    <div style={{ maxWidth: 680 }} className="animate-fade-in">
      {/* Standardized header */}
      <div style={{ marginBottom: 32 }}>
        <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
        <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: 8 }}>
          Votre profil de maturité climat
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', marginBottom: 16 }}>
          Synthèse de vos réponses aux 20 questions du Bloc 2.
        </p>
        <div style={{ borderBottom: '1px solid var(--color-border)' }} />
      </div>

      {/* Radar chart */}
      <div style={{
        backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 24, marginBottom: 24,
      }}>
        <div style={{ width: 300, height: 300, margin: '0 auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 500, fill: 'var(--color-texte)' }} />
              <Radar dataKey="score" stroke="#1B4332" fill="#1B4332" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: '#1B4332' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global score */}
      <div style={{
        backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 28, marginBottom: 24, textAlign: 'center',
      }}>
        <p className="label-uppercase" style={{ marginBottom: 16 }}>Score global</p>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
          backgroundColor: global.grade.color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="font-display" style={{ fontSize: '3rem', fontWeight: 600, lineHeight: 1 }}>
            {global.grade.letter}
          </span>
        </div>
        <p className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: global.grade.color }}>
          {global.grade.label}
        </p>
      </div>

      {/* Dimension scores */}
      <div style={{
        backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 24, marginBottom: 24,
      }}>
        {dimensionScores.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              backgroundColor: d.grade.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-display)',
            }}>
              {d.grade.letter}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 4 }}>{d.name}</p>
              <div style={{ height: 6, backgroundColor: 'var(--color-subtle)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${Math.round(d.score)}%`, backgroundColor: d.grade.color, borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: d.grade.color, flexShrink: 0 }}>
              {Math.round(d.score)}/100
            </span>
          </div>
        ))}
      </div>

      {/* Interpretation */}
      <div style={{
        backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)',
        borderRadius: 14, padding: 24, marginBottom: 24,
      }}>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          Vous êtes en phase de <strong style={{ color: global.grade.color }}>{global.grade.label}</strong>.{' '}
          <strong>{best.name}</strong> est votre point fort, <strong>{worst.name}</strong> est votre axe de progression.
        </p>
        <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-texte-muted)', marginTop: 12 }}>
          Ce profil est provisoire. Il sera affiné lors de l'analyse.
        </p>
      </div>

      {/* Profil Climat teaser */}
      <div style={{
        background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)',
        borderRadius: 14, padding: '28px 32px', marginBottom: 24, textAlign: 'center',
      }}>
        <p className="label-uppercase" style={{ color: 'var(--color-accent-warm)', marginBottom: 8, letterSpacing: '0.1em' }}>
          VOTRE PROFIL CLIMAT
        </p>
        <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--color-primary)', marginBottom: 16 }}>
          Votre profil se dessine…
        </h3>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
          <span className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {profil.axe1}
          </span>
          <span className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {profil.axe2}
          </span>
          <span className="font-display pulse-letter" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-border-active)' }}>
            ?
          </span>
          <span className="font-display pulse-letter" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-border-active)', animationDelay: '0.3s' }}>
            ?
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-texte-secondary)', lineHeight: 1.5, textAlign: 'center' }}>
          Votre démarche est ancrée dans {profil.axe1 === 'S' ? 'la structure' : 'la culture'} et vous privilégiez {profil.axe2 === 'M' ? 'la mesure' : "l'action"}.
          Complétez la suite pour découvrir votre profil complet.
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
        <button
          onClick={() => navigate('/client/questionnaire/bloc3')}
          style={{
            flex: 1, padding: '14px 28px', borderRadius: 8,
            backgroundColor: 'var(--color-primary)', color: '#fff',
            fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          Passer au Bloc 3 <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        .pulse-letter {
          animation: pulse-mystery 2s ease-in-out infinite;
        }
        @keyframes pulse-mystery {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
