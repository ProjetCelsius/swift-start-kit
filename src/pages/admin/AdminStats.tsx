import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { MOCK_STATS } from '@/data/mockAdminData'

// Letter colors for future use: A=#1B5E3B, B=#2D7A50, C=#E8734A, D=#DC4A4A

export default function AdminStats() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Statistiques</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Status distribution */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-sm font-bold mb-4">Diagnostics par statut</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.statusDistribution}>
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: 'var(--color-texte-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#1B5E3B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maturity distribution */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-sm font-bold mb-4">Distribution maturité</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.maturityDistribution}>
                <XAxis dataKey="letter" tick={{ fontSize: 14, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#2D7A50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-sm font-bold mb-4">Diagnostics mensuels</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_STATS.monthlyDiagnostics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-texte-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="count" stroke="#1B5E3B" strokeWidth={2} dot={{ r: 4, fill: '#1B5E3B' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement placeholders */}
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
        Engagement client
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          'Temps moyen par section',
          'Taux de retour J+7',
          'Sections les plus consultées',
        ].map(label => (
          <div key={label} className="rounded-xl p-5 text-center" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-texte-secondary)' }}>{label}</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-gris-400)' }}>Données insuffisantes</p>
          </div>
        ))}
      </div>
    </div>
  )
}
