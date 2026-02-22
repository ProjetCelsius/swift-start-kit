import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'

const SECTION_TITLES = [
  'Synthèse éditoriale',
  'Nos recommandations',
  'Score de maturité',
  'Écarts de perception',
  'Moyens & ressources',
  'Empreinte carbone',
  'Échéancier réglementaire',
  'Cartographie des dispositifs',
  'Feuille de route',
]

interface SectionLayoutProps {
  sectionNumber: number
  children: React.ReactNode
  showAnalyst?: boolean
}

export default function SectionLayout({ sectionNumber, children, showAnalyst }: SectionLayoutProps) {
  const navigate = useNavigate()
  const analyst = mockDiagnostic.client.analyst
  const date = mockDiagnostic.section1.date

  const prevSection = sectionNumber > 1 ? sectionNumber - 1 : null
  const nextSection = sectionNumber < 9 ? sectionNumber + 1 : null

  return (
    <div className="max-w-[760px]">
      {/* Top bar */}
      <p className="text-xs mb-2" style={{ fontFamily: 'var(--font-sans)', color: '#B0AB9F' }}>
        Section {sectionNumber} sur 9
      </p>
      <h1
        className="mb-0"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.6rem', color: '#2A2A28' }}
      >
        {SECTION_TITLES[sectionNumber - 1]}
      </h1>
      <div className="h-px my-4" style={{ backgroundColor: '#EDEAE3' }} />

      {/* Analyst attribution */}
      {showAnalyst && (
        <div className="mb-8 pl-4" style={{ borderLeft: '3px solid #1B4332' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: '#1B4332' }}
            >
              {analyst.initials}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28' }}>
                {analyst.name}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.72rem', color: '#7A766D' }}>
                {analyst.title} · Celsius
              </p>
            </div>
          </div>
          <p className="mt-1.5" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.65rem', color: '#B0AB9F' }}>
            Rédigé le {date}
          </p>
        </div>
      )}

      {/* Section content */}
      <div>{children}</div>

      {/* Navigation footer */}
      <div className="mt-12 pt-6" style={{ borderTop: '1px solid #EDEAE3' }}>
        <div className="flex items-center justify-between">
          {prevSection ? (
            <button
              onClick={() => navigate(`/client/diagnostic/${prevSection}`)}
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#2A2A28' }}
            >
              <ChevronLeft size={16} />
              <span>{SECTION_TITLES[prevSection - 1]}</span>
            </button>
          ) : (
            <div />
          )}
          {nextSection ? (
            <button
              onClick={() => navigate(`/client/diagnostic/${nextSection}`)}
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#2A2A28' }}
            >
              <span>{SECTION_TITLES[nextSection - 1]}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/client/synthesis')}
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#2A2A28' }}
            >
              <span>Retour à la synthèse</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/client/synthesis')}
            className="text-xs hover:underline transition-opacity"
            style={{ color: '#B0AB9F' }}
          >
            Retour à la synthèse
          </button>
        </div>
      </div>
    </div>
  )
}
