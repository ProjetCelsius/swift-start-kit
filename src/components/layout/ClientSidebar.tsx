import { useState, useRef, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Check,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  User,
  Lock,
  Download,
  LogOut,
  Phone,
  FileText,
  Users,
  BarChart3,
  Presentation,
} from 'lucide-react'
import boussoleLogo from '@/assets/boussole-logo.png'
import celsiusLogo from '@/assets/celsius-logo.svg'
import { MOCK_ANALYST } from '../../hooks/useAuth'
import { useAuth } from '../../hooks/useAuth'
import HelpPanel from '../questionnaire/HelpPanel'

// ── Journey state ──────────────────────────────
type StepStatus = 'done' | 'current' | 'upcoming'

interface JourneyStep {
  id: string
  label: string
  icon: React.ReactNode
  status: StepStatus
  statusText: string
  subItems?: SubItem[]
}

interface SubItem {
  label: string
  path?: string
  status?: 'done' | 'in_progress' | 'todo'
  statusText?: string
  info?: boolean // non-clickable info row
}

function computeBlocStatuses(): Record<string, string> {
  try {
    const bloc1 = localStorage.getItem('boussole_bloc1')
    const bloc2 = localStorage.getItem('boussole_bloc2')
    const bloc3 = localStorage.getItem('boussole_bloc3')
    const bloc4 = localStorage.getItem('boussole_bloc4')

    const s1 = bloc1 ? (() => {
      const d = JSON.parse(bloc1)
      const hasCompany = d.company?.raison_sociale
      const tiles = d.tiles ? Object.values(d.tiles) : []
      const allDone = tiles.length > 0 && tiles.every((t: any) => t.status !== 'not_started')
      return allDone && hasCompany ? 'done' : (hasCompany || tiles.some((t: any) => t.status !== 'not_started')) ? 'in_progress' : 'todo'
    })() : 'todo'
    const s2 = bloc2 ? (() => { const d = JSON.parse(bloc2); const a = Object.keys(d).length; return a >= 20 ? 'done' : a > 0 ? 'in_progress' : 'todo' })() : 'todo'
    const s3 = bloc3 ? (() => { const d = JSON.parse(bloc3); const m = d.moteurs?.length > 0; const f = !!d.frein; const r = Object.keys(d.regulatory || {}).length > 0; return (m && f && r && d.q25 && d.q26) ? 'done' : (m || f || r) ? 'in_progress' : 'todo' })() : 'todo'
    const s4 = bloc4 ? (() => { const d = JSON.parse(bloc4); const sd = d.selfScores?.filter((v: any) => v !== null).length >= 8; const pd = d.predScores?.filter((v: any) => v !== null).length >= 8; return sd && pd ? 'done' : d.selfScores?.some((v: any) => v !== null) ? 'in_progress' : 'todo' })() : 'todo'
    return { bloc1: s1, bloc2: s2, bloc3: s3, bloc4: s4 }
  } catch { return { bloc1: 'todo', bloc2: 'todo', bloc3: 'todo', bloc4: 'todo' } }
}

const DIAG_SECTIONS = [
  { label: 'Synthèse éditoriale', slug: '1' },
  { label: 'Ce que nous ferions à votre place', slug: '2' },
  { label: 'Score de maturité', slug: '3' },
  { label: 'Écarts de perception', slug: '4' },
  { label: 'Capital humain climat', slug: '5' },
  { label: 'Empreinte contextualisée', slug: '6' },
  { label: 'Vos échéances clés', slug: '7' },
  { label: 'Profil d\'avancement', slug: '8' },
  { label: 'Prochaines étapes', slug: '9' },
]

const dotColor: Record<string, string> = {
  done: '#1B4332',
  in_progress: '#B87333',
  todo: '#E5E1D8',
}

