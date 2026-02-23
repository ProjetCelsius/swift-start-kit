import { Lightbulb, Shield, AlertTriangle, TrendingUp } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

const ACCENT_COLORS = ['#1B4332', '#B87333', '#5B8C6E']

const SUMMARY_CARDS = [
  {
    Icon: Shield,
    title: 'Point fort',
    text: 'Gouvernance et engagement direction',
    bg: 'var(--color-celsius-100)',
    color: 'var(--color-celsius-900)',
  },
  {
    Icon: AlertTriangle,
    title: "Point d'alerte",
    text: 'Écart de perception RSE/terrain',
    bg: '#FEF3C7',
    color: '#92400E',
  },
  {
    Icon: TrendingUp,
    title: 'Opportunité',
    text: "18 mois d'avance possible sur la CSRD",
    bg: 'var(--color-accent-warm-light)',
    color: 'var(--color-accent-warm)',
  },
]

export default function DiagnosticSection1() {
  const { paragraphs, keyTakeaways } = mockDiagnostic.section1

  return (
    <SectionLayout sectionNumber={1} showAnalyst>
      {/* Paragraph cards with connecting dots */}
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <div key={i}>
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEAE3',
                borderLeft: `3px solid ${ACCENT_COLORS[i]}`,
              }}
            >
              <p
                className="leading-[1.75]"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.93rem', color: '#2A2A28' }}
              >
                {p}
              </p>
            </div>

            {/* Key figure callout after first paragraph */}
            {i === 0 && (
              <div
                className="my-8"
                style={{
                  backgroundColor: 'var(--color-fond)',
                  borderLeft: '3px solid var(--color-celsius-900)',
                  padding: '20px 24px',
                  borderRadius: 8,
                }}
              >
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#2A2A28', fontStyle: 'italic', lineHeight: 1.7 }}>
                  L'écart de perception moyen entre votre vision et celle de vos équipes est de <strong>3.8 points sur 10</strong>. C'est le signal le plus fort de ce diagnostic.
                </p>
              </div>
            )}

            {/* Connecting dots */}
            {i < paragraphs.length - 1 && i !== 0 && (
              <div className="flex justify-center gap-1 py-2">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EDEAE3' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EDEAE3' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EDEAE3' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* "En résumé" mini-cards */}
      <div className="mt-8 mb-8">
        <p className="label-uppercase mb-3">En résumé</p>
        <div className="flex gap-3">
          {SUMMARY_CARDS.map((card, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ backgroundColor: card.bg, borderRadius: 10, padding: 16 }}
            >
              <card.Icon size={20} color={card.color} style={{ marginBottom: 8 }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.72rem', color: card.color, marginBottom: 4 }}>
                {card.title}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: card.color, lineHeight: 1.5, opacity: 0.85 }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Key takeaway box */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <Lightbulb size={20} color="#1B4332" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#1B4332' }}>
            L'essentiel à retenir
          </h3>
        </div>
        <ul className="space-y-2.5">
          {keyTakeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                style={{ backgroundColor: '#1B4332' }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: '#2A2A28' }}>{t}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Date footer */}
      <p className="mt-6 text-center" style={{ fontSize: '0.7rem', color: 'var(--color-gris-400)' }}>
        Diagnostic généré le 15 février 2026 • Mis à jour le 18 février 2026
      </p>
    </SectionLayout>
  )
}
