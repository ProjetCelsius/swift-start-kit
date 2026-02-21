import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check, Users, Lock, Compass, Calendar, BookOpen, Sparkles } from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import ProtocolModal, { useProtocolModal } from '../../components/ProtocolModal'
import clientAvatar from '../../assets/client-avatar.jpg'
import guillaumePhoto from '../../assets/guillaume-photo.png'

// ── Questionnaire blocs ──────
type BlocStatus = 'done' | 'active' | 'todo'
interface QuestionnaireBloc {
  label: string
  route: string
  status: BlocStatus
  progress?: string // e.g. "3/7"
}

const BLOCS: QuestionnaireBloc[] = [
  { label: 'Votre démarche', route: '/client/questionnaire/bloc1', status: 'done' },
  { label: 'Votre maturité', route: '/client/questionnaire/bloc2', status: 'done' },
  { label: 'Vos enjeux', route: '/client/questionnaire/bloc3', status: 'active', progress: '3/7' },
  { label: 'La perception', route: '/client/questionnaire/bloc4', status: 'todo' },
]

// ── Journey steps ──────
type StepStatus = 'done' | 'active' | 'locked'
const STEPS: { num: number; label: string; detail: string; status: StepStatus }[] = [
  { num: 1, label: 'Appel de lancement', detail: '10 fév.', status: 'done' },
  { num: 2, label: 'Questionnaire', detail: '2/4 blocs', status: 'active' },
  { num: 3, label: 'Sondage', detail: '12/30', status: 'active' },
  { num: 4, label: 'Analyse', detail: '—', status: 'locked' },
  { num: 5, label: 'Restitution', detail: '—', status: 'locked' },
]

// Determine questionnaire state: 'not_started' | 'in_progress' | 'completed'
function getQuestionnaireState(blocs: QuestionnaireBloc[]) {
  const allDone = blocs.every(b => b.status === 'done')
  const anyStarted = blocs.some(b => b.status === 'done' || b.status === 'active')
  if (allDone) return 'completed'
  if (anyStarted) return 'in_progress'
  return 'not_started'
}

