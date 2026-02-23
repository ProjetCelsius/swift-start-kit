import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import { MOCK_MATURITY } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

const GRADE_COLORS: Record<string, string> = { A: '#1B4332', B: '#5B8C6E', C: '#B87333', D: '#9B2C2C' }
const GRADE_SCALE = [
  { letter: 'A', label: '≥ 75', color: '#1B4332' },
  { letter: 'B', label: '50–74', color: '#5B8C6E' },
  { letter: 'C', label: '25–49', color: '#B87333' },
  { letter: 'D', label: '< 25', color: '#9B2C2C' },
]

export default function DiagnosticSection3() {
  const { globalScore, globalGrade, dimensions, sectorAverages, profileSummary } = mockDiagnostic.section3
  const globalColor = GRADE_COLORS[globalGrade]
  const sectorGlobal = MOCK_MATURITY.sectorAverages?.global ?? 59
  const aboveSector = globalScore > sectorGlobal

  // Circular progress ring data
  const ringData = [
    { name: 'score', value: globalScore },
    { name: 'rest', value: 100 - globalScore },
  ]

  // Radar data with sector overlay
  const radarData = dimensions.map(d => ({
    dimension: d.name.replace('et ', '&\n'),
    score: d.score,
    sector: sectorAverages[d.name as keyof typeof sectorAverages] || 50,
  }))

  return (
    <SectionLayout sectionNumber={3}>
      {/* Score hero with circular ring */}
      <div
        className="rounded-xl p-8 mb-4 text-center"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <div className="relative w-[120px] h-[120px] mx-auto mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ringData}
                innerRadius={45}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={globalColor} />
                <Cell fill="#EDEAE3" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '2rem', color: globalColor }}>
              {globalGrade}
            </span>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>
          Votre score de maturité climat
        </p>
        <p className="text-sm mt-1" style={{ color: '#7A766D' }}>
          Score global : <span className="font-bold" style={{ color: globalColor }}>{globalScore}</span>/100
        </p>
        <p style={{ fontSize: '0.78rem', color: '#B0AB9F', marginTop: 4 }}>
          Moyenne sectorielle : {sectorGlobal}/100
          {aboveSector && <span style={{ color: '#1B4332', marginLeft: 4 }}>↑</span>}
        </p>
      </div>

      {/* Profile summary */}
      {profileSummary && (
        <div
          className="rounded-xl mb-6"
          style={{ backgroundColor: 'var(--color-fond)', padding: '20px 24px', borderRadius: 12 }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28', marginBottom: 8 }}>
            Votre profil en un mot
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', lineHeight: 1.7, color: '#2A2A28' }}>
            {profileSummary}
          </p>
        </div>
      )}

      {/* 2×2 Dimension cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {dimensions.map(dim => {
          const dimColor = GRADE_COLORS[dim.grade]
          const sectorAvg = sectorAverages[dim.name as keyof typeof sectorAverages] || 50
          const dimDetail = MOCK_MATURITY.dimensions.find(d => d.label === dim.name)
          return (
            <div
              key={dim.name}
              className="rounded-xl p-5"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold" style={{ color: '#2A2A28' }}>{dim.name}</p>
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: dimColor }}
                >
                  {dim.grade}
                </span>
              </div>
              <p className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: dimColor }}>
                {dim.score}<span className="text-xs font-normal text-[#B0AB9F]">/100</span>
              </p>
              {/* Main score bar */}
              <div className="relative">
                <div className="h-2 rounded-full" style={{ backgroundColor: '#EDEAE3' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${dim.score}%`, backgroundColor: dimColor }}
                  />
                </div>
                {/* Sector average dashed marker */}
                <div
                  className="absolute top-0 h-2 border-r-2 border-dashed"
                  style={{ left: `${sectorAvg}%`, borderColor: '#B0AB9F' }}
                />
              </div>
              {/* Sector comparison mini bar */}
              <div className="relative mt-2">
                <div className="h-[3px] rounded-full" style={{ backgroundColor: 'var(--color-gris-200)' }} />
                <div
                  className="absolute"
                  style={{
                    left: `${sectorAvg}%`,
                    top: -4,
                    transform: 'translateX(-50%)',
                    fontSize: '8px',
                    color: '#B0AB9F',
                    lineHeight: 1,
                  }}
                >
                  ▲
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#B0AB9F', marginTop: 4 }}>
                Moy. sectorielle : {sectorAvg}
              </p>
              {/* Dimension analysis */}
              {dimDetail?.analysis && (
                <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: '#7A766D', marginTop: 8 }}>
                  {dimDetail.analysis}
                </p>
              )}
              {dimDetail?.sectorPosition && (
                <p style={{ fontSize: '0.7rem', fontWeight: 600, marginTop: 4, color: dimDetail.sectorPositive ? '#1B4332' : '#B87333' }}>
                  {dimDetail.sectorPositive ? '↑' : '↓'} {dimDetail.sectorPosition}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Radar chart with sector overlay */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#EDEAE3" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#2A2A28' }} />
              <Radar dataKey="sector" stroke="#B0AB9F" fill="transparent" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r: 3, fill: '#B0AB9F' }} />
              <Radar dataKey="score" stroke="#1B4332" fill="#1B4332" fillOpacity={0.12} strokeWidth={2} dot={{ r: 4, fill: '#1B4332' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#2A2A28' }}>
            <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: '#1B4332' }} /> Votre score
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#B0AB9F' }}>
            <span className="w-3 h-0.5 inline-block rounded border-t border-dashed" style={{ borderColor: '#B0AB9F' }} /> Moyenne sectorielle
          </span>
        </div>
      </div>

      {/* Grade scale */}
      <div
        className="rounded-xl p-4 flex items-center gap-0"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        {GRADE_SCALE.map((g, i) => {
          const isActive = g.letter === globalGrade
          return (
            <div
              key={g.letter}
              className="flex-1 text-center py-2 relative"
              style={{
                backgroundColor: isActive ? g.color : 'transparent',
                borderRadius: i === 0 ? '8px 0 0 8px' : i === 3 ? '0 8px 8px 0' : '0',
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ fontFamily: 'var(--font-display)', color: isActive ? '#FFFFFF' : g.color }}
              >
                {g.letter}
              </span>
              <p className="text-[9px] mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#B0AB9F' }}>
                {g.label}
              </p>
              {isActive && (
                <div
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${g.color}` }}
                />
              )}
            </div>
          )
        })}
      </div>
    </SectionLayout>
  )
}
