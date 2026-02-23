import { useState } from 'react'
import { Check, Clock, AlertTriangle, Flag } from 'lucide-react'
import { mockDiagnostic, MOCK_TILE_ENRICHMENTS } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

type FilterMode = 'all' | 'essential' | 'not_done'

export default function DiagnosticSection8() {
  const { tiles } = mockDiagnostic.section8
  const [filter, setFilter] = useState<FilterMode>('all')

  const realized = tiles.filter(t => t.status === 'Realise').length
  const inProgress = tiles.filter(t => t.status === 'En cours').length
  const notDone = tiles.filter(t => t.status === 'Pas fait').length
  const essential = tiles.filter(t => t.status === 'Pas fait' && t.relevance === 'Essentiel').length

  // Map tile names to enrichment keys
  const nameToKey: Record<string, string> = {
    'Bilan Carbone': 'bilan_carbone',
    'Stratégie climat': 'strategie_climat',
    'Trajectoire SBTi': 'objectifs_reduction',
    'Reporting CSRD': 'rapport_rse',
    'Certification environnementale': 'certification',
    'Formation collaborateurs': 'formation',
    'Éco-conception': 'eco_conception',
    'Achats responsables': 'achats_responsables',
    'Plan de mobilité': 'mobilite',
  }

  const filteredTiles = tiles.filter(t => {
    if (filter === 'essential') return t.relevance === 'Essentiel'
    if (filter === 'not_done') return t.status !== 'Realise'
    return true
  })

  const filters: { key: FilterMode; label: string }[] = [
    { key: 'all', label: 'Tout' },
    { key: 'essential', label: 'Essentiels' },
    { key: 'not_done', label: 'Non faits' },
  ]

  return (
    <SectionLayout sectionNumber={8}>
      {/* Summary strip */}
      <div
        className="rounded-xl p-5 mb-6 flex"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <Stat value={realized} label="réalisés" color="#1B4332" />
        <div style={{ width: 1, backgroundColor: '#EDEAE3' }} />
        <Stat value={inProgress} label="en cours" color="#B87333" />
        <div style={{ width: 1, backgroundColor: '#EDEAE3' }} />
        <Stat value={notDone} label="à démarrer" color="#B0AB9F" />
        {essential > 0 && (
          <>
            <div style={{ width: 1, backgroundColor: '#EDEAE3' }} />
            <Stat value={essential} label="essentiels manquants" color="#DC4A4A" />
          </>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={filter === f.key
              ? { backgroundColor: 'var(--color-celsius-100)', color: 'var(--color-celsius-900)' }
              : { backgroundColor: 'transparent', border: '1px solid #EDEAE3', color: '#7A766D' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTiles.map((tile, i) => {
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

          const enrichKey = nameToKey[tile.name]
          const enrichment = enrichKey ? MOCK_TILE_ENRICHMENTS[enrichKey] : undefined
          const celsiusOffer = (enrichment as any)?.celsiusOffer as string | undefined

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
              {celsiusOffer && (
                <div className="mt-2">
                  <p className="text-[10px] font-semibold" style={{ color: 'var(--color-accent-warm)' }}>
                    Découvrir l'offre Celsius
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-texte-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                    {celsiusOffer}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionLayout>
  )
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex-1 text-center">
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.5rem', color }}>
        {value}
      </span>
      <p style={{ fontSize: '0.7rem', color: '#7A766D' }}>{label}</p>
    </div>
  )
}
