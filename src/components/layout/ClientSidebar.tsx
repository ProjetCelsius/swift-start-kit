import { useState, useRef, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Target,
  Sparkles,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Compass,
  ChevronUp,
  User,
  Lock,
  Download,
  LogOut,
} from 'lucide-react'
import { MOCK_ANALYST } from '../../hooks/useAuth'
import { useAuth } from '../../hooks/useAuth'
import HelpPanel from '../questionnaire/HelpPanel'

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

    const s2 = bloc2 ? (() => {
      const d = JSON.parse(bloc2)
      const answered = Object.keys(d).length
      return answered >= 20 ? 'done' : answered > 0 ? 'in_progress' : 'todo'
    })() : 'todo'

    const s3 = bloc3 ? (() => {
      const d = JSON.parse(bloc3)
      const hasMoteurs = d.moteurs?.length > 0
      const hasFrein = !!d.frein
      const hasReg = Object.keys(d.regulatory || {}).length > 0
      const complete = hasMoteurs && hasFrein && hasReg && d.q25 && d.q26
      return complete ? 'done' : (hasMoteurs || hasFrein || hasReg) ? 'in_progress' : 'todo'
    })() : 'todo'

    const s4 = bloc4 ? (() => {
      const d = JSON.parse(bloc4)
      const selfDone = d.selfScores?.filter((v: any) => v !== null).length >= 8
      const predDone = d.predScores?.filter((v: any) => v !== null).length >= 8
      return selfDone && predDone ? 'done' : (d.selfScores?.some((v: any) => v !== null)) ? 'in_progress' : 'todo'
    })() : 'todo'

    return { bloc1: s1, bloc2: s2, bloc3: s3, bloc4: s4 }
  } catch { return { bloc1: 'todo', bloc2: 'todo', bloc3: 'todo', bloc4: 'todo' } }
}

const QUESTIONNAIRE_ITEMS_BASE = [
  { key: 'bloc1', label: 'Votre démarche', path: '/client/questionnaire/bloc1', icon: <ClipboardList size={16} /> },
  { key: 'bloc2', label: 'Votre maturité', path: '/client/questionnaire/bloc2', icon: <BarChart3 size={16} /> },
  { key: 'bloc3', label: 'Vos enjeux', path: '/client/questionnaire/bloc3', icon: <Target size={16} /> },
  { key: 'bloc4', label: 'La perception', path: '/client/questionnaire/bloc4', icon: <Sparkles size={16} /> },
]

const DIAGNOSTIC_ITEMS = [
  { key: 'synthese', label: 'Synthèse', path: '/client/diagnostic' },
  { key: 'priorites', label: 'Priorités', path: '/client/diagnostic' },
  { key: 'maturite', label: 'Maturité', path: '/client/diagnostic' },
]

const dotColor: Record<string, string> = {
  done: '#1B4332',
  in_progress: '#B87333',
  todo: '#E5E1D8',
}

export default function ClientSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const analyst = MOCK_ANALYST
  const [helpOpen, setHelpOpen] = useState(false)

  const statuses = useMemo(computeBlocStatuses, [])
  const QUESTIONNAIRE_ITEMS = QUESTIONNAIRE_ITEMS_BASE.map(item => ({
    ...item,
    status: statuses[item.key] ?? 'todo',
  }))

  const isActive = (path: string) => location.pathname === path
  const isDashboard = location.pathname === '/client/dashboard'

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col overflow-y-auto"
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EDEAE3',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: '#1B4332' }}
          >
            <Compass size={14} color="white" />
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '0.9rem', color: '#1B4332' }}>
              Boussole Climat
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F' }}>
              PAR CELSIUS
            </div>
          </div>
        </div>
      </div>

      {/* Analyst card */}
      <div className="px-4 pb-4">
        <div
          className="flex items-center gap-3 rounded-[10px] p-3"
          style={{ background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)' }}
        >
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: '#1B4332', fontFamily: 'var(--font-display)', fontSize: '0.6rem' }}
          >
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.45rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#B0AB9F' }}>
              VOTRE ANALYSTE
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>
              {analyst.first_name} {analyst.last_name}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <SectionLabel>NAVIGATION</SectionLabel>
        <SidebarItem to="/client/dashboard" icon={<LayoutDashboard size={16} />} label="Vue d'ensemble" active={isDashboard} onClick={onNavigate} />

        <SectionLabel className="mt-5">QUESTIONNAIRE</SectionLabel>
        {QUESTIONNAIRE_ITEMS.map(item => (
          <SidebarItem key={item.key} to={item.path} icon={item.icon} label={item.label} active={isActive(item.path)} dotStatus={item.status} onClick={onNavigate} />
        ))}

        <SectionLabel className="mt-5">DIAGNOSTIC</SectionLabel>
        {DIAGNOSTIC_ITEMS.map(item => (
          <div key={item.key} className="flex items-center gap-3 px-3 py-2 text-sm" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#B0AB9F', opacity: 0.35 }}>
            {item.label}
          </div>
        ))}

        <SectionLabel className="mt-5">SUIVI</SectionLabel>
        <SidebarItem to="/client/journal" icon={<BookOpen size={16} />} label="Journal" active={isActive('/client/journal')} onClick={onNavigate} />
        <SidebarItem to="/client/messages" icon={<MessageSquare size={16} />} label="Messages" active={isActive('/client/messages')} onClick={onNavigate} />
      </nav>

      {/* Bottom: Aide + User Profile */}
      <div className="px-3">
        <div className="flex items-center">
          <NavLink
            to="/client/aide"
            className="flex items-center gap-2 px-3 py-2 flex-1"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}
          >
            <HelpCircle size={14} />
            Aide
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
          >
            ?
          </button>
        </div>

        <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 0 12px' }} />
        <UserProfileBlock />
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Pulse animation for in-progress dots */}
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

