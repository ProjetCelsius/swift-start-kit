import { MOCK_DEADLINES } from '@/data/mockDiagnosticData'

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  'Prêt': { bg: 'var(--color-celsius-100)', color: '#1B5E3B', dot: '#1B5E3B' },
  'En cours': { bg: 'var(--color-gold-100)', color: '#E8734A', dot: '#E8734A' },
  'Pas commencé': { bg: '#FEE2E2', color: '#DC4A4A', dot: '#DC4A4A' },
}

export default function DiagnosticSection7() {
  return (
    <div className="max-w-[640px]">
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-8"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        Échéances clés
      </h2>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-[5px] top-2 bottom-2 w-0.5"
          style={{ backgroundColor: '#1B5E3B' }}
        />

        <div className="space-y-5">
          {MOCK_DEADLINES.map((d, i) => {
            const style = STATUS_STYLES[d.status]
            const isAlert = d.urgent && d.status === 'Pas commencé'

            return (
              <div key={i} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-8 top-5 w-3 h-3 rounded-full border-2 border-white z-10"
                  style={{ backgroundColor: style.dot, boxShadow: '0 0 0 2px ' + style.dot + '33' }}
                />

                <div
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: isAlert ? '#FEE2E2' : 'var(--color-blanc)',
                    boxShadow: 'var(--shadow-card)',
                    borderLeft: isAlert ? '3px solid #DC4A4A' : 'none',
                  }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
                    {d.date}
                  </p>
                  <h3 className="text-base font-bold mb-1">{d.title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-texte-secondary)' }}>
                    {d.description}
                  </p>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
