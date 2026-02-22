import { Check, Clock, AlertTriangle, Flag } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

export default function DiagnosticSection8() {
  const { tiles } = mockDiagnostic.section8
  const realized = tiles.filter(t => t.status === 'Realise').length
  const inProgress = tiles.filter(t => t.status === 'En cours').length
  const notDone = tiles.filter(t => t.status === 'Pas fait').length
  const essential = tiles.filter(t => t.status === 'Pas fait' && t.relevance === 'Essentiel').length

  return (
    <SectionLayout sectionNumber={8}>
      {/* Summary strip */}
      <div
        className="rounded-xl p-4 mb-6 flex flex-wrap gap-4 justify-center"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <Stat value={realized} label="réalisés" color="#1B4332" />
        <Stat value={inProgress} label="en cours" color="#B87333" />
        <Stat value={notDone} label="à démarrer" color="#B0AB9F" />
        {essential > 0 && <Stat value={essential} label="essentiels manquants" color="#DC4A4A" />}
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((tile, i) => {
          const isDone = tile.status === 'Realise'
          const isInProgress = tile.status === 'En cours'
          const isEssential = tile.status === 'Pas fait' && tile.relevance === 'Essentiel'
          const isRecommended = tile.status === 'Pas fait' && tile.relevance === 'Recommande'
          

          let bg = '#FFFFFF'
          let borderLeft = 'none'
          let Icon = Flag
          let iconColor = '#B0AB9F'
          let statusLabel = 'Non commencé'
          let statusBg = '#F0EDE6'
          let statusColor = '#B0AB9F'

          if (isDone) {
            bg = '#E8F0EB'; Icon = Check; iconColor = '#1B4332'; statusLabel = 'Réalisé'; statusBg = '#E8F0EB'; statusColor = '#1B4332'
          } else if (isInProgress) {
            bg = '#FFFFFF'; Icon = Clock; iconColor = '#B87333'; statusLabel = 'En cours'; statusBg = '#F5EDE4'; statusColor = '#B87333'
          } else if (isEssential) {
            bg = '#FEF2F2'; borderLeft = '3px solid #DC4A4A'; Icon = AlertTriangle; iconColor = '#DC4A4A'; statusLabel = 'Essentiel'; statusBg = '#FEF2F2'; statusColor = '#DC4A4A'
          } else if (isRecommended) {
            bg = '#FFF7ED'; borderLeft = '3px solid #B87333'; Icon = Flag; iconColor = '#B87333'; statusLabel = 'Recommandé'; statusBg = '#F5EDE4'; statusColor = '#B87333'
          }

          return (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ backgroundColor: bg, border: '1px solid #EDEAE3', borderLeft: borderLeft !== 'none' ? borderLeft : '1px solid #EDEAE3' }}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon size={16} color={iconColor} className="shrink-0 mt-0.5" />
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: statusBg, color: statusColor }}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="text-sm font-semibold leading-snug" style={{ color: '#2A2A28' }}>
                {tile.name}
              </p>
            </div>
          )
        })}
      </div>
    </SectionLayout>
  )
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center px-3">
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.3rem', color }}>
        {value}
      </span>
      <p className="text-[10px]" style={{ color: '#7A766D' }}>{label}</p>
    </div>
  )
}
