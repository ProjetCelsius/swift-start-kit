import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Users, Compass, User, FolderOpen, Lock, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import { useDemoIfAvailable } from '../../hooks/useDemo'
import ProtocolModal, { useProtocolModal } from '../../components/ProtocolModal'
import guillaumePhoto from '../../assets/guillaume-photo.png'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import type { DemoStatus } from '@/data/demoData'

// ── Types ──────
type BlocStatus = 'done' | 'active' | 'todo'
interface QuestionnaireBloc {
  label: string
  route: string
  status: BlocStatus
  progress?: string
}

type StepStatus = 'done' | 'active' | 'parallel' | 'locked' | 'optional'
interface JourneyStep {
  num: number
  label: string
  detail: string
  status: StepStatus
  dashed?: boolean
}

// ── Derive state from demo status ──────
function deriveFromStatus(status: DemoStatus | undefined) {
  const s = status || 'questionnaire'

  // 3 blocs now (no more Perception in questionnaire)
  const blocConfigs: Record<string, QuestionnaireBloc[]> = {
    onboarding: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'todo' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'todo' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'todo' },
    ],
    questionnaire: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'active', progress: '3/7' },
    ],
    survey_pending: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
    ],
    analysis: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
    ],
    ready_for_restitution: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
    ],
    delivered: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
    ],
  }

  // Perception RSE status (separate from questionnaire now)
  const perceptionStatus: Record<string, 'done' | 'todo' | 'in_progress'> = {
    onboarding: 'todo', questionnaire: 'todo', survey_pending: 'in_progress',
    analysis: 'done', ready_for_restitution: 'done', delivered: 'done',
  }

  // 6-step stepper
  const isPostAnalysis = s === 'analysis' || s === 'ready_for_restitution' || s === 'delivered'
  const isPostQuestionnaire = s === 'survey_pending' || isPostAnalysis
  const allQDone = isPostQuestionnaire

  const doneBlocs = (blocConfigs[s] || blocConfigs.questionnaire).filter(b => b.status === 'done').length

  // Sondages & Perception progress
  const perSt = perceptionStatus[s] || 'todo'
  const sondageDone = isPostAnalysis
  const entretienDone = isPostAnalysis
  const sondPerDone = [perSt === 'done', sondageDone, entretienDone].filter(Boolean).length

  const stepConfigs: Record<string, JourneyStep[]> = {
    onboarding: [
      { num: 1, label: 'Lancement', detail: 'Aujourd\'hui', status: 'active' },
      { num: 2, label: 'Questionnaire', detail: '~2 jours', status: 'locked' },
      { num: 3, label: 'Sondages &\nPerception', detail: '~3 jours', status: 'locked' },
      { num: 4, label: 'Documents', detail: 'Optionnel', status: 'optional', dashed: true },
      { num: 5, label: 'Analyse', detail: '< 1 sem.', status: 'locked' },
      { num: 6, label: 'Restitution', detail: 'J+7', status: 'locked' },
    ],
    questionnaire: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: `${doneBlocs}/3 blocs`, status: 'active' },
      { num: 3, label: 'Sondages &\nPerception', detail: '12 réponses', status: 'parallel' },
      { num: 4, label: 'Documents', detail: 'Optionnel', status: 'optional', dashed: true },
      { num: 5, label: 'Analyse', detail: '< 1 sem.', status: 'locked' },
      { num: 6, label: 'Restitution', detail: 'J+7', status: 'locked' },
    ],
    survey_pending: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: `${doneBlocs}/3 blocs`, status: allQDone ? 'done' : 'active' },
      { num: 3, label: 'Sondages &\nPerception', detail: '12/30', status: 'parallel' },
      { num: 4, label: 'Documents', detail: 'Optionnel', status: 'optional', dashed: true },
      { num: 5, label: 'Analyse', detail: '< 1 sem.', status: 'locked' },
      { num: 6, label: 'Restitution', detail: 'J+7', status: 'locked' },
    ],
    analysis: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: 'Terminé', status: 'done' },
      { num: 3, label: 'Sondages &\nPerception', detail: 'Terminé', status: 'done' },
      { num: 4, label: 'Documents', detail: '3 fichiers', status: 'optional', dashed: true },
      { num: 5, label: 'Analyse', detail: 'En cours', status: 'active' },
      { num: 6, label: 'Restitution', detail: 'Bientôt', status: 'locked' },
    ],
    ready_for_restitution: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: 'Terminé', status: 'done' },
      { num: 3, label: 'Sondages &\nPerception', detail: 'Terminé', status: 'done' },
      { num: 4, label: 'Documents', detail: '3 fichiers', status: 'optional', dashed: true },
      { num: 5, label: 'Analyse', detail: 'Terminé', status: 'done' },
      { num: 6, label: 'Restitution', detail: 'À planifier', status: 'active' },
    ],
    delivered: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: 'Terminé', status: 'done' },
      { num: 3, label: 'Sondages &\nPerception', detail: 'Terminé', status: 'done' },
      { num: 4, label: 'Documents', detail: '5 fichiers', status: 'optional', dashed: true },
      { num: 5, label: 'Analyse', detail: 'Terminé', status: 'done' },
      { num: 6, label: 'Restitution', detail: 'Fait', status: 'done' },
    ],
  }

  const headerConfigs: Record<string, { title: string; subtitle: string }> = {
    onboarding: { title: 'prend forme.', subtitle: 'Commençons par un appel de lancement.' },
    questionnaire: { title: 'votre diagnostic prend forme.', subtitle: 'Encore quelques étapes et Guillaume prendra le relais.' },
    survey_pending: { title: 'avance bien.', subtitle: 'Le sondage est lancé, continuez le questionnaire.' },
    analysis: { title: 'tout est entre nos mains.', subtitle: 'Guillaume analyse vos résultats. Votre diagnostic sera prêt sous 48h.' },
    ready_for_restitution: { title: 'votre diagnostic est prêt.', subtitle: 'Planifiez votre appel de restitution.' },
    delivered: { title: 'merci pour votre confiance.', subtitle: 'Consultez vos 9 sections d\'analyse.' },
  }

  const surveyConfigs: Record<string, { count: number; target: number }> = {
    onboarding: { count: 0, target: 30 },
    questionnaire: { count: 12, target: 30 },
    survey_pending: { count: 12, target: 30 },
    analysis: { count: 34, target: 30 },
    ready_for_restitution: { count: 34, target: 30 },
    delivered: { count: 34, target: 30 },
  }

  const analystMessages: Record<string, string> = {
    onboarding: '« Bienvenue ! On se retrouve bientôt pour l\'appel de lancement. N\'hésitez pas si vous avez des questions. »',
    questionnaire: '« Vos deux premiers blocs sont très bien renseignés. Votre profil de maturité est intéressant — j\'ai hâte de voir la suite ! »',
    survey_pending: '« Le sondage est bien lancé ! Continuez à relancer vos équipes pour atteindre les 30 réponses. »',
    analysis: '« J\'ai bien reçu toutes vos réponses et celles de vos équipes. Je m\'y plonge — comptez 48h. »',
    ready_for_restitution: '« Votre diagnostic est finalisé. Prenons rendez-vous pour en discuter ? »',
    delivered: '« Votre diagnostic est disponible. N\'hésitez pas à me contacter si vous avez des questions. »',
  }

  const dgStatus: Record<string, 'pending' | 'done' | 'not_started'> = {
    onboarding: 'not_started',
    questionnaire: 'pending',
    survey_pending: 'pending',
    analysis: 'done',
    ready_for_restitution: 'done',
    delivered: 'done',
  }

  const header = headerConfigs[s] || headerConfigs.questionnaire
  const survey = surveyConfigs[s] || surveyConfigs.questionnaire

  // Profil Climat visibility
  const bloc2Done = (blocConfigs[s] || blocConfigs.questionnaire).filter(b => b.label === 'Votre maturité' && b.status === 'done').length > 0
  const bloc3Done = (blocConfigs[s] || blocConfigs.questionnaire).filter(b => b.label === 'Vos enjeux' && b.status === 'done').length > 0
  const profilClimatState: 'hidden' | 'teaser' | 'full' = !bloc2Done ? 'hidden' : !bloc3Done ? 'teaser' : 'full'

  return {
    blocs: blocConfigs[s] || blocConfigs.questionnaire,
    steps: stepConfigs[s] || stepConfigs.questionnaire,
    headerTitle: header.title,
    headerSubtitle: header.subtitle,
    surveyCount: survey.count,
    surveyTarget: survey.target,
    analystMessage: analystMessages[s] || analystMessages.questionnaire,
    diagnosticUnlocked: s === 'delivered',
    dgStatus: dgStatus[s] || 'not_started',
    isAnalysis: s === 'analysis',
    allSubmitted: s === 'analysis' || s === 'ready_for_restitution' || s === 'delivered',
    perceptionDone: perSt === 'done',
    sondPerDone,
    profilClimatState,
  }
}

