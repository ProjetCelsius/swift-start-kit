import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  PERCEPTION_LABELS, MOCK_PERCEPTION_GAPS,
  MOCK_POPULATION_COMPARISON, MOCK_DG_COMPARISON,
} from '@/data/mockDiagnosticData'
import { POPULATION_PROFILES } from '@/data/bloc4Data'

const PROFILE_COLORS = POPULATION_PROFILES.map(p => p.color)

function gapSeverityColor(gap: number) {
  if (gap > 2) return '#DC4A4A'
  if (gap >= 1) return '#E8734A'
  return '#1B5E3B'
}

export default function DiagnosticSection4() {
  const { rseScores, rsePredictions, employeeScores } = MOCK_PERCEPTION_GAPS

  // Bar chart data
  const barData = PERCEPTION_LABELS.map((label, i) => ({
    name: `P${i + 1}`,
    fullLabel: label,
    RSE: rseScores[i],
    Prédiction: rsePredictions[i],
    Collaborateurs: employeeScores[i],
  }))

  // Top 3 gaps (RSE vs Employee)
  const gaps = PERCEPTION_LABELS.map((label, i) => ({
    label,
    index: i,
    rse: rseScores[i],
    pred: rsePredictions[i],
    emp: employeeScores[i],
    gap: Math.abs(rseScores[i] - employeeScores[i]),
  }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)

  // Population data
  const { rseEstimate, employeeReal } = MOCK_POPULATION_COMPARISON
  const estData = POPULATION_PROFILES.map((p, i) => ({ name: p.label, value: rseEstimate[i] }))
  const realData = POPULATION_PROFILES.map((p, i) => ({ name: p.label, value: employeeReal[i] }))

  // Find biggest population discrepancy
  const popGaps = POPULATION_PROFILES.map((p, i) => ({
    label: p.label,
    diff: Math.abs(rseEstimate[i] - employeeReal[i]),
    est: rseEstimate[i],
    real: employeeReal[i],
  })).sort((a, b) => b.diff - a.diff)

  return (
    <div className="max-w-[720px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Écarts de perception
      </h2>

      {/* Main bar chart */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Triple comparaison : RSE × Prédiction × Collaborateurs</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={2} barCategoryGap="20%">
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-texte)' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}/10`, String(name)]}
                labelFormatter={(label: any) => {
                  const idx = parseInt(String(label).replace('P', '')) - 1
                  return PERCEPTION_LABELS[idx] || String(label)
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
              <Bar dataKey="RSE" fill="#1B5E3B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Prédiction" fill="#E8734A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Collaborateurs" fill="#93C5A0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 3 gaps */}
      <div className="space-y-3 mb-8">
        {gaps.map((g, i) => (
          <div
            key={i}
            className="rounded-xl p-5 border-l-4"
            style={{
              backgroundColor: 'var(--color-blanc)',
              boxShadow: 'var(--shadow-card)',
              borderLeftColor: gapSeverityColor(g.gap),
            }}
          >
            <p className="text-sm font-semibold mb-2">{g.label}</p>
            <div className="flex gap-4 mb-2">
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#1B5E3B' }} />
                RSE : {g.rse.toFixed(1)}
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#E8734A' }} />
                Prédiction : {g.pred.toFixed(1)}
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#93C5A0' }} />
                Collaborateurs : {g.emp.toFixed(1)}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-texte-secondary)' }}>
              Écart de {g.gap.toFixed(1)} points : vous estimez {g.rse.toFixed(1)}/10, vos équipes répondent {g.emp.toFixed(1)}/10.
            </p>
          </div>
        ))}
      </div>

      {/* Population map */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-5">Carte de population : estimation vs réalité</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-center mb-2" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
              Votre estimation
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
            <p className="text-xs font-semibold uppercase tracking-wider text-center mb-2" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
              Auto-déclaration
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
          {POPULATION_PROFILES.map((p, i) => (
            <span key={i} className="flex items-center gap-1 text-xs">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
        {popGaps[0] && (
          <p className="text-xs mt-4 text-center leading-relaxed" style={{ color: 'var(--color-texte-secondary)' }}>
            Plus grand écart : <strong>{popGaps[0].label}</strong> — vous estimez {popGaps[0].est}%, réalité {popGaps[0].real}% ({popGaps[0].diff > 0 ? '+' : ''}{popGaps[0].real - popGaps[0].est} points).
          </p>
        )}
      </div>

      {/* DG comparison */}
      {MOCK_DG_COMPARISON.hasResponded && (
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <h3 className="text-base font-bold mb-4">Regard croisé RSE / Direction</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-fond)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
                Budget climat
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-gris-400)' }}>Direction déclare</p>
                  <p className="text-sm font-semibold">{MOCK_DG_COMPARISON.budgetDeclared}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-gris-400)' }}>RSE perçoit</p>
                  <p className="text-sm font-semibold">{MOCK_DG_COMPARISON.budgetPerceived}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-fond)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
                Adéquation des moyens
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-gris-400)' }}>Direction (DG5)</p>
                  <p className="text-sm font-bold" style={{ color: '#1B5E3B' }}>{MOCK_DG_COMPARISON.dgMeansScore}/10</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-gris-400)' }}>RSE (P2)</p>
                  <p className="text-sm font-bold" style={{ color: '#E8734A' }}>{MOCK_DG_COMPARISON.rseMeansScore}/10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
