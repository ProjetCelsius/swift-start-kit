import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'
import { useAnalytics } from '@/hooks/useAnalytics'

const PRIORITY_COLORS = ['#1B4332', '#B87333', '#5B8C6E']
const EFFORT_STYLES: Record<string, { bg: string; color: string }> = {
  Rapide: { bg: '#E8F0EB', color: '#1B4332' },
  Projet: { bg: '#F5EDE4', color: '#B87333' },
}

export default function DiagnosticSection2() {
  const { track } = useAnalytics()
  useEffect(() => { track('section_view', { section: 2 }) }, [])

  const { priorities, antiRecommendation } = mockDiagnostic.section2

  return (
    <SectionLayout sectionNumber={2} showAnalyst>
      {/* Anti-recommendation FIRST */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #DC2626' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} color="#DC2626" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.95rem', color: '#DC2626' }}>
            Ce que nous ne recommandons PAS
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#2A2A28' }}>
          {antiRecommendation}
        </p>
      </div>

      {/* Priorities */}
      <h3
        className="text-xs font-semibold uppercase tracking-wider mb-4"
        style={{ color: '#B0AB9F', letterSpacing: '0.05em' }}
      >
        Nos 3 priorités
      </h3>

      <div className="space-y-4 mb-8">
        {priorities.map((p, i) => (
          <div
            key={i}
            className="rounded-xl p-6"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EDEAE3',
              borderLeft: `3px solid ${PRIORITY_COLORS[i]}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: PRIORITY_COLORS[i] }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.1rem', color: '#FFFFFF' }}>
                  0{i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="mb-2"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A766D' }}>
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
                    style={{ backgroundColor: '#F0EDE6', color: '#7A766D' }}
                  >
                    {p.budget}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Matrix */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Matrice impact / effort
        </h3>
        <div className="relative" style={{ height: '240px' }}>
          {/* Grid lines */}
          <div className="absolute inset-0 border rounded-lg" style={{ borderColor: '#EDEAE3' }}>
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: '#EDEAE3' }} />
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: '#EDEAE3' }} />
          </div>
          {/* Labels */}
          <span className="absolute -left-1 top-1 text-[10px] font-semibold" style={{ color: '#B0AB9F' }}>Impact fort</span>
          <span className="absolute -left-1 bottom-1 text-[10px] font-semibold" style={{ color: '#B0AB9F' }}>Impact faible</span>
          <span className="absolute bottom-[-18px] left-1 text-[10px] font-semibold" style={{ color: '#B0AB9F' }}>Effort faible</span>
          <span className="absolute bottom-[-18px] right-1 text-[10px] font-semibold" style={{ color: '#B0AB9F' }}>Effort fort</span>
          {/* Dots */}
          {priorities.map((p, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                left: `${p.impactX}%`,
                bottom: `${p.impactY - 10}%`,
                transform: 'translate(-50%, 50%)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: PRIORITY_COLORS[i] }}
              >
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
