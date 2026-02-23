import { useEffect } from 'react'
import { AlertTriangle, Quote } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import { POPULATION_PROFILES } from '@/data/bloc4Data'
import SectionLayout from '@/components/diagnostic/SectionLayout'
import { useAnalytics } from '@/hooks/useAnalytics'

const PROFILE_COLORS = POPULATION_PROFILES.map(p => p.color)
const SENTIMENT_STYLE: Record<string, { border: string }> = {
  positive: { border: '#1B4332' },
  neutral: { border: '#B0AB9F' },
  critical: { border: '#DC4A4A' },
}

export default function DiagnosticSection4() {
  const { track } = useAnalytics()
  useEffect(() => { track('section_view', { section: 4 }) }, [])

  const { perceptionData, populationEstimated, populationReal, verbatims } = mockDiagnostic.section4

  // Find biggest gap
  const sorted = [...perceptionData].sort((a, b) => Math.abs(b.rse - b.terrain) - Math.abs(a.rse - a.terrain))
  const biggest = sorted[0]
  const biggestGap = Math.abs(biggest.rse - biggest.terrain).toFixed(1)

  // Horizontal bar data
  const barData = perceptionData.map(d => ({
    name: d.label,
    'Votre perception': d.rse,
    'Votre prédiction': d.prediction,
    'Vos équipes': d.terrain,
    gap: Math.abs(d.rse - d.terrain),
  }))

  // Population donut data
  const labels = POPULATION_PROFILES.map(p => p.label)
  const estValues = [populationEstimated.moteurs, populationEstimated.engages, populationEstimated.indifferents, populationEstimated.sceptiques, populationEstimated.refractaires]
  const realValues = [populationReal.moteurs, populationReal.engages, populationReal.indifferents, populationReal.sceptiques, populationReal.refractaires]
  const estData = labels.map((l, i) => ({ name: l, value: estValues[i] }))
  const realData = labels.map((l, i) => ({ name: l, value: realValues[i] }))

  return (
    <SectionLayout sectionNumber={4}>
      {/* Triple regard explanation */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-3"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Le triple regard
        </h3>
        <div className="flex flex-wrap gap-4 mb-3">
          {[
            { color: '#1B4332', label: 'Ce que vous pensez', sub: 'Perception RSE' },
            { color: '#B87333', label: 'Ce que vous prédisez', sub: 'Prédiction RSE' },
            { color: '#E8734A', label: "Ce que vos équipes disent", sub: 'Sondage terrain' },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#2A2A28' }}>{d.label}</p>
                <p className="text-[10px]" style={{ color: '#B0AB9F' }}>{d.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#7A766D' }}>
          Nous comparons 3 regards : votre évaluation, ce que vous imaginiez que vos équipes répondraient, et ce qu'elles ont réellement dit.
        </p>
      </div>

      {/* Horizontal bar chart */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" barGap={2} barSize={8} margin={{ left: 20 }}>
              <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10, fill: '#B0AB9F' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#2A2A28' }} width={130} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #EDEAE3' }}
                formatter={(v: any, name: any) => [`${Number(v).toFixed(1)}/10`, String(name)]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Votre perception" fill="#1B4332" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Votre prédiction" fill="#B87333" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Vos équipes" fill="#E8734A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biggest gap callout */}
      <div
        className="rounded-xl p-5 mb-6 flex items-start gap-3"
        style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #DC4A4A' }}
      >
        <AlertTriangle size={20} color="#DC4A4A" className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: '#DC4A4A' }}>
            Plus grand écart : « {biggest.label} »
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#2A2A28' }}>
            Écart de {biggestGap} points — vous estimez {biggest.rse.toFixed(1)}/10, vos équipes répondent {biggest.terrain.toFixed(1)}/10.
            {biggest.label === 'Objectifs clairs' && " Vous pensez que vos objectifs sont clairs. Vos équipes ne les voient pas."}
          </p>
        </div>
      </div>

      {/* Population distribution */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Répartition de vos équipes
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-center mb-3" style={{ color: '#7A766D', letterSpacing: '0.05em' }}>
              Ce que vous estimiez
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={estData} innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={2} stroke="white">
                    {PROFILE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-center mb-3" style={{ color: '#7A766D', letterSpacing: '0.05em' }}>
              La réalité mesurée
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={realData} innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={2} stroke="white">
                    {PROFILE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          {POPULATION_PROFILES.map(p => (
            <span key={p.id} className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
        {/* Shift summary */}
        <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: '#F7F5F0' }}>
          <p className="text-xs" style={{ color: '#7A766D' }}>
            Vous estimiez <strong>{populationEstimated.engages + populationEstimated.moteurs}%</strong> d'engagés/moteurs.
            Réalité : <strong>{populationReal.engages + populationReal.moteurs}%</strong>.
            Écart de <strong style={{ color: '#DC4A4A' }}>{(populationEstimated.engages + populationEstimated.moteurs) - (populationReal.engages + populationReal.moteurs)} points</strong>.
          </p>
        </div>
      </div>

      {/* Verbatims */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Paroles d'équipes
        </h3>
        <div className="space-y-3">
          {verbatims.map((v, i) => (
            <div
              key={i}
              className="rounded-lg p-4 flex items-start gap-3"
              style={{ backgroundColor: '#F7F5F0', borderLeft: `3px solid ${SENTIMENT_STYLE[v.sentiment].border}` }}
            >
              <Quote size={14} color="#B0AB9F" className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm leading-relaxed italic" style={{ color: '#2A2A28' }}>
                  « {v.text} »
                </p>
                <p className="text-[10px] mt-1.5 font-semibold" style={{ color: '#B0AB9F' }}>
                  — {v.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
