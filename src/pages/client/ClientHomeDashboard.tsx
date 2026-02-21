import { useNavigate } from 'react-router-dom'
import { ChevronRight, Edit3, Users } from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'

const BLOCS = [
  { num: 1, name: 'Votre démarche', status: 'done' as const, progress: 1, total: 1, path: '/client/questionnaire/bloc1' },
  { num: 2, name: 'Votre maturité', status: 'done' as const, progress: 1, total: 1, path: '/client/questionnaire/bloc2' },
  { num: 3, name: 'Vos enjeux', status: 'in_progress' as const, progress: 3, total: 7, path: '/client/questionnaire/bloc3' },
  { num: 4, name: 'La perception', status: 'todo' as const, progress: 0, total: 1, path: '/client/questionnaire/bloc4' },
]

const dotColors: Record<string, string> = {
  done: '#1B4332',
  in_progress: '#B87333',
  todo: '#E5E1D8',
}

export default function ClientHomeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Marie'

  return (
    <div>
      {/* Header */}
      <div className="dash-fadein" style={{ animationDelay: '0ms' }}>
        <h1 className="font-display" style={{ fontSize: '1.85rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.25 }}>
          Bienvenue {firstName},
          <br />
          <span>votre diagnostic </span>
          <span style={{ color: '#1B4332', fontWeight: 500 }}>prend forme.</span>
        </h1>
        <p className="mt-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A766D' }}>
          Vous avez complété 2 blocs sur 4. Votre analyste a commencé l'étude de vos premières réponses.
        </p>
      </div>

      {/* Analyst message */}
      <div
        className="mt-6 dash-fadein"
        style={{
          background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #EDEAE3',
          animationDelay: '70ms',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: '#1B4332', fontFamily: 'var(--font-display)', fontSize: '0.65rem' }}
          >
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>
                {analyst.first_name} {analyst.last_name}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>
                il y a 2h
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5 }}>
              « Vos deux premiers blocs sont très bien renseignés, {firstName}. Votre profil de maturité est intéressant — j'ai hâte de voir la suite ! »
            </p>
          </div>
        </div>
      </div>

      {/* VOTRE PROGRESSION */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '140ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VOTRE PROGRESSION</div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EDEAE3',
            borderRadius: 14,
            padding: '24px 28px',
          }}
        >
          {/* Top row: ring + summary */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <svg width={64} height={64} viewBox="0 0 64 64">
                <circle cx={32} cy={32} r={26} fill="none" stroke="#F0EDE6" strokeWidth={5} />
                <circle
                  cx={32} cy={32} r={26}
                  fill="none" stroke="#1B4332" strokeWidth={5}
                  strokeDasharray={`${Math.PI * 2 * 26 * 0.5} ${Math.PI * 2 * 26}`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1B4332', lineHeight: 1 }}>50%</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.45rem', fontWeight: 600, color: '#1B4332', textTransform: 'uppercase', letterSpacing: '0.05em' }}>complet</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.95rem', color: '#2A2A28' }}>
                Questionnaire en cours
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D' }}>
                2 blocs terminés, 1 en cours, 1 à venir
              </div>
            </div>
          </div>

          {/* Progress bars per bloc */}
          <div className="flex flex-col gap-3">
            {BLOCS.map(b => {
              const isDone = b.status === 'done'
              const isActive = b.status === 'in_progress'
              const isTodo = b.status === 'todo'
              const pct = isDone ? 100 : isTodo ? 0 : (b.progress / b.total) * 100
              const barColor = isDone ? '#1B4332' : isActive ? '#B87333' : '#E5E1D8'
              const trackColor = isDone ? '#D1E0D8' : isActive ? '#F5EDE4' : '#F0EDE6'

              return (
                <div key={b.num} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: dotColors[b.status] }}
                  />
                  <span
                    className="shrink-0"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.82rem',
                      color: isTodo ? '#B0AB9F' : '#2A2A28',
                      width: 130,
                    }}
                  >
                    {b.name}
                  </span>
                  <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: trackColor }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                  <span
                    className="shrink-0 text-right"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: isActive ? '#B87333' : isTodo ? '#B0AB9F' : '#7A766D',
                      width: 60,
                    }}
                  >
                    {isDone ? 'Terminé' : isTodo ? 'À faire' : `${b.progress} / ${b.total}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* VOS PROCHAINES ÉTAPES */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '210ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VOS PROCHAINES ÉTAPES</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Reprendre questionnaire */}
          <div
            onClick={() => navigate('/client/questionnaire/bloc3')}
            className="cursor-pointer group transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #B87333',
              borderRadius: 14,
              padding: '20px 22px',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#E8F0EB' }}
              >
                <Edit3 size={18} color="#1B4332" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="label-uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.45rem' }}>QUESTIONNAIRE</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: '#2A2A28' }}>
                  Reprendre « Vos enjeux »
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A766D' }}>
                  Encore 4 questions — environ 5 min
                </div>
              </div>
              <ChevronRight size={16} color="#B0AB9F" className="shrink-0" />
            </div>
          </div>

          {/* Relancer sondage */}
          <div
            onClick={() => navigate('/client/sondage')}
            className="cursor-pointer group transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EDEAE3',
              borderRadius: 14,
              padding: '20px 22px',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#F5EDE4' }}
              >
                <Users size={18} color="#B87333" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="label-uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.45rem' }}>SONDAGE</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: '#2A2A28' }}>
                  Relancer vos équipes
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A766D' }}>
                  12 réponses sur 30 — objectif
                </div>
              </div>
              <ChevronRight size={16} color="#B0AB9F" className="shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* EN UN COUP D'ŒIL */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '280ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>EN UN COUP D'ŒIL</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Sondage interne */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>SONDAGE INTERNE</div>
            <div>
              <span className="font-display" style={{ fontWeight: 500, fontSize: '1.4rem', color: '#2A2A28' }}>12</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#B0AB9F' }}> / 30</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>réponses collectées</div>
            {/* Mini progress dots */}
            <div className="flex gap-[3px] mt-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[4px] rounded-full"
                  style={{
                    width: 6,
                    backgroundColor: i < 12 ? '#1B4332' : '#E5E1D8',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Analyse en cours */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>ANALYSE EN COURS</div>
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>Phase 1</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
              {analyst.first_name} étudie vos réponses
            </div>
          </div>

          {/* Prochaine étape */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>PROCHAINE ÉTAPE</div>
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>Restitution</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
              Visio planifiée après finalisation
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
