import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, RefreshCw, X, ChevronRight, ChevronLeft, ChevronDown, Clock } from 'lucide-react'
import { ADVANCEMENT_TILES, HEADCOUNT_OPTIONS, REVENUE_OPTIONS, type TileStatus } from '@/data/bloc1Tiles'
import NafDropdown from '@/components/questionnaire/NafDropdown'
import AdvancementTileCard from '@/components/questionnaire/AdvancementTileCard'
import BlocIntroScreen from '@/components/questionnaire/BlocIntroScreen'

// ── Types ────────────────────────────────────
interface TileState {
  status: TileStatus
  comment: string
}

interface CompanyData {
  raison_sociale: string
  secteur: string
  effectif: string
  chiffre_affaires: string
  nb_sites: string
  annee_rse: string
  pas_de_demarche: boolean
  nom_repondant: string
  fonction_repondant: string
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
  const steps = ['Entreprise', 'Démarche', 'Passeport']
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
  const [step, setStep] = useState(0) // 0=entreprise, 1=démarche, 2=passeport

  const [company, setCompany] = useState<CompanyData>(saved?.company ?? {
    raison_sociale: '', secteur: '', effectif: '', chiffre_affaires: '',
    nb_sites: '', annee_rse: '', pas_de_demarche: false,
    nom_repondant: '', fonction_repondant: '',
  })

  const [tiles, setTiles] = useState<Record<string, TileState>>(
    saved?.tiles ?? Object.fromEntries(
      ADVANCEMENT_TILES.map(t => [t.id, { status: 'not_started' as TileStatus, comment: '' }])
    )
  )

  const [expandedTile, setExpandedTile] = useState<string | null>(null)

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ company, tiles }))
  }, [company, tiles])
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

  function updateCompany(field: keyof CompanyData, value: string | boolean) {
    setCompany(prev => ({ ...prev, [field]: value }))
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
        description="On commence par faire connaissance. Quelques informations sur votre entreprise et un tour d'horizon de ce que vous avez déjà mis en place en matière de climat."
        duration="~10 min"
        questionCount="2 sections"
        analystTip="Ce bloc se remplit idéalement ensemble lors de notre appel. Mais vous pouvez commencer seul(e), je compléterai avec vous."
        hasStarted={hasStarted}
        onStart={() => setShowIntro(false)}
      />
    )
  }

  // ── Transition between step 0 and 1 ──────
  if (step === 0.5 as never) { /* handled via state */ }

  // ── Feedback view (step 2) ────────────────
  if (step === 2) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 680 }}>
        <Stepper step={2} />
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
          <button onClick={() => setStep(1)} style={{
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

  // ── Transition message ────────────────────
  if (step === -1) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 560, textAlign: 'center', margin: '40px auto' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-texte-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
          Parfait. Maintenant, faisons le point sur les actions que vous avez déjà engagées.
        </p>
        <button onClick={() => setStep(1)} style={{
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

  // ── Step 0: Company Data ──────────────────
  if (step === 0) {
    return (
      <div style={{ maxWidth: 680 }} className="animate-fade-in">
        <Stepper step={0} />
        <div style={{ marginBottom: 32 }}>
          <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 8 }}>
            Bloc 1 — Votre entreprise
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', margin: 0 }}>
              Quelques informations de base sur votre organisation.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--color-border)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-texte-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Clock size={11} /> ~5 min
            </span>
          </div>
          <div style={{ borderBottom: '1px solid var(--color-border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
          <FormField label="Raison sociale">
            <TextInput value={company.raison_sociale} onChange={v => updateCompany('raison_sociale', v)} placeholder="Nom de votre entreprise" />
          </FormField>
          <FormField label="Secteur d'activité (code NAF)">
            <NafDropdown value={company.secteur} onChange={v => updateCompany('secteur', v)} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Effectif total">
              <SelectInput value={company.effectif} onChange={v => updateCompany('effectif', v)} options={HEADCOUNT_OPTIONS} />
            </FormField>
            <FormField label="Chiffre d'affaires">
              <SelectInput value={company.chiffre_affaires} onChange={v => updateCompany('chiffre_affaires', v)} options={REVENUE_OPTIONS} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Nombre de sites">
              <TextInput type="number" value={company.nb_sites} onChange={v => updateCompany('nb_sites', v)} placeholder="1" min="1" />
            </FormField>
            <FormField label="Démarche RSE depuis">
              <TextInput type="number" value={company.annee_rse} onChange={v => updateCompany('annee_rse', v)} placeholder="2020" min="1990" max="2026" disabled={company.pas_de_demarche} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: '0.8rem', color: 'var(--color-texte-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={company.pas_de_demarche} onChange={e => updateCompany('pas_de_demarche', e.target.checked)} style={{ borderRadius: 4 }} />
                Pas de démarche formalisée
              </label>
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Votre nom">
              <TextInput value={company.nom_repondant} onChange={v => updateCompany('nom_repondant', v)} placeholder="Prénom Nom" />
            </FormField>
            <FormField label="Votre fonction">
              <TextInput value={company.fonction_repondant} onChange={v => updateCompany('fonction_repondant', v)} placeholder="Ex : Responsable RSE" />
            </FormField>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-texte-muted)', alignSelf: 'center', marginRight: 'auto' }}>Sauvegarde auto</span>
          <button onClick={() => setStep(-1)} style={{
            padding: '12px 28px', borderRadius: 8, backgroundColor: 'var(--color-primary)', color: '#fff',
            fontWeight: 500, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'background-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            Suivant <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── Step 1: Advancement Tiles ─────────────
  return (
    <div style={{ maxWidth: 680 }} className="animate-fade-in">
      <Stepper step={1} />
      <div style={{ marginBottom: 32 }}>
        <p className="label-uppercase" style={{ marginBottom: 12 }}>QUESTIONNAIRE</p>
        <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 8 }}>
          Bloc 1 — Votre démarche
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-texte-secondary)', marginBottom: 16 }}>
          Pour chaque initiative, indiquez si elle est réalisée, en cours, ou pas encore lancée.
        </p>
        <div style={{ borderBottom: '1px solid var(--color-border)' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginBottom: 40 }}>
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

      <div style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }}>
        <button onClick={() => setStep(0)} style={{
          padding: '12px 20px', borderRadius: 8, border: '1px solid var(--color-border)',
          backgroundColor: 'transparent', color: 'var(--color-texte)', fontSize: '0.875rem',
          fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <ChevronLeft size={16} /> Précédent
        </button>
        <button onClick={() => setStep(2)} style={{
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

// ── Reusable form primitives ─────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-texte)', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', disabled, min, max }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; min?: string; max?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      disabled={disabled} min={min} max={max}
      style={{
        width: '100%', height: 48, padding: '0 14px', borderRadius: 8,
        border: '1px solid var(--color-border)', fontSize: '0.875rem',
        fontFamily: 'var(--font-sans)', color: 'var(--color-texte)',
        backgroundColor: 'var(--color-blanc)', outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s', opacity: disabled ? 0.4 : 1,
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.08)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
    />
  )
}

function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', height: 48, padding: '0 36px 0 14px', borderRadius: 8,
          border: '1px solid var(--color-border)', fontSize: '0.875rem',
          fontFamily: 'var(--font-sans)', color: value ? 'var(--color-texte)' : 'var(--color-texte-muted)',
          backgroundColor: 'var(--color-blanc)', outline: 'none', appearance: 'none',
          cursor: 'pointer', transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
        onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
      >
        <option value="">Sélectionner</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-texte-muted)', pointerEvents: 'none' }} />
    </div>
  )
}
