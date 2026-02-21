import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { MOCK_MATURITY } from '@/data/mockDiagnosticData'

export default function DiagnosticSection3() {
  const { globalScore, globalLetter, globalLabel, globalColor, dimensions } = MOCK_MATURITY

  const radarData = dimensions.map(d => ({
    dimension: d.label.replace(' et ', ' &\n'),
    score: d.score,
    fullMark: 100,
  }))

  return (
    <div className="max-w-[640px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Score de maturité
      </h2>

      {/* Global score */}
      <div
        className="rounded-xl p-8 mb-6 text-center"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3 text-5xl font-bold text-white"
          style={{ backgroundColor: globalColor }}
        >
          {globalLetter}
        </div>
        <p className="text-lg font-semibold mb-1">{globalLabel}</p>
        <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
          Score global : <span className="font-bold" style={{ color: globalColor }}>{globalScore}</span>/100
        </p>
      </div>

      {/* Radar chart */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--color-border-light)" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: 'var(--color-texte)' }} />
              <Radar
                dataKey="score"
                stroke="#1B5E3B"
                fill="#1B5E3B"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ r: 4, fill: '#1B5E3B' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dimension blocks */}
      <div className="space-y-4">
        {dimensions.map(dim => (
          <div
            key={dim.id}
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: dim.color }}
              >
                {dim.letter}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{dim.label}</p>
                  <span className="text-sm font-bold" style={{ color: dim.color }}>{dim.score}/100</span>
                </div>
                <div className="h-1.5 rounded-full mt-1.5" style={{ backgroundColor: 'var(--color-gris-200)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${dim.score}%`, backgroundColor: dim.color }}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-texte-secondary)' }}>
              {dim.analysis}
            </p>

            <span
              className="text-xs font-medium px-3 py-1 rounded-full inline-block"
              style={{
                backgroundColor: dim.sectorPositive ? 'var(--color-celsius-100)' : 'var(--color-gris-100)',
                color: dim.sectorPositive ? 'var(--color-celsius-900)' : 'var(--color-texte-secondary)',
              }}
            >
              {dim.sectorPosition}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
