import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemoIfAvailable } from '@/hooks/useDemo'
import { useAuth, MOCK_ANALYST } from '@/hooks/useAuth'
import { Settings, Users, Briefcase, ChevronRight, Check, Sparkles } from 'lucide-react'
import guillaumePhoto from '@/assets/guillaume-photo.png'

type SurveyMode = 'normal' | 'simplified'
type DgMode = 'exhaustive' | 'simplified'

export default function OnboardingSetupPage() {
  const navigate = useNavigate()
  const demo = useDemoIfAvailable()
  const { user } = useAuth()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Claire'

  const [surveyMode, setSurveyMode] = useState<SurveyMode>('normal')
  const [surveyRespondents, setSurveyRespondents] = useState(30)
  const [dgMode, setDgMode] = useState<DgMode>('exhaustive')
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    setConfirmed(true)
    // Move demo to questionnaire stage
    setTimeout(() => {
      if (demo?.enabled) {
        demo.setDiagnosticStatus('questionnaire')
      }
      navigate('/client/dashboard')
    }, 800)
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* ── Header ── */}
      <div className="dash-fadein" style={{ animationDelay: '0ms', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(27,67,50,0.2)',
          }}>
            <Settings size={20} color="#fff" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.45rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.2 }}>
              Paramétrez votre diagnostic
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', marginTop: 2 }}>
              {firstName}, configurez les modules avant de démarrer.
            </p>
          </div>
        </div>
      </div>

      {/* ── Analyst intro ── */}
      <div className="dash-fadein" style={{
        animationDelay: '60ms',
        padding: '16px 20px', borderRadius: 14, marginBottom: 20,
        background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
        border: '1px solid #EDEAE3',
      }}>
        <div className="flex items-center gap-3">
          <img src={guillaumePhoto} alt={analyst.first_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>
              {analyst.first_name} {analyst.last_name}
            </span>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', fontStyle: 'italic', margin: '2px 0 0', lineHeight: 1.5 }}>
              « Bienvenue ! Ces choix orientent la profondeur de l'analyse. Vous pourrez les ajuster plus tard avec moi. »
            </p>
          </div>
        </div>
      </div>

      {/* ── Survey Module ── */}
      <div className="dash-fadein" style={{ animationDelay: '120ms', marginBottom: 16 }}>
        <ConfigCard
          icon={<Users size={20} color="#B87333" />}
          iconBg="#F5EDE4"
          label="SONDAGE INTERNE"
          title="Perception de vos collaborateurs"
          description="Un questionnaire envoyé à vos équipes pour mesurer la perception climat interne."
        >
          {/* Mode selection */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: '#7A766D', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Format du sondage
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ModeButton
                selected={surveyMode === 'normal'}
                onClick={() => setSurveyMode('normal')}
                title="Complet"
                subtitle="8 questions + verbatims"
                detail="~5 min par répondant"
              />
              <ModeButton
                selected={surveyMode === 'simplified'}
                onClick={() => setSurveyMode('simplified')}
                title="Simplifié"
                subtitle="4 questions essentielles"
                detail="~2 min par répondant"
              />
            </div>
          </div>

          {/* Respondent count */}
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: '#7A766D', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Nombre de répondants ciblés
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={surveyRespondents}
                onChange={e => setSurveyRespondents(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#1B4332' }}
              />
              <div style={{
                minWidth: 48, textAlign: 'center', padding: '6px 10px', borderRadius: 8,
                backgroundColor: '#E8F0EB', fontFamily: 'var(--font-sans)', fontWeight: 700,
                fontSize: '0.9rem', color: '#1B4332',
              }}>
                {surveyRespondents}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#B0AB9F', marginTop: 4 }}>
              Recommandé : 25-50 pour une analyse statistiquement robuste
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* ── DG Interview Module ── */}
      <div className="dash-fadein" style={{ animationDelay: '180ms', marginBottom: 28 }}>
        <ConfigCard
          icon={<Briefcase size={20} color="#1B4332" />}
          iconBg="#E8F0EB"
          label="ENTRETIEN DIRECTION"
          title="Vision de votre direction générale"
          description="Un questionnaire adressé au dirigeant pour capter sa vision stratégique climat."
        >
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: '#7A766D', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Format de l'entretien
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ModeButton
                selected={dgMode === 'exhaustive'}
                onClick={() => setDgMode('exhaustive')}
                title="Exhaustif"
                subtitle="5 questions ouvertes + note"
                detail="~15 min"
              />
              <ModeButton
                selected={dgMode === 'simplified'}
                onClick={() => setDgMode('simplified')}
                title="Simplifié"
                subtitle="3 questions clés"
                detail="~5 min"
              />
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* ── Confirm button ── */}
      <div className="dash-fadein" style={{ animationDelay: '240ms', textAlign: 'center' }}>
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          style={{
            padding: '14px 36px', borderRadius: 10,
            background: confirmed
              ? 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)'
              : 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
            color: '#fff', border: 'none', cursor: confirmed ? 'default' : 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9rem',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: '0 4px 16px rgba(27,67,50,0.25)',
            transform: confirmed ? 'scale(1.02)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {confirmed ? (
            <>
              <Check size={18} /> Configuration enregistrée !
            </>
          ) : (
            <>
              <Sparkles size={18} /> Valider et démarrer
              <ChevronRight size={16} />
            </>
          )}
        </button>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#B0AB9F', marginTop: 10 }}>
          Modifiable à tout moment avec votre analyste
        </p>
      </div>

      <style>{`
        @keyframes dashFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dash-fadein { animation: dashFadeIn 0.5s ease-out both; }
      `}</style>
    </div>
  )
}

/* ── Config Card wrapper ── */
function ConfigCard({ icon, iconBg, label, title, description, children }: {
  icon: React.ReactNode; iconBg: string; label: string; title: string; description: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
      overflow: 'hidden',
    }}>
      {/* Header band */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0EDE6' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
            {icon}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 700, color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>
              {label}
            </div>
            <div className="font-display" style={{ fontSize: '1.05rem', color: '#2A2A28', fontWeight: 500 }}>
              {title}
            </div>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', marginTop: 8, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
      {/* Options body */}
      <div style={{ padding: '18px 22px' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Mode selection button ── */
function ModeButton({ selected, onClick, title, subtitle, detail }: {
  selected: boolean; onClick: () => void; title: string; subtitle: string; detail: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '14px 16px', borderRadius: 12, textAlign: 'left',
        border: selected ? '2px solid #1B4332' : '1.5px solid #EDEAE3',
        backgroundColor: selected ? '#F0F7F3' : '#FAFAF8',
        cursor: 'pointer', transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 0 3px rgba(27,67,50,0.08)' : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          border: selected ? 'none' : '2px solid #D5D1C8',
          backgroundColor: selected ? '#1B4332' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {selected && <Check size={10} color="#fff" strokeWidth={3} />}
        </div>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: selected ? '#1B4332' : '#2A2A28' }}>
          {title}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A766D', marginBottom: 2, paddingLeft: 24 }}>
        {subtitle}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#B0AB9F', paddingLeft: 24 }}>
        {detail}
      </div>
    </button>
  )
}
