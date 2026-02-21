import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { MOCK_HUMAN_CAPITAL } from '@/data/mockDiagnosticData'
import { POPULATION_PROFILES } from '@/data/bloc4Data'

const PROFILE_COLORS = POPULATION_PROFILES.map(p => p.color)

export default function DiagnosticSection5() {
  const { currentFTE, recommendedFTE, population, analysis } = MOCK_HUMAN_CAPITAL
  const fillPercent = Math.min((currentFTE / recommendedFTE) * 100, 100)

  const popData = POPULATION_PROFILES.map((p, i) => ({ name: p.label, value: population[i] }))

  return (
    <div className="max-w-[640px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Capital humain climat
      </h2>

      {/* FTE Gauge */}
      <div
        className="rounded-xl p-8 mb-6 text-center"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-6">Dimensionnement de l'équipe climat</h3>

        {/* Horizontal gauge */}
        <div className="max-w-md mx-auto mb-4">
          <div className="relative">
            <div
              className="h-8 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-gris-200)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 relative"
                style={{
                  width: `${fillPercent}%`,
                  backgroundColor: fillPercent < 50 ? '#E8734A' : fillPercent < 75 ? '#F5A623' : '#1B5E3B',
                  minWidth: '40px',
                }}
              >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                  {currentFTE} ETP
                </span>
              </div>
            </div>
            {/* Recommended marker */}
            <div
              className="absolute top-0 h-8 border-r-2 border-dashed"
              style={{ left: '100%', borderColor: 'var(--color-celsius-900)' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>0</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--color-celsius-900)' }}>
              Recommandé : {recommendedFTE} ETP
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#E8734A' }}>{currentFTE}</p>
            <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>ETP actuel</p>
          </div>
          <div className="w-px" style={{ backgroundColor: 'var(--color-border)' }} />
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#1B5E3B' }}>{recommendedFTE}</p>
            <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>ETP recommandé</p>
          </div>
        </div>
      </div>

      {/* Population donut */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Profils déclarés par vos collaborateurs</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={popData} innerRadius={50} outerRadius={85} dataKey="value" strokeWidth={2} stroke="white"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {PROFILE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {POPULATION_PROFILES.map((p, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.label} ({population[i]}%)
            </span>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Analyse</h3>
        {analysis.map((para, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--color-texte-secondary)',
              marginBottom: i < analysis.length - 1 ? '16px' : '0',
            }}
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}
