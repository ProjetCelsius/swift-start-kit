import { ExternalLink } from 'lucide-react'
import { ADVANCEMENT_TILES } from '@/data/bloc1Tiles'
import { MOCK_TILE_ENRICHMENTS } from '@/data/mockDiagnosticData'

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  done: { label: 'Réalisé', bg: 'var(--color-celsius-100)', color: '#1B5E3B' },
  in_progress: { label: 'En cours', bg: 'var(--color-gold-100)', color: '#E8734A' },
  not_started: { label: 'Pas fait', bg: 'var(--color-gris-100)', color: 'var(--color-gris-400)' },
}

const RELEVANCE_MAP: Record<string, { label: string; bg: string; color: string }> = {
  essential: { label: 'Essentiel pour votre profil', bg: '#FEE2E2', color: '#DC4A4A' },
  recommended: { label: 'Recommandé', bg: 'var(--color-gold-100)', color: '#E8734A' },
  optional: { label: 'Optionnel', bg: 'var(--color-gris-100)', color: 'var(--color-gris-400)' },
}

export default function DiagnosticSection8() {
  return (
    <div className="max-w-[960px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Profil d'avancement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADVANCEMENT_TILES.map(tile => {
          const enrichment = MOCK_TILE_ENRICHMENTS[tile.id] || { status: 'not_started', relevance: 'optional' }
          const status = STATUS_MAP[enrichment.status]
          const relevance = enrichment.status !== 'done' ? RELEVANCE_MAP[enrichment.relevance] : null
          const isEssential = enrichment.relevance === 'essential' && enrichment.status !== 'done'

          return (
            <div
              key={tile.id}
              className="rounded-xl p-5"
              style={{
                backgroundColor: 'var(--color-blanc)',
                boxShadow: isEssential ? '0 4px 20px -4px rgba(220, 74, 74, 0.15)' : 'var(--shadow-card)',
                borderLeft: isEssential ? '3px solid #DC4A4A' : 'none',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold leading-snug flex-1 pr-2">{tile.label}</h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>

              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-texte-secondary)' }}>
                {tile.description}
              </p>

              {relevance && (
                <span
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: relevance.bg, color: relevance.color }}
                >
                  {relevance.label}
                </span>
              )}

              {relevance && enrichment.relevance !== 'optional' && (
                <a
                  href="https://celsius.eco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium mt-3 hover:underline"
                  style={{ color: '#E8734A' }}
                >
                  Découvrir l'offre Celsius <ExternalLink size={11} />
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
