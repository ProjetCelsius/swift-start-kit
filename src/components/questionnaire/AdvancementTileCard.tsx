import { Check, RefreshCw, X } from 'lucide-react'
import type { AdvancementTile, TileStatus } from '@/data/bloc1Tiles'

interface TileState {
  status: TileStatus
  comment: string
}

interface Props {
  tile: AdvancementTile
  state: TileState
  isExpanded: boolean
  onCycle: () => void
  onCommentChange: (comment: string) => void
}

const statusConfig = {
  done: {
    bg: 'var(--color-primary-light)',
    border: 'var(--color-primary)',
    text: 'var(--color-primary)',
    icon: <Check size={16} />,
    label: 'Réalisé',
    iconBg: 'var(--color-primary)',
  },
  in_progress: {
    bg: 'var(--color-accent-warm-light)',
    border: 'var(--color-accent-warm)',
    text: 'var(--color-accent-warm)',
    icon: <RefreshCw size={16} />,
    label: 'En cours',
    iconBg: 'var(--color-accent-warm)',
  },
  not_started: {
    bg: 'var(--color-blanc)',
    border: 'var(--color-border)',
    text: 'var(--color-texte-muted)',
    icon: <X size={14} />,
    label: 'Pas encore',
    iconBg: 'var(--color-border-active)',
  },
}

export default function AdvancementTileCard({ tile, state, isExpanded, onCycle, onCommentChange }: Props) {
  const config = statusConfig[state.status]

  return (
    <div>
      <button
        onClick={onCycle}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '16px 20px',
          borderRadius: 14,
          border: `1px solid ${config.border}`,
          backgroundColor: config.bg,
          cursor: 'pointer',
          transition: 'transform 0.1s, border-color 0.2s, background-color 0.2s',
          outline: 'none',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={e => (e.currentTarget.style.transform = '')}
        onMouseLeave={e => (e.currentTarget.style.transform = '')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4, color: 'var(--color-texte)', margin: 0 }}>
            {tile.label}
          </p>
          <div style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: config.iconBg,
            color: '#fff',
          }}>
            {config.icon}
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', marginTop: 4, display: 'inline-block', color: config.text }}>
          {config.label}
        </span>
      </button>

      {isExpanded && (
        <textarea
          value={state.comment}
          onChange={e => onCommentChange(e.target.value)}
          placeholder="Précisez : date, prestataire, périmètre..."
          style={{
            width: '100%',
            marginTop: 4,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-sans)',
            fontStyle: 'italic',
            resize: 'none',
            minHeight: 60,
            outline: 'none',
            transition: 'border-color 0.2s',
            color: 'var(--color-texte)',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
        />
      )}
    </div>
  )
}
