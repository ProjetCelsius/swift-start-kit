import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check, Users, Lock, Compass, Calendar, BookOpen, Sparkles } from 'lucide-react'
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

type StepStatus = 'done' | 'active' | 'locked'
interface JourneyStep {
  num: number
  label: string
  detail: string
  status: StepStatus
}

// ── Derive state from demo status ──────
function deriveFromStatus(status: DemoStatus | undefined): {
  blocs: QuestionnaireBloc[]
  steps: JourneyStep[]
  headerTitle: string
  headerSubtitle: string
  surveyCount: number
  surveyTarget: number
  analystMessage: string
  showDiagnosticPreview: boolean
  diagnosticUnlocked: boolean
} {
  const s = status || 'questionnaire'

  // Default questionnaire state per status
  const blocConfigs: Record<string, QuestionnaireBloc[]> = {
    onboarding: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'todo' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'todo' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'todo' },
      { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'todo' },
    ],
    questionnaire: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'active', progress: '3/7' },
      { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'todo' },
    ],
    survey_pending: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
      { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'active', progress: '5/8' },
    ],
    analysis: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
      { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'done' },
    ],
    ready_for_restitution: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
      { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'done' },
    ],
    delivered: [
      { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
      { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
      { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'done' },
      { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'done' },
    ],
  }

  const stepConfigs: Record<string, JourneyStep[]> = {
    onboarding: [
      { num: 1, label: 'Lancement', detail: 'Aujourd\'hui', status: 'active' },
      { num: 2, label: 'Questionnaire', detail: '~2 jours', status: 'locked' },
      { num: 3, label: 'Sondage', detail: '~3 jours', status: 'locked' },
      { num: 4, label: 'Analyse', detail: '< 1 sem.', status: 'locked' },
      { num: 5, label: 'Restitution', detail: 'J+7', status: 'locked' },
    ],
    questionnaire: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: '2/4 blocs', status: 'active' },
      { num: 3, label: 'Sondage', detail: 'À lancer', status: 'active' },
      { num: 4, label: 'Analyse', detail: '< 1 sem.', status: 'locked' },
      { num: 5, label: 'Restitution', detail: 'J+7', status: 'locked' },
    ],
    survey_pending: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: '3/4 blocs', status: 'active' },
      { num: 3, label: 'Sondage', detail: '12/30', status: 'active' },
      { num: 4, label: 'Analyse', detail: '< 1 sem.', status: 'locked' },
      { num: 5, label: 'Restitution', detail: 'J+7', status: 'locked' },
    ],
    analysis: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: 'Terminé', status: 'done' },
      { num: 3, label: 'Sondage', detail: 'Terminé', status: 'done' },
      { num: 4, label: 'Analyse', detail: 'En cours', status: 'active' },
      { num: 5, label: 'Restitution', detail: 'Bientôt', status: 'locked' },
    ],
    ready_for_restitution: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: 'Terminé', status: 'done' },
      { num: 3, label: 'Sondage', detail: 'Terminé', status: 'done' },
      { num: 4, label: 'Analyse', detail: 'Terminé', status: 'done' },
      { num: 5, label: 'Restitution', detail: 'À planifier', status: 'active' },
    ],
    delivered: [
      { num: 1, label: 'Lancement', detail: 'Fait', status: 'done' },
      { num: 2, label: 'Questionnaire', detail: 'Terminé', status: 'done' },
      { num: 3, label: 'Sondage', detail: 'Terminé', status: 'done' },
      { num: 4, label: 'Analyse', detail: 'Terminé', status: 'done' },
      { num: 5, label: 'Restitution', detail: 'Fait', status: 'done' },
    ],
  }

  const headerConfigs: Record<string, { title: string; subtitle: string }> = {
    onboarding: { title: 'prend forme.', subtitle: 'Commençons par un appel de lancement.' },
    questionnaire: { title: 'prend forme.', subtitle: 'Encore quelques étapes et Guillaume prendra le relais.' },
    survey_pending: { title: 'avance bien.', subtitle: 'Le sondage est lancé, continuez le questionnaire.' },
    analysis: { title: 'est en cours d\'analyse.', subtitle: 'Guillaume analyse vos réponses, patience !' },
    ready_for_restitution: { title: 'est prêt !', subtitle: 'Planifiez votre appel de restitution.' },
    delivered: { title: 'est disponible.', subtitle: 'Consultez vos 9 sections d\'analyse.' },
  }

  const surveyConfigs: Record<string, { count: number; target: number }> = {
    onboarding: { count: 0, target: 30 },
    questionnaire: { count: 0, target: 30 },
    survey_pending: { count: 12, target: 30 },
    analysis: { count: 34, target: 30 },
    ready_for_restitution: { count: 34, target: 30 },
    delivered: { count: 34, target: 30 },
  }

  const analystMessages: Record<string, string> = {
    onboarding: '« Bienvenue ! On se retrouve bientôt pour l\'appel de lancement. N\'hésitez pas si vous avez des questions. »',
    questionnaire: '« Vos deux premiers blocs sont très bien renseignés. Votre profil de maturité est intéressant — j\'ai hâte de voir la suite ! »',
    survey_pending: '« Le sondage est bien lancé ! Continuez à relancer vos équipes pour atteindre les 30 réponses. »',
    analysis: '« J\'ai commencé l\'analyse croisée de vos réponses. Les résultats sont très intéressants, je vous en dis plus bientôt. »',
    ready_for_restitution: '« Votre diagnostic est finalisé ! Prenons rendez-vous pour la restitution en visio. »',
    delivered: '« Votre diagnostic est disponible. N\'hésitez pas à me contacter si vous avez des questions. »',
  }

  const header = headerConfigs[s] || headerConfigs.questionnaire
  const survey = surveyConfigs[s] || surveyConfigs.questionnaire

  return {
    blocs: blocConfigs[s] || blocConfigs.questionnaire,
    steps: stepConfigs[s] || stepConfigs.questionnaire,
    headerTitle: header.title,
    headerSubtitle: header.subtitle,
    surveyCount: survey.count,
    surveyTarget: survey.target,
    analystMessage: analystMessages[s] || analystMessages.questionnaire,
    showDiagnosticPreview: true,
    diagnosticUnlocked: s === 'delivered',
  }
}

