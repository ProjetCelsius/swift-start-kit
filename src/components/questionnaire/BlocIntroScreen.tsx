import { Clock, BarChart3, Save, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ANALYST } from '@/hooks/useAuth'

interface BlocIntroProps {
  blocNum: number
  title: string
  description: string
  duration: string
  questionCount: string
  analystTip: string
  hasStarted: boolean
  onStart: () => void
}

const BLOC_COLORS: Record<number, string> = {
  1: '#1B4332',
  2: '#1B4332',
  3: '#B87333',
  4: '#7A766D',
}

export default function BlocIntroScreen({
  blocNum, title, description, duration, questionCount, analystTip, hasStarted, onStart,
}: BlocIntroProps) {
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const circleColor = BLOC_COLORS[blocNum] ?? '#1B4332'

  return (
    <div className="animate-fade-in" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      {/* Bloc number circle */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%', margin: '0 auto 20px',
        backgroundColor: circleColor, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.1rem',
      }}>
        {blocNum}
      </div>

      {/* Title */}
      <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--color-texte)', marginBottom: 12 }}>
        {title}
      </h1>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--color-texte-secondary)',
        lineHeight: 1.6, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px',
      }}>
        {description}
      </p>

      {/* Info row */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        <InfoChip icon={<Clock size={16} />} text={duration} />
        <InfoChip icon={<BarChart3 size={16} />} text={questionCount} />
        <InfoChip icon={<Save size={16} />} text="Sauvegarde auto" />
      </div>

      {/* Analyst tip */}
      <div style={{
        background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 100%)',
        border: '1px solid var(--color-border)', borderRadius: 10,
        padding: '14px 16px', textAlign: 'left', marginBottom: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            backgroundColor: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '0.5rem',
          }}>
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.72rem', color: 'var(--color-primary)' }}>
            Conseil de {analyst.first_name}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-texte-secondary)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
          {analystTip}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          padding: '14px 36px', borderRadius: 8,
          backgroundColor: 'var(--color-primary)', color: '#fff',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
          border: 'none', cursor: 'pointer', maxWidth: 280, width: '100%',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
      >
        {hasStarted ? 'Reprendre' : 'Commencer'}
      </button>

      {/* Contact link */}
      <button
        onClick={() => navigate('/client/messages')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          margin: '16px auto 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--color-texte-secondary)',
        }}
        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
      >
        <MessageSquare size={12} />
        Une question ? Contactez {analyst.first_name}
      </button>
    </div>
  )
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--color-texte-muted)', display: 'flex' }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem', color: 'var(--color-texte)' }}>
        {text}
      </span>
    </div>
  )
}
