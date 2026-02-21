import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { ExternalLink } from 'lucide-react'
import { MOCK_FOOTPRINT } from '@/data/mockDiagnosticData'

const SCOPE_COLORS = { scope1: '#1B4332', scope2: '#2D6A4F', scope3: '#93C5A0' }

export default function DiagnosticSection6() {
  const [hasFootprint, setHasFootprint] = useState(MOCK_FOOTPRINT.hasFootprint)

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
        >
          Empreinte carbone contextualisée
        </h2>
        {/* Demo toggle */}
        <button
          onClick={() => setHasFootprint(!hasFootprint)}
          className="text-xs px-3 py-1 rounded-full border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-texte-secondary)' }}
        >
          {hasFootprint ? 'Voir sans bilan' : 'Voir avec bilan'}
        </button>
      </div>

      {hasFootprint ? <StateA /> : <StateB />}
    </div>
  )
}

// ── STATE A: Has carbon footprint ────────────────────────
function StateA() {
  const d = MOCK_FOOTPRINT

  const scopeData = [
    { name: 'Scope 1', value: d.scope1, color: SCOPE_COLORS.scope1 },
    { name: 'Scope 2', value: d.scope2, color: SCOPE_COLORS.scope2 },
    { name: 'Scope 3', value: d.scope3, color: SCOPE_COLORS.scope3 },
  ]

  const trajectoryData = d.trajectoryYears.map((y, i) => ({
    year: y,
    'Tendance actuelle': d.trajectoryBau[i],
    'Trajectoire Paris': d.trajectoryParis[i],
  }))

  const sectorPos = Math.min((d.intensityPerEmployee / (d.sectorAvgIntensity * 1.8)) * 100, 100)
  const sectorAvgPos = Math.min((d.sectorAvgIntensity / (d.sectorAvgIntensity * 1.8)) * 100, 100)

  return (
    <>
      {/* Total */}
      <div
        className="rounded-xl p-8 mb-6 text-center"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
          Émissions totales
        </p>
        <p className="text-4xl font-bold mb-1" style={{ color: 'var(--color-celsius-900)' }}>
          {d.total.toLocaleString('fr-FR')}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>tCO₂e / an</p>

        <div className="flex justify-center gap-4 mt-4">
          {scopeData.map(s => (
            <div key={s.name} className="text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: s.color }} />
              <p className="text-xs font-medium">{s.name}</p>
              <p className="text-sm font-bold">{s.value.toLocaleString('fr-FR')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scope breakdown bar */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Répartition par scope</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scopeData} layout="vertical" barSize={28}>
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-texte)' }} width={70} />
              <Tooltip
                formatter={(v: any) => `${Number(v).toLocaleString('fr-FR')} tCO₂e`}
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {scopeData.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Intensity cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-2xl font-bold" style={{ color: 'var(--color-celsius-900)' }}>{d.intensityPerEmployee}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-texte-secondary)' }}>tCO₂e / collaborateur</p>
        </div>
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-2xl font-bold" style={{ color: 'var(--color-celsius-900)' }}>{d.intensityPerRevenue}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-texte-secondary)' }}>tCO₂e / k€ CA</p>
        </div>
      </div>

      {/* Sector benchmark */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Positionnement sectoriel</h3>
        <p className="text-xs mb-3" style={{ color: 'var(--color-texte-secondary)' }}>
          Intensité carbone par collaborateur (tCO₂e/salarié)
        </p>
        <div className="relative h-6 rounded-full" style={{ backgroundColor: 'var(--color-gris-200)' }}>
          {/* Sector avg marker */}
          <div
            className="absolute top-0 h-full border-r-2 border-dashed z-10"
            style={{ left: `${sectorAvgPos}%`, borderColor: 'var(--color-gris-400)' }}
          />
          <div
            className="absolute -top-5 text-xs font-medium"
            style={{ left: `${sectorAvgPos}%`, transform: 'translateX(-50%)', color: 'var(--color-gris-400)' }}
          >
            Moy. secteur
          </div>
          {/* Client position */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-3 z-20"
            style={{
              left: `${sectorPos}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: sectorPos > sectorAvgPos ? '#B87333' : '#1B4332',
              borderColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>0</span>
          <span className="text-xs" style={{ color: 'var(--color-gris-400)' }}>
            {Math.round(d.sectorAvgIntensity * 1.8)} tCO₂e/sal.
          </span>
        </div>
        <p className="text-xs mt-3 font-medium" style={{ color: sectorPos > sectorAvgPos ? '#B87333' : '#1B4332' }}>
          {sectorPos > sectorAvgPos
            ? `Au-dessus de la moyenne sectorielle (${d.sectorAvgIntensity} tCO₂e/sal.)`
            : `En dessous de la moyenne sectorielle (${d.sectorAvgIntensity} tCO₂e/sal.)`
          }
        </p>
      </div>

      {/* Trajectory */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Trajectoire implicite</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <Tooltip
                formatter={(v: any) => `${Number(v).toLocaleString('fr-FR')} tCO₂e`}
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="Tendance actuelle" stroke="#DC4A4A" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="6 3" />
              <Line type="monotone" dataKey="Trajectoire Paris" stroke="#1B4332" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

// ── STATE B: No carbon footprint ─────────────────────────
function StateB() {
  const categories = MOCK_FOOTPRINT.estimatedCategories
  const maxVal = Math.max(...categories.map(c => c.value))

  return (
    <>
      <div
        className="rounded-xl p-6 mb-6 border-l-4"
        style={{
          backgroundColor: 'var(--color-accent-warm-light)',
          borderLeftColor: 'var(--color-accent-warm)',
        }}
      >
        <p className="text-sm leading-relaxed">
          Vous n'avez pas encore réalisé de Bilan Carbone. Voici une <strong>estimation de votre profil d'émissions</strong> basée sur votre secteur et votre taille.
        </p>
      </div>

      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-5">Profil estimé des émissions</h3>
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{cat.label}</span>
                <span className="text-xs font-bold" style={{ color: 'var(--color-celsius-900)' }}>
                  {cat.value.toLocaleString('fr-FR')} tCO₂e
                </span>
              </div>
              <div className="h-3 rounded-full" style={{ backgroundColor: 'var(--color-gris-200)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(cat.value / maxVal) * 100}%`,
                    backgroundColor: 'var(--color-celsius-900)',
                    opacity: 0.6 + (cat.value / maxVal) * 0.4,
                  }}
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
        style={{ backgroundColor: 'var(--color-corail-500)', boxShadow: 'var(--shadow-card)' }}
      >
        Réaliser votre Bilan Carbone avec Celsius <ExternalLink size={16} />
      </a>
    </>
  )
}
