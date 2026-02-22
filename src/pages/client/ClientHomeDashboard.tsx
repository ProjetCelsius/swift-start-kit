import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check, Users, Lock, Compass, User, FolderOpen } from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import { useDemoIfAvailable } from '../../hooks/useDemo'
import ProtocolModal, { useProtocolModal } from '../../components/ProtocolModal'
import guillaumePhoto from '../../assets/guillaume-photo.png'
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
                      6: '/client/diagnostic/1',
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
        <div
          className="diagnostic-teaser-card"
          style={{
            position: 'relative', minHeight: diagnosticUnlocked ? 'auto' : 260, borderRadius: 18,
            overflow: 'hidden',
            border: diagnosticUnlocked ? '1px solid #EDEAE3' : '1px solid #E5E1D8',
            backgroundColor: diagnosticUnlocked ? '#FFFFFF' : '#F0EDE6',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}>
          {diagnosticUnlocked ? (
            <div style={{ padding: '32px 36px' }}>
              <div className="font-display" style={{ fontSize: '1.3rem', color: '#2A2A28', fontWeight: 400, marginBottom: 12 }}>
                Votre diagnostic est prêt
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 20 }}>
                9 sections d'analyse personnalisées vous attendent.
              </p>
              <button
                onClick={() => navigate('/client/diagnostic')}
                style={{
                  padding: '11px 24px', borderRadius: 8, backgroundColor: '#1B4332', color: '#fff',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Consulter le diagnostic <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* Abstract blurred visualization */}
              <div style={{ position: 'absolute', inset: 0, filter: 'blur(14px)', opacity: 0.5, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(27,67,50,0.3) 0%, transparent 70%)', top: 20, left: '10%' }} />
                <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,115,51,0.25) 0%, transparent 70%)', top: 40, right: '15%' }} />
                <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,106,79,0.2) 0%, transparent 70%)', bottom: 30, left: '40%' }} />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(240,237,230,0.7)' }}>
                {isAnalysis ? (
                  <>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%', marginBottom: 14,
                      background: 'linear-gradient(135deg, #F5EDE4, #F0EDE6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'analysisPulse 2s ease-in-out infinite',
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', backgroundColor: '#1B4332',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.65rem', color: '#FFFFFF',
                      }}>GP</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem', color: '#B87333', marginBottom: 6 }}>
                      Analyse en cours
                    </div>
                  </>
                ) : (
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', marginBottom: 14,
                    background: 'linear-gradient(135deg, #F5EDE4, #F0EDE6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Lock size={22} color="#B87333" strokeWidth={1.5} />
                  </div>
                )}

                <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2A2A28', marginBottom: 6, textAlign: 'center' }}>
                  Votre diagnostic en 9 sections
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', marginBottom: 16, textAlign: 'center' }}>
                  {isAnalysis ? 'Guillaume est en train d\'analyser vos résultats.' : 'Complétez les étapes pour déverrouiller votre analyse complète.'}
                </p>

                {/* Progress bar */}
                <div style={{ width: 200, height: 6, borderRadius: 3, backgroundColor: '#E5E1D8', overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: 'linear-gradient(90deg, #B87333, #1B4332)',
                    width: `${(() => {
                      const pillsDone = [allBlocsDone, sondPerDone === 3].filter(Boolean).length
                      return (pillsDone / 2) * 100
                    })()}%`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>

                {/* Step pills — updated */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { label: 'Questionnaire', done: allBlocsDone, route: '/client/questionnaire/bloc1', detail: allBlocsDone ? 'Terminé' : `${doneCount}/${blocs.length} blocs` },
                    { label: 'Sondages & Perception', done: sondPerDone === 3, route: '/client/perception', detail: sondPerDone === 3 ? 'Terminé' : `${sondPerDone}/3` },
                    { label: 'Documents', done: false, route: '/client/documents', detail: 'Optionnel', muted: true },
                  ].map((pill, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(pill.route)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '5px 14px', borderRadius: 20,
                        backgroundColor: pill.done ? '#E8F0EB' : pill.muted ? '#F0EDE6' : '#F5EDE4',
                        border: `1px solid ${pill.done ? '#2D6A4F33' : pill.muted ? '#EDEAE3' : '#B8733333'}`,
                        fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500,
                        color: pill.done ? '#1B4332' : pill.muted ? '#B0AB9F' : '#B87333',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      {pill.done ? <Check size={10} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: pill.muted ? '#B0AB9F' : '#B87333', flexShrink: 0 }} />}
                      <span>{pill.label}</span>
                      <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>· {pill.detail}</span>
                      <ChevronRight size={10} style={{ opacity: 0.5 }} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
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
