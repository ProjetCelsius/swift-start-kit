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
    border: 'var(--color-primary)',
    bg: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 100%)',
    text: 'var(--color-primary)',
    icon: <Check size={14} />,
    label: 'Réalisé',
    iconBg: 'var(--color-primary)',
  },
  in_progress: {
    border: 'var(--color-accent-warm)',
    bg: 'linear-gradient(135deg, #F5EDE4 0%, #FFFFFF 100%)',
    text: 'var(--color-accent-warm)',
    icon: <RefreshCw size={14} />,
    label: 'En cours',
    iconBg: 'var(--color-accent-warm)',
  },
  not_started: {
    border: 'var(--color-border)',
    bg: 'var(--color-blanc)',
    text: 'var(--color-texte-muted)',
    icon: <X size={12} />,
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
          padding: '16px 16px',
          borderRadius: 12,
          border: `1px solid ${config.border}`,
          background: config.bg,
          cursor: 'pointer',
          transition: 'transform 0.1s, border-color 0.2s, background 0.2s',
          outline: 'none',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={e => (e.currentTarget.style.transform = '')}
        onMouseLeave={e => (e.currentTarget.style.transform = '')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4, color: 'var(--color-texte)', margin: 0, fontFamily: 'var(--font-sans)' }}>
            {tile.label}
          </p>
          <div style={{
            flexShrink: 0,
            width: 22,
            height: 22,
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
        <span style={{ fontSize: '0.7rem', fontWeight: 500, marginTop: 4, display: 'inline-block', color: config.text }}>
          {config.label}
        </span>
      </button>

      {/* Slide-in comment textarea */}
      <div style={{
        maxHeight: isExpanded ? 120 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
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
            transition: 'border-color 0.2s, box-shadow 0.2s',
            color: 'var(--color-texte)',
            backgroundColor: 'var(--color-blanc)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.08)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
        />
      </div>
    </div>
  )
}
