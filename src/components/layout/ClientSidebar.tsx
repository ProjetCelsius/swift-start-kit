import { useState, useRef, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Check,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ChevronUp,
  User,
  Lock,
  Download,
  LogOut,
  LayoutGrid,
  FolderOpen,
  BarChart3,
} from 'lucide-react'
import celsiusLogo from '@/assets/celsius-logo.svg'
import clientAvatar from '@/assets/client-avatar.jpg'
import guillaumePhoto from '@/assets/guillaume-photo.png'
import { MOCK_ANALYST } from '../../hooks/useAuth'
import { useAuth } from '../../hooks/useAuth'
import { useDemoIfAvailable } from '../../hooks/useDemo'
import { useDiagnosticReading } from '../../hooks/useDiagnosticReading'
import HelpPanel from '../questionnaire/HelpPanel'
import { MonComptePanel, ChangePasswordPanel, ExportDataPanel, AideSupportPanel } from './AccountPanels'

// ── Types ──────────────────────────────
type StepStatus = 'done' | 'current' | 'parallel' | 'upcoming' | 'optional'

interface JourneyStep {
  id: string
  num: number
  label: string
  status: StepStatus
  meta: string
  subItems?: SubItem[]
  dashed?: boolean // dashed connector
}

interface SubItem {
  label: string
  path?: string
  status?: 'done' | 'in_progress' | 'todo'
  info?: boolean
}

const DIAG_SECTIONS = [
  { label: 'Synthèse éditoriale', slug: '1' },
  { label: 'Nos recommandations', slug: '2' },
  { label: 'Score de maturité', slug: '3' },
  { label: 'Écarts de perception', slug: '4' },
  { label: 'Moyens & ressources', slug: '5' },
  { label: 'Empreinte carbone', slug: '6' },
  { label: 'Échéancier réglementaire', slug: '7' },
  { label: 'Cartographie', slug: '8' },
  { label: 'Feuille de route', slug: '9' },
]

// ── Derive sidebar steps from demo status ──────
import type { DemoStatus } from '@/data/demoData'

