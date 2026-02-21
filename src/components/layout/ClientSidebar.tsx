import { NavLink, useLocation } from 'react-router-dom'
import {
  ClipboardList,
  Users,
  FileText,
  Target,
  BarChart3,
  GitCompare,
  UserCheck,
  Leaf,
  Calendar,
  CheckSquare,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Download,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import { useDemoIfAvailable } from '../../hooks/useDemo'

interface NavItem {
  key: string
  label: string
  path: string
  icon: React.ReactNode
  locked?: boolean
  badge?: string | number
  children?: { key: string; label: string; path: string; status?: string }[]
}

interface ClientSidebarProps {
  diagnosticUnlocked?: boolean
  surveyCount?: number
  hasNewJournal?: boolean
  hasNewMessages?: boolean
  questionnaireProgress?: { block: number; status: string }[]
}

export default function ClientSidebar({
  diagnosticUnlocked: propUnlocked = false,
  surveyCount: propSurveyCount = 0,
  hasNewJournal = false,
  hasNewMessages = false,
  questionnaireProgress = [],
}: ClientSidebarProps) {
  const { user } = useAuth()
  const location = useLocation()
  const analyst = MOCK_ANALYST
  const demo = useDemoIfAvailable()
  const isDemo = demo?.enabled ?? false
  const diag = isDemo ? demo?.activeDiagnostic : null

  const diagnosticUnlocked = isDemo && diag ? diag.diagnosticUnlocked : propUnlocked
  const surveyCount = isDemo && diag ? diag.survey.respondents : propSurveyCount
  const orgName = isDemo && diag ? diag.organization.name : (user?.organization_id ? 'TechVert Solutions' : 'Mon entreprise')

  const questionnaireSections: NavItem['children'] = [
    { key: 'bloc1', label: 'Votre démarche', path: '/client/questionnaire/bloc1', status: getBlockStatus(1) },
    { key: 'bloc2', label: 'Votre maturité', path: '/client/questionnaire/bloc2', status: getBlockStatus(2) },
    { key: 'bloc3', label: 'Vos enjeux', path: '/client/questionnaire/bloc3', status: getBlockStatus(3) },
    { key: 'bloc4', label: 'La perception', path: '/client/questionnaire/bloc4', status: getBlockStatus(4) },
  ]

  function getBlockStatus(block: number): string {
    const progress = questionnaireProgress.find(p => p.block === block)
    return progress?.status || 'not_started'
  }

  const diagnosticSections: NavItem[] = [
    { key: 'synthese', label: 'Synthèse éditoriale', path: '/client/diagnostic/1', icon: <FileText size={18} />, locked: !diagnosticUnlocked },
    { key: 'priorites', label: 'Ce que nous ferions', path: '/client/diagnostic/2', icon: <Target size={18} />, locked: !diagnosticUnlocked },
    { key: 'maturite', label: 'Score de maturité', path: '/client/diagnostic/3', icon: <BarChart3 size={18} />, locked: !diagnosticUnlocked },
    { key: 'ecarts', label: 'Écarts de perception', path: '/client/diagnostic/4', icon: <GitCompare size={18} />, locked: !diagnosticUnlocked },
    { key: 'capital', label: 'Capital humain', path: '/client/diagnostic/5', icon: <UserCheck size={18} />, locked: !diagnosticUnlocked },
    { key: 'empreinte', label: 'Empreinte carbone', path: '/client/diagnostic/6', icon: <Leaf size={18} />, locked: !diagnosticUnlocked },
    { key: 'echeances', label: 'Vos échéances', path: '/client/diagnostic/7', icon: <Calendar size={18} />, locked: !diagnosticUnlocked },
    { key: 'avancement', label: "Profil d'avancement", path: '/client/diagnostic/8', icon: <CheckSquare size={18} />, locked: !diagnosticUnlocked },
    { key: 'etapes', label: 'Prochaines étapes', path: '/client/diagnostic/9', icon: <ArrowRight size={18} />, locked: !diagnosticUnlocked },
  ]

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col bg-blanc overflow-y-auto"
      style={{
        width: 'var(--sidebar-width)',
        boxShadow: 'var(--shadow-sidebar)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: 'var(--color-celsius-900)' }}
          >
            C
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--color-celsius-900)' }}>
              Boussole Climat
            </div>
            <div className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>
              Projet Celsius
            </div>
          </div>
        </div>
      </div>

      {/* Organisation */}
      <div className="px-5 pb-3">
        <div className="font-semibold text-sm truncate">
          {orgName}
        </div>
      </div>

      {/* Analyste */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-gris-100)' }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
            style={{ backgroundColor: 'var(--color-celsius-800)' }}
          >
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{analyst.first_name}</div>
            <div className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>
              Votre analyste
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-3" style={{ borderTop: '1px solid var(--color-border-light)' }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {/* Questionnaire */}
        <div className="mb-1">
          <SidebarNavItem
            to="/client/questionnaire/bloc1"
            icon={<ClipboardList size={18} />}
            label="Questionnaire"
            active={location.pathname.startsWith('/client/questionnaire')}
          />
          {location.pathname.startsWith('/client/questionnaire') && (
            <div className="ml-8 mt-1 space-y-0.5">
              {questionnaireSections.map(child => (
                <NavLink
                  key={child.key}
                  to={child.path}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-[var(--color-gris-100)]"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-celsius-900)' : 'var(--color-texte-secondary)',
                    fontWeight: isActive ? 600 : 400,
                  })}
                >
                  <StatusDot status={child.status || 'not_started'} />
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Sondage */}
        <SidebarNavItem
          to="/client/sondage"
          icon={<Users size={18} />}
          label="Sondage interne"
          badge={surveyCount > 0 ? `${surveyCount}` : undefined}
          active={location.pathname === '/client/sondage'}
        />

        <div className="mx-2 my-3" style={{ borderTop: '1px solid var(--color-border-light)' }} />

        {/* Sections diagnostic */}
        <div className="label-uppercase px-3 mb-2">Votre diagnostic</div>
        {diagnosticSections.map(section => (
          <SidebarNavItem
            key={section.key}
            to={section.locked ? '#' : section.path}
            icon={section.locked ? <Lock size={16} className="opacity-40" /> : section.icon}
            label={section.label}
            locked={section.locked}
            active={location.pathname === section.path}
          />
        ))}
      </nav>

      <div className="mx-5 my-2" style={{ borderTop: '1px solid var(--color-border-light)' }} />

      {/* Bottom nav */}
      <div className="px-3 pb-4 space-y-0.5">
        <SidebarNavItem
          to="/client/journal"
          icon={<BookOpen size={18} />}
          label="Journal de bord"
          badge={hasNewJournal ? '•' : undefined}
          active={location.pathname === '/client/journal'}
        />
        <SidebarNavItem
          to="/client/messages"
          icon={<MessageSquare size={18} />}
          label="Messagerie"
          badge={hasNewMessages ? '•' : undefined}
          active={location.pathname === '/client/messages'}
        />
        <button
          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-gris-100)] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ color: 'var(--color-texte-secondary)' }}
          disabled={!diagnosticUnlocked}
          title={diagnosticUnlocked ? 'Exporter en PDF' : 'Disponible après la restitution'}
        >
          <Download size={18} />
          Exporter en PDF
        </button>
        <NavLink
          to="/client/aide"
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-gris-100)]"
          style={{ color: 'var(--color-texte-secondary)' }}
        >
          <HelpCircle size={18} />
          Aide
        </NavLink>
      </div>
    </aside>
  )
}

