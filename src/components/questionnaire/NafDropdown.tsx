import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { NAF_CODES_LEVEL2 } from '@/data/nafCodes'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function NafDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = NAF_CODES_LEVEL2.filter(n =>
    `${n.code} ${n.label}`.toLowerCase().includes(search.toLowerCase())
  )
  const selected = NAF_CODES_LEVEL2.find(n => n.code === value)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          height: 44,
          padding: '0 14px',
          borderRadius: 8,
          border: `1px solid ${open ? 'var(--color-primary)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-blanc)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-sans)',
          color: selected ? 'var(--color-texte)' : 'var(--color-texte-muted)',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? `${selected.code} — ${selected.label}` : 'Rechercher un secteur NAF...'}
        </span>
        <Search size={14} style={{ color: 'var(--color-texte-muted)', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          zIndex: 50,
          marginTop: 4,
          width: '100%',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-blanc)',
          boxShadow: 'var(--shadow-card-hover)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: 8, borderBottom: '1px solid var(--color-border)' }}>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tapez pour filtrer..."
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'var(--color-subtle)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            />
          </div>
          <ul style={{ maxHeight: 220, overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
            {filtered.length === 0 && (
              <li style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--color-texte-muted)' }}>Aucun résultat</li>
            )}
            {filtered.map(n => (
              <li
                key={n.code}
                onClick={() => { onChange(n.code); setOpen(false); setSearch('') }}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: n.code === value ? 'var(--color-primary-light)' : undefined,
                  color: 'var(--color-texte)',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (n.code !== value) (e.currentTarget.style.backgroundColor = 'var(--color-subtle)') }}
                onMouseLeave={e => { if (n.code !== value) (e.currentTarget.style.backgroundColor = '') }}
              >
                <span style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{n.code}</span>
                {' — '}{n.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
