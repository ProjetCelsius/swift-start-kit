import { useState } from 'react'

interface Message {
  id: string
  author: 'analyst' | 'client'
  authorName: string
  date: Date
  text: string
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    author: 'analyst',
    authorName: 'Claire Lefèvre',
    date: new Date(Date.now() - 5 * 86400_000),
    text: "Bonjour ! Je me permets de vous contacter car j'ai une question sur vos réponses au Bloc 3 : vous mentionnez une pression réglementaire comme moteur principal, mais vous n'avez pas coché la CSRD dans les réglementations qui vous concernent. Pourriez-vous préciser ?",
  },
  {
    id: '2',
    author: 'client',
    authorName: 'Vous',
    date: new Date(Date.now() - 4 * 86400_000),
    text: "Bonjour Claire, merci pour la question. En fait, nous ne sommes pas encore sûrs de notre éligibilité CSRD — nous sommes juste en dessous du seuil de 250 salariés mais notre CA dépasse 50M€. C'est justement un point que j'aimerais clarifier avec vous.",
  },
  {
    id: '3',
    author: 'analyst',
    authorName: 'Claire Lefèvre',
    date: new Date(Date.now() - 3 * 86400_000),
    text: "Parfait, c'est noté. Avec un CA supérieur à 50M€, vous serez effectivement concernés par la CSRD dès l'exercice 2025 (publication en 2026). Je prends cela en compte dans l'analyse et nous en reparlerons lors de la restitution. Bonne journée !",
  },
]

function formatDate(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600_000)
  if (hours < 24) return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  const days = Math.floor(hours / 24)
  if (days === 1) return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ` à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

export default function MessagesPage() {
  const [message, setMessage] = useState('')

  return (
    <div className="max-w-[640px] flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>

      <div className="flex-1 space-y-4 mb-6">
        {MOCK_MESSAGES.map(msg => (
          <div
            key={msg.id}
            className="rounded-xl p-5"
            style={{
              backgroundColor: msg.author === 'client' ? '#F0F9F4' : 'var(--color-blanc)',
              boxShadow: 'var(--shadow-card)',
              marginLeft: msg.author === 'client' ? '64px' : '0',
              marginRight: msg.author === 'analyst' ? '64px' : '0',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">{msg.authorName}</p>
              <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>
                {formatDate(msg.date)}
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texte)' }}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-center mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
        Réponse sous 24-48h ouvrées
      </p>

      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Écrire à votre analyste..."
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
