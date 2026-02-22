import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ChevronRight, ChevronLeft, GripVertical, X } from 'lucide-react'
import QuestionnaireHeader from '@/components/questionnaire/QuestionnaireHeader'
import {
  MOTEURS, FREINS,
  REGULATORY_ROWS, REGULATORY_COLUMNS,
  type RegulatoryAnswer,
} from '@/data/bloc3Data'
import { computeFullProfil } from '@/utils/profilClimat'

const STORAGE_KEY = 'boussole_bloc3'
const MAX_CHARS = 500

interface Bloc3State {
  moteurs: string[]
  frein: string
  freinAutre: string
  regulatory: Record<string, RegulatoryAnswer>
  perteMarche: string
  perteDetail: string
  q25: string
  q26: string
  q27: string
}

const defaultState: Bloc3State = {
  moteurs: [],
  frein: '',
  freinAutre: '',
  regulatory: {},
  perteMarche: '',
  perteDetail: '',
  q25: '',
  q26: '',
  q27: '',
}

function loadState(): Bloc3State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
  } catch { return defaultState }
}

function loadBloc2Answers(): Record<number, number> {
  try {
    const raw = localStorage.getItem('boussole_bloc2')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

// ── Counted Textarea ─────────────────────────
function CountedTextarea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={e => { if (e.target.value.length <= MAX_CHARS) onChange(e.target.value) }}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 120, padding: 16, borderRadius: 8,
          border: '1px solid var(--color-border)', fontSize: '0.85rem',
          fontFamily: 'var(--font-sans)', fontStyle: 'italic', resize: 'none',
          outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          color: 'var(--color-texte)', backgroundColor: 'var(--color-blanc)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.08)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
      />
      <span style={{
        position: 'absolute', bottom: 8, right: 12,
        fontSize: '0.7rem', color: 'var(--color-texte-muted)',
      }}>
        {value.length} / {MAX_CHARS}
      </span>
    </div>
  )
}