function deriveSteps(demoStatus: DemoStatus | undefined, analyst: { first_name: string }, corpusValidated?: boolean): JourneyStep[] {
  const s = demoStatus || 'questionnaire'

  // Determine bloc statuses (now 3 blocs for questionnaire)
  const blocStatusMap: Record<string, Record<string, 'done' | 'in_progress' | 'todo'>> = {
    onboarding: { b1: 'todo', b2: 'todo', b3: 'todo' },
    questionnaire: { b1: 'done', b2: 'done', b3: 'in_progress' },
    survey_pending: { b1: 'done', b2: 'done', b3: 'done' },
    analysis: { b1: 'done', b2: 'done', b3: 'done' },
    ready_for_restitution: { b1: 'done', b2: 'done', b3: 'done' },
    delivered: { b1: 'done', b2: 'done', b3: 'done' },
  }
  const bs = blocStatusMap[s] || blocStatusMap.questionnaire

  // Perception RSE status
  const perceptionStatus: Record<string, 'done' | 'in_progress' | 'todo'> = {
    onboarding: 'todo',
    questionnaire: 'todo',
    survey_pending: 'in_progress',
    analysis: 'done',
    ready_for_restitution: 'done',
    delivered: 'done',
  }

  const sondageStatus: Record<string, 'done' | 'in_progress' | 'todo'> = {
    onboarding: 'todo',
    questionnaire: 'in_progress',
    survey_pending: 'in_progress',
    analysis: 'done',
    ready_for_restitution: 'done',
    delivered: 'done',
  }

  const entretienStatus: Record<string, 'done' | 'in_progress' | 'todo'> = {
    onboarding: 'todo',
    questionnaire: 'todo',
    survey_pending: 'todo',
    analysis: 'done',
    ready_for_restitution: 'done',
    delivered: 'done',
  }

  const doneBlocs = Object.values(bs).filter(v => v === 'done').length

  // Documents count and validation from demo data
  const docsCount: Record<string, number> = {
    onboarding: 0, questionnaire: 0, survey_pending: 0,
    analysis: 3, ready_for_restitution: 3, delivered: 5,
  }

  const perSt = perceptionStatus[s] || 'todo'
  const sonSt = sondageStatus[s] || 'todo'
  const entSt = entretienStatus[s] || 'todo'
  const sondPerDone = [perSt, sonSt, entSt].filter(v => v === 'done').length

  // Build step configs
  const isPostAnalysis = s === 'analysis' || s === 'ready_for_restitution' || s === 'delivered'
  const isPostQuestionnaire = s === 'survey_pending' || isPostAnalysis
  const allQDone = isPostQuestionnaire

  function questMeta() {
    if (allQDone) return 'Terminé'
    return `En cours — ${doneBlocs}/3 blocs`
  }

  function sondMeta() {
    if (isPostAnalysis) return `${sondPerDone}/3 ✓`
    if (s === 'survey_pending' || s === 'questionnaire') return '12/30 — en parallèle'
    return ''
  }

  const isDiagnosticReady = s === 'ready_for_restitution' || s === 'delivered'

  const steps: JourneyStep[] = [
    {
      id: 'appel', num: 1, label: 'Appel de lancement',
      status: s === 'onboarding' ? 'current' : 'done',
      meta: s === 'onboarding' ? 'À planifier' : 'Réalisé le 10 fév.',
    },
    {
      id: 'questionnaire', num: 2, label: 'Questionnaire',
      status: allQDone ? 'done' : s === 'onboarding' ? 'upcoming' : 'current',
      meta: s === 'onboarding' ? '' : questMeta(),
      subItems: [
        { label: 'Votre démarche', path: '/client/questionnaire/bloc1', status: bs.b1 },
        { label: 'Votre maturité', path: '/client/questionnaire/bloc2', status: bs.b2 },
        { label: 'Vos enjeux', path: '/client/questionnaire/bloc3', status: bs.b3 },
      ],
    },
    {
      id: 'sondage', num: 3, label: 'Sondages & Perception',
      status: isPostAnalysis ? 'done' : (s === 'questionnaire' || s === 'survey_pending') ? 'parallel' : 'upcoming',
      meta: sondMeta(),
      subItems: [
        { label: 'Perception RSE', path: '/client/perception', status: perSt },
        { label: 'Sondage interne', path: '/client/sondage', status: sonSt },
        { label: 'Entretien direction', path: '/client/entretiens', status: entSt },
      ],
    },
    {
      id: 'documents', num: 4, label: 'Documents',
      status: corpusValidated ? 'done' as StepStatus : 'optional' as StepStatus,
      meta: corpusValidated ? 'Corpus validé ✓' : (docsCount[s] || 0) > 0 ? `${docsCount[s]} fichier${(docsCount[s] || 0) > 1 ? 's' : ''} envoyé${(docsCount[s] || 0) > 1 ? 's' : ''}` : 'À compléter à tout moment',
      dashed: !corpusValidated,
      subItems: [],
    },
    {
      id: 'analyse', num: 5, label: 'Analyse',
      status: s === 'analysis' ? 'current' : isPostAnalysis ? 'done' : 'upcoming',
      meta: s === 'analysis' ? 'En cours' : (s === 'ready_for_restitution' || s === 'delivered') ? 'Terminée' : '',
      subItems: s === 'analysis' ? [{ label: `${analyst.first_name} travaille sur votre diagnostic`, info: true }] : undefined,
    },
    {
      id: 'restitution', num: 6, label: 'Votre diagnostic',
      status: s === 'delivered' ? 'done' : s === 'ready_for_restitution' ? 'current' : 'upcoming',
      meta: s === 'delivered' ? 'Fait ✓' : s === 'ready_for_restitution' ? 'À planifier' : 'Verrouillé',
      // Sub-items will be rendered with reading states, not green checks
      subItems: isDiagnosticReady ? DIAG_SECTIONS.map(sec => ({
        label: sec.label,
        path: `/client/diagnostic/${sec.slug}`,
        // status is irrelevant here, reading states are used instead
        status: 'todo' as const,
      })) : undefined,
    },
  ]

  return steps
}

