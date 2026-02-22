import { Lightbulb } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import SectionLayout from '@/components/diagnostic/SectionLayout'

const ACCENT_COLORS = ['#1B4332', '#B87333', '#5B8C6E']

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
            {/* Connecting dots */}
            {i < paragraphs.length - 1 && (
              <div className="flex justify-center gap-1 py-2">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EDEAE3' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EDEAE3' }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EDEAE3' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key takeaway box */}
      <div
        className="mt-8 rounded-xl p-6"
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
    </SectionLayout>
  )
}