function getQuestionnaireState(blocs: QuestionnaireBloc[]) {
  const allDone = blocs.every(b => b.status === 'done')
  const anyStarted = blocs.some(b => b.status === 'done' || b.status === 'active')
  if (allDone) return 'completed'
  if (anyStarted) return 'in_progress'
  return 'not_started'
}

export default function ClientHomeDashboard() {
  const { user } = useAuth()
  const demo = useDemoIfAvailable()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Claire'
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const protocol = useProtocolModal()

  // Derive all state from demo status
  const demoStatus = demo?.enabled ? demo.activeDiagnostic.status : undefined
  const derived = useMemo(() => deriveFromStatus(demoStatus), [demoStatus])

  const { blocs, steps, headerTitle, headerSubtitle, surveyCount, surveyTarget, analystMessage, diagnosticUnlocked } = derived
  const qState = getQuestionnaireState(blocs)
  const doneCount = blocs.filter(b => b.status === 'done').length

  // Determine which cards are locked based on status
  // Sondage + Questionnaire run in PARALLEL — both available from 'questionnaire' onwards
  // Only Analyse (needs everything submitted) and Restitution/Diagnostic (needs analysis done) are locked
  const isSondageAvailable = !!demoStatus && demoStatus !== 'onboarding'
  const isAnalysisOrLater = demoStatus === 'analysis' || demoStatus === 'ready_for_restitution' || demoStatus === 'delivered'
  const isRestitutionReady = demoStatus === 'ready_for_restitution' || demoStatus === 'delivered'

  return (
    <div>
      <ProtocolModal open={protocol.open} onClose={() => protocol.setOpen(false)} />

      {/* ═══════ UNIFIED HEADER + STEPPER BLOCK ═══════ */}
      <div className="dash-fadein" style={{
        animationDelay: '0ms',
        backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
        padding: '28px 32px 20px', marginBottom: 20,
      }}>
        {/* Top row: title + analyst message */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <h1 className="font-display" style={{ fontSize: '1.65rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.3 }}>
              Bonjour {firstName},<br />
              <span>votre diagnostic </span>
              <span style={{ color: '#1B4332', fontWeight: 500 }}>{headerTitle}</span>
            </h1>
            <p className="mt-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D' }}>
              {headerSubtitle}
            </p>
            {/* Méthodologie — small inline link */}
            <button
              onClick={() => protocol.setOpen(true)}
              className="mt-3 flex items-center gap-1.5"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: '#2D6A4F',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B4332'}
              onMouseLeave={e => e.currentTarget.style.color = '#2D6A4F'}
            >
              <Compass size={13} /> Notre méthodologie →
            </button>
          </div>

          {/* Analyst message — top right */}
          <div style={{
            maxWidth: 280, flexShrink: 0, padding: '14px 16px', borderRadius: 12,
            background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
            border: '1px solid #EDEAE3',
          }}>
            <div className="flex items-center gap-2.5 mb-2">
              <img src={guillaumePhoto} alt={`${analyst.first_name} ${analyst.last_name}`} className="w-[30px] h-[30px] rounded-full object-cover shrink-0" />
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

        {/* Stepper */}
        <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em', fontSize: '0.5rem' }}>VOTRE PARCOURS</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '8px 0 4px' }}>
          {steps.map((step, i) => {
            const isDone = step.status === 'done'
            const isActive = step.status === 'active'
            const isLocked = step.status === 'locked'
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div style={{
                    flex: 1, height: 2, maxWidth: 64, marginTop: 17, /* Aligns to center of 34px circles */
                    backgroundColor: isDone || (isActive && steps[i - 1].status === 'done') ? '#1B4332' : '#E5E1D8',
                  }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 80 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isDone ? '#1B4332' : isActive ? '#FFFFFF' : '#FFFFFF',
                    border: `2px solid ${isDone ? '#1B4332' : isActive ? '#1B4332' : '#E5E1D8'}`,
                    color: isDone ? '#FFFFFF' : isActive ? '#1B4332' : '#B0AB9F',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.78rem',
                  }}>
                    {isDone ? <Check size={15} /> : step.num}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.65rem', color: isDone ? '#1B4332' : isLocked ? '#B0AB9F' : '#2A2A28' }}>
                      {step.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', color: isDone ? '#2D6A4F' : '#B0AB9F' }}>
                      {step.detail}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* ═══════ TWO-COLUMN LAYOUT ═══════ */}
      <div className="dash-fadein" style={{ animationDelay: '100ms', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* ── LEFT: Action cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ActionCard
            label="SONDAGE"
            title={!isSondageAvailable ? 'Sondage interne' : surveyCount >= surveyTarget ? 'Sondage complété ✓' : surveyCount > 0 ? 'Relancer vos équipes' : 'Lancer le sondage'}
            subtitle={isSondageAvailable ? `${surveyCount} réponses sur ${surveyTarget}` : 'Disponible après le lancement'}
            icon={<Users size={18} color={isSondageAvailable ? '#B87333' : '#7A766D'} />}
            iconBg={isSondageAvailable ? '#F5EDE4' : '#F7F5F0'}
            hovered={hoveredCard === 'sondage'}
            onHover={v => setHoveredCard(v ? 'sondage' : null)}
            onClick={() => navigate('/client/sondage')}
            locked={!isSondageAvailable}
          />
          <ActionCard
            label="PLANNING"
            title="Planifier la restitution"
            subtitle={isRestitutionReady ? 'Choisissez un créneau' : 'Disponible après l\'analyse'}
            icon={<Calendar size={18} color={isRestitutionReady ? '#1B4332' : '#7A766D'} />}
            iconBg={isRestitutionReady ? '#E8F0EB' : '#F7F5F0'}
            hovered={hoveredCard === 'planning'}
            onHover={v => setHoveredCard(v ? 'planning' : null)}
            onClick={() => {}}
            locked={!isRestitutionReady}
          />
          <ActionCard
            label="JOURNAL"
            title="Journal de bord"
            subtitle="Suivi en temps réel"
            icon={<BookOpen size={18} color="#1B4332" />}
            iconBg="#E8F0EB"
            hovered={hoveredCard === 'journal'}
            onHover={v => setHoveredCard(v ? 'journal' : null)}
            onClick={() => navigate('/client/journal')}
          />
        </div>

        {/* ── RIGHT: Questionnaire block ── */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {qState === 'not_started' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(184,115,51,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{
                width: 60, height: 60, borderRadius: '50%', marginBottom: 14,
                background: 'linear-gradient(135deg, #B87333 0%, #E8A66A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(184,115,51,0.25), 0 0 60px rgba(184,115,51,0.10)',
              }}>
                <Sparkles size={26} color="#FFFFFF" />
              </div>
              <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: '#2A2A28', marginBottom: 6 }}>
                Commencez votre questionnaire
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', maxWidth: 240, lineHeight: 1.5, marginBottom: 18 }}>
                4 blocs thématiques, à votre rythme. Sauvegarde automatique.
              </p>
              <button onClick={() => navigate('/client/questionnaire/bloc1')} style={{
                padding: '11px 24px', borderRadius: 8, backgroundColor: '#1B4332', color: '#fff',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Démarrer <ChevronRight size={16} />
              </button>
            </div>
          ) : qState === 'in_progress' ? (
            <div style={{ padding: '20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Header — simple title + progress bar */}
              <div style={{ marginBottom: 16 }}>
                <div className="font-display" style={{ fontSize: '1rem', fontWeight: 500, color: '#2A2A28', marginBottom: 4 }}>Questionnaire</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E5E1D8', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, backgroundColor: '#1B4332',
                      width: `${(doneCount / blocs.length) * 100}%`,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: '#1B4332', flexShrink: 0 }}>
                    {doneCount}/{blocs.length}
                  </span>
                </div>
              </div>
              {/* Bloc list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, justifyContent: 'center' }}>
                {blocs.map((bloc, i) => {
                  const isDone = bloc.status === 'done'
                  const isActive = bloc.status === 'active'
                  const isTodo = bloc.status === 'todo'
                  return (
                    <div
                      key={i}
                      onClick={() => !isTodo && navigate(bloc.route)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                        borderRadius: 10, cursor: isTodo ? 'default' : 'pointer',
                        backgroundColor: isActive ? '#FDFAF6' : 'transparent',
                        border: isActive ? '1px solid #E8D5BF' : '1px solid transparent',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!isTodo) e.currentTarget.style.backgroundColor = isDone ? '#E8F0EB' : '#FDFAF6' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? '#FDFAF6' : 'transparent' }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isDone ? '#1B4332' : isActive ? '#B87333' : '#E5E1D8',
                      }}>
                        {isDone ? <Check size={11} color="#FFFFFF" /> :
                         isActive ? <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#FFFFFF' }} /> :
                         <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#B0AB9F' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-sans)', fontWeight: isActive ? 600 : 500, fontSize: '0.8rem',
                          color: isDone ? '#1B4332' : isTodo ? '#B0AB9F' : '#2A2A28',
                        }}>
                          {bloc.label}
                        </div>
                      </div>
                      <div style={{ width: 50, height: 4, borderRadius: 2, backgroundColor: '#E5E1D8', overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: isDone ? '100%' : isActive ? '43%' : '0%',
                          backgroundColor: isDone ? '#1B4332' : '#B87333',
                        }} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: isDone ? '#1B4332' : isTodo ? '#B0AB9F' : '#B87333', flexShrink: 0, width: 48, textAlign: 'right' }}>
                        {isDone ? 'Terminé' : isActive ? bloc.progress : 'À faire'}
                      </div>
                      {!isTodo && (
                        <ChevronRight size={14} color={isDone ? '#1B4332' : '#B87333'} style={{ flexShrink: 0, opacity: 0.6 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', marginBottom: 12,
                backgroundColor: '#E8F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={26} color="#1B4332" />
              </div>
              <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 500, color: '#1B4332', marginBottom: 4 }}>
                Questionnaire terminé
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>
                {analyst.first_name} analyse vos réponses.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ EN UN COUP D'ŒIL ═══════ */}
      <div className="mt-7 dash-fadein" style={{ animationDelay: '200ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>EN UN COUP D'ŒIL</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Sondage */}
          <KpiCard
            label="SONDAGE INTERNE"
            isDone={surveyCount >= surveyTarget}
          >
            <div>
              <span className="font-display" style={{ fontWeight: 500, fontSize: '1.4rem', color: '#2A2A28' }}>{surveyCount}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#B0AB9F' }}> / {surveyTarget}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: surveyCount >= surveyTarget ? '#1B4332' : '#B0AB9F', fontWeight: surveyCount >= surveyTarget ? 500 : 400 }}>
              {surveyCount >= surveyTarget ? '👍 Excellent taux de réponse !' : 'réponses collectées'}
            </div>
            <div className="flex gap-[3px] mt-2">
              {Array.from({ length: surveyTarget }).map((_, i) => (
                <div key={i} className="h-[4px] rounded-full" style={{ width: 6, backgroundColor: i < surveyCount ? '#1B4332' : '#E5E1D8' }} />
              ))}
            </div>
          </KpiCard>
          {/* Analyse */}
          <KpiCard
            label={isAnalysisOrLater ? 'ANALYSE' : 'PROCHAINE ÉTAPE'}
            isDone={demoStatus === 'ready_for_restitution' || demoStatus === 'delivered'}
          >
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>
              {isAnalysisOrLater
                ? (demoStatus === 'analysis' ? 'En cours' : 'Terminée')
                : 'Questionnaire'}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
              {isAnalysisOrLater
                ? (demoStatus === 'analysis' ? `${analyst.first_name} étudie vos réponses` : 'Rapport finalisé')
                : `${doneCount}/4 blocs complétés`}
            </div>
          </KpiCard>
          {/* Restitution */}
          <KpiCard
            label="RESTITUTION"
            isDone={diagnosticUnlocked}
          >
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>
              {diagnosticUnlocked ? 'Fait ✓' : isRestitutionReady ? 'À planifier' : 'Bientôt'}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
              {diagnosticUnlocked ? 'Diagnostic déverrouillé' : 'Visio après finalisation'}
            </div>
          </KpiCard>
        </div>
      </div>

      {/* ═══════ DIAGNOSTIC PREVIEW ═══════ */}
      <div className="mt-7 dash-fadein" style={{ animationDelay: '310ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>
          {diagnosticUnlocked ? 'VOTRE DIAGNOSTIC' : 'VOTRE FUTUR DIAGNOSTIC'}
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14, overflow: 'hidden', position: 'relative', height: diagnosticUnlocked ? 'auto' : 240 }}>
          {diagnosticUnlocked ? (
            <div style={{ padding: '28px 32px' }}>
              <div className="font-display" style={{ fontSize: '1.3rem', color: '#2A2A28', fontWeight: 400, marginBottom: 12 }}>Votre diagnostic est prêt</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 20 }}>
                9 sections d'analyse personnalisées vous attendent. Découvrez votre profil de maturité climat, les écarts de perception, et nos recommandations concrètes.
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
              <div style={{ padding: '28px 32px', filter: 'blur(6px)', opacity: 0.6 }}>
                <div className="font-display" style={{ fontSize: '1.3rem', color: '#2A2A28', fontWeight: 400, marginBottom: 16 }}>Synthèse éditoriale</div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 12 }}>
                  Votre organisation présente un profil de maturité climat de niveau intermédiaire, avec des fondations solides sur le volet réglementaire mais des lacunes identifiées sur l'intégration opérationnelle des enjeux carbone.
                </p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(247,245,240,0.7)' }}>
                <Lock size={32} color="#B0AB9F" strokeWidth={1.5} />
                <div className="mt-3" style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.9rem', color: '#7A766D' }}>
                  Déverrouillé après votre restitution
                </div>
                <div style={{ width: 40, height: 1, backgroundColor: '#EDEAE3', margin: '12px 0' }} />
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
                  9 sections d'analyse sur mesure
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dashFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dash-fadein { animation: dashFadeIn 0.5s ease-out both; }
        @keyframes kpiPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}

/* ── Reusable Action Card ── */
function ActionCard({ label, title, subtitle, icon, iconBg, hovered, onHover, onClick, locked }: {
  label: string; title: string; subtitle: string; icon: React.ReactNode; iconBg: string
  hovered: boolean; onHover: (v: boolean) => void; onClick: () => void; locked?: boolean
}) {
  return (
    <div
      onClick={locked ? undefined : onClick}
      className={locked ? '' : 'cursor-pointer'}
      style={{
        backgroundColor: hovered && !locked ? '#FEFEFE' : '#FFFFFF',
        border: `${hovered && !locked ? '1.5px' : '1px'} solid ${hovered && !locked ? '#1B4332' : '#EDEAE3'}`,
        borderRadius: 14, padding: '16px 18px', flex: 1,
        boxShadow: hovered && !locked ? '0 2px 8px rgba(42,42,40,.04), 0 8px 32px rgba(42,42,40,.06)' : 'none',
        transform: hovered && !locked ? 'translateY(-1px)' : 'none',
        background: hovered && !locked ? 'linear-gradient(135deg, #FFFFFF 0%, #E8F0EB 100%)' : '#FFFFFF',
        transition: 'all 0.2s ease',
        opacity: locked ? 0.55 : 1,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="label-uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.45rem' }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>{title}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>{subtitle}</div>
        </div>
        {locked ? <Lock size={14} color="#B0AB9F" className="shrink-0" /> : <ChevronRight size={16} color="#B0AB9F" className="shrink-0" />}
      </div>
    </div>
  )
}

/* ── KPI Card with green halo ── */
function KpiCard({ label, isDone, children }: {
  label: string; isDone: boolean; children: React.ReactNode
}) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: `1px solid ${isDone ? '#2D6A4F' : '#EDEAE3'}`,
      borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      boxShadow: isDone ? '0 0 0 1px rgba(27,67,50,0.08), 0 4px 16px rgba(27,67,50,0.08)' : 'none',
    }}>
      {/* Green glow background when done */}
      {isDone && (
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 80, height: 80,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,106,79,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className="label-uppercase" style={{ letterSpacing: '0.1em', flex: 1 }}>{label}</div>
        {isDone && (
          <div style={{
            width: 20, height: 20, borderRadius: '50%', backgroundColor: '#1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'kpiPop 0.4s ease-out',
          }}>
            <Check size={11} color="#fff" strokeWidth={2.5} />
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