export default function ClientSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const demo = useDemoIfAvailable()
  const [helpOpen, setHelpOpen] = useState(false)
  const { progress: readProgress } = useDiagnosticReading()

  const demoStatus = demo?.enabled ? demo.activeDiagnostic.status : undefined
  const corpusValidated = demo?.enabled ? demo.activeDiagnostic.documents?.corpus_validated : false
  const steps = useMemo(() => deriveSteps(demoStatus, analyst, corpusValidated), [demoStatus, analyst, corpusValidated])

  const isDashboard = location.pathname === '/client/dashboard'
  const isAppelLancement = location.pathname === '/client/appel-lancement'
  const isSynthesis = location.pathname === '/client/synthesis'
  const isDiagnosticReady = demoStatus === 'ready_for_restitution' || demoStatus === 'delivered'

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col overflow-y-auto"
      style={{ width: 'var(--sidebar-width)', backgroundColor: '#FFFFFF', borderRight: '1px solid #EDEAE3' }}
    >
      {/* ── BRANDING ── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 32, height: 32, borderRadius: 8, backgroundColor: '#1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.7rem', color: '#FFFFFF' }}>BC</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.88rem', color: '#1B4332', lineHeight: 1.2 }}>
              Boussole Climat
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0AB9F' }}>
              PAR CELSIUS
            </div>
          </div>
        </div>
      </div>

      {/* ── ANALYST CARD ── */}
      <div className="px-4 pb-3">
        <button
          onClick={() => { navigate('/client/analyste'); onNavigate?.() }}
          className="w-full flex items-center gap-3 text-left"
          style={{
            background: 'linear-gradient(135deg, #E8F0EB, white 60%, #F5EDE4)',
            border: '1px solid #EDEAE3', borderRadius: 8, padding: '11px 10px',
            cursor: 'pointer', transition: 'box-shadow 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(42,42,40,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          <img src={guillaumePhoto} alt={`${analyst.first_name} ${analyst.last_name}`}
            className="w-[34px] h-[34px] rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0AB9F' }}>
              VOTRE ANALYSTE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.78rem', color: '#2A2A28' }}>
              {analyst.first_name} {analyst.last_name}
            </div>
          </div>
        </button>
      </div>

      {/* ── VUE D'ENSEMBLE ── */}
      <div className="px-3 mb-1">
        <NavLink
          to="/client/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
          style={{
            padding: '7px 10px', borderRadius: 6,
            backgroundColor: isDashboard ? '#E8F0EB' : 'transparent',
            color: isDashboard ? '#1B4332' : '#2A2A28',
            fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: isDashboard ? 500 : 400,
            transition: 'background-color 0.15s',
          }}
        >
          <LayoutGrid size={15} />
          Vue d'ensemble
        </NavLink>
      </div>

      {/* ── SYNTHÈSE DU DIAGNOSTIC (always visible, styled by status) ── */}
      <div className="px-3 mb-2">
        <NavLink
          to="/client/synthesis"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
          style={{
            padding: '7px 10px', borderRadius: 6,
            backgroundColor: isSynthesis ? '#E8F0EB' : 'transparent',
            color: isSynthesis ? '#1B4332' : isDiagnosticReady ? '#2A2A28' : '#B0AB9F',
            fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
            fontWeight: isSynthesis ? 500 : 400,
            opacity: isDiagnosticReady ? 1 : demoStatus === 'analysis' ? 0.8 : 0.5,
            transition: 'background-color 0.15s',
          }}
        >
          <BarChart3 size={15} />
          Synthèse du diagnostic
          {demoStatus === 'analysis' && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B87333', marginLeft: 'auto', flexShrink: 0 }} />
          )}
        </NavLink>
      </div>

      {/* ── VERTICAL JOURNEY ── */}
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="px-3 pt-1 pb-2" style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F',
        }}>
          VOTRE PARCOURS
        </div>

        <div style={{ position: 'relative', paddingLeft: 6 }}>
          {steps.map((step, i) => {
            const isOptional = step.status === 'optional'
            const showSubs = step.status === 'done' || step.status === 'current' || step.status === 'parallel' || isOptional
            const isLast = i === steps.length - 1
            const isRestitution = step.id === 'restitution'

            // Determine line segment style between this step and next
            const lineSegment = !isLast ? (() => {
              const next = steps[i + 1]
              // Dashed connectors for Documents step
              if (step.dashed || next.dashed) return 'dashed'
              if (step.status === 'done' && (next.status === 'done' || next.status === 'current')) return 'done'
              if (next.status === 'parallel') return 'parallel'
              return 'upcoming'
            })() : null

            return (
              <div key={step.id} style={{ position: 'relative' }}>
                {/* Line segment */}
                {lineSegment && (
                  <div style={{
                    position: 'absolute',
                    left: 15.5,
                    top: 28,
                    bottom: 0,
                    width: 1.5,
                    ...(lineSegment === 'done' ? { backgroundColor: '#1B4332' } :
                      lineSegment === 'parallel' ? {
                        backgroundImage: 'repeating-linear-gradient(to bottom, #E5E1D8 0, #E5E1D8 3px, transparent 3px, transparent 6px)',
                      } :
                      lineSegment === 'dashed' ? {
                        backgroundImage: 'repeating-linear-gradient(to bottom, #E5E1D8 0, #E5E1D8 4px, transparent 4px, transparent 8px)',
                      } :
                      { backgroundColor: '#E5E1D8' }),
                  }} />
                )}

                {/* Step header */}
                {(() => {
                  const stepRoutes: Record<string, string> = {
                    appel: '/client/appel-lancement',
                    questionnaire: '/client/questionnaire/bloc1',
                    sondage: '/client/perception',
                    documents: '/client/documents',
                    analyse: '/client/dashboard',
                    restitution: '/client/synthesis',
                  }
                  const isClickable = step.status === 'done' || step.status === 'current' || step.status === 'parallel' || isOptional
                  const isStepActive = step.id === 'appel' && isAppelLancement
                  return (
                    <button
                      onClick={() => {
                        if (!isClickable) return
                        navigate(stepRoutes[step.id] || '/client/dashboard')
                        onNavigate?.()
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '8px 6px', textAlign: 'left',
                        background: 'none', border: 'none',
                        cursor: isClickable ? 'pointer' : 'default',
                        borderRadius: 6,
                        backgroundColor: isStepActive ? '#E8F0EB' : 'transparent',
                      }}
                    >
                      {/* Circle */}
                      {isOptional ? (
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          border: '1.5px dashed #EDEAE3',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FolderOpen size={10} style={{ color: '#B0AB9F' }} />
                        </div>
                      ) : (
                        <JourneyCircle status={step.status} num={step.num} />
                      )}

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-sans)', fontSize: '0.76rem',
                          fontWeight: step.status === 'current' || step.status === 'parallel' ? 500 : 400,
                          color: isOptional ? '#7A766D' : step.status === 'current' ? '#2A2A28' : step.status === 'parallel' ? '#2A2A28' : step.status === 'done' ? '#7A766D' : '#B0AB9F',
                        }}>
                          {step.label}
                        </div>
                        {step.meta && (
                          <div style={{
                            fontFamily: 'var(--font-sans)', fontSize: '0.6rem',
                            fontStyle: isOptional ? 'italic' : 'normal',
                            color: step.status === 'current' || step.status === 'parallel' ? '#B87333' : '#B0AB9F',
                          }}>
                            {step.meta}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })()}

                {/* Sub-items */}
                {showSubs && step.subItems && step.subItems.length > 0 && (
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

                      // For restitution sub-items, use reading states instead of green checks
                      if (isRestitution && isDiagnosticReady) {
                        const sectionSlug = sub.path?.split('/').pop() || ''
                        const readState = readProgress[sectionSlug] || 'locked'
                        const isReadLocked = readState === 'locked'
                        const isNouveau = readState === 'nouveau'

                        // Dot color based on reading state
                        const dotColor = readState === 'lu' ? '#7A766D' : isNouveau ? '#B87333' : '#E5E1D8'

                        return (
                          <button
                            key={si}
                            onClick={() => {
                              if (isReadLocked || !sub.path) return
                              navigate(sub.path)
                              onNavigate?.()
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                              padding: '5px 10px', borderRadius: 6, border: 'none',
                              backgroundColor: isActivePath ? '#E8F0EB' : 'transparent',
                              cursor: isReadLocked ? 'default' : 'pointer',
                              opacity: isReadLocked ? 0.4 : 1,
                              transition: 'background-color 0.15s', textAlign: 'left',
                            }}
                            onMouseEnter={e => { if (!isReadLocked && !isActivePath) e.currentTarget.style.backgroundColor = '#F0EDE6' }}
                            onMouseLeave={e => { if (!isActivePath) e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            {/* Section number */}
                            <span style={{
                              fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 600,
                              color: isReadLocked ? '#E5E1D8' : '#B0AB9F', width: 12, textAlign: 'right', flexShrink: 0,
                            }}>
                              {sectionSlug}
                            </span>

                            {/* Dot — cuivre for nouveau, neutral for lu */}
                            {isNouveau && (
                              <span style={{
                                width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                                backgroundColor: dotColor,
                                animation: 'sidebarPulse 2s ease-in-out infinite',
                              }} />
                            )}
                            {isReadLocked && <Lock size={10} style={{ color: '#B0AB9F', flexShrink: 0 }} />}

                            <span style={{
                              fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
                              fontWeight: isActivePath ? 500 : 400,
                              color: isActivePath ? '#1B4332' : isReadLocked ? '#B0AB9F' : '#2A2A28',
                              flex: 1,
                            }}>
                              {sub.label}
                            </span>
                          </button>
                        )
                      }

                      // Default sub-item rendering (questionnaire, sondage, etc.)
                      const isLocked = step.id === 'restitution' && step.status === 'upcoming'
                      const dotColor = sub.status === 'done' ? '#1B4332' : sub.status === 'in_progress' ? '#B87333' : '#E5E1D8'

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
                            padding: '5px 10px', borderRadius: 6, border: 'none',
                            backgroundColor: isActivePath ? '#E8F0EB' : 'transparent',
                            cursor: isLocked ? 'default' : 'pointer',
                            opacity: isLocked ? 0.4 : 1,
                            transition: 'background-color 0.15s', textAlign: 'left',
                          }}
                          onMouseEnter={e => { if (!isLocked && !isActivePath) e.currentTarget.style.backgroundColor = '#F0EDE6' }}
                          onMouseLeave={e => { if (!isActivePath) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                            backgroundColor: dotColor,
                            animation: sub.status === 'in_progress' ? 'sidebarPulse 2s ease-in-out infinite' : undefined,
                          }} />
                          {isLocked && <Lock size={10} style={{ color: '#B0AB9F', flexShrink: 0 }} />}
                          <span style={{
                            fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
                            fontWeight: isActivePath ? 500 : 400,
                            color: isActivePath ? '#1B4332' : isLocked ? '#B0AB9F' : '#2A2A28',
                            flex: 1,
                          }}>
                            {sub.label}
                          </span>
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

      {/* ── FOOTER ── */}
      <div className="px-3">
        <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 10px 8px' }} />
        <NavLink to="/client/aide" className="flex items-center gap-2 px-3 py-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
          <HelpCircle size={14} /> Aide
        </NavLink>

        <div style={{ height: 1, backgroundColor: '#EDEAE3', margin: '4px 0 12px' }} />
        <UserProfileBlock />
        <div className="flex items-center justify-center pt-3 pb-4" style={{ opacity: 0.35 }}>
          <img src={celsiusLogo} alt="Projet Celsius" style={{ height: 12 }} />
        </div>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

      <style>{`
        @keyframes sidebarPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </aside>
  )
}

// ── Journey circle (20px) ─────────────────────
function JourneyCircle({ status, num }: { status: StepStatus; num: number }) {
  if (status === 'done') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        backgroundColor: '#1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={11} color="#fff" strokeWidth={2.5} />
      </div>
    )
  }
  if (status === 'current') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: '2px solid #B87333', backgroundColor: '#F5EDE4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.55rem', color: '#B87333',
      }}>
        {num}
      </div>
    )
  }
  if (status === 'parallel') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: '1.5px dashed #B87333', backgroundColor: '#F5EDE4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.55rem', color: '#B87333',
      }}>
        {num}
      </div>
    )
  }
  // upcoming
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      border: '1.5px solid #E5E1D8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.55rem', color: '#B0AB9F',
    }}>
      {num}
    </div>
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
  const [activePanel, setActivePanel] = useState<'compte' | 'password' | 'export' | 'aide' | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const demo = useDemoIfAvailable()
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey) }
  }, [open])

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t) }, [toast])

  function openPanel(panel: 'compte' | 'password' | 'export' | 'aide') { setOpen(false); setActivePanel(panel) }
  async function handleLogout() { setOpen(false); demo?.setEnabled(false); await signOut(); navigate('/login') }

  const menuItems = [
    { icon: <User size={15} />, label: 'Mon compte', action: () => openPanel('compte') },
    { icon: <Lock size={15} />, label: 'Changer le mot de passe', action: () => openPanel('password') },
    { icon: <Download size={15} />, label: 'Exporter mes données', action: () => openPanel('export') },
    { icon: <HelpCircle size={15} />, label: 'Aide & support', action: () => openPanel('aide') },
  ]

  return (
    <>
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
            <img src={clientAvatar} alt="CL" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>Claire Lefèvre</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D', marginBottom: 4 }}>c.lefevre@republique.gouv.fr</div>
              <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, border: '1px solid #EDEAE3', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.6rem', color: '#7A766D' }}>Directrice Générale</span>
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
        <img src={clientAvatar} alt="CL" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.82rem', color: '#2A2A28' }}>Claire Lefèvre</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.7rem', color: '#B0AB9F' }}>République française</div>
        </div>
        <ChevronUp size={14} style={{ color: '#B0AB9F', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      <style>{`
        @keyframes popoverIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastFade { from { opacity: 0; transform: translate(-50%, -6px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>

    {/* Account panels */}
    <MonComptePanel open={activePanel === 'compte'} onClose={() => setActivePanel(null)} />
    <ChangePasswordPanel open={activePanel === 'password'} onClose={() => setActivePanel(null)} />
    <ExportDataPanel open={activePanel === 'export'} onClose={() => setActivePanel(null)} />
    <AideSupportPanel open={activePanel === 'aide'} onClose={() => setActivePanel(null)} />
    </>
  )
}
