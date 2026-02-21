import { MOCK_SYNTHESIS } from '@/data/mockDiagnosticData'

export default function DiagnosticSection1() {
  const { paragraphs, analyst } = MOCK_SYNTHESIS

  return (
    <div className="max-w-[640px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Synthèse éditoriale
      </h2>

      <div
        className="rounded-xl p-8"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="leading-[1.7]"
            style={{
              fontSize: '18px',
              color: 'var(--color-texte)',
              marginBottom: i < paragraphs.length - 1 ? '32px' : '0',
            }}
          >
            {p}
          </p>
        ))}

        {/* Signature */}
        <div
          className="mt-10 pt-8 flex items-center gap-4"
          style={{ borderTop: '1px solid var(--color-border-light)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
            style={{ backgroundColor: 'var(--color-celsius-900)' }}
          >
            {analyst.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold">{analyst.name}</p>
            <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>{analyst.title}</p>
            <p className="text-xs" style={{ color: 'var(--color-gris-400)' }}>{analyst.date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
