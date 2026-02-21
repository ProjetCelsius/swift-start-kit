import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { PERCEPTION_AFFIRMATIONS } from '@/data/bloc4Data'
import { POPULATION_PROFILES } from '@/data/bloc4Data'

const ROLE_OPTIONS = ['Direction', 'Manager', 'Collaborateur']

// Mock data — in production, fetched from backend via token
function useSurveyConfig(_token: string) {
  return {
    companyName: 'Acme Corp',
    message: 'Dans le cadre de notre démarche climat, nous souhaitons recueillir votre perception sur notre engagement environnemental.',
    distinguishLevels: true,
  }
}

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

// ── Compact Slider ───────────────────────────
function CompactSlider({ value, onChange, label, index }: {
  value: number | null; onChange: (v: number) => void; label: string; index: number
}) {
  const display = value ?? 5
  const touched = value !== null
  return (
    <div style={{ padding: '14px 0' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 400, marginBottom: 10, lineHeight: 1.5, color: '#2A2A28' }}>
        <span style={{ fontWeight: 600, color: '#1B4332' }}>S{index}.</span> {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '0.7rem', color: '#B0AB9F', width: 52, textAlign: 'right', flexShrink: 0 }}>Pas du tout</span>
        <div style={{ flex: 1 }}>
          <input
            type="range" min={1} max={10} value={display}
            onChange={e => onChange(parseInt(e.target.value))}
            className="survey-slider"
            style={{
              width: '100%', height: 4, borderRadius: 2, appearance: 'none', cursor: 'pointer', outline: 'none',
              background: `linear-gradient(to right, #1B4332 0%, #1B4332 ${((display - 1) / 9) * 100}%, #F0EDE6 ${((display - 1) / 9) * 100}%, #F0EDE6 100%)`,
            }}
          />
        </div>
        <span style={{ fontSize: '0.7rem', color: '#B0AB9F', width: 52, flexShrink: 0 }}>Tout à fait</span>
        <span
          className="font-display"
          style={{ fontSize: '1rem', fontWeight: 500, width: 28, textAlign: 'center', flexShrink: 0, color: touched ? '#1B4332' : '#E5E1D8', transition: 'color 0.2s' }}
        >
          {display}
        </span>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────
export default function SurveyPage() {
  const { token } = useParams<{ token: string }>()
  const config = useSurveyConfig(token ?? '')

  const [phase, setPhase] = useState<'welcome' | 'questions' | 'profile' | 'open' | 'done'>('welcome')
  const [role, setRole] = useState('')
  const [scores, setScores] = useState<(number | null)[]>(Array(8).fill(null))
  const [page, setPage] = useState(0) // 0=S1-S2, 1=S3-S4, 2=S5-S6, 3=S7-S8
  const [profile, setProfile] = useState('')
  const [openAnswer, setOpenAnswer] = useState('')
  const [fadeKey, setFadeKey] = useState(0)

  const pages = [[0, 1], [2, 3], [4, 5], [6, 7]]

  function setScore(i: number, v: number) {
    setScores(prev => { const a = [...prev]; a[i] = v; return a })
  }

  const currentQuestions = pages[page]
  const allAnswered = currentQuestions.every(i => scores[i] !== null)

  function nextPage() {
    if (page < 3) { setPage(page + 1); setFadeKey(k => k + 1) }
    else setPhase('profile')
  }

  function prevPage() {
    if (page > 0) { setPage(page - 1); setFadeKey(k => k + 1) }
  }

  const shell = (children: React.ReactNode) => (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F5F0', display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 540, width: '100%' }}>{children}</div>
      <style>{`
        .survey-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: #1B4332; border: 2px solid white; box-shadow: 0 1px 3px rgba(42,42,40,.12); cursor: grab;
        }
        .survey-slider::-moz-range-thumb {
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
          <h1 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: 8 }}>
            Merci pour votre participation.
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#B0AB9F' }}>
            Vos réponses ont été enregistrées de manière anonyme.
          </p>
        </div>
      </div>
    )
  }

  // ── OPEN ──
  if (phase === 'open') {
    return shell(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ width: '100%' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 400, color: '#2A2A28', flex: 1 }}>
              Si vous aviez un message à faire passer à la direction sur le sujet climat ?
            </p>
            <span style={{
              fontSize: '0.65rem', fontFamily: 'var(--font-sans)', padding: '3px 8px',
              borderRadius: 20, backgroundColor: '#F0EDE6', color: '#B0AB9F', flexShrink: 0,
            }}>
              Optionnel
            </span>
          </div>
          <textarea
            value={openAnswer}
            onChange={e => setOpenAnswer(e.target.value)}
            placeholder="Votre message..."
            style={{
              width: '100%', minHeight: 80, padding: 14, borderRadius: 8,
              border: '1px solid #EDEAE3', fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
              resize: 'none', outline: 'none', backgroundColor: '#fff',
            }}
          />
          <button
            onClick={() => setPhase('done')}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 8, backgroundColor: '#1B4332',
              color: '#fff', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
              marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--font-sans)',
            }}
          >
            Terminer <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ── PROFILE S9 ──
  if (phase === 'profile') {
    return shell(
      <div style={{ paddingTop: 32 }} className="animate-fade-in">
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 500, marginBottom: 16, color: '#2A2A28' }}>
          Comment décririez-vous votre posture personnelle ?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {POPULATION_PROFILES.map(p => {
            const isSelected = profile === p.id
            return (
              <button
                key={p.id}
                onClick={() => setProfile(p.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10,
                  border: `1px solid ${isSelected ? '#1B4332' : '#EDEAE3'}`,
                  backgroundColor: isSelected ? '#F7F5F0' : '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color, flexShrink: 0,
                }} />
                <div>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>
                    {p.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', color: '#7A766D', marginLeft: 8 }}>
                    — {p.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setPhase('open')}
          disabled={!profile}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 8, backgroundColor: '#1B4332',
            color: '#fff', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: !profile ? 0.4 : 1, fontFamily: 'var(--font-sans)',
          }}
        >
          Suivant <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  // ── QUESTIONS (2 per screen) ──
  if (phase === 'questions') {
    const totalScreens = 4
    const progress = ((page + 1) / (totalScreens + 2)) * 100 // +2 for profile+open
    return shell(
      <div style={{ paddingTop: 16 }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.75rem', color: '#7A766D', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            {page * 2 + 1}–{Math.min((page + 1) * 2, 8)} / 10
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 2, backgroundColor: '#F0EDE6', marginBottom: 24 }}>
          <div style={{ height: '100%', borderRadius: 2, backgroundColor: '#1B4332', width: `${progress}%`, transition: 'width 0.4s' }} />
        </div>

        <div key={fadeKey} className="animate-fade-in">
          <div style={{ borderTop: '1px solid #F0EDE6' }}>
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

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {page > 0 && (
              <button
                onClick={prevPage}
                style={{
                  padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 500, color: '#7A766D', backgroundColor: '#F0EDE6',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ← Précédent
              </button>
            )}
            <button
              onClick={nextPage}
              disabled={!allAnswered}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 8, backgroundColor: '#1B4332',
                color: '#fff', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                opacity: !allAnswered ? 0.4 : 1, fontFamily: 'var(--font-sans)',
              }}
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        </div>
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
          Sondage climat
        </h1>
        <p className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: '#1B4332', marginBottom: 16 }}>
          {config.companyName}
        </p>
        <p style={{ fontSize: '0.88rem', color: '#7A766D', lineHeight: 1.5, marginBottom: 12 }}>
          {config.message}
        </p>
        <p style={{ fontSize: '0.8rem', color: '#B0AB9F', marginBottom: 24 }}>
          Anonyme · 5 minutes · Vos réponses seront agrégées
        </p>

        {config.distinguishLevels && (
          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
              Vous êtes...
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{
                width: '100%', height: 44, padding: '0 14px', borderRadius: 8,
                border: '1px solid #EDEAE3', fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
                backgroundColor: '#fff', outline: 'none', color: role ? '#2A2A28' : '#B0AB9F',
              }}
            >
              <option value="">Sélectionner</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        <button
          onClick={() => setPhase('questions')}
          disabled={config.distinguishLevels && !role}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 8, backgroundColor: '#1B4332',
            color: '#fff', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: (config.distinguishLevels && !role) ? 0.4 : 1, fontFamily: 'var(--font-sans)',
          }}
        >
          Démarrer <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
