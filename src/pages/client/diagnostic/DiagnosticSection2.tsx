import { ExternalLink, X } from 'lucide-react'
import { MOCK_PRIORITIES, MOCK_ANTI_RECOMMENDATION } from '@/data/mockDiagnosticData'

const EFFORT_STYLES: Record<string, { bg: string; color: string }> = {
  Rapide: { bg: 'var(--color-celsius-100)', color: 'var(--color-celsius-900)' },
  Projet: { bg: 'var(--color-gold-100)', color: 'var(--color-gold-500)' },
  Transformation: { bg: 'var(--color-corail-100)', color: 'var(--color-corail-500)' },
}

export default function DiagnosticSection2() {
  return (
    <div className="max-w-[640px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Ce que nous ferions à votre place
      </h2>

      {/* Priority cards */}
      <div className="space-y-4 mb-8">
        {MOCK_PRIORITIES.map(p => (
          <div
            key={p.number}
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-celsius-900)' }}
              >
                {p.number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
                  {p.why}
                </p>
                <div className="flex gap-2">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={EFFORT_STYLES[p.effort]}
                  >
                    {p.effort}
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--color-gris-100)', color: 'var(--color-texte-secondary)' }}
                  >
                    {p.budget}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="h-px mb-8" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Anti-recommendation */}
      <div
        className="rounded-xl p-6 mb-8 border-l-4"
        style={{ backgroundColor: '#FEE2E2', borderLeftColor: '#DC4A4A' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <X size={18} color="#DC4A4A" />
          <h3 className="text-base font-bold" style={{ color: '#DC4A4A' }}>
            {MOCK_ANTI_RECOMMENDATION.title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texte)' }}>
          {MOCK_ANTI_RECOMMENDATION.text}
        </p>
      </div>

      {/* CTA */}
      <a
        href="https://calendly.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--color-corail-500)', boxShadow: 'var(--shadow-card)' }}
      >
        Mettre en œuvre ces recommandations <ExternalLink size={16} />
      </a>
    </div>
  )
}
