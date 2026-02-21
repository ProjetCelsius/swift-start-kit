import { ExternalLink } from 'lucide-react'
import { MOCK_PRIORITIES } from '@/data/mockDiagnosticData'
import { MOCK_QUARTERLY_PLAN } from '@/data/mockDiagnosticData'
import { useNavigate } from 'react-router-dom'

const EFFORT_STYLES: Record<string, { bg: string; color: string }> = {
  Rapide: { bg: 'var(--color-celsius-100)', color: 'var(--color-celsius-900)' },
  Projet: { bg: 'var(--color-gold-100)', color: 'var(--color-gold-500)' },
  Transformation: { bg: 'var(--color-corail-100)', color: 'var(--color-corail-500)' },
}

const PRIORITY_COLORS = ['#1B5E3B', '#2D7A50', '#E8734A']

export default function DiagnosticSection9() {
  const navigate = useNavigate()

  return (
    <div className="max-w-[720px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Prochaines étapes
      </h2>

      {/* Priority recap */}
      <div className="space-y-3 mb-8">
        {MOCK_PRIORITIES.map(p => (
          <button
            key={p.number}
            onClick={() => navigate('/diagnostic/2')}
            className="w-full text-left rounded-xl p-4 flex items-center gap-4 transition-all hover:scale-[1.005]"
            style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: PRIORITY_COLORS[p.number - 1] }}
            >
              {p.number}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{p.title}</p>
            </div>
            <span
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
              style={EFFORT_STYLES[p.effort]}
            >
              {p.effort}
            </span>
          </button>
        ))}
      </div>

      {/* 12-month plan */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-5">Plan suggéré sur 12 mois</h3>

        <div className="grid grid-cols-4 gap-3">
          {MOCK_QUARTERLY_PLAN.map(q => (
            <div key={q.quarter}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 text-center" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
                {q.quarter}
              </p>
              <div className="space-y-2">
                {q.actions.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: 'var(--color-fond)' }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: PRIORITY_COLORS[a.priority - 1] || 'var(--color-gris-400)' }}
                      />
                      <p className="text-xs leading-snug">{a.label}</p>
                    </div>
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
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
        >
          Planifier un échange avec votre analyste <ExternalLink size={16} />
        </a>
        <a
          href="https://celsius.eco"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all hover:scale-[1.01]"
          style={{ borderColor: '#E8734A', color: '#E8734A' }}
        >
          Découvrir les accompagnements Celsius <ExternalLink size={16} />
        </a>
      </div>
    </div>
  )
}