// ── Main Component ───────────────────────────
export default function QuestionnaireBloc3() {
  const navigate = useNavigate()
  const [state, setState] = useState<Bloc3State>(loadState)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [revealStep, setRevealStep] = useState(0)

  const update = useCallback(<K extends keyof Bloc3State>(key: K, value: Bloc3State[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 500)
    return () => clearTimeout(t)
  }, [state])

  useEffect(() => {
    if (showOverlay && revealStep < 4) {
      const t = setTimeout(() => setRevealStep(s => s + 1), 200)
      return () => clearTimeout(t)
    }
  }, [showOverlay, revealStep])

  function toggleMoteur(m: string) {
    setState(prev => {
      const has = prev.moteurs.includes(m)
      if (has) return { ...prev, moteurs: prev.moteurs.filter(x => x !== m) }
      if (prev.moteurs.length >= 3) return prev
      return { ...prev, moteurs: [...prev.moteurs, m] }
    })
  }

  function removeMoteur(index: number) {
    setState(prev => ({ ...prev, moteurs: prev.moteurs.filter((_, i) => i !== index) }))
  }

  function moveMoteur(from: number, to: number) {
    setState(prev => {
      const arr = [...prev.moteurs]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...prev, moteurs: arr }
    })
  }

  function handleValidate() {
    setShowFeedback(true)
  }

  function handleReveal() {
    setRevealStep(0)
    setShowOverlay(true)
  }

  const bloc2Answers = loadBloc2Answers()
  const { code, profil } = computeFullProfil(
    bloc2Answers,
    state.moteurs,
    state.perteMarche,
    state.regulatory as Record<string, string>,
  )
  const letters = code.split('')

  // ── OVERLAY ────────────────────────────────
  if (showOverlay) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(27,67,50,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.8s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          <p className="label-uppercase" style={{ color: '#B87333', letterSpacing: '0.12em', marginBottom: 24, fontSize: '0.6rem' }}>
            VOTRE PROFIL CLIMAT
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
            {letters.map((letter, i) => (
              <span
                key={i}
                className="font-display"
                style={{
                  fontSize: '4rem', fontWeight: 600, color: '#fff',
                  letterSpacing: '0.15em',
                  opacity: i < revealStep ? 1 : 0,
                  transform: i < revealStep ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          {revealStep >= 4 && profil && (
            <div className="animate-fade-in">
              <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 500, color: '#fff', marginBottom: 12 }}>
                {profil.name}
              </h2>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#E8F0EB', marginBottom: 20, lineHeight: 1.5 }}>
                « {profil.phrase} »
              </p>
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
                fontSize: '0.75rem', fontWeight: 500, marginBottom: 8,
              }}>
                Famille des {profil.family}
              </span>
              <p style={{ fontSize: '0.85rem', color: '#B0AB9F', marginTop: 8 }}>
                Entreprise-type : {profil.entrepriseType}
              </p>
            </div>
          )}

          {revealStep >= 4 && (
            <button
              onClick={() => setShowOverlay(false)}
              className="font-display"
              style={{
                marginTop: 32, padding: '12px 28px', borderRadius: 8,
                backgroundColor: '#fff', color: 'var(--color-primary)',
                fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              Découvrir la suite
            </button>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  // ── FEEDBACK ───────────────────────────────
  if (showFeedback) {
    const urgencyItems = REGULATORY_ROWS.map(row => {
      const answer = state.regulatory[row.id]
      let level: 'ready' | 'approaching' | 'urgent' | null = null
      if (answer === 'Déjà concerné') level = 'ready'
      else if (answer === 'Sous 12 mois') level = 'urgent'
      else if (answer === 'Sous 2-3 ans') level = 'approaching'
      return { ...row, answer, level }
    }).filter(r => r.level !== null)
      .sort((a, b) => {
        const order = { urgent: 0, approaching: 1, ready: 2 }
        return (order[a.level!] ?? 3) - (order[b.level!] ?? 3)
      })
      .slice(0, 3)

    const urgencyStyle = {
      ready: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Prêt' },
      approaching: { bg: 'var(--color-accent-warm-light)', color: 'var(--color-accent-warm)', label: 'En approche' },
      urgent: { bg: '#FEE2E2', color: '#DC4A4A', label: 'Urgent' },
    }

    return (
      <div style={{ maxWidth: 680 }} className="animate-fade-in">
        <div style={{ marginBottom: 32 }}>
          <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: 8 }}>
            Carte des échéances réglementaires
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', marginBottom: 16 }}>
            Vos 3 échéances les plus urgentes, basées sur vos réponses.
          </p>
          <div style={{ borderBottom: '1px solid var(--color-border)' }} />
        </div>

        <div style={{
          backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
          borderRadius: 14, padding: 24, marginBottom: 32,
        }}>
          {urgencyItems.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-muted)' }}>
              Aucune échéance critique identifiée.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {urgencyItems.map(item => {
                const s = urgencyStyle[item.level!]
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 500, padding: '4px 12px',
                      borderRadius: 20, backgroundColor: s.bg, color: s.color,
                      flexShrink: 0,
                    }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-texte)' }}>
                      {item.label}
                    </span>
                    {item.answer && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-texte-muted)', marginLeft: 'auto' }}>
                        {item.answer}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Profil Climat reveal */}
        <div style={{
          background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)',
          borderRadius: 14, padding: '28px 32px', marginBottom: 24, textAlign: 'center',
        }}>
          <p className="label-uppercase" style={{ color: 'var(--color-accent-warm)', letterSpacing: '0.1em', marginBottom: 8, fontSize: '0.56rem' }}>
            VOTRE PROFIL CLIMAT
          </p>
          <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--color-primary)', marginBottom: 16 }}>
            Votre profil est prêt.
          </h3>
          <button
            onClick={handleReveal}
            style={{
              padding: '12px 28px', borderRadius: 8,
              backgroundColor: 'var(--color-primary)', color: '#fff',
              fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            Révéler mon profil <ChevronRight size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          <button
            onClick={() => setShowFeedback(false)}
            style={{
              padding: '12px 20px', borderRadius: 8,
              border: '1px solid var(--color-border)', backgroundColor: 'transparent',
              color: 'var(--color-texte)', fontSize: '0.875rem', fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <ChevronLeft size={16} /> Précédent
          </button>
          <button
            onClick={() => navigate('/client/perception')}
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
            Continuer vers Sondages & Perception <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── MAIN FORM ──────────────────────────────
  return (
    <div style={{ maxWidth: 680 }} className="animate-fade-in">
      {/* Premium header */}
      <QuestionnaireHeader
        blocNumber={3}
        title="Vos enjeux"
        subtitle="Identifiez et hiérarchisez vos enjeux climat prioritaires."
        duration="~12 min"
        accentColor="#B87333"
      />

      {/* Q21 — Moteurs */}
      <div style={{ marginBottom: 48 }}>
        <p className="label-uppercase" style={{ marginBottom: 8 }}>MOTIVATIONS</p>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: 8 }}>
          Quels sont les principaux moteurs de votre démarche climat ?
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-texte-secondary)', marginBottom: 16 }}>
          Sélectionnez 3 maximum, puis classez-les par ordre d'importance
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {MOTEURS.map(m => {
            const isSelected = state.moteurs.includes(m)
            const isDisabled = !isSelected && state.moteurs.length >= 3
            return (
              <button
                key={m}
                onClick={() => toggleMoteur(m)}
                disabled={isDisabled}
                style={{
                  padding: '8px 16px', borderRadius: 20,
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-fond)',
                  color: isSelected ? '#fff' : 'var(--color-texte)',
                  fontSize: '0.82rem', fontFamily: 'var(--font-sans)', fontWeight: isSelected ? 500 : 400,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.4 : 1,
                  transition: 'all 0.15s', outline: 'none',
                }}
              >
                {m}
              </button>
            )
          })}
        </div>

        {state.moteurs.length > 0 && (
          <div className="animate-fade-in">
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-texte-secondary)', marginBottom: 8 }}>
              Classement par importance (glissez pour réordonner) :
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.moteurs.map((m, i) => (
                <div
                  key={m}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', String(i))}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    moveMoteur(parseInt(e.dataTransfer.getData('text/plain')), i)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-blanc)',
                    cursor: 'grab',
                  }}
                >
                  <GripVertical size={14} style={{ color: 'var(--color-texte-muted)', flexShrink: 0 }} />
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: 'var(--color-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-display)',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>{m}</span>
                  <button
                    onClick={() => removeMoteur(i)}
                    style={{ color: 'var(--color-texte-muted)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Q22 — Frein principal */}
      <div style={{ marginBottom: 48 }}>
        <p className="label-uppercase" style={{ marginBottom: 8 }}>OBSTACLES</p>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: 16 }}>
          Quel est le principal frein à l'action climat dans votre organisation ?
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
          {[...FREINS, 'Autre'].map(f => {
            const isSelected = state.frein === f
            return (
              <div key={f}>
                <button
                  onClick={() => update('frein', f)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px',
                    borderRadius: 10,
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: isSelected ? 'var(--color-fond)' : 'var(--color-blanc)',
                    cursor: 'pointer', outline: 'none',
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border-active)'}`,
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-texte)' }}>{f === 'Autre' ? 'Autre (champ libre)' : f}</span>
                </button>
                {f === 'Autre' && isSelected && (
                  <textarea
                    value={state.freinAutre}
                    onChange={e => update('freinAutre', e.target.value)}
                    placeholder="Précisez votre frein principal..."
                    style={{
                      width: '100%', marginTop: 8, padding: '12px 16px',
                      borderRadius: 8, border: '1px solid var(--color-border)',
                      fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
                      resize: 'none', minHeight: 80, outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s', color: 'var(--color-texte)',
                      backgroundColor: 'var(--color-blanc)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Q23 — Échéances réglementaires */}
      <div style={{ marginBottom: 48 }}>
        <p className="label-uppercase" style={{ marginBottom: 8 }}>RÉGLEMENTATION</p>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: 16 }}>
          À quelle échéance estimez-vous être concerné par ces obligations ?
        </h2>

        {/* Desktop table */}
        <div className="hidden sm:block" style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-subtle)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-texte-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Obligation</th>
                {REGULATORY_COLUMNS.map(col => (
                  <th key={col} style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--color-texte-muted)', fontWeight: 600, fontSize: '0.7rem', minWidth: 80, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGULATORY_ROWS.map((row, ri) => (
                <tr key={row.id} style={{ backgroundColor: ri % 2 === 0 ? 'var(--color-blanc)' : 'var(--color-fond)' }}>
                  <td style={{ padding: '0 16px', height: 48, fontWeight: 500, borderBottom: '1px solid var(--color-border)' }}>{row.label}</td>
                  {REGULATORY_COLUMNS.map(col => {
                    const isSelected = state.regulatory[row.id] === col
                    return (
                      <td key={col} style={{ textAlign: 'center', height: 48, borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : undefined,
                        borderRadius: isSelected ? 6 : undefined,
                        fontWeight: isSelected ? 500 : undefined,
                        color: isSelected ? 'var(--color-primary)' : undefined,
                      }}
                        onClick={() => update('regulatory', { ...state.regulatory, [row.id]: col })}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', margin: '0 auto',
                          border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border-active)'}`,
                          backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {isSelected && <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#fff' }} />}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked */}
        <div className="sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {REGULATORY_ROWS.map(row => (
            <div key={row.id}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 8 }}>{row.label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {REGULATORY_COLUMNS.map(col => {
                  const isSelected = state.regulatory[row.id] === col
                  return (
                    <button
                      key={col}
                      onClick={() => update('regulatory', { ...state.regulatory, [row.id]: col })}
                      style={{
                        padding: '6px 12px', borderRadius: 8,
                        border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-subtle)',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-texte-secondary)',
                        fontSize: '0.75rem', fontWeight: 500,
                        cursor: 'pointer', outline: 'none', transition: 'all 0.15s',
                      }}
                    >
                      {col}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q24 — Perte de marché */}
      <div style={{ marginBottom: 48 }}>
        <p className="label-uppercase" style={{ marginBottom: 8 }}>EXPÉRIENCE</p>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: 16 }}>
          Avez-vous perdu un appel d'offres, un client ou un financement pour des raisons climat/RSE ?
        </h2>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {['Oui', 'Non', 'Je ne sais pas'].map(opt => {
            const isSelected = state.perteMarche === opt
            return (
              <button
                key={opt}
                onClick={() => update('perteMarche', opt)}
                style={{
                  flex: 1, padding: '14px 24px', borderRadius: 10,
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: isSelected ? 'var(--color-fond)' : 'var(--color-blanc)',
                  fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer',
                  outline: 'none', transition: 'all 0.2s',
                  color: 'var(--color-texte)',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {state.perteMarche === 'Oui' && (
          <textarea
            value={state.perteDetail}
            onChange={e => update('perteDetail', e.target.value)}
            placeholder="Pouvez-vous préciser brièvement ?"
            className="animate-fade-in"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              border: '1px solid var(--color-border)', fontSize: '0.85rem',
              fontFamily: 'var(--font-sans)', resize: 'none', minHeight: 80,
              outline: 'none', transition: 'border-color 0.2s', color: 'var(--color-texte)',
              backgroundColor: 'var(--color-blanc)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
          />
        )}
      </div>

      {/* Q25 & Q26 — Open questions */}
      <div style={{ marginBottom: 48 }}>
        <p className="label-uppercase" style={{ marginBottom: 8 }}>VISION</p>

        <div style={{ marginBottom: 28 }}>
          <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, fontStyle: 'italic', marginBottom: 12 }}>
            Si vous aviez carte blanche et budget illimité, quelles seraient vos 3 premières actions climat ?
          </h2>
          <CountedTextarea
            value={state.q25}
            onChange={v => update('q25', v)}
            placeholder="Décrivez vos 3 premières actions climat..."
          />
        </div>

        <div>
          <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, fontStyle: 'italic', marginBottom: 12 }}>
            Quel scénario redoutez-vous le plus dans les 3 prochaines années ?
          </h2>
          <CountedTextarea
            value={state.q26}
            onChange={v => update('q26', v)}
            placeholder="Décrivez le scénario que vous redoutez..."
          />
        </div>
      </div>

      {/* Q27 — Confidential */}
      <div style={{
        marginBottom: 48, padding: '20px 24px', borderRadius: 10,
        backgroundColor: '#FFF9F5', borderLeft: '3px solid var(--color-accent-warm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Lock size={18} style={{ color: 'var(--color-accent-warm)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-accent-warm)' }}>
            Réponse confidentielle. Ne figurera pas dans le rapport partageable.
          </span>
        </div>
        <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, fontStyle: 'italic', marginBottom: 12 }}>
          Qu'est-ce qui vous frustre le plus dans la démarche climat de votre entreprise ?
        </h2>
        <CountedTextarea
          value={state.q27}
          onChange={v => update('q27', v)}
          placeholder="Partagez ce qui vous frustre..."
        />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-texte-muted)', alignSelf: 'center', marginRight: 'auto' }}>Sauvegarde auto</span>
        <button
          onClick={handleValidate}
          style={{
            padding: '12px 28px', borderRadius: 8,
            backgroundColor: 'var(--color-primary)', color: '#fff',
            fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          Valider ce bloc <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
