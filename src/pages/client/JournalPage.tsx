import { useState } from 'react'

interface JournalEntry {
  id: string
  author: 'analyst' | 'client'
  authorName: string
  photoUrl: string
  date: Date
  text: string
  badge?: string
  badgeColor?: string
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '4',
    author: 'analyst',
    authorName: 'Claire',
    photoUrl: '',
    date: new Date(Date.now() - 2 * 3600_000),
    text: "J'ai finalisé l'analyse croisée de vos réponses au questionnaire et des résultats du sondage collaborateurs. Les écarts de perception sont significatifs sur 3 dimensions — je détaillerai tout cela lors de notre appel de restitution.",
    badge: 'Étape : Analyse croisée terminée',
    badgeColor: '#1B5E3B',
  },
  {
    id: '3',
    author: 'client',
    authorName: 'Vous',
    photoUrl: '',
    date: new Date(Date.now() - 26 * 3600_000),
    text: "Merci Claire. Nous avons atteint 23 réponses au sondage, est-ce suffisant pour l'analyse ?",
  },
  {
    id: '2',
    author: 'analyst',
    authorName: 'Claire',
    photoUrl: '',
    date: new Date(Date.now() - 3 * 86400_000),
    text: "Le sondage est bien lancé avec déjà 15 réponses. Je commence l'analyse de vos réponses au questionnaire RSE. Première observation : votre gouvernance climat est plus avancée que ce que l'on observe habituellement dans votre secteur.",
    badge: 'Étape : Analyse en cours',
    badgeColor: '#E8734A',
  },
  {
    id: '1',
    author: 'analyst',
    authorName: 'Claire',
    photoUrl: '',
    date: new Date(Date.now() - 7 * 86400_000),
    text: "Bienvenue dans votre espace Boussole Climat ! Je suis Claire, votre analyste dédiée. J'ai bien reçu vos réponses au Bloc 1 et 2. Je reviendrai vers vous dès que j'aurai avancé dans l'analyse.",
    badge: 'Étape : Démarrage',
    badgeColor: '#2D7A50',
  },
]

function formatRelativeDate(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600_000)
  if (hours < 1) return "À l'instant"
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function JournalPage() {
  const [reply, setReply] = useState('')

  return (
    <div className="max-w-[640px]">
      <h1 className="text-2xl font-bold mb-6">Journal de bord</h1>

      <div className="space-y-4 mb-8">
        {MOCK_ENTRIES.map(entry => (
          <div
            key={entry.id}
            className="rounded-xl p-5"
            style={{
              backgroundColor: entry.author === 'client' ? '#F0F9F4' : 'var(--color-blanc)',
              boxShadow: 'var(--shadow-card)',
              marginLeft: entry.author === 'client' ? '48px' : '0',
              marginRight: entry.author === 'analyst' ? '48px' : '0',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: entry.author === 'analyst' ? 'var(--color-celsius-900)' : '#93C5A0' }}
              >
                {entry.authorName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{entry.authorName}</p>
                <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>
                  {formatRelativeDate(entry.date)}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-texte)' }}>
              {entry.text}
            </p>

            {entry.badge && (
              <span
                className="text-[10px] font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: entry.badgeColor }}
              >
                {entry.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Reply input */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="Répondre à votre analyste..."
          className="w-full text-sm p-3 rounded-lg border-none resize-none focus:outline-none"
          style={{ backgroundColor: 'var(--color-fond)', minHeight: '80px' }}
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--color-celsius-900)' }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
