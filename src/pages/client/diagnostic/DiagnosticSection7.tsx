import { useEffect } from 'react'
import { AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'
import { useAnalytics } from '@/hooks/useAnalytics'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  'En cours': { bg: '#F5EDE4', color: '#B87333', label: 'En cours' },
  'Pas commence': { bg: '#FEF2F2', color: '#DC4A4A', label: 'Pas commencé' },
  'Conforme': { bg: '#E8F0EB', color: '#1B4332', label: 'Conforme' },
}

// Reference: February 2026
const REF_DATE = new Date(2026, 1, 1)

function parseDeadlineDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
  }
  const lower = dateStr.toLowerCase()
  for (const [m, idx] of Object.entries(months)) {
    if (lower.includes(m)) {
      const yearMatch = lower.match(/\d{4}/)
      const year = yearMatch ? parseInt(yearMatch[0]) : 2026
      return new Date(year, idx, 1)
    }
  }
  const yearOnly = dateStr.match(/^(\d{4})/)
  if (yearOnly) return new Date(parseInt(yearOnly[1]), 0, 1)
  const rangeMatch = dateStr.match(/(\d{4})-(\d{4})/)
  if (rangeMatch) return new Date(parseInt(rangeMatch[1]), 0, 1)
  return null
}

function getMonthsUntil(dateStr: string): number | null {
  const d = parseDeadlineDate(dateStr)
  if (!d) return null
  return (d.getFullYear() - REF_DATE.getFullYear()) * 12 + (d.getMonth() - REF_DATE.getMonth())
}

function getUrgencyBadge(dateStr: string, status: string): { label: string; bg: string; color: string } | null {
  const months = getMonthsUntil(dateStr)
  if (months === null) return null
  if (months < 6 && status === 'Pas commence') return { label: '< 6 mois • Pas commencé', bg: '#FEE2E2', color: '#DC4A4A' }
  if (months < 6 && status === 'En cours') return { label: '< 6 mois • En cours', bg: '#FEF3C7', color: '#92400E' }
  if (months >= 6 && months < 12 && status === 'Pas commence') return { label: '6-12 mois • Pas commencé', bg: '#FEF3C7', color: '#92400E' }
  return null
}

export default function DiagnosticSection7() {
  const { track } = useAnalytics()
  useEffect(() => { track('section_view', { section: 7 }) }, [])

  const { deadlines } = mockDiagnostic.section7

  // Deadlines < 12 months not started
  const urgentDeadlines = deadlines.filter(d => {
    const m = getMonthsUntil(d.date)
    return m !== null && m < 12 && d.status === 'Pas commence'
  })
  const urgentNotStarted = urgentDeadlines.length

  return (
    <SectionLayout sectionNumber={7}>
      {/* Alert block for urgent not-started deadlines */}
      {urgentNotStarted > 0 && (
        <div
          className="rounded-xl mb-6"
          style={{ backgroundColor: '#FEE2E2', borderRadius: 12, padding: '16px 20px' }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} color="#DC4A4A" className="shrink-0" />
            <p className="text-sm" style={{ color: '#2A2A28' }}>
              <strong style={{ color: '#DC4A4A' }}>{urgentNotStarted} échéance{urgentNotStarted > 1 ? 's' : ''} dans les 12 prochains mois</strong> {urgentNotStarted > 1 ? "n'ont" : "n'a"} pas été commencé{urgentNotStarted > 1 ? 'es' : 'e'}
            </p>
          </div>
          <ul className="mt-2 ml-8 space-y-1">
            {urgentDeadlines.map((d, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: '#2A2A28' }}>• {d.obligation} ({d.date})</li>
            ))}
          </ul>
        </div>
      )}

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
            const urgencyBadge = getUrgencyBadge(d.date, d.status)

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
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#B0AB9F', letterSpacing: '0.05em' }}>
                      {d.date}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {urgencyBadge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: urgencyBadge.bg, color: urgencyBadge.color }}>
                          {urgencyBadge.label}
                        </span>
                      )}
                      {isUrgent && !urgencyBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC4A4A' }}>
                          Urgent
                        </span>
                      )}
                    </div>
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

      {/* CTA */}
      <div
        className="mt-8 rounded-xl p-5"
        style={{ backgroundColor: 'var(--color-fond)', border: '1px solid #EDEAE3' }}
      >
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 500, color: '#2A2A28', marginBottom: 12 }}>
          Besoin d'aide pour préparer ces échéances ?
        </p>
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{ border: '2px solid #B87333', color: '#B87333', backgroundColor: 'transparent' }}
        >
          Planifier un échange avec votre analyste <ExternalLink size={14} />
        </a>
      </div>
    </SectionLayout>
  )
}
