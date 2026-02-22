import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'

const GRADE_DATA = [
  { name: 'A', value: 2, color: '#1B4332' },
  { name: 'B', value: 5, color: '#2D6A4F' },
  { name: 'C', value: 4, color: '#B87333' },
  { name: 'D', value: 1, color: '#DC4A4A' },
]
const TOTAL = GRADE_DATA.reduce((s, d) => s + d.value, 0)

const FAMILY_DATA = [
  { name: 'Les Méthodiques', value: 4 },
  { name: 'Les Opérationnels', value: 3 },
  { name: 'Les Éclairés', value: 3 },
  { name: 'Les Engagés', value: 2 },
]

const RADAR_DATA = [
  { subject: 'Gouvernance', value: 65 },
  { subject: 'Mesure & données', value: 58 },
  { subject: 'Stratégie', value: 52 },
  { subject: 'Culture', value: 48 },
]

const DIMENSION_BARS = [
  { name: 'Gouvernance climat', score: 65 },
  { name: 'Mesure et données', score: 58 },
  { name: 'Stratégie et trajectoire', score: 52 },
  { name: 'Culture et engagement', score: 48 },
]

const ANALYSTS = [
  { name: 'Guillaume Pakula', diagnostics: 3, delay: '11j', survey: '74%' },
  { name: 'Thomas Martin', diagnostics: 2, delay: '14j', survey: '65%' },
]

const SPARKLINE = [3, 5, 4, 6, 5, 7, 8]

export default function AdminStats() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: '1.5rem', color: '#2A2A28', marginBottom: 28 }}>
        Statistiques
      </h1>

      {/* SECTION 1 — AGGREGATE METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {/* Diagnostics réalisés */}
        <MetricCard value="12" label="Diagnostics réalisés" pill={{ text: '3 ce mois', bg: '#E8F0EB', color: '#1B4332' }} />

        {/* Score moyen */}
        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '2.5rem', color: '#1B4332', lineHeight: 1 }}>58/100</span>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', backgroundColor: '#2D6A4F',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '0.85rem', color: '#fff',
            }}>B</span>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D' }}>Score moyen de maturité</p>
        </div>

        {/* Profil le plus fréquent */}
        <div style={{ ...cardStyle }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1.5rem', color: '#1B4332', lineHeight: 1 }}>SMFD</span>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D', marginTop: 4 }}>
            Profil le plus fréquent · <span style={{ color: '#2A2A28', fontWeight: 500 }}>Les Méthodiques</span>
          </p>
        </div>

        {/* Taux de réponse sondage */}
        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '2.5rem', color: '#1B4332', lineHeight: 1 }}>68%</span>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D', marginTop: 4 }}>Taux de réponse sondage moyen</p>
            </div>
            {/* Mini sparkline */}
            <svg width="60" height="28" viewBox="0 0 60 28" style={{ flexShrink: 0 }}>
              <polyline
                points={SPARKLINE.map((v, i) => `${i * 10},${28 - v * 3}`).join(' ')}
                fill="none" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* SECTION 2 — DISTRIBUTION CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {/* Grade pie */}
        <div style={{ ...cardStyle }}>
          <SectionLabel text="Répartition par grade" />
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GRADE_DATA} innerRadius={60} outerRadius={95} dataKey="value" strokeWidth={2} stroke="#fff">
                  {GRADE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1.5rem', fill: '#2A2A28' }}>
                  {TOTAL}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            {GRADE_DATA.map(d => (
              <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        {/* Family bar chart */}
        <div style={{ ...cardStyle }}>
          <SectionLabel text="Répartition par famille de profil" />
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAMILY_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#B0AB9F' }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#2A2A28', fontFamily: 'DM Sans, sans-serif' }} />
                <Bar dataKey="value" fill="#1B4332" barSize={16} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3 — DIMENSION COMPARISON */}
      <div style={{ ...cardStyle, marginBottom: 32 }}>
        <SectionLabel text="Score moyen par dimension (tous clients)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ width: 300, height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#EDEAE3" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', fill: '#2A2A28' }} />
                <Radar dataKey="value" stroke="#1B4332" strokeWidth={2} fill="#1B4332" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            {DIMENSION_BARS.map(d => {
              const color = d.score >= 60 ? '#1B4332' : d.score >= 50 ? '#2D6A4F' : '#B87333'
              return (
                <div key={d.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28' }}>{d.name}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.85rem', color: '#7A766D' }}>{d.score}</span>
                  </div>
                  <div style={{ height: 6, backgroundColor: '#F0EDE6', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${d.score}%`, backgroundColor: color, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4 — ANALYST PERFORMANCE */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px' }}>
          <SectionLabel text="Performance analystes" />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
          <thead>
            <tr style={{ backgroundColor: '#F0EDE6' }}>
              {['Analyste', 'Diagnostics', 'Délai moyen', 'Taux sondage moyen'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 16px', fontSize: '0.7rem',
                  fontWeight: 600, textTransform: 'uppercase' as const, color: '#B0AB9F',
                  letterSpacing: '0.08em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANALYSTS.map(a => (
              <tr key={a.name} style={{ borderBottom: '1px solid #EDEAE3' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1B4332',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.5rem', fontWeight: 600, color: '#fff',
                    }}>{a.name.split(' ').map(n => n[0]).join('')}</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#2A2A28' }}>{a.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#2A2A28' }}>{a.diagnostics}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#2A2A28' }}>{a.delay}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#2A2A28' }}>{a.survey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetricCard({ value, label, pill }: { value: string; label: string; pill: { text: string; bg: string; color: string } }) {
  return (
    <div style={{ ...cardStyle }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '2.5rem', color: '#1B4332', lineHeight: 1 }}>{value}</span>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 500,
          backgroundColor: pill.bg, color: pill.color, fontFamily: 'DM Sans, sans-serif',
        }}>{pill.text}</span>
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D' }}>{label}</p>
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem',
      textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 16,
    }}>{text}</p>
  )
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
  padding: 24, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
}
