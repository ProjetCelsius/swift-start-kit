import { User, Users } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

export default function DiagnosticSection5() {
  const { currentFTE, recommendedFTE, analysisText, recommendations } = mockDiagnostic.section5

  return (
    <SectionLayout sectionNumber={5} showAnalyst>
      {/* FTE visual comparison */}
      <div
        className="rounded-xl p-8 mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-6 text-center"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Dimensionnement de l'équipe climat
        </h3>

        <div className="flex items-end justify-center gap-16">
          {/* Current */}
          <div className="text-center">
            <div className="flex items-end justify-center gap-1 mb-3" style={{ height: '80px' }}>
              <div className="relative">
                <User size={64} color="#EDEAE3" strokeWidth={1.5} />
                {/* Half fill overlay */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '50%' }}>
                  <User size={64} color="#B87333" strokeWidth={1.5} className="absolute bottom-0" />
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.8rem', color: '#B87333' }}>
              {currentFTE}
            </p>
            <p className="text-xs mt-1" style={{ color: '#7A766D' }}>ETP aujourd'hui</p>
          </div>

          {/* Arrow */}
          <div className="mb-8">
            <div className="text-2xl" style={{ color: '#EDEAE3' }}>→</div>
          </div>

          {/* Recommended */}
          <div className="text-center">
            <div className="flex items-end justify-center gap-1 mb-3" style={{ height: '80px' }}>
              <Users size={64} color="#1B4332" strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.8rem', color: '#1B4332' }}>
              {recommendedFTE}
            </p>
            <p className="text-xs mt-1" style={{ color: '#7A766D' }}>ETP recommandés</p>
          </div>
        </div>

        {/* Gap highlight */}
        <div
          className="mt-6 mx-auto max-w-sm text-center rounded-lg p-3"
          style={{ backgroundColor: '#F5EDE4' }}
        >
          <p className="text-sm font-semibold" style={{ color: '#B87333' }}>
            Gap : {(recommendedFTE - currentFTE).toFixed(1)} ETP à combler
          </p>
        </div>
      </div>

      {/* Analysis quote */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: '#F7F5F0', borderLeft: '3px solid #1B4332' }}
      >
        <p className="text-sm leading-[1.75] italic" style={{ color: '#2A2A28' }}>
          « {analysisText} »
        </p>
      </div>

      {/* Recommendations */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Actions recommandées
        </h3>
        <div className="space-y-3">
          {recommendations.map((r, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: '#1B4332' }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: '#2A2A28' }}>{r}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
