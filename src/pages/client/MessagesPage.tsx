import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'

interface Message {
  id: string
  author: 'analyst' | 'client'
  authorName: string
  date: Date
  text: string
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1', author: 'analyst', authorName: 'Claire Lefèvre',
    date: new Date(Date.now() - 5 * 86400_000),
    text: "Bonjour ! J'ai une question sur vos réponses au Bloc 3 : vous mentionnez une pression réglementaire comme moteur principal, mais vous n'avez pas coché la CSRD dans les réglementations qui vous concernent. Pourriez-vous préciser ?",
  },
  {
    id: '2', author: 'client', authorName: 'Vous',
    date: new Date(Date.now() - 4 * 86400_000),
    text: "Bonjour Claire, merci pour la question. En fait, nous ne sommes pas encore sûrs de notre éligibilité CSRD — nous sommes juste en dessous du seuil de 250 salariés mais notre CA dépasse 50M€. C'est justement un point que j'aimerais clarifier avec vous.",
  },
  {
    id: '3', author: 'analyst', authorName: 'Claire Lefèvre',
    date: new Date(Date.now() - 3 * 86400_000),
    text: "Parfait, c'est noté. Avec un CA supérieur à 50M€, vous serez effectivement concernés par la CSRD dès l'exercice 2025 (publication en 2026). Je prends cela en compte dans l'analyse et nous en reparlerons lors de la restitution. Bonne journée !",
  },
]

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDaySeparator(date: Date): string {
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400_000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

function groupByDay(messages: Message[]): { day: string; messages: Message[] }[] {
  const groups: { day: string; date: Date; messages: Message[] }[] = []
  messages.forEach(msg => {
    const dayStr = msg.date.toLocaleDateString('fr-FR')
    const last = groups[groups.length - 1]
    if (last && last.day === dayStr) last.messages.push(msg)
    else groups.push({ day: dayStr, date: msg.date, messages: [msg] })
  })
  return groups.map(g => ({ day: formatDaySeparator(g.date), messages: g.messages }))
}

export default function MessagesPage() {
  const [message, setMessage] = useState('')
  const grouped = groupByDay(MOCK_MESSAGES)

  if (MOCK_MESSAGES.length === 0) {
    return (
      <div style={{ maxWidth: 960 }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: 32 }}>
          Messages
        </h1>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <MessageSquare size={48} color="#E5E1D8" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: '0.9rem', color: '#B0AB9F' }}>
            Vous pouvez écrire à votre analyste à tout moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: 24 }}>
        Messages
      </h1>

      <div style={{ flex: 1, marginBottom: 20 }}>
        {grouped.map((group, gi) => (
          <div key={gi}>
            {/* Day separator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px',
            }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#EDEAE3' }} />
              <span style={{ fontSize: '0.7rem', color: '#B0AB9F', fontWeight: 500, flexShrink: 0 }}>{group.day}</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#EDEAE3' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {group.messages.map(msg => {
                const isClient = msg.author === 'client'
                return (
                  <div key={msg.id} style={{
                    display: 'flex', justifyContent: isClient ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{
                      maxWidth: '75%', padding: '14px 18px',
                      backgroundColor: isClient ? '#E8F0EB' : '#fff',
                      border: isClient ? 'none' : '1px solid #EDEAE3',
                      borderRadius: isClient ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{msg.authorName}</span>
                        <span style={{ fontSize: '0.7rem', color: '#B0AB9F' }}>{formatTime(msg.date)}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#2A2A28' }}>{msg.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{
        position: 'sticky', bottom: 0, backgroundColor: '#F7F5F0', paddingTop: 12, paddingBottom: 8,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Écrire à votre analyste..."
            style={{
              flex: 1, minHeight: 48, padding: '10px 14px', borderRadius: 10,
              border: '1px solid #EDEAE3', fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
              resize: 'vertical', outline: 'none', backgroundColor: '#fff',
            }}
          />
          <button style={{
            padding: '10px 20px', borderRadius: 8, backgroundColor: '#1B4332',
            color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500,
            fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            <Send size={14} /> Envoyer
          </button>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#B0AB9F', marginTop: 6, textAlign: 'center' }}>
          Réponse sous 24-48h
        </p>
      </div>
    </div>
  )
}
