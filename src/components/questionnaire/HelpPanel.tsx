import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

const FAQS = [
  { q: 'Combien de temps prend le questionnaire ?', a: 'Environ 45 minutes au total, réparties en 4 blocs que vous pouvez compléter à votre rythme. Vos réponses sont sauvegardées automatiquement.' },
  { q: 'Puis-je revenir modifier mes réponses ?', a: 'Oui, tant que votre diagnostic n\'est pas en phase d\'analyse, vous pouvez revenir sur n\'importe quel bloc et modifier vos réponses.' },
  { q: 'Qui verra mes réponses ?', a: 'Seul votre analyste Celsius a accès à vos réponses détaillées. Le rapport final peut être partagé selon vos choix.' },
  { q: 'Comment fonctionne le sondage interne ?', a: 'Un lien anonyme est envoyé à vos collaborateurs. Ils répondent à 10 questions en 3 minutes. Les résultats sont agrégés — aucune réponse individuelle n\'est identifiable.' },
  { q: 'Quand recevrai-je mon diagnostic ?', a: 'Environ 2 semaines après la finalisation du questionnaire et du sondage. Votre analyste vous proposera un créneau de restitution.' },
  { q: 'La question confidentielle est-elle vraiment confidentielle ?', a: 'Oui. La réponse à la question Q27 est lue uniquement par votre analyste. Elle n\'apparaît dans aucun rapport, même interne.' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function HelpPanel({ open, onClose }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 200 }}
      />
      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 320, zIndex: 201,
          backgroundColor: '#FFFFFF', boxShadow: '-4px 0 20px rgba(42,42,40,0.08)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px' }}>
          <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-texte)' }}>
            Questions fréquentes
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-texte-muted)', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />

        {/* FAQ items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '14px 4px',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.85rem',
                  color: 'var(--color-texte)', lineHeight: 1.4,
                }}
              >
                <span style={{ flex: 1 }}>{faq.q}</span>
                <ChevronDown
                  size={14}
                  style={{
                    flexShrink: 0, marginTop: 3, color: 'var(--color-texte-muted)',
                    transform: expanded === i ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {expanded === i && (
                <div
                  className="animate-fade-in"
                  style={{
                    padding: '0 4px 14px',
                    fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                    color: 'var(--color-texte-secondary)', lineHeight: 1.5,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
