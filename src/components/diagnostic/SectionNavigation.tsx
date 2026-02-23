// ============================================
// BOUSSOLE CLIMAT — Diagnostic Section Navigation
// Breadcrumb header + prev/next footer for each section
// ============================================

import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SECTION_TITLES = [
  'Synthèse éditoriale',
  'Ce que nous ferions à votre place',
  'Score de maturité',
  'Écarts de perception',
  'Capital humain climat',
  'Empreinte contextualisée',
  'Vos échéances clés',
  'Profil d\'avancement',
  'Prochaines étapes',
]

export function SectionHeader({ sectionNumber }: { sectionNumber: number }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
      <button
        onClick={() => navigate('/client/synthesis')}
        className="flex items-center gap-1.5 text-sm"
        style={{
          color: 'var(--color-texte-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
      >
        <ChevronLeft size={16} />
        Synthèse
      </button>
      <span style={{ color: 'var(--color-gris-300)' }}>·</span>
      <span
        className="text-sm font-semibold"
        style={{ color: 'var(--color-celsius-900)' }}
      >
        Section {sectionNumber} — {SECTION_TITLES[sectionNumber - 1]}
      </span>
    </div>
  )
}

export function SectionFooterNav({ sectionNumber }: { sectionNumber: number }) {
  const navigate = useNavigate()

  return (
    <div
      className="mt-12 pt-8 flex items-center justify-between"
      style={{ borderTop: '1px solid var(--color-border-light)' }}
    >
      {sectionNumber > 1 ? (
        <button
          onClick={() => navigate(`/client/diagnostic/${sectionNumber - 1}`)}
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: 'var(--color-texte-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-celsius-900)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-texte-secondary)')}
        >
          <ChevronLeft size={16} />
          {SECTION_TITLES[sectionNumber - 2]}
        </button>
      ) : (
        <div />
      )}

      {sectionNumber < 9 ? (
        <button
          onClick={() => navigate(`/client/diagnostic/${sectionNumber + 1}`)}
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: 'var(--color-celsius-900)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {SECTION_TITLES[sectionNumber]}
          <ChevronRight size={16} />
        </button>
      ) : (
        <button
          onClick={() => navigate('/client/synthesis')}
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: 'var(--color-celsius-900)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Retour à la synthèse
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
