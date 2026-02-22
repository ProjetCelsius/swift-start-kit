import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

const PRIORITY_COLORS = ['#1B4332', '#B87333', '#5B8C6E']

export default function DiagnosticSection9() {
  const navigate = useNavigate()
  const { priorities } = mockDiagnostic.section2
  const { quarters } = mockDiagnostic.section9

  return (
    <SectionLayout sectionNumber={9}>
      {/* Horizon banner */}
      <div
        className="rounded-xl p-4 mb-6 text-center"
        style={{ background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)' }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#1B4332' }}>
          Horizon : 12 mois
        </p>
        <p className="text-xs mt-1" style={{ color: '#7A766D' }}>
          Plan d'action structuré autour de vos 3 priorités
        </p>
      </div>

      {/* Priority recap */}
      <div className="space-y-2 mb-8">
        {priorities.map((p, i) => (
          <button
            key={i}
            onClick={() => navigate('/client/diagnostic/2')}
            className="w-full text-left rounded-xl p-3.5 flex items-center gap-3 transition-all hover:scale-[1.003]"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: PRIORITY_COLORS[i] }}
            >
              {i + 1}
            </div>
            <p className="text-sm font-semibold flex-1 truncate" style={{ color: '#2A2A28' }}>{p.title}</p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{
                backgroundColor: p.effort === 'Rapide' ? '#E8F0EB' : '#F5EDE4',
                color: p.effort === 'Rapide' ? '#1B4332' : '#B87333',
              }}
            >
              {p.effort}
            </span>
          </button>
        ))}
      </div>

      {/* Quarterly timeline */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Plan sur 4 trimestres
        </h3>

        <div className="grid grid-cols-4 gap-3">
          {quarters.map((q, qi) => (
            <div key={qi}>
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-3 text-center"
                style={{ color: '#1B4332', letterSpacing: '0.05em' }}
              >
                {q.label}
              </p>
              <div className="space-y-2">
                {q.actions.map((a, ai) => (
                  <div
                    key={ai}
                    className="rounded-lg p-2.5"
                    style={{ backgroundColor: '#F7F5F0' }}
                  >
                    <p className="text-[11px] leading-snug" style={{ color: '#2A2A28' }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: '#1B4332' }}
        >
          Planifier un échange avec votre analyste <ExternalLink size={16} />
        </a>
        <a
          href="https://celsius.eco"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all hover:scale-[1.01]"
          style={{ borderColor: '#B87333', color: '#B87333' }}
        >
          Découvrir les accompagnements Celsius <ExternalLink size={16} />
        </a>
      </div>
    </SectionLayout>
  )
}
