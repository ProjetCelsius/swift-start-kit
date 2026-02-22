import { AlertCircle } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  'En cours': { bg: '#F5EDE4', color: '#B87333', label: 'En cours' },
  'Pas commence': { bg: '#FEF2F2', color: '#DC4A4A', label: 'Pas commencé' },
  'Conforme': { bg: '#E8F0EB', color: '#1B4332', label: 'Conforme' },
}

export default function DiagnosticSection7() {
  const { deadlines } = mockDiagnostic.section7

  return (
    <SectionLayout sectionNumber={7}>
      {/* Urgency summary */}
      <div
        className="rounded-xl p-5 mb-8 flex items-center gap-3"
        style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #DC4A4A' }}
      >
        <AlertCircle size={20} color="#DC4A4A" className="shrink-0" />
        <p className="text-sm font-medium" style={{ color: '#2A2A28' }}>
          <strong style={{ color: '#DC4A4A' }}>2 échéances imminentes</strong>, {deadlines.length - 2} à anticiper
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] top-3 bottom-3 w-0.5"
          style={{ backgroundColor: '#EDEAE3' }}
        />

        <div className="space-y-4">
          {deadlines.map((d, i) => {
            const isUrgent = d.status === 'Pas commence' && i < 2
            const status = STATUS_STYLES[d.status] || STATUS_STYLES['Pas commence']
            const borderColor = isUrgent ? '#DC4A4A' : d.status === 'En cours' ? '#B87333' : '#EDEAE3'
            const dotColor = isUrgent ? '#DC4A4A' : d.status === 'En cours' ? '#B87333' : '#B0AB9F'

            return (
              <div key={i} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-8 top-5 w-3.5 h-3.5 rounded-full border-2 border-white z-10"
                  style={{ backgroundColor: dotColor, boxShadow: `0 0 0 2px ${dotColor}22` }}
                />

                <div
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEAE3',
                    borderLeft: `3px solid ${borderColor}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#B0AB9F', letterSpacing: '0.05em' }}>
                      {d.date}
                    </p>
                    {isUrgent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC4A4A' }}>
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#2A2A28' }}>{d.obligation}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#7A766D' }}>
                    {d.description}
                  </p>
                  <span
                    className="text-[10px] font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SectionLayout>
  )
}