// ── User Profile Block + Popover ─────────────
function UserProfileBlock() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { signOut } = useAuth()

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey) }
  }, [open])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast])

  function showToast(msg: string) {
    setToast(msg)
    setOpen(false)
  }

  async function handleLogout() {
    setOpen(false)
    await signOut()
    navigate('/login')
  }

  const menuItems = [
    { icon: <User size={15} />, label: 'Mon compte', action: () => showToast('Bientôt disponible') },
    { icon: <Lock size={15} />, label: 'Changer le mot de passe', action: () => showToast('Bientôt disponible') },
    { icon: <Download size={15} />, label: 'Exporter mes données', action: () => showToast('Bientôt disponible') },
    { icon: <HelpCircle size={15} />, label: 'Aide & support', action: () => showToast('Bientôt disponible') },
  ]

  return (
    <div ref={ref} style={{ position: 'relative', paddingBottom: 16 }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
            backgroundColor: '#2A2A28', color: '#fff', padding: '10px 20px', borderRadius: 8,
            fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem',
            animation: 'toastFade 0.15s ease-out',
          }}
        >
          {toast}
        </div>
      )}

      {/* Popover */}
      {open && (
        <div
          style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0,
            marginBottom: 6, width: 232,
            backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12,
            boxShadow: '0 4px 20px rgba(42,42,40,0.08), 0 1px 3px rgba(42,42,40,0.04)',
            padding: 6, zIndex: 100,
            animation: 'popoverIn 0.15s ease-out',
          }}
        >
          {/* User info header */}
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#1B4332', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '0.7rem',
              }}
            >
              MD
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>
                Marie Dupont
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D', marginBottom: 4 }}>
                marie.dupont@novatech.fr
              </div>
              <span style={{
                display: 'inline-block', padding: '2px 10px', borderRadius: 12,
                border: '1px solid #EDEAE3', fontFamily: 'var(--font-sans)',
                fontWeight: 500, fontSize: '0.6rem', color: '#7A766D',
              }}>
                Responsable RSE
              </span>
            </div>
          </div>

          {/* Separator */}
          <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 6px' }} />

          {/* Menu items */}
          <div style={{ padding: '2px 0' }}>
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 14px', borderRadius: 8, border: 'none', backgroundColor: 'transparent',
                  fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28',
                  cursor: 'pointer', transition: 'background-color 0.15s', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ color: '#7A766D', flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 6px' }} />

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderRadius: 8, border: 'none', backgroundColor: 'transparent',
              fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#DC4A4A',
              cursor: 'pointer', transition: 'background-color 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ color: '#DC4A4A', flexShrink: 0, display: 'flex' }}><LogOut size={15} /></span>
            Se déconnecter
          </button>
        </div>
      )}

      {/* Profile row trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 10px', borderRadius: 8, border: 'none',
          backgroundColor: 'transparent', cursor: 'pointer',
          transition: 'background-color 0.15s', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div
          style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            backgroundColor: '#1B4332', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
          }}
        >
          MD
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.82rem', color: '#2A2A28' }}>
            Marie Dupont
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.7rem', color: '#B0AB9F' }}>
            NovaTech Solutions
          </div>
        </div>
        <ChevronUp
          size={14}
          style={{
            color: '#B0AB9F', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      <style>{`
        @keyframes popoverIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastFade {
          from { opacity: 0; transform: translate(-50%, -6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ───────────────────────────
function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`px-3 pt-2 pb-1 ${className}`}
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: '0.5rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: '#B0AB9F',
      }}
    >
      {children}
    </div>
  )
}

function SidebarItem({
  to, icon, label, active, dotStatus, onClick,
}: {
  to: string; icon: React.ReactNode; label: string; active?: boolean; dotStatus?: string; onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-md"
      style={{
        backgroundColor: active ? '#E8F0EB' : 'transparent',
        color: active ? '#1B4332' : '#2A2A28',
        fontFamily: 'var(--font-sans)',
        fontWeight: active ? 600 : 400,
        fontSize: '0.85rem',
      }}
    >
      <span style={{ color: active ? '#1B4332' : '#7A766D' }}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {dotStatus && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStatus === 'in_progress' ? 'dot-pulse' : ''}`}
          style={{ backgroundColor: dotColor[dotStatus] || '#E5E1D8' }}
        />
      )}
    </NavLink>
  )
}
