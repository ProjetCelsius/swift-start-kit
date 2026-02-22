import { TrendingDown, ExternalLink } from 'lucide-react'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { MOCK_FOOTPRINT } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

const SCOPE_COLORS = ['#1B4332', '#2D6A4F', '#93C5A0']

export default function DiagnosticSection6() {
  const hasFootprint = MOCK_FOOTPRINT.hasFootprint

  return (
    <SectionLayout sectionNumber={6}>
      {hasFootprint ? <WithFootprint /> : <WithoutFootprint />}
    </SectionLayout>
  )
}

function WithFootprint() {
  const d = MOCK_FOOTPRINT

  const scopeData = [
    { name: 'Scope 1 — Direct', value: d.scope1, pct: Math.round((d.scope1 / d.total) * 100) },
    { name: 'Scope 2 — Énergie', value: d.scope2, pct: Math.round((d.scope2 / d.total) * 100) },
    { name: 'Scope 3 — Chaîne de valeur', value: d.scope3, pct: Math.round((d.scope3 / d.total) * 100) },
  ]

  const trajectoryData = d.trajectoryYears.map((y, i) => ({
    year: y,
    'Tendance actuelle': d.trajectoryBau[i],
    'Trajectoire Paris': d.trajectoryParis[i],
  }))

  return (
    <>
      {/* Big number hero */}
      <div
        className="rounded-xl p-8 mb-6 text-center"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <p
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '2.5rem', color: '#1B4332' }}
        >
          {d.total.toLocaleString('fr-FR')}
        </p>
        <p className="text-sm mt-1" style={{ color: '#7A766D' }}>
          tCO₂e — Émissions totales annuelles
        </p>
      </div>

      {/* Scope breakdown stacked bar */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Répartition par scope
        </h3>
        {/* Simple horizontal stacked bar */}
        <div className="flex rounded-lg overflow-hidden h-10 mb-4">
          {scopeData.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center justify-center"
              style={{
                width: `${s.pct}%`,
                backgroundColor: SCOPE_COLORS[i],
                minWidth: s.pct > 5 ? 'auto' : '30px',
              }}
            >
              <span className="text-[10px] font-bold text-white">{s.pct}%</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {scopeData.map((s, i) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: SCOPE_COLORS[i] }} />
                <span className="text-xs" style={{ color: '#2A2A28' }}>{s.name}</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#2A2A28' }}>
                {s.value.toLocaleString('fr-FR')} tCO₂e
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmarking cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <BenchCard
          label="Par collaborateur"
          value={`${d.intensityPerEmployee} tCO₂e`}
          sector={`${d.sectorAvgIntensity} tCO₂e`}
          isBetter={d.intensityPerEmployee < d.sectorAvgIntensity}
        />
        <BenchCard
          label="Par k€ de CA"
          value={`${d.intensityPerRevenue} tCO₂e`}
          sector={`${d.sectorAverageRevenue} tCO₂e`}
          isBetter={d.intensityPerRevenue < d.sectorAverageRevenue}
        />
      </div>

      {/* Trajectory chart */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Trajectoire implicite
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE3" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#B0AB9F' }} />
              <YAxis tick={{ fontSize: 11, fill: '#B0AB9F' }} />
              <Tooltip
                formatter={(v: any) => `${Number(v).toLocaleString('fr-FR')} tCO₂e`}
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #EDEAE3' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Tendance actuelle" stroke="#DC4A4A" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="6 3" />
              <Line type="monotone" dataKey="Trajectoire Paris" stroke="#1B4332" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

function BenchCard({ label, value, sector, isBetter }: { label: string; value: string; sector: string; isBetter: boolean }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#B0AB9F', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.5rem', color: '#1B4332' }}>
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <TrendingDown size={14} color={isBetter ? '#1B4332' : '#DC4A4A'} />
        <p className="text-xs" style={{ color: isBetter ? '#1B4332' : '#DC4A4A' }}>
          {isBetter ? 'Mieux que' : 'Au-dessus de'} la moyenne sectorielle ({sector})
        </p>
      </div>
    </div>
  )
}

function WithoutFootprint() {
  const categories = MOCK_FOOTPRINT.estimatedCategories
  const maxVal = Math.max(...categories.map(c => c.value))

  return (
    <>
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: '#F5EDE4', borderLeft: '3px solid #B87333' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: '#2A2A28' }}>
          Vous n'avez pas encore réalisé de Bilan Carbone. Voici une <strong>estimation</strong> basée sur votre secteur et votre taille.
        </p>
      </div>

      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Profil estimé des émissions
        </h3>
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs">{cat.label}</span>
                <span className="text-xs font-semibold" style={{ color: '#1B4332' }}>
                  {cat.value.toLocaleString('fr-FR')} tCO₂e
                </span>
              </div>
              <div className="h-2.5 rounded-full" style={{ backgroundColor: '#EDEAE3' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(cat.value / maxVal) * 100}%`, backgroundColor: '#1B4332', opacity: 0.6 + (cat.value / maxVal) * 0.4 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="https://calendly.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: '#B87333' }}
      >
        Réaliser votre Bilan Carbone avec Celsius <ExternalLink size={16} />
      </a>
    </>
  )
}
