import { NavLink, useLocation } from 'react-router-dom'
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
} from 'lucide-react'
import { MOCK_ANALYST } from '../../hooks/useAuth'

const QUESTIONNAIRE_ITEMS = [
  { key: 'bloc1', label: 'Votre démarche', path: '/client/questionnaire/bloc1', icon: <ClipboardList size={16} />, status: 'done' },
  { key: 'bloc2', label: 'Votre maturité', path: '/client/questionnaire/bloc2', icon: <BarChart3 size={16} />, status: 'done' },
  { key: 'bloc3', label: 'Vos enjeux', path: '/client/questionnaire/bloc3', icon: <Target size={16} />, status: 'in_progress' },
  { key: 'bloc4', label: 'La perception', path: '/client/questionnaire/bloc4', icon: <Sparkles size={16} />, status: 'todo' },
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

export default function ClientSidebar() {
  const location = useLocation()
  const analyst = MOCK_ANALYST

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
        {/* NAVIGATION section */}
        <SectionLabel>NAVIGATION</SectionLabel>
        <SidebarItem
          to="/client/dashboard"
          icon={<LayoutDashboard size={16} />}
          label="Vue d'ensemble"
          active={isDashboard}
        />

        {/* QUESTIONNAIRE section */}
        <SectionLabel className="mt-5">QUESTIONNAIRE</SectionLabel>
        {QUESTIONNAIRE_ITEMS.map(item => (
          <SidebarItem
            key={item.key}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={isActive(item.path)}
            dotStatus={item.status}
          />
        ))}

        {/* DIAGNOSTIC section */}
        <SectionLabel className="mt-5">DIAGNOSTIC</SectionLabel>
        {DIAGNOSTIC_ITEMS.map(item => (
          <div
            key={item.key}
            className="flex items-center gap-3 px-3 py-2 text-sm"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#B0AB9F', opacity: 0.35 }}
          >
            {item.label}
          </div>
        ))}

        {/* SUIVI section */}
        <SectionLabel className="mt-5">SUIVI</SectionLabel>
        <SidebarItem
          to="/client/journal"
          icon={<BookOpen size={16} />}
          label="Journal"
          active={isActive('/client/journal')}
        />
        <SidebarItem
          to="/client/messages"
          icon={<MessageSquare size={16} />}
          label="Messages"
          active={isActive('/client/messages')}
        />
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5">
        <NavLink
          to="/client/aide"
          className="flex items-center gap-2 px-3 py-2"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}
        >
          <HelpCircle size={14} />
          Aide
        </NavLink>
      </div>

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
  to,
  icon,
  label,
  active,
  dotStatus,
}: {
  to: string
  icon: React.ReactNode
  label: string
  active?: boolean
  dotStatus?: string
}) {
  return (
    <NavLink
      to={to}
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