export default function ClientHomeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Claire'
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const protocol = useProtocolModal()
  const qState = getQuestionnaireState(BLOCS)
  const doneCount = BLOCS.filter(b => b.status === 'done').length

  return (
    <div>
      <ProtocolModal open={protocol.open} onClose={() => protocol.setOpen(false)} />

      {/* ═══════ HEADER BLOCK ═══════ */}
      <div className="dash-fadein" style={{ animationDelay: '0ms' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={clientAvatar} alt={firstName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EDEAE3' }} />
            <div>
              <h1 className="font-display" style={{ fontSize: '1.75rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.25 }}>
                Bonjour {firstName},<br />
                <span>votre diagnostic </span>
                <span style={{ color: '#1B4332', fontWeight: 500 }}>prend forme.</span>
              </h1>
              <p className="mt-1" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D' }}>
                Encore quelques étapes et {analyst.first_name} prendra le relais.
              </p>
            </div>
          </div>
          <button
            onClick={() => protocol.setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
              borderRadius: 14, border: '1.5px solid #1B4332',
              background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 100%)',
              fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#2A2A28',
              cursor: 'pointer', flexShrink: 0, marginTop: 4,
              transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(27,67,50,0.08)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #D4E8DB 0%, #E8F0EB 100%)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(27,67,50,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 100%)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(27,67,50,0.08)' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Compass size={16} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1B4332' }}>Notre méthodologie</div>
              <div style={{ fontSize: '0.68rem', color: '#7A766D' }}>Rappel du parcours en 5 étapes</div>
            </div>
          </button>
        </div>
      </div>

      {/* ═══════ STEPPER PARCOURS ═══════ */}
      <div className="mt-6 dash-fadein" style={{ animationDelay: '70ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VOTRE PARCOURS</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '16px 8px' }}>
          {STEPS.map((step, i) => {
            const isDone = step.status === 'done'
            const isActive = step.status === 'active'
            const isLocked = step.status === 'locked'
            return (
              <React.Fragment key={i}>
                {/* Connector line */}
                {i > 0 && (
                  <div style={{
                    flex: 1, height: 2, maxWidth: 60,
                    backgroundColor: isDone || (isActive && STEPS[i - 1].status === 'done') ? '#1B4332' : '#E5E1D8',
                  }} />
                )}
                {/* Step circle + label */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 70 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isDone ? '#1B4332' : isActive ? '#FFFFFF' : '#FFFFFF',
                    border: `2px solid ${isDone ? '#1B4332' : isActive ? '#1B4332' : '#E5E1D8'}`,
                    color: isDone ? '#FFFFFF' : isActive ? '#1B4332' : '#B0AB9F',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem',
                  }}>
                    {isDone ? <Check size={16} /> : step.num}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.68rem', color: isDone ? '#1B4332' : isLocked ? '#B0AB9F' : '#2A2A28' }}>
                      {step.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: isDone ? '#2D6A4F' : '#B0AB9F' }}>
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
      <div className="mt-6 dash-fadein" style={{ animationDelay: '140ms', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>

        {/* ── LEFT: Action cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Sondage card */}
          <ActionCard
            label="SONDAGE"
            title="Relancer vos équipes"
            subtitle="12 réponses sur 30 — objectif"
            icon={<Users size={18} color="#B87333" />}
            iconBg="#F5EDE4"
            hovered={hoveredCard === 'sondage'}
            onHover={v => setHoveredCard(v ? 'sondage' : null)}
            onClick={() => navigate('/client/sondage')}
          />
          {/* Planning card */}
          <ActionCard
            label="PLANNING"
            title="Planifier la restitution"
            subtitle="Disponible après l'analyse"
            icon={<Calendar size={18} color="#7A766D" />}
            iconBg="#F7F5F0"
            hovered={hoveredCard === 'planning'}
            onHover={v => setHoveredCard(v ? 'planning' : null)}
            onClick={() => {}}
            locked
          />
          {/* Journal card */}
          <ActionCard
            label="JOURNAL"
            title="Journal de bord"
            subtitle="2 nouvelles entrées"
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
          position: 'relative',
        }}>
          {qState === 'not_started' ? (
            /* ── GOLDEN "START" STATE ── */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', position: 'relative' }}>
              {/* Subtle radial glow */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(184,115,51,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{
                width: 64, height: 64, borderRadius: '50%', marginBottom: 16,
                background: 'linear-gradient(135deg, #B87333 0%, #E8A66A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(184,115,51,0.25), 0 0 60px rgba(184,115,51,0.10)',
              }}>
                <Sparkles size={28} color="#FFFFFF" />
              </div>
              <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, color: '#2A2A28', marginBottom: 6 }}>
                Commencez votre questionnaire
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D', maxWidth: 260, lineHeight: 1.5, marginBottom: 20 }}>
                4 blocs thématiques, à votre rythme. Sauvegarde automatique.
              </p>
              <button
                onClick={() => navigate('/client/questionnaire/bloc1')}
                style={{
                  padding: '12px 28px', borderRadius: 8, backgroundColor: '#1B4332', color: '#fff',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Démarrer <ChevronRight size={16} />
              </button>
            </div>
          ) : qState === 'in_progress' ? (
            /* ── IN-PROGRESS STATE with bloc list ── */
            <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                {/* Progress ring */}
                <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#E5E1D8" strokeWidth="3" />
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#1B4332" strokeWidth="3"
                      strokeDasharray={`${(doneCount / BLOCS.length) * 150.8} 150.8`}
                      strokeLinecap="round" transform="rotate(-90 28 28)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5rem', color: '#7A766D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ÉTAPE</div>
                    <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1B4332', lineHeight: 1 }}>2</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5rem', color: '#B0AB9F' }}>sur 5</div>
                  </div>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 500, color: '#2A2A28' }}>Questionnaire</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>
                    4 blocs thématiques · sauvegarde auto
                  </div>
                </div>
              </div>
              {/* Bloc list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {BLOCS.map((bloc, i) => {
                  const isDone = bloc.status === 'done'
                  const isActive = bloc.status === 'active'
                  const isTodo = bloc.status === 'todo'
                  return (
                    <div
                      key={i}
                      onClick={() => !isTodo && navigate(bloc.route)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                        borderRadius: 10, cursor: isTodo ? 'default' : 'pointer',
                        backgroundColor: isActive ? '#FDFAF6' : 'transparent',
                        border: isActive ? '1px solid #E8D5BF' : '1px solid transparent',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!isTodo) e.currentTarget.style.backgroundColor = isDone ? '#E8F0EB' : '#FDFAF6' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? '#FDFAF6' : 'transparent' }}
                    >
                      {/* Status icon */}
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isDone ? '#1B4332' : isActive ? '#B87333' : '#E5E1D8',
                      }}>
                        {isDone ? <Check size={12} color="#FFFFFF" /> :
                         isActive ? <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FFFFFF' }} /> :
                         <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B0AB9F' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-sans)', fontWeight: isActive ? 600 : 500, fontSize: '0.82rem',
                          color: isDone ? '#1B4332' : isTodo ? '#B0AB9F' : '#2A2A28',
                        }}>
                          {bloc.label} {isActive && bloc.progress && <span style={{ color: '#B87333' }}>— {bloc.progress}</span>}
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: '#E5E1D8', overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: isDone ? '100%' : isActive ? '43%' : '0%',
                          backgroundColor: isDone ? '#1B4332' : '#B87333',
                          transition: 'width 0.3s',
                        }} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: isDone ? '#1B4332' : isTodo ? '#B0AB9F' : '#B87333', flexShrink: 0, width: 52, textAlign: 'right' }}>
                        {isDone ? 'Terminé' : isActive ? bloc.progress : 'À faire'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* ── COMPLETED STATE ── */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', marginBottom: 14,
                backgroundColor: '#E8F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={28} color="#1B4332" />
              </div>
              <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1B4332', marginBottom: 4 }}>
                Questionnaire terminé
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D' }}>
                {analyst.first_name} analyse vos réponses.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ ANALYST MESSAGE ═══════ */}
      <div className="mt-6 dash-fadein" style={{
        background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
        borderRadius: 14, padding: '16px 20px', border: '1px solid #EDEAE3', animationDelay: '210ms',
      }}>
        <div className="flex items-center gap-3">
          <img src={guillaumePhoto} alt={`${analyst.first_name} ${analyst.last_name}`} className="w-[38px] h-[38px] rounded-full object-cover shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>{analyst.first_name} {analyst.last_name}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>il y a 2h</span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5 }}>
              « Vos deux premiers blocs sont très bien renseignés, {firstName}. Votre profil de maturité est intéressant — j'ai hâte de voir la suite ! »
            </p>
          </div>
        </div>
      </div>

      {/* ═══════ EN UN COUP D'ŒIL ═══════ */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '280ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>EN UN COUP D'ŒIL</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>SONDAGE INTERNE</div>
            <div>
              <span className="font-display" style={{ fontWeight: 500, fontSize: '1.4rem', color: '#2A2A28' }}>12</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#B0AB9F' }}> / 30</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>réponses collectées</div>
            <div className="flex gap-[3px] mt-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="h-[4px] rounded-full" style={{ width: 6, backgroundColor: i < 12 ? '#1B4332' : '#E5E1D8' }} />
              ))}
            </div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>ANALYSE EN COURS</div>
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>Phase 1</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>{analyst.first_name} étudie vos réponses</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>PROCHAINE ÉTAPE</div>
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>Restitution</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>Visio planifiée après finalisation</div>
          </div>
        </div>
      </div>

      {/* ═══════ BLURRED DIAGNOSTIC ═══════ */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '350ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VOTRE FUTUR DIAGNOSTIC</div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14, overflow: 'hidden', position: 'relative', height: 260 }}>
          <div style={{ padding: '28px 32px', filter: 'blur(6px)', opacity: 0.6 }}>
            <div className="font-display" style={{ fontSize: '1.3rem', color: '#2A2A28', fontWeight: 400, marginBottom: 16 }}>Synthèse éditoriale</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 12 }}>
              Votre organisation présente un profil de maturité climat de niveau intermédiaire, avec des fondations solides sur le volet réglementaire mais des lacunes identifiées sur l'intégration opérationnelle des enjeux carbone.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6 }}>
              Les résultats du sondage interne révèlent un écart significatif entre la perception de la direction et celle des équipes terrain.
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
        </div>
      </div>

      <style>{`
        @keyframes dashFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dash-fadein { animation: dashFadeIn 0.5s ease-out both; }
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
        borderRadius: 14, padding: '16px 18px',
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
