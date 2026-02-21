import { Check, Clock } from 'lucide-react'

const STEPS = [
  { label: 'Collecte des données', desc: 'Questionnaire et sondage complétés', status: 'done' as const },
  { label: 'Analyse en cours', desc: 'Croisement des réponses et benchmarks', status: 'done' as const },
  { label: 'Rédaction du diagnostic', desc: 'Votre analyste rédige le rapport', status: 'current' as const },
  { label: 'Relecture et finalisation', desc: 'Vérification qualité et mise en forme', status: 'future' as const },
  { label: 'Prêt pour la restitution', desc: 'Planification de l\'appel de restitution', status: 'future' as const },
]

const JOURNAL_PREVIEW = [
  {
    initials: 'CL', name: 'Claire Lefèvre',
    date: 'Il y a 2h',
    text: "J'ai finalisé l'analyse croisée de vos réponses. Les écarts de perception sont significatifs sur 3 dimensions.",
  },
  {
    initials: 'CL', name: 'Claire Lefèvre',
    date: 'Il y a 3 jours',
    text: "Le sondage est bien lancé avec déjà 15 réponses. Je commence l'analyse de vos réponses au questionnaire.",
  },
]

export default function AttentePage() {
  const currentStep = 2 // 0-indexed, step 3 "Rédaction"

  return (
    <div style={{ maxWidth: 960 }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: 6 }}>
        Votre diagnostic est en préparation
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#7A766D', marginBottom: 32 }}>
        Claire travaille sur votre diagnostic
      </p>

      {/* Step indicator */}
      <div style={{ position: 'relative', marginBottom: 40 }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, position: 'relative', paddingBottom: i < STEPS.length - 1 ? 24 : 0 }}>
            {/* Vertical line */}
            {i < STEPS.length - 1 && (
              <div style={{
                position: 'absolute', left: 13, top: 28, width: 2, bottom: 0,
                backgroundColor: i < currentStep ? '#1B4332' : '#EDEAE3',
              }} />
            )}
            {/* Circle */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: step.status === 'done' ? '#1B4332' : step.status === 'current' ? '#B87333' : '#F0EDE6',
              border: step.status === 'future' ? '1.5px solid #E5E1D8' : 'none',
              animation: step.status === 'current' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
              position: 'relative', zIndex: 1,
            }}>
              {step.status === 'done' && <Check size={14} color="white" />}
              {step.status === 'current' && <Clock size={13} color="white" />}
            </div>
            {/* Text */}
            <div style={{ paddingTop: 2 }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 500, color: '#2A2A28' }}>{step.label}</p>
              <p style={{ fontSize: '0.78rem', fontWeight: 300, color: '#B0AB9F', marginTop: 2 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Journal preview */}
      <div style={{ marginBottom: 32 }}>
        <p className="label-uppercase" style={{ marginBottom: 12 }}>JOURNAL DE BORD</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {JOURNAL_PREVIEW.map((entry, i) => (
            <div key={i} style={{
              backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
              padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1B4332',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: '0.55rem', fontWeight: 600, color: '#fff',
              }}>
                {entry.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{entry.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#B0AB9F' }}>{entry.date}</span>
                </div>
                <p style={{
                  fontSize: '0.82rem', color: '#7A766D', lineHeight: 1.4,
                  overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {entry.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <a href="/journal" style={{
          display: 'inline-block', marginTop: 10, fontSize: '0.82rem',
          fontWeight: 500, color: '#2D6A4F', textDecoration: 'none',
        }}>
          Voir tout le journal →
        </a>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
