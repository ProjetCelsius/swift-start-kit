import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { MOCK_DIAGNOSTICS, MOCK_ADMIN_KPIS, STATUS_CONFIG, type DiagnosticStatus } from '@/data/mockAdminData'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DiagnosticStatus | 'all'>('all')

  const kpis = MOCK_ADMIN_KPIS
  const filtered = MOCK_DIAGNOSTICS.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false
    if (search && !d.company.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <button
          onClick={() => navigate('/admin/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: '#1B5E3B' }}
        >
          <Plus size={16} /> Nouveau diagnostic
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard label="Diagnostics actifs" value={kpis.activeDiagnostics} />
        <KPICard label="En attente de restitution" value={kpis.awaitingRestitution} highlight={kpis.awaitingRestitution > 0} />
        <KPICard label="Taux moyen sondage" value={`${kpis.avgSurveyRate}%`} />
        <KPICard label="Temps moyen / diagnostic" value={`${kpis.avgDaysPerDiagnostic}j`} />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gris-400)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une entreprise..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-blanc)' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as DiagnosticStatus | 'all')}
          className="px-3 py-2 text-sm rounded-lg border focus:outline-none"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-blanc)' }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Entreprise', 'Analyste', 'Statut', 'Créé le', 'Dernière activité', 'Sondage'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const st = STATUS_CONFIG[d.status]
              return (
                <tr
                  key={d.id}
                  onClick={() => navigate(`/admin/diagnostics/${d.id}`)}
                  className="cursor-pointer hover:bg-[var(--color-gris-100)] transition-colors"
                  style={{ borderBottom: '1px solid var(--color-border-light)' }}
                >
                  <td className="px-4 py-3 font-medium">{d.company}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-texte-secondary)' }}>{d.analyst}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-texte-secondary)' }}>{formatDate(d.createdAt)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-texte-secondary)' }}>{formatDate(d.lastActivity)}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: d.surveyRespondents >= d.surveyTarget ? '#1B5E3B' : 'var(--color-texte-secondary)' }}>
                      {d.surveyRespondents}/{d.surveyTarget}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KPICard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-texte-secondary)' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: highlight ? '#E8734A' : 'var(--color-texte)' }}>{value}</p>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
