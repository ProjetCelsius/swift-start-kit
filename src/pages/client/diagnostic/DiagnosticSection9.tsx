import { useEffect } from 'react'
import { ExternalLink, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import guillaumePhoto from '@/assets/guillaume-photo.png'
import SectionLayout from '@/components/diagnostic/SectionLayout'
import { useAnalytics } from '@/hooks/useAnalytics'

const PRIORITY_COLORS = ['#1B4332', '#B87333', '#5B8C6E']

const QUICK_ACTIONS = [
  'Créer le comité climat (1h de réunion pour officialiser)',
  'Planifier la première Fresque du Climat managers (date + prestataire)',
  'Demander un devis trajectoire SBTi à Celsius',
]

export default function DiagnosticSection9() {
  const { track } = useAnalytics()
  useEffect(() => { track('section_view', { section: 9 }) }, [])

  const navigate = useNavigate()
  const { priorities } = mockDiagnostic.section2
  const { quarters } = mockDiagnostic.section9
  const analyst = mockDiagnostic.client.analyst

  return (
    <SectionLayout sectionNumber={9}>
      {/* Quick actions */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: 'var(--color-celsius-100)', borderRadius: 12 }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: '#1B4332', marginBottom: 12 }}>
          Actions rapides (&lt; 30 jours)
        </h3>
        <div className="space-y-2.5">
          {QUICK_ACTIONS.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle size={16} color="#1B4332" className="shrink-0 mt-0.5" />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#2A2A28', lineHeight: 1.5 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Horizon banner */}
      <div
        className="rounded-xl p-4 mb-6 text-center"
        style={{ background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)' }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#1B4332' }}>
          Horizon : 12 mois
        </p>
        <p className="text-xs mt-1" style={{ color: '#7A766D' }}>
          Plan d'action structuré autour de vos 3 priorités
        </p>
      </div>

      {/* Priority recap */}
      <div className="space-y-2 mb-8">
        {priorities.map((p, i) => (
          <button
            key={i}
            onClick={() => navigate('/client/diagnostic/2')}
            className="w-full text-left rounded-xl p-3.5 flex items-center gap-3 transition-all hover:scale-[1.003]"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: PRIORITY_COLORS[i] }}
            >
              {i + 1}
            </div>
            <p className="text-sm font-semibold flex-1 truncate" style={{ color: '#2A2A28' }}>{p.title}</p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{
                backgroundColor: p.effort === 'Rapide' ? '#E8F0EB' : '#F5EDE4',
                color: p.effort === 'Rapide' ? '#1B4332' : '#B87333',
              }}
            >
              {p.effort}
            </span>
          </button>
        ))}
      </div>

      {/* Quarterly timeline */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3' }}
      >
        <h3
          className="mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}
        >
          Plan sur 4 trimestres
        </h3>

        <div className="grid grid-cols-4 gap-3">
          {quarters.map((q, qi) => (
            <div key={qi}>
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-3 text-center"
                style={{ color: '#1B4332', letterSpacing: '0.05em' }}
              >
                {q.label}
              </p>
              <div className="space-y-2">
                {q.actions.map((a, ai) => (
                  <div
                    key={ai}
                    className="rounded-lg p-2.5"
                    style={{ backgroundColor: '#F7F5F0' }}
                  >
                    <p className="text-[11px] leading-snug" style={{ color: '#2A2A28' }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 mb-8">
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: '#1B4332' }}
        >
          Planifier un échange avec votre analyste <ExternalLink size={16} />
        </a>
        <a
          href="https://celsius.eco"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all hover:scale-[1.01]"
          style={{ borderColor: '#B87333', color: '#B87333' }}
        >
          Découvrir les accompagnements Celsius <ExternalLink size={16} />
        </a>
      </div>

      {/* Conclusion */}
      <div
        className="rounded-xl"
        style={{ backgroundColor: 'var(--color-fond)', padding: '24px 28px', borderRadius: 12 }}
      >
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', lineHeight: 1.7, color: '#2A2A28', marginBottom: 16 }}>
          Ce diagnostic a été réalisé par {analyst.name}, Projet Celsius. Il est valable 12 mois. Nous recommandons un point d'étape à 6 mois pour mesurer les progrès.
        </p>
        <div className="flex items-center gap-3">
          <img
            src={guillaumePhoto}
            alt={analyst.name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28' }}>
              {analyst.name}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>
              {analyst.title} · Celsius · {mockDiagnostic.section1.date}
            </p>
          </div>
        </div>
      </div>
    </SectionLayout>
  )
}
