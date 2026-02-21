import { ArrowLeft, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QuestionnaireHeaderProps {
  blocNumber: number
  title: string
  subtitle: string
  duration: string
  accentColor?: string
  progress?: { current: number; total: number }
}

export default function QuestionnaireHeader({
  blocNumber,
  title,
  subtitle,
  duration,
  accentColor = '#B87333',
  progress,
}: QuestionnaireHeaderProps) {
  const navigate = useNavigate()

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Back link */}
      <button
        onClick={() => navigate('/client/dashboard')}
        className="flex items-center gap-2 mb-5"
        style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Tableau de bord
      </button>

      {/* Premium header card */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F5F0 100%)',
        border: '1px solid #EDEAE3', borderRadius: 16, padding: '24px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
        }} />

        {/* Top row: label + duration */}
        <div className="flex items-center justify-between mb-3">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            backgroundColor: `${accentColor}12`, border: `1px solid ${accentColor}22`,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              backgroundColor: accentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, color: '#fff',
            }}>
              {blocNumber}
            </div>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              color: accentColor,
            }}>
              QUESTIONNAIRE
            </span>
          </div>

          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 20,
            backgroundColor: '#F7F5F0', border: '1px solid #EDEAE3',
            fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, color: '#7A766D',
          }}>
            <Clock size={12} /> {duration}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display" style={{
          fontSize: '1.35rem', fontWeight: 400, color: '#2A2A28',
          marginBottom: 6, lineHeight: 1.3,
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D',
          margin: 0, lineHeight: 1.5,
        }}>
          {subtitle}
        </p>

        {/* Progress bar */}
        {progress && (
          <div className="mt-4 flex items-center gap-3">
            <div style={{
              flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E5E1D8', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 3, backgroundColor: accentColor,
                width: `${(progress.current / progress.total) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, color: accentColor,
            }}>
              {progress.current}/{progress.total}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