export default function ClientHomeDashboard() {
  const { user } = useAuth()
  const demo = useDemoIfAvailable()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Claire'
  const protocol = useProtocolModal()

  const demoStatus = demo?.enabled ? demo.activeDiagnostic.status : undefined
  const derived = useMemo(() => deriveFromStatus(demoStatus), [demoStatus])

  const { blocs, steps, headerTitle, headerSubtitle, surveyCount, surveyTarget, analystMessage, diagnosticUnlocked, dgStatus, isAnalysis, perceptionDone, sondPerDone } = derived
  const doneCount = blocs.filter(b => b.status === 'done').length
  const allBlocsDone = blocs.every(b => b.status === 'done')
  const activeBloc = blocs.find(b => b.status === 'active')

  return (
    <div>
      <ProtocolModal open={protocol.open} onClose={() => protocol.setOpen(false)} />

      {/* ═══════ HEADER CARD ═══════ */}
      <div className="dash-fadein" style={{
        animationDelay: '0ms',
        backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
        padding: '28px 32px 20px', marginBottom: 20,
      }}>
        {/* Top row: greeting + analyst message */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <h1 className="font-display" style={{ fontSize: '1.55rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.3 }}>
              Bonjour {firstName},<br />
              <span>{headerTitle}</span>
            </h1>
            <p className="mt-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: '#7A766D' }}>
              {headerSubtitle}
            </p>
            <button
              onClick={() => protocol.setOpen(true)}
              className="mt-3 flex items-center gap-1.5"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: '#1B4332',
              }}
            >
              <Compass size={13} /> Notre méthodologie →
            </button>
          </div>

          {/* Analyst message bubble */}
          <div style={{
            maxWidth: 280, flexShrink: 0, padding: '14px 16px', borderRadius: 12,
            background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
            border: '1px solid #EDEAE3',
          }}>
            <div className="flex items-center gap-2.5 mb-2">
              <img src={guillaumePhoto} alt={analyst.first_name} className="w-[30px] h-[30px] rounded-full object-cover shrink-0" />
              <div>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.75rem', color: '#2A2A28' }}>{analyst.first_name} {analyst.last_name}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: '#B0AB9F', marginLeft: 6 }}>il y a 2h</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
              {analystMessage}
            </p>
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, backgroundColor: '#F0EDE6', marginBottom: 16 }} />

        {/* ── HORIZONTAL STEPPER (6 steps) ── */}
        <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em', fontSize: '0.5rem' }}>VOTRE PARCOURS</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '8px 20px 4px' }}>
          {steps.map((step, i) => {
            const isDone = step.status === 'done'
            const isActive = step.status === 'active'
            const isParallel = step.status === 'parallel'
            const isLocked = step.status === 'locked'
            const isOptional = step.status === 'optional'
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div style={{
                    flex: 1, height: 2, maxWidth: 80, marginTop: 14,
                    ...(step.dashed || steps[i - 1]?.dashed ? {
                      backgroundImage: 'repeating-linear-gradient(to right, #E5E1D8 0, #E5E1D8 4px, transparent 4px, transparent 8px)',
                      backgroundSize: '8px 2px',
                    } : {
                      backgroundColor: isDone || (isActive && steps[i - 1].status === 'done') ? '#1B4332' : '#E5E1D8',
                    }),
                  }} />
                )}
                <button
                  onClick={() => {
                    if (isLocked) return
                    const routes: Record<number, string> = {
                      1: '/client/appel-lancement',
                      2: '/client/questionnaire/bloc1',
                      3: '/client/perception',
                      4: '/client/documents',
                      5: '/client/dashboard',
                      6: '/client/synthesis',
                    }
                    navigate(routes[step.num] || '/client/dashboard')
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 70,
                    background: 'none', border: 'none', padding: 0,
                    cursor: isLocked ? 'default' : 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => { if (!isLocked) e.currentTarget.style.opacity = '0.7' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isDone ? '#1B4332' : isActive ? '#FFFFFF' : isParallel ? '#F5EDE4' : isOptional ? '#FFFFFF' : '#FFFFFF',
                    border: isDone ? 'none' : isActive ? '2px solid #1B4332' : isParallel ? '1.5px dashed #B87333' : isOptional ? '1.5px dashed #EDEAE3' : '1.5px solid #E5E1D8',
                    color: isDone ? '#FFFFFF' : isActive ? '#1B4332' : isParallel ? '#B87333' : isOptional ? '#B0AB9F' : '#B0AB9F',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.7rem',
                  }}>
                    {isDone ? <Check size={13} /> : isOptional ? <FolderOpen size={12} /> : step.num}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.6rem',
                      color: isDone ? '#1B4332' : isLocked ? '#B0AB9F' : isOptional ? '#7A766D' : '#2A2A28',
                      whiteSpace: 'pre-line', lineHeight: 1.2,
                    }}>
                      {step.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.52rem', color: isDone ? '#2D6A4F' : isActive ? '#B87333' : '#B0AB9F' }}>
                      {step.detail}
                    </div>
                  </div>
                </button>
              </React.Fragment>
            )
          })}
        </div>
      </div>




      {/* ═══════ DIAGNOSTIC TEASER ═══════ */}
      <div className="dash-fadein" style={{ animationDelay: '100ms', marginBottom: 20 }}>
        <DiagnosticTeaser
          diagnosticUnlocked={diagnosticUnlocked}
          isAnalysis={isAnalysis}
          allBlocsDone={allBlocsDone}
          sondPerDone={sondPerDone}
          doneCount={doneCount}
          
          navigate={navigate}
        />
      </div>

      {/* ═══════ THREE-COLUMN LAYOUT ═══════ */}
      <div className="dash-fadein" style={{ animationDelay: '200ms', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* ── QUESTIONNAIRE CARD (LEFT) ── */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 16,
          border: allBlocsDone ? '1px solid #EDEAE3' : '2px solid #B87333',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          animation: allBlocsDone ? 'none' : 'questionnaireGlow 3s ease-in-out infinite',
          position: 'relative',
        }}>
          {!allBlocsDone && (
            <div style={{
              height: 3, width: '100%',
              background: 'linear-gradient(90deg, #B87333, #1B4332, #B87333)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
            }} />
          )}

          <div style={{ padding: '20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 500, color: '#2A2A28' }}>Questionnaire</div>
              <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: allBlocsDone ? '#1B4332' : '#B87333' }}>
                {doneCount}/{blocs.length}
              </span>
            </div>

            <div style={{ height: 4, borderRadius: 2, backgroundColor: '#E5E1D8', overflow: 'hidden', marginBottom: 14 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, #B87333, #1B4332)',
                width: `${(doneCount / blocs.length) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {blocs.map((bloc, i) => {
                const isDone = bloc.status === 'done'
                const isActive = bloc.status === 'active'
                const isTodo = bloc.status === 'todo'
                return (
                  <div
                    key={i}
                    onClick={() => navigate(bloc.route)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                      borderRadius: 10, cursor: 'pointer',
                      backgroundColor: isActive ? '#F5EDE4' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDone ? '#E8F0EB' : '#F5EDE4' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? '#F5EDE4' : 'transparent' }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: isDone ? '#1B4332' : isActive ? '#B87333' : 'transparent',
                      border: isTodo ? '1.5px solid #E5E1D8' : 'none',
                    }}>
                      {isDone ? <Check size={12} color="#FFFFFF" /> :
                       isActive ? <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FFFFFF' }} /> :
                       null}
                    </div>
                    <div style={{
                      flex: 1, fontFamily: 'var(--font-sans)', fontWeight: isActive ? 500 : 400, fontSize: '0.82rem',
                      color: isDone ? '#7A766D' : isTodo ? '#7A766D' : '#2A2A28',
                    }}>
                      {bloc.label}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500,
                      color: isDone ? '#1B4332' : '#B87333',
                    }}>
                      {isDone ? 'Terminé ›' : isActive ? `${bloc.progress} ›` : 'À faire ›'}
                    </span>
                  </div>
                )
              })}
            </div>

            {!allBlocsDone && activeBloc ? (
              <button
                onClick={() => navigate(activeBloc.route)}
                style={{
                  marginTop: 14, width: '100%', padding: '11px 20px', borderRadius: 8,
                  backgroundColor: '#1B4332', color: '#fff',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.82rem',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                Reprendre « {activeBloc.label} » →
              </button>
            ) : allBlocsDone ? (
              <div style={{
                marginTop: 14, width: '100%', padding: '11px 20px', borderRadius: 8,
                backgroundColor: '#E8F0EB', textAlign: 'center',
                fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.82rem', color: '#1B4332',
              }}>
                Questionnaire terminé ✓
              </div>
            ) : null}
          </div>
        </div>

        {/* ── SONDAGES & PERCEPTION CARD (CENTER) ── */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
          padding: '20px 20px', display: 'flex', flexDirection: 'column',
        }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{
              width: 36, height: 36, borderRadius: 9, backgroundColor: '#E8F0EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Users size={18} color="#1B4332" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#2A2A28' }}>Sondages & Perception</div>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: 12,
              backgroundColor: sondPerDone === 3 ? '#E8F0EB' : '#F5EDE4',
              fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600,
              color: sondPerDone === 3 ? '#1B4332' : '#B87333',
            }}>
              {sondPerDone}/3
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', lineHeight: 1.5, marginBottom: 14 }}>
            Croisez les perspectives.
          </p>

          <SubItemButton
            onClick={() => navigate('/client/perception')}
            icon={<User size={14} color="#B87333" />}
            iconBg="#F5EDE4"
            label="Perception RSE"
            detail={perceptionDone ? 'Terminé' : 'À faire'}
            statusColor={perceptionDone ? '#1B4332' : '#B87333'}
            mb={8}
          />

          <SubItemButton
            onClick={() => navigate('/client/sondage')}
            icon={<Users size={14} color="#1B4332" />}
            iconBg="#E8F0EB"
            label="Sondage interne"
            detail={surveyCount >= surveyTarget ? 'Terminé' : `${surveyCount}/${surveyTarget}`}
            statusColor={surveyCount >= surveyTarget ? '#1B4332' : '#B87333'}
            mb={8}
          />

          <SubItemButton
            onClick={() => navigate('/client/entretiens')}
            icon={<User size={14} color="#1B4332" />}
            iconBg="#E8F0EB"
            label="Entretien direction"
            detail={dgStatus === 'done' ? 'Terminé' : 'En attente'}
            statusColor={dgStatus === 'done' ? '#1B4332' : '#B87333'}
          />
        </div>

        {/* ── DOCUMENTS CARD ── */}
        <div
          onClick={() => navigate('/client/documents')}
          style={{
            backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px dashed #EDEAE3',
            padding: '20px 20px', display: 'flex', flexDirection: 'column',
            cursor: 'pointer', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#B87333')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#EDEAE3')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div style={{
              width: 36, height: 36, borderRadius: 9, backgroundColor: '#F0EDE6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FolderOpen size={18} color="#7A766D" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 500, color: '#2A2A28' }}>Documents</div>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', lineHeight: 1.5, marginBottom: 8 }}>
            Transmettez les documents utiles à votre analyste.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#B0AB9F', fontStyle: 'italic' }}>
            0 fichier envoyé · Optionnel
          </p>
        </div>
      </div>

      <style>{`
        @keyframes dashFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dash-fadein { animation: dashFadeIn 0.5s ease-out both; }
        @keyframes questionnaireGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,115,51,0); }
          50% { box-shadow: 0 0 0 8px rgba(184,115,51,0.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes analysisPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes profilPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .diagnostic-teaser-card:hover {
          box-shadow: 0 4px 20px rgba(42,42,40,0.08), 0 0 0 1px rgba(184,115,51,0.12);
          border-color: #D5CFC5 !important;
        }
      `}</style>
    </div>
  )
}

// ── Reusable sub-item button ──
function SubItemButton({ onClick, icon, iconBg, label, detail, statusColor, mb }: {
  onClick: () => void; icon: React.ReactNode; iconBg: string; label: string; detail: string; statusColor: string; mb?: number
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        borderRadius: 10, border: '1px solid #EDEAE3', backgroundColor: '#FFFFFF',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'background-color 0.15s', marginBottom: mb || 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F7F5F0' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, backgroundColor: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.78rem', color: '#2A2A28' }}>{label}</div>
      </div>
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, color: statusColor,
      }}>
        {detail}
      </span>
    </button>
  )
}

// ── SVG Mini Radar for teaser ──
function MiniRadarSVG() {
  const dims = mockDiagnostic.section3.dimensions
  const sa = mockDiagnostic.section3.sectorAverages as Record<string, number>
  const w = 140, h = 120
  const cx = w / 2, cy = h / 2 + 2
  const r = 42

  const angles = [-90, 0, 90, 180].map(a => (a * Math.PI) / 180)
  function point(angle: number, value: number) {
    const ratio = value / 100
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) }
  }

  const levels = [50, 100]
  const clientPoints = dims.map((dim, i) => point(angles[i], dim.score))
  const sectorPoints = dims.map((dim, i) => point(angles[i], sa[dim.name] || 55))
  const clientPath = clientPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'
  const sectorPath = sectorPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'

  const dimLabels = [
    { short: 'Gouv.', idx: 0, anchor: 'middle' as const, dx: 0, dy: -6 },
    { short: 'Mesure', idx: 1, anchor: 'start' as const, dx: 5, dy: 3 },
    { short: 'Strat.', idx: 2, anchor: 'middle' as const, dx: 0, dy: 10 },
    { short: 'Culture', idx: 3, anchor: 'end' as const, dx: -5, dy: 3 },
  ]

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {levels.map(lev => {
        const pts = angles.map(a => point(a, lev))
        return <polygon key={lev} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#EDEAE3" strokeWidth={0.7} />
      })}
      {angles.map((a, i) => {
        const end = point(a, 100)
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#EDEAE3" strokeWidth={0.7} />
      })}
      <path d={sectorPath} fill="rgba(176,171,159,0.08)" stroke="#B0AB9F" strokeWidth={1} strokeDasharray="3 2" />
      <path d={clientPath} fill="rgba(27,67,50,0.1)" stroke="#1B4332" strokeWidth={1.5} />
      {dimLabels.map((lb) => {
        const p = point(angles[lb.idx], 100)
        const score = dims[lb.idx].score
        const scoreColor = dims[lb.idx].grade === 'A' || dims[lb.idx].grade === 'B' ? '#1B4332' : '#B87333'
        return (
          <g key={lb.idx}>
            <text x={p.x + lb.dx} y={p.y + lb.dy - 3} textAnchor={lb.anchor}
              style={{ fontSize: 8, fontFamily: 'var(--font-sans)', fontWeight: 500, fill: '#7A766D' }}>
              {lb.short}
            </text>
            <text x={p.x + lb.dx} y={p.y + lb.dy + 6} textAnchor={lb.anchor}
              style={{ fontSize: 9, fontFamily: 'var(--font-display)', fontWeight: 600, fill: scoreColor }}>
              {score}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Diagnostic Teaser Block (3 states) ──
function DiagnosticTeaser({ diagnosticUnlocked, isAnalysis, allBlocsDone, sondPerDone, doneCount, navigate }: {
  diagnosticUnlocked: boolean; isAnalysis: boolean; allBlocsDone: boolean; sondPerDone: number; doneCount: number; navigate: ReturnType<typeof useNavigate>
}) {
  const d = mockDiagnostic

  // ── STATE A: Diagnostic prêt ──
  if (diagnosticUnlocked) {
    const gaps = d.section4.perceptionData.map(item => ({ ...item, gap: Math.abs(item.rse - item.terrain) }))
    const maxGap = gaps.reduce((a, b) => a.gap > b.gap ? a : b)
    const circumference = 2 * Math.PI * 32
    const dashLen = (d.section3.globalScore / 100) * circumference
    const scoreColor = d.section3.globalGrade === 'A' ? '#1B4332' : d.section3.globalGrade === 'B' ? '#2D6A4F' : '#B87333'

    return (
      <button
        onClick={() => navigate('/client/synthesis')}
        className="diagnostic-teaser-card"
        style={{
          display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
          backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
          overflow: 'hidden', transition: 'all 250ms ease', position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D6A4F'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(42,42,40,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #1B4332, #B87333, #1B4332)', opacity: 0.6 }} />

        {/* 3-column content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', minHeight: 160 }}>
          {/* Left: Score */}
          <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 14, borderRight: '1px solid #EDEAE3' }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg viewBox="0 0 80 80" style={{ width: '100%', height: '100%' }}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#F0EDE6" strokeWidth="5" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="5"
                  strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                  strokeDashoffset={circumference * 0.25}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: '#2A2A28', lineHeight: 1 }}>
                  {d.section3.globalScore}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', color: '#B0AB9F' }}>/ 100</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 500, color: '#2A2A28', marginBottom: 4 }}>
                Score de maturité
              </div>
              <div className="flex items-center gap-1.5" style={{ marginBottom: 4 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 22, height: 22, borderRadius: 5, backgroundColor: '#E8F0EB',
                  fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 600, color: '#1B4332',
                }}>{d.section3.globalGrade}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#7A766D' }}>
                  Structuré — au-dessus de la moyenne sectorielle
                </span>
              </div>
            </div>
          </div>

          {/* Center: Mini radar */}
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #EDEAE3' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.48rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 2 }}>
              4 DIMENSIONS
            </div>
            <MiniRadarSVG />
          </div>

          {/* Right: Profil Climat */}
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.48rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 6 }}>
              PROFIL CLIMAT
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500, color: '#1B4332', letterSpacing: '0.08em', marginBottom: 4 }}>
              {d.client.profilClimat.code.split('').join(' · ')}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 400, color: '#2A2A28', marginBottom: 6 }}>
              {d.client.profilClimat.name}
            </div>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 4,
              backgroundColor: '#E8F0EB', fontFamily: 'var(--font-sans)', fontSize: '0.56rem',
              fontWeight: 600, color: '#1B4332', textTransform: 'uppercase', letterSpacing: '0.05em',
              alignSelf: 'flex-start',
            }}>
              {d.client.profilClimat.family}
            </span>
          </div>
        </div>

        {/* 3 mini-insights strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #EDEAE3' }}>
          {[
            { icon: <AlertTriangle size={14} />, iconBg: '#FEF2F2', iconColor: '#DC4A4A', label: 'ALERTE PERCEPTION', value: `–${maxGap.gap.toFixed(1)} pts sur « ${maxGap.label} »` },
            { icon: <CheckCircle size={14} />, iconBg: '#E8F0EB', iconColor: '#1B4332', label: 'PRIORITÉ N°1', value: 'Reporting trimestriel COMEX' },
            { icon: <Clock size={14} />, iconBg: '#F5EDE4', iconColor: '#B87333', label: 'ÉCHÉANCE URGENTE', value: 'CSRD — Juin 2026' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5" style={{
              padding: '14px 16px',
              borderRight: i < 2 ? '1px solid #EDEAE3' : 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7, backgroundColor: item.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.iconColor, flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.48rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: item.iconColor, marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, color: '#2A2A28' }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderTop: '1px solid #EDEAE3',
          backgroundColor: 'rgba(232,240,235,0.25)',
        }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 500, color: '#2A2A28' }}>
              Votre diagnostic est prêt
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#B0AB9F', marginLeft: 10 }}>
              9 sections d'analyse personnalisées vous attendent.
            </span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 8, backgroundColor: '#1B4332', color: '#FFFFFF',
            fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600,
          }}>
            Consulter le diagnostic <ChevronRight size={14} />
          </span>
        </div>
      </button>
    )
  }

  // ── STATE B: Analyse en cours ──
  if (isAnalysis) {
    return (
      <div style={{
        position: 'relative', minHeight: 280, borderRadius: 16, border: '1px solid #EDEAE3',
        overflow: 'hidden', backgroundColor: '#FFFFFF',
      }}>
        {/* Blurred blobs */}
        <div style={{ position: 'absolute', inset: 0, filter: 'blur(14px)', opacity: 0.25, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(27,67,50,0.2)', top: '15%', left: '15%' }} />
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(184,115,51,0.15)', top: '25%', right: '20%' }} />
          <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(45,106,79,0.15)', bottom: '15%', left: '40%' }} />
        </div>

        {/* Overlay */}
        <div style={{
          position: 'relative', zIndex: 1,
          backgroundColor: 'rgba(247,245,240,0.88)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '36px 32px', textAlign: 'center', minHeight: 280,
        }}>
          {/* Analyst photo with pulse */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%', border: '2px solid #1B4332',
            overflow: 'hidden', marginBottom: 16,
            animation: 'teaserPulse 2s ease-in-out infinite',
          }}>
            <img src={guillaumePhoto} alt="Guillaume Pakula" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28', margin: '0 0 8px' }}>
            Guillaume analyse vos résultats
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', maxWidth: 400, margin: '0 0 20px', lineHeight: 1.5 }}>
            Toutes vos réponses ont été reçues. Votre diagnostic personnalisé sera prêt sous 48h.
          </p>

          {/* Step pills — ALL done (green) */}
          <div className="flex items-center gap-1.5" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Lancement', 'Questionnaire', 'Sondages', 'Documents', 'Données reçues'].map((label) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 6,
                backgroundColor: '#E8F0EB', border: '1px solid rgba(45,106,79,0.13)',
                fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, color: '#1B4332',
              }}>
                <Check size={10} /> {label}
              </span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes teaserPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(27,67,50,0.2); }
            50% { box-shadow: 0 0 0 12px rgba(27,67,50,0); }
          }
        `}</style>
      </div>
    )
  }

  // ── STATE C: Verrouillé ──
  const completedSteps = 1 + (allBlocsDone ? 1 : 0) + (sondPerDone === 3 ? 1 : 0)
  const totalSteps = 5
  const progressPct = (completedSteps / totalSteps) * 100
  const stepPills = [
    { label: 'Lancement', status: 'done' as const },
    { label: 'Questionnaire', status: allBlocsDone ? 'done' as const : doneCount > 0 ? 'current' as const : 'pending' as const },
    { label: 'Sondages', status: sondPerDone === 3 ? 'done' as const : sondPerDone > 0 ? 'current' as const : 'pending' as const },
    { label: 'Documents', status: 'pending' as const },
    { label: 'Analyse', status: 'pending' as const },
  ]

  return (
    <div style={{
      position: 'relative', minHeight: 280, borderRadius: 16, border: '1px solid #EDEAE3',
      overflow: 'hidden', backgroundColor: '#FFFFFF',
    }}>
      {/* Blurred blobs */}
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(14px)', opacity: 0.25, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(27,67,50,0.15)', top: '15%', left: '20%' }} />
        <div style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', background: 'rgba(184,115,51,0.1)', bottom: '20%', right: '25%' }} />
      </div>

      {/* Overlay */}
      <div style={{
        position: 'relative', zIndex: 1,
        backgroundColor: 'rgba(247,245,240,0.88)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '36px 32px', textAlign: 'center', minHeight: 280,
      }}>
        {/* Lock icon */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F5EDE4, #F0EDE6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Lock size={22} color="#B87333" strokeWidth={1.5} />
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28', margin: '0 0 8px' }}>
          Votre diagnostic en 9 sections
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', maxWidth: 400, margin: '0 0 20px', lineHeight: 1.5 }}>
          Complétez les étapes restantes pour débloquer votre analyse personnalisée.
        </p>

        {/* Progress bar — inverted gradient cuivre→green */}
        <div style={{ width: 220, height: 4, borderRadius: 2, backgroundColor: '#EDEAE3', overflow: 'hidden', marginBottom: 8 }}>
          <div style={{
            height: '100%', width: `${progressPct}%`, borderRadius: 2,
            background: 'linear-gradient(90deg, #B87333, #1B4332)',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: '#B0AB9F', margin: '0 0 16px' }}>
          {completedSteps}/{totalSteps} étapes complétées
        </p>

        {/* Step pills */}
        <div className="flex items-center gap-1.5" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {stepPills.map((pill) => (
            <span key={pill.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 6,
              backgroundColor: pill.status === 'done' ? '#E8F0EB' : pill.status === 'current' ? '#F5EDE4' : '#F0EDE6',
              border: `1px solid ${pill.status === 'done' ? 'rgba(45,106,79,0.13)' : pill.status === 'current' ? 'rgba(184,115,51,0.13)' : '#EDEAE3'}`,
              fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500,
              color: pill.status === 'done' ? '#1B4332' : pill.status === 'current' ? '#B87333' : '#B0AB9F',
            }}>
              {pill.status === 'done' ? <><Check size={10} /> {pill.label}</> :
               pill.status === 'current' ? <>◉ {pill.label}</> :
               pill.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