export default function ClientSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const [helpOpen, setHelpOpen] = useState(false)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  const blocStatuses = useMemo(computeBlocStatuses, [])

  // For demo: step 1 done, step 2 current, step 3 parallel, steps 4-5 upcoming
  const completedBlocs = Object.values(blocStatuses).filter(s => s === 'done').length
  const allBlocsDone = completedBlocs === 4
  const questStatus: StepStatus = allBlocsDone ? 'done' : 'current'

  const steps: JourneyStep[] = [
    {
      id: 'appel', label: 'Appel de lancement', icon: <Phone size={12} />,
      status: 'done', statusText: 'Réalisé',
      subItems: [
        { label: 'Bloc 1 — Votre démarche', path: '/client/questionnaire/bloc1', status: blocStatuses.bloc1 as any },
      ],
    },
    {
      id: 'questionnaire', label: 'Questionnaire', icon: <FileText size={12} />,
      status: questStatus, statusText: `${completedBlocs - 1}/3 blocs`,
      subItems: [
        { label: 'Bloc 2 — Votre maturité', path: '/client/questionnaire/bloc2', status: blocStatuses.bloc2 as any, statusText: blocStatuses.bloc2 === 'done' ? 'Terminé' : blocStatuses.bloc2 === 'in_progress' ? 'En cours' : 'À faire' },
        { label: 'Bloc 3 — Vos enjeux', path: '/client/questionnaire/bloc3', status: blocStatuses.bloc3 as any, statusText: blocStatuses.bloc3 === 'done' ? 'Terminé' : blocStatuses.bloc3 === 'in_progress' ? 'En cours' : 'À faire' },
        { label: 'Bloc 4 — La perception', path: '/client/questionnaire/bloc4', status: blocStatuses.bloc4 as any, statusText: blocStatuses.bloc4 === 'done' ? 'Terminé' : blocStatuses.bloc4 === 'in_progress' ? 'En cours' : 'À faire' },
      ],
    },
    {
      id: 'sondage', label: 'Sondage & entretiens', icon: <Users size={12} />,
      status: 'current', statusText: '12/30 réponses',
      subItems: [
        { label: 'Sondage interne', path: '/client/sondage', status: 'in_progress', statusText: '12/30 réponses' },
        { label: 'Questionnaire DG', path: '/dg/demo', status: 'todo', statusText: 'En attente' },
      ],
    },
    {
      id: 'analyse', label: 'Analyse', icon: <BarChart3 size={12} />,
      status: 'upcoming', statusText: '—',
      subItems: [
        { label: `${analyst.first_name} travaille sur votre diagnostic`, info: true },
        { label: 'Étape 1/4 — Collecte des données', info: true },
      ],
    },
    {
      id: 'restitution', label: 'Restitution & diagnostic', icon: <Presentation size={12} />,
      status: 'upcoming', statusText: 'Verrouillé',
      subItems: DIAG_SECTIONS.map(s => ({
        label: s.label, path: `/client/diagnostic/${s.slug}`, status: 'todo' as const,
      })),
    },
  ]

  // Auto-expand current step
  useEffect(() => {
    const current = steps.find(s => s.status === 'current')
    if (current && expandedStep === null) setExpandedStep(current.id)
  }, [])

  function toggleStep(id: string) {
    setExpandedStep(prev => prev === id ? null : id)
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col overflow-y-auto"
      style={{ width: 'var(--sidebar-width)', backgroundColor: '#FFFFFF', borderRight: '1px solid #EDEAE3' }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <img src={boussoleLogo} alt="Boussole Climat" style={{ width: 30, height: 30 }} />
          <div>
            <div className="font-display" style={{ fontSize: '0.9rem', color: '#1B4332' }}>Boussole Climat</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F' }}>PAR</span>
              <img src={celsiusLogo} alt="Celsius" style={{ height: 10 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Analyst card */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 rounded-[10px] p-3" style={{ background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)' }}>
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: '#1B4332', fontFamily: 'var(--font-display)', fontSize: '0.6rem' }}>
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.45rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#B0AB9F' }}>VOTRE ANALYSTE</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>{analyst.first_name} {analyst.last_name}</div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble link */}
      <div className="px-3 mb-1">
        <NavLink
          to="/client/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-md"
          style={{
            backgroundColor: location.pathname === '/client/dashboard' ? '#E8F0EB' : 'transparent',
            color: location.pathname === '/client/dashboard' ? '#1B4332' : '#2A2A28',
            fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: location.pathname === '/client/dashboard' ? 600 : 400,
            transition: 'background-color 0.15s',
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={3} width={7} height={7} rx={1}/><rect x={14} y={3} width={7} height={7} rx={1}/><rect x={3} y={14} width={7} height={7} rx={1}/><rect x={14} y={14} width={7} height={7} rx={1}/></svg>
          Vue d'ensemble
        </NavLink>
      </div>

      {/* ── VERTICAL STEPPER ── */}
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="px-3 pt-2 pb-1" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F' }}>
          VOTRE PARCOURS
        </div>

        <div style={{ position: 'relative', paddingLeft: 14 }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 24, top: 14, bottom: 14, width: 2 }}>
            {steps.map((step, i) => {
              if (i === steps.length - 1) return null
              const isDone = step.status === 'done'
              return (
                <div key={i} style={{
                  position: 'absolute',
                  top: `${(i / (steps.length - 1)) * 100}%`,
                  height: `${(1 / (steps.length - 1)) * 100}%`,
                  width: 2,
                  backgroundColor: isDone ? '#1B4332' : '#E5E1D8',
                }} />
              )
            })}
          </div>

          {steps.map((step) => {
            const isExpanded = expandedStep === step.id
            const canExpand = step.status === 'done' || step.status === 'current'

            return (
              <div key={step.id} style={{ position: 'relative', marginBottom: 4 }}>
                {/* Step header */}
                <button
                  onClick={() => canExpand && toggleStep(step.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '8px 6px', borderRadius: 6, border: 'none',
                    backgroundColor: 'transparent', cursor: canExpand ? 'pointer' : 'default',
                    transition: 'background-color 0.15s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (canExpand) e.currentTarget.style.backgroundColor = '#F7F5F0' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {/* Circle */}
                  <StepCircle status={step.status} icon={step.icon} />

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem',
                      color: step.status === 'current' ? '#2A2A28' : step.status === 'done' ? '#7A766D' : '#B0AB9F',
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.65rem',
                      color: '#B0AB9F',
                    }}>
                      {step.statusText}
                    </div>
                  </div>

                  {canExpand && (
                    <ChevronDown size={12} style={{
                      color: '#B0AB9F', flexShrink: 0,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                    }} />
                  )}
                </button>

                {/* Sub-items */}
                {isExpanded && step.subItems && (
                  <div style={{ paddingLeft: 34, paddingBottom: 4 }}>
                    {step.subItems.map((sub, si) => {
                      if (sub.info) {
                        return (
                          <div key={si} style={{
                            padding: '6px 10px', fontFamily: 'var(--font-sans)',
                            fontSize: '0.72rem', color: '#B0AB9F', fontStyle: 'italic',
                          }}>
                            {sub.label}
                          </div>
                        )
                      }

                      const isActivePath = sub.path && location.pathname === sub.path
                      const isLocked = step.id === 'restitution' && step.status === 'upcoming'

                      return (
                        <button
                          key={si}
                          onClick={() => {
                            if (isLocked || !sub.path) return
                            navigate(sub.path)
                            onNavigate?.()
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                            padding: '6px 10px', borderRadius: 6, border: 'none',
                            backgroundColor: isActivePath ? '#E8F0EB' : 'transparent',
                            cursor: isLocked ? 'default' : 'pointer',
                            opacity: isLocked ? 0.4 : 1,
                            transition: 'background-color 0.15s', textAlign: 'left',
                          }}
                          onMouseEnter={e => { if (!isLocked && !isActivePath) e.currentTarget.style.backgroundColor = '#F7F5F0' }}
                          onMouseLeave={e => { if (!isActivePath) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          {sub.status && (
                            <span style={{
                              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                              backgroundColor: dotColor[sub.status] || '#E5E1D8',
                              animation: sub.status === 'in_progress' ? 'sidebarPulse 2s ease-in-out infinite' : undefined,
                            }} />
                          )}
                          {isLocked && <Lock size={10} style={{ color: '#B0AB9F', flexShrink: 0 }} />}
                          <span style={{
                            fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                            fontWeight: isActivePath ? 500 : 400,
                            color: isActivePath ? '#1B4332' : isLocked ? '#B0AB9F' : '#2A2A28',
                            flex: 1,
                          }}>
                            {sub.label}
                          </span>
                          {sub.statusText && (
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: '#B0AB9F', flexShrink: 0 }}>
                              {sub.statusText}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Separator */}
        <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '8px 10px' }} />

        {/* Secondary nav */}
        <div className="space-y-0.5">
          <SecondaryNavItem to="/client/journal" icon={<BookOpen size={15} />} label="Journal de bord" badge={2} active={location.pathname === '/client/journal'} onClick={onNavigate} />
          <SecondaryNavItem to="/client/messages" icon={<MessageSquare size={15} />} label="Messages" badge={1} active={location.pathname === '/client/messages'} onClick={onNavigate} />
        </div>
      </div>

      {/* Bottom: Aide + User Profile */}
      <div className="px-3">
        <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 10px 8px' }} />
        <div className="flex items-center">
          <NavLink to="/client/aide" className="flex items-center gap-2 px-3 py-2 flex-1" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
            <HelpCircle size={14} /> Aide
          </NavLink>
          <button
            onClick={() => setHelpOpen(true)}
            title="Questions fréquentes"
            style={{
              width: 22, height: 22, borderRadius: '50%', border: '1px solid #EDEAE3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', cursor: 'pointer', color: '#B0AB9F', flexShrink: 0,
              fontSize: '0.65rem', fontWeight: 600, fontFamily: 'var(--font-sans)',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >?</button>
        </div>

        <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 0 12px' }} />
        <UserProfileBlock />
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

      <style>{`
        @keyframes sidebarPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .dot-pulse { animation: sidebarPulse 2s ease-in-out infinite; }
      `}</style>
    </aside>
  )
}

// ── Step circle ─────────────────────────────
function StepCircle({ status, icon: _icon }: { status: StepStatus; icon: React.ReactNode }) {
  if (status === 'done') {
    return (
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        backgroundColor: '#1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={12} color="#fff" strokeWidth={2.5} />
      </div>
    )
  }
  if (status === 'current') {
    return (
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: '2px solid #1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1B4332' }} />
      </div>
    )
  }
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
      border: '1.5px solid #E5E1D8',
    }} />
  )
}

// ── Secondary nav item ──────────────────────
function SecondaryNavItem({ to, icon, label, badge, active, onClick }: {
  to: string; icon: React.ReactNode; label: string; badge?: number; active: boolean; onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-md"
      style={{
        backgroundColor: active ? '#E8F0EB' : 'transparent',
        color: active ? '#1B4332' : '#2A2A28',
        fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: active ? 600 : 400,
        transition: 'background-color 0.15s',
      }}
    >
      <span style={{ color: active ? '#1B4332' : '#7A766D', display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && badge > 0 && (
        <span style={{
          minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px',
          backgroundColor: '#B87333', color: '#fff',
          fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </NavLink>
  )
}

// ── User Profile Block + Popover ─────────────
function UserProfileBlock() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { signOut } = useAuth()

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey) }
  }, [open])

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t) }, [toast])

  function showToast(msg: string) { setToast(msg); setOpen(false) }
  async function handleLogout() { setOpen(false); await signOut(); navigate('/login') }

  const menuItems = [
    { icon: <User size={15} />, label: 'Mon compte', action: () => showToast('Bientôt disponible') },
    { icon: <Lock size={15} />, label: 'Changer le mot de passe', action: () => showToast('Bientôt disponible') },
    { icon: <Download size={15} />, label: 'Exporter mes données', action: () => showToast('Bientôt disponible') },
    { icon: <HelpCircle size={15} />, label: 'Aide & support', action: () => showToast('Bientôt disponible') },
  ]

  return (
    <div ref={ref} style={{ position: 'relative', paddingBottom: 16 }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          backgroundColor: '#2A2A28', color: '#fff', padding: '10px 20px', borderRadius: 8,
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem',
          animation: 'toastFade 0.15s ease-out',
        }}>{toast}</div>
      )}

      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 6, width: 232,
          backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(42,42,40,0.08), 0 1px 3px rgba(42,42,40,0.04)',
          padding: 6, zIndex: 100, animation: 'popoverIn 0.15s ease-out',
        }}>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, backgroundColor: '#1B4332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.7rem' }}>MD</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>Marie Dupont</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D', marginBottom: 4 }}>marie.dupont@novatech.fr</div>
              <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, border: '1px solid #EDEAE3', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.6rem', color: '#7A766D' }}>Responsable RSE</span>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 6px' }} />
          <div style={{ padding: '2px 0' }}>
            {menuItems.map((item, i) => (
              <button key={i} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28', cursor: 'pointer', transition: 'background-color 0.15s', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ color: '#7A766D', flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 6px' }} />
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#DC4A4A', cursor: 'pointer', transition: 'background-color 0.15s', textAlign: 'left' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ color: '#DC4A4A', flexShrink: 0, display: 'flex' }}><LogOut size={15} /></span>
            Se déconnecter
          </button>
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.15s', textAlign: 'left' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, backgroundColor: '#1B4332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.65rem' }}>MD</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.82rem', color: '#2A2A28' }}>Marie Dupont</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.7rem', color: '#B0AB9F' }}>NovaTech Solutions</div>
        </div>
        <ChevronUp size={14} style={{ color: '#B0AB9F', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      <style>{`
        @keyframes popoverIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastFade { from { opacity: 0; transform: translate(-50%, -6px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  )
}
