import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, RefreshCw, X, ChevronRight, ChevronLeft, Clock } from 'lucide-react'
import { ADVANCEMENT_TILES, type TileStatus } from '@/data/bloc1Tiles'
import AdvancementTileCard from '@/components/questionnaire/AdvancementTileCard'
import BlocIntroScreen from '@/components/questionnaire/BlocIntroScreen'

// ── Types ────────────────────────────────────
interface TileState {
  status: TileStatus
  comment: string
}


const STORAGE_KEY = 'boussole_bloc1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ── Stepper ──────────────────────────────────
function Stepper({ step }: { step: number }) {
  const steps = ['Démarche', 'Passeport']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const isDone = i < step
        const isCurrent = i === step
        const color = isDone ? '#1B4332' : isCurrent ? '#B87333' : '#E5E1D8'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ width: 32, height: 2, backgroundColor: isDone ? '#1B4332' : '#E5E1D8' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', backgroundColor: color,
                animation: isCurrent ? 'sidebarPulse 2s ease-in-out infinite' : undefined,
              }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 500, color: isCurrent ? '#B87333' : isDone ? '#1B4332' : '#B0AB9F', fontFamily: 'var(--font-sans)' }}>
                {label}
              </span>
            </div>
          </div>
        )
      })}
      <style>{`
        @keyframes sidebarPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

// ── Main Component ───────────────────────────
export default function QuestionnaireBloc1() {
  const navigate = useNavigate()
  const saved = loadState()
  const hasStarted = !!saved

  const [showIntro, setShowIntro] = useState(!hasStarted)
  const [step, setStep] = useState(0) // 0=démarche, 1=passeport

  // Company data is now handled during the launch call setup

  const [tiles, setTiles] = useState<Record<string, TileState>>(
    saved?.tiles ?? Object.fromEntries(
      ADVANCEMENT_TILES.map(t => [t.id, { status: 'not_started' as TileStatus, comment: '' }])
    )
  )

  const [expandedTile, setExpandedTile] = useState<string | null>(null)

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tiles }))
  }, [tiles])
  useEffect(() => { const timer = setTimeout(save, 500); return () => clearTimeout(timer) }, [save])

  function cycleTileStatus(id: string) {
    setTiles(prev => {
      const current = prev[id].status
      const next: TileStatus = current === 'not_started' ? 'done' : current === 'done' ? 'in_progress' : 'not_started'
      if (next !== 'not_started') setExpandedTile(id)
      else setExpandedTile(cur => cur === id ? null : cur)
      return { ...prev, [id]: { ...prev[id], status: next } }
    })
  }

  function updateTileComment(id: string, comment: string) {
    setTiles(prev => ({ ...prev, [id]: { ...prev[id], comment } }))
  }


  const doneCount = Object.values(tiles).filter(t => t.status === 'done').length
  const inProgressCount = Object.values(tiles).filter(t => t.status === 'in_progress').length
  const notStartedCount = 12 - doneCount - inProgressCount

  // ── Intro screen ──────────────────────────
  if (showIntro) {
    return (
      <BlocIntroScreen
        blocNum={1}
        title="Votre démarche aujourd'hui"
        description="Faisons le point sur ce que vous avez déjà mis en place. Pour chaque initiative climat, indiquez simplement où vous en êtes : c'est fait, c'est en cours, ou ce n'est pas encore lancé."
        duration="~10 min"
        questionCount="12 initiatives à évaluer"
        analystTip="Ce bloc se remplit idéalement ensemble lors de notre appel. Mais vous pouvez commencer seul(e), je compléterai avec vous."
        hasStarted={hasStarted}
        onStart={() => setShowIntro(false)}
      />
    )
  }

  // ── Feedback view (step 1 = passeport) ────────────────
  if (step === 1) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 680 }}>
        <Stepper step={1} />
        <div style={{ marginBottom: 32 }}>
          <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 8 }}>
            Votre passeport climat
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', marginBottom: 16 }}>
            Voici le profil de votre démarche. Il sera enrichi dans les prochaines sections.
          </p>
          <div style={{ borderBottom: '1px solid var(--color-border)' }} />
        </div>

        <div style={{ backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 32, marginBottom: 24 }}>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" style={{ marginBottom: 28 }}>
            {ADVANCEMENT_TILES.map(tile => {
              const state = tiles[tile.id]
              const isDone = state.status === 'done'
              const isInProgress = state.status === 'in_progress'
              return (
                <div key={tile.id} style={{
                  padding: '14px 10px', borderRadius: 12,
                  border: `1px solid ${isDone ? 'var(--color-primary)' : isInProgress ? 'var(--color-accent-warm)' : 'var(--color-border)'}`,
                  backgroundColor: isDone ? 'var(--color-primary-light)' : isInProgress ? 'var(--color-accent-warm-light)' : 'var(--color-blanc)',
                  textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: isDone ? 'var(--color-primary)' : isInProgress ? 'var(--color-accent-warm)' : 'var(--color-texte-muted)' }}>
                    {isDone ? <Check size={16} /> : isInProgress ? <RefreshCw size={16} /> : <X size={14} />}
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.3, color: 'var(--color-texte)' }}>{tile.label}</p>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-primary)' }}>✓ {doneCount} réalisé{doneCount > 1 ? 's' : ''}</span>
            <span style={{ color: 'var(--color-accent-warm)' }}>↻ {inProgressCount} en cours</span>
            <span style={{ color: 'var(--color-texte-muted)' }}>✗ {notStartedCount} pas encore</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          <button onClick={() => setStep(0)} style={{
            padding: '12px 20px', borderRadius: 8, border: '1px solid var(--color-border)',
            backgroundColor: 'transparent', color: 'var(--color-texte)', fontSize: '0.875rem',
            fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <ChevronLeft size={16} /> Précédent
          </button>
          <button onClick={() => navigate('/client/questionnaire/bloc2')} style={{
            flex: 1, padding: '12px 28px', borderRadius: 8, backgroundColor: 'var(--color-primary)',
            color: '#fff', fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            Passer au Bloc 2 <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── Step 0: Advancement Tiles (Démarche) ─────────────
  return (
    <div style={{ maxWidth: 680 }} className="animate-fade-in">
      <Stepper step={0} />
      <div style={{ marginBottom: 32 }}>
        <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
        <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 8 }}>
          Bloc 1 — Votre démarche
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', margin: 0 }}>
            Où en êtes-vous sur chacune de ces initiatives climat ?
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--color-border)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-texte-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Clock size={11} /> ~10 min
          </span>
        </div>
        <div style={{ borderBottom: '1px solid var(--color-border)' }} />
      </div>

      {/* Guide */}
      <div style={{
        backgroundColor: 'var(--color-blanc)', border: '1px solid var(--color-border)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 24,
      }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-texte-secondary)', lineHeight: 1.6, margin: 0 }}>
          Pour chaque initiative, cliquez pour indiquer son statut. Vous pouvez ajouter un commentaire pour préciser le contexte (date, périmètre, prestataire…). Il n'y a pas de mauvaise réponse — c'est un état des lieux, pas une évaluation.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={9} color="#fff" />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-texte-secondary)', fontFamily: 'var(--font-sans)' }}>Réalisé</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#B87333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={8} color="#fff" />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-texte-secondary)', fontFamily: 'var(--font-sans)' }}>En cours</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #E5E1D8' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-texte-secondary)', fontFamily: 'var(--font-sans)' }}>Pas encore lancé</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginBottom: 24 }}>
        {ADVANCEMENT_TILES.map(tile => (
          <AdvancementTileCard
            key={tile.id}
            tile={tile}
            state={tiles[tile.id]}
            isExpanded={expandedTile === tile.id && tiles[tile.id].status !== 'not_started'}
            onCycle={() => cycleTileStatus(tile.id)}
            onCommentChange={comment => updateTileComment(tile.id, comment)}
          />
        ))}
      </div>

      {/* Summary */}
      <div style={{
        display: 'flex', gap: 16, fontSize: '0.82rem', marginBottom: 32,
        padding: '12px 16px', backgroundColor: 'var(--color-blanc)', borderRadius: 10, border: '1px solid var(--color-border)',
      }}>
        <span style={{ color: '#1B4332', fontWeight: 500 }}>✓ {doneCount} réalisé{doneCount > 1 ? 's' : ''}</span>
        <span style={{ color: '#B87333', fontWeight: 500 }}>↻ {inProgressCount} en cours</span>
        <span style={{ color: 'var(--color-texte-muted)' }}>✗ {notStartedCount} pas encore</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-texte-muted)' }}>Sauvegarde auto</span>
      </div>

      <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
        <button onClick={() => setStep(1)} style={{
          flex: 1, padding: '12px 28px', borderRadius: 8, backgroundColor: 'var(--color-primary)',
          color: '#fff', fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background-color 0.2s',
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
