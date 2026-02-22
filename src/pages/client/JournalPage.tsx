import { useState } from 'react'
import { BookOpen, Send } from 'lucide-react'

interface JournalEntry {
  id: string
  author: 'analyst' | 'client'
  authorName: string
  initials: string
  date: Date
  text: string
  badge?: string
  replies?: { author: string; text: string; date: Date }[]
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '4', author: 'analyst', authorName: 'Guillaume Pakula', initials: 'GP',
    date: new Date(Date.now() - 2 * 3600_000),
    text: "J'ai finalisé l'analyse croisée de vos réponses au questionnaire et des résultats du sondage collaborateurs. Les écarts de perception sont significatifs sur 3 dimensions — je détaillerai tout cela lors de notre appel de restitution.",
    badge: 'Rédaction',
  },
  {
    id: '3', author: 'analyst', authorName: 'Guillaume Pakula', initials: 'GP',
    date: new Date(Date.now() - 3 * 86400_000),
    text: "Le sondage est bien lancé avec déjà 15 réponses. Je commence l'analyse de vos réponses au questionnaire RSE. Première observation : votre gouvernance climat est plus avancée que ce que l'on observe habituellement dans votre secteur.",
    badge: 'Analyse en cours',
    replies: [
      { author: 'Vous', text: 'Merci Claire. Nous avons atteint 23 réponses, est-ce suffisant ?', date: new Date(Date.now() - 2 * 86400_000) },
    ],
  },
  {
    id: '2', author: 'analyst', authorName: 'Guillaume Pakula', initials: 'GP',
    date: new Date(Date.now() - 5 * 86400_000),
    text: "Les résultats de votre Bloc 2 montrent un score de maturité intéressant. Votre dimension Gouvernance est nettement au-dessus de la moyenne sectorielle, tandis que la dimension Mesure & Données présente une marge de progression.",
    badge: 'Analyse en cours',
  },
  {
    id: '1', author: 'analyst', authorName: 'Guillaume Pakula', initials: 'GP',
    date: new Date(Date.now() - 7 * 86400_000),
    text: "Bienvenue dans votre espace Boussole Climat ! Je suis Claire, votre analyste dédiée. J'ai bien reçu vos réponses au Bloc 1 et 2. Je reviendrai vers vous dès que j'aurai avancé dans l'analyse.",
    badge: 'Démarrage',
  },
]

function formatDate(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600_000)
  if (hours < 1) return "À l'instant"
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function JournalPage() {
  const [replyStates, setReplyStates] = useState<Record<string, string>>({})

  if (MOCK_ENTRIES.length === 0) {
    return (
      <div style={{ maxWidth: 960 }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: 32 }}>
          Journal de bord
        </h1>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <BookOpen size={48} color="#E5E1D8" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: '0.9rem', color: '#B0AB9F' }}>
            Votre analyste publiera des notes au fil de l'analyse.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: 24 }}>
        Journal de bord
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOCK_ENTRIES.map(entry => (
          <div key={entry.id} style={{
            backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
            padding: 20, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1B4332',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 600, color: '#fff', flexShrink: 0,
              }}>
                {entry.initials}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{entry.authorName}</span>
                <span style={{ fontSize: '0.75rem', color: '#B0AB9F', marginLeft: 8 }}>{formatDate(entry.date)}</span>
              </div>
            </div>

            {entry.badge && (
              <span style={{
                display: 'inline-block', fontSize: '0.7rem', fontWeight: 500,
                padding: '3px 10px', borderRadius: 20, marginBottom: 10,
                backgroundColor: '#F5EDE4', color: '#B87333',
              }}>
                Étape : {entry.badge}
              </span>
            )}

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#2A2A28' }}>{entry.text}</p>

            {/* Replies */}
            {entry.replies?.map((r, i) => (
              <div key={i} style={{
                marginTop: 12, marginLeft: 'auto', maxWidth: '80%',
                backgroundColor: '#E8F0EB', borderRadius: 10, padding: '12px 16px',
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>{r.author}</p>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#2A2A28' }}>{r.text}</p>
              </div>
            ))}

            {/* Reply input */}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <textarea
                value={replyStates[entry.id] || ''}
                onChange={e => setReplyStates(prev => ({ ...prev, [entry.id]: e.target.value }))}
                placeholder="Répondre..."
                style={{
                  flex: 1, minHeight: 40, padding: '8px 12px', borderRadius: 8,
                  border: '1px solid #EDEAE3', fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
                  resize: 'none', outline: 'none',
                }}
              />
              <button style={{
                padding: '0 14px', borderRadius: 8, backgroundColor: '#1B4332',
                color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0,
              }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