// --- Sub-components ---

function SidebarNavItem({
  to,
  icon,
  label,
  locked,
  active,
  badge,
}: {
  to: string
  icon: React.ReactNode
  label: string
  locked?: boolean
  active?: boolean
  badge?: string
}) {
  if (locked) {
    return (
      <div
        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-not-allowed opacity-50"
        style={{ color: 'var(--color-gris-400)' }}
      >
        {icon}
        <span className="truncate">{label}</span>
      </div>
    )
  }

  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg"
      style={{
        backgroundColor: active ? 'var(--color-celsius-50)' : 'transparent',
        color: active ? 'var(--color-celsius-900)' : 'var(--color-texte)',
        fontWeight: active ? 600 : 400,
      }}
    >
      <span style={{ color: active ? 'var(--color-celsius-900)' : 'var(--color-texte-secondary)' }}>
        {icon}
      </span>
      <span className="truncate flex-1">{label}</span>
      {badge && (
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: badge === '•' ? 'var(--color-corail-500)' : 'var(--color-celsius-100)',
            color: badge === '•' ? 'white' : 'var(--color-celsius-900)',
            minWidth: badge === '•' ? '8px' : undefined,
            height: badge === '•' ? '8px' : undefined,
          }}
        >
          {badge === '•' ? '' : badge}
        </span>
      )}
    </NavLink>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'var(--color-celsius-900)',
    in_progress: 'var(--color-corail-500)',
    not_started: 'var(--color-gris-300)',
  }
  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: colors[status] || colors.not_started }}
    />
  )
}
