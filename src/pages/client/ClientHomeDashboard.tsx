import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Users, Calendar } from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'

const BLOCS = [
  {
    num: 1,
    name: 'Votre démarche',
    desc: 'Organisation, contexte et historique climat',
    status: 'done' as const,
    path: '/client/questionnaire/bloc1',
  },
  {
    num: 2,
    name: 'Votre maturité',
    desc: '20 questions — Score provisoire : B',
    status: 'done' as const,
    path: '/client/questionnaire/bloc2',
  },
  {
    num: 3,
    name: 'Vos enjeux',
    desc: 'Contraintes réglementaires, ambitions, freins',
    status: 'in_progress' as const,
    time: '~10 min',
    path: '/client/questionnaire/bloc3',
  },
  {
    num: 4,
    name: 'La perception',
    desc: 'Perception des équipes vs direction',
    status: 'todo' as const,
    time: '~15 min',
    path: '/client/questionnaire/bloc4',
  },
]

const statusPill: Record<string, { label: string; border: string; text: string }> = {
  done: { label: 'Terminé', border: '#EDEAE3', text: '#7A766D' },
  in_progress: { label: 'En cours', border: '#B87333', text: '#B87333' },
  todo: { label: 'À faire', border: '#E5E1D8', text: '#B0AB9F' },
}

export default function ClientHomeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Marie'

  return (
    <div>
      {/* ZONE 1 — Header */}
      <div style={{ animationDelay: '0ms' }} className="dash-fadein">
        <h1 className="font-display" style={{ fontSize: '1.85rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.25 }}>
          Bienvenue {firstName},
          <br />
          <span>votre diagnostic </span>
          <span style={{ color: '#1B4332', fontWeight: 500 }}>prend forme.</span>
        </h1>
        <p className="mt-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A766D' }}>
          Deux blocs complétés sur quatre. Votre analyste a commencé à étudier vos réponses.
        </p>
      </div>

      {/* Analyst message */}
      <div
        className="mt-6 dash-fadein"
        style={{
          background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #EDEAE3',
          animationDelay: '70ms',
        }}
      >
        <div className="flex gap-3">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: '#1B4332', fontFamily: 'var(--font-display)', fontSize: '0.65rem' }}
          >
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>
                {analyst.first_name} {analyst.last_name}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>
                il y a 2h
              </span>
            </div>
            <p className="mt-1" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5 }}>
              « J'ai bien reçu vos deux premiers blocs, {firstName}. Votre profil de maturité est intéressant — j'ai hâte de voir vos réponses sur les enjeux. Prenez votre temps ! »
            </p>
          </div>
        </div>
      </div>

      {/* Progress resume bar */}
      <div
        className="mt-7 dash-fadein flex items-center justify-between"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EDEAE3',
          borderRadius: 14,
          padding: '16px 24px',
          animationDelay: '140ms',
        }}
      >
        <div className="flex items-center gap-4">
          {/* SVG ring */}
          <svg width={48} height={48} viewBox="0 0 48 48">
            <circle cx={24} cy={24} r={19} fill="none" stroke="#F0EDE6" strokeWidth={4} />
            <circle
              cx={24} cy={24} r={19}
              fill="none" stroke="#1B4332" strokeWidth={4}
              strokeDasharray={`${Math.PI * 2 * 19 * 0.5} ${Math.PI * 2 * 19}`}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
            <circle cx={24} cy={24} r={21.5} fill="none" stroke="#B87333" strokeWidth={0.8} opacity={0.4} />
            <text x={24} y={25} textAnchor="middle" dominantBaseline="middle" fill="#1B4332" fontFamily="var(--font-display)" fontWeight={600} fontSize="0.6rem">
              50%
            </text>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9rem', color: '#2A2A28' }}>
              Questionnaire en cours
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D' }}>
              Prochain bloc : <strong>Vos enjeux</strong> — environ 10 min
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/client/questionnaire/bloc3')}
          className="shrink-0 transition-colors"
          style={{
            backgroundColor: '#1B4332',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.85rem',
            padding: '12px 28px',
            borderRadius: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#153728')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
        >
          Reprendre →
        </button>
      </div>

      {/* ZONE 2 — 4 Blocs */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '210ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>
          VOS 4 BLOCS À COMPLÉTER
        </div>
        <div className="flex flex-col gap-2">
          {BLOCS.map(b => {
            const pill = statusPill[b.status]
            const isActive = b.status === 'in_progress'
            const isTodo = b.status === 'todo'
            const isDone = b.status === 'done'

            return (
              <div
                key={b.num}
                onClick={() => navigate(b.path)}
                className="flex items-center gap-4 cursor-pointer group transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isActive ? '1.5px solid #B87333' : '1px solid #EDEAE3',
                  borderRadius: 12,
                  padding: '16px 20px',
                  opacity: isTodo ? 0.7 : 1,
                }}
              >
                {/* Circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isDone ? '#1B4332' : isActive ? '#B87333' : '#F0EDE6',
                  }}
                >
                  {isDone ? (
                    <Check size={18} color="white" strokeWidth={2.5} />
                  ) : (
                    <span
                      style={{
                        fontFamily: isActive ? 'var(--font-display)' : 'var(--font-sans)',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: isActive ? 'white' : '#B0AB9F',
                      }}
                    >
                      {b.num}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isDone || isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    color: isTodo ? '#7A766D' : '#2A2A28',
                  }}>
                    {b.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: isTodo ? '#B0AB9F' : '#7A766D',
                  }}>
                    {b.desc}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0">
                  {b.time && (
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
                      {b.time}
                    </span>
                  )}
                  <span
                    style={{
                      border: `1px solid ${pill.border}`,
                      borderRadius: 20,
                      padding: '4px 14px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      color: pill.text,
                    }}
                  >
                    {pill.label}
                  </span>
                  <ChevronRight size={14} color={isTodo ? '#E5E1D8' : '#B0AB9F'} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ZONE 3 — En un coup d'œil */}
      <div className="mt-9 dash-fadein" style={{ animationDelay: '280ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>
          EN UN COUP D'ŒIL
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Sondage */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EDEAE3',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#E8F0EB' }}
              >
                <Users size={18} color="#1B4332" />
              </div>
              <div>
                <div className="label-uppercase" style={{ letterSpacing: '0.1em' }}>SONDAGE INTERNE</div>
                <div className="mt-1">
                  <span className="font-display" style={{ fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}>
                    12/30
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#B0AB9F' }}> réponses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prochaine étape */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EDEAE3',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#F5EDE4' }}
              >
                <Calendar size={18} color="#B87333" />
              </div>
              <div>
                <div className="label-uppercase" style={{ letterSpacing: '0.1em' }}>PROCHAINE ÉTAPE</div>
                <div className="font-display mt-1" style={{ fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}>
                  Restitution
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
                  Planifiable après l'analyse
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-fadein {
          animation: dashFadeIn 0.5s ease-out both;
        }
      `}</style>
    </div>
  )
}
