import { useState, useEffect } from 'react'
import { Phone, FileText, Users, BarChart3, Presentation } from 'lucide-react'

const STORAGE_KEY = 'boussole_protocol_seen'

const STEPS = [
  {
    icon: <Phone size={14} />,
    title: 'Appel de lancement',
    duration: '30 min',
    desc: 'Votre analyste vous présente la démarche et vous aide à remplir le premier volet.',
  },
  {
    icon: <FileText size={14} />,
    title: 'Questionnaire',
    duration: '~40 min',
    desc: '3 volets à compléter à votre rythme. Sauvegarde automatique, vous pouvez revenir quand vous voulez.',
  },
  {
    icon: <Users size={14} />,
    title: 'Sondage & entretiens',
    duration: '2 semaines',
    desc: 'Un court sondage envoyé à vos équipes pour capter la perception interne. Optionnel : un entretien avec la direction.',
  },
  {
    icon: <BarChart3 size={14} />,
    title: 'Analyse',
    duration: '1 à 2 semaines',
    desc: 'Votre analyste croise toutes les données et rédige votre diagnostic personnalisé.',
  },
  {
    icon: <Presentation size={14} />,
    title: 'Restitution',
    duration: '1h',
    desc: 'Présentation de vos résultats en visio, puis accès complet à votre diagnostic interactif.',
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function ProtocolModal({ open, onClose }: Props) {
  const [dontShow, setDontShow] = useState(false)

  if (!open) return null

  function handleClose() {
    if (dontShow) localStorage.setItem(STORAGE_KEY, 'true')
    onClose()
  }

  return (
    <>
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 300,
        backgroundColor: 'rgba(42,42,40,0.3)', backdropFilter: 'blur(4px)',
        animation: 'modalBgIn 0.2s ease-out',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 301, width: '100%', maxWidth: 640,
        backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(42,42,40,0.15)',
        animation: 'modalIn 0.25s ease-out',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Gradient header */}
        <div style={{ padding: '32px 40px 24px', background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: '#2A2A28', textAlign: 'center', marginBottom: 6 }}>
            Comment se déroule votre diagnostic ?
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', textAlign: 'center' }}>
            5 étapes, 3 à 4 semaines, un accompagnement personnalisé.
          </p>
        </div>

        <div style={{ padding: '24px 40px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16 }}>
                {/* Vertical line + circle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    backgroundColor: '#1B4332', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {step.icon}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, backgroundColor: '#E5E1D8', minHeight: 16 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 18 : 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>
                      {step.title}
                    </span>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12,
                      backgroundColor: '#F7F5F0',
                      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.7rem', color: '#7A766D',
                    }}>
                      {step.duration}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D', lineHeight: 1.5, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={handleClose}
              style={{
                padding: '14px 36px', borderRadius: 8,
                backgroundColor: '#1B4332', color: '#fff',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
                border: 'none', cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#153728')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
            >
              C'est compris !
            </button>
          </div>

          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 14, fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F',
            cursor: 'pointer',
          }}>
            <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)} style={{ borderRadius: 4 }} />
            Ne plus afficher à la connexion
          </label>
        </div>
      </div>

      <style>{`
        @keyframes modalBgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -48%); } to { opacity: 1; transform: translate(-50%, -50%); } }
      `}</style>
    </>
  )
}

export function useProtocolModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) setOpen(true)
  }, [])

  return { open, setOpen }
}
