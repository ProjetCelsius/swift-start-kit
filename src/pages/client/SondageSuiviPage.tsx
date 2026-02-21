import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Check, Clock, Copy, RefreshCw } from 'lucide-react'

const MOCK_DATA = {
  totalResponses: 23,
  target: 30,
  dgReceived: true,
  surveyLink: 'https://app.celsius.eco/sondage/abc123',
  dailyResponses: [
    { day: '10/01', count: 0 },
    { day: '11/01', count: 3 },
    { day: '12/01', count: 8 },
    { day: '13/01', count: 12 },
    { day: '14/01', count: 15 },
    { day: '15/01', count: 19 },
    { day: '16/01', count: 21 },
    { day: '17/01', count: 23 },
  ],
}

function getEncouragement(count: number): string {
  if (count < 10) return "Les premières réponses arrivent. N'hésitez pas à relancer vos équipes."
  if (count < 20) return 'Bon début. Chaque réponse supplémentaire renforce la fiabilité du diagnostic.'
  return 'Excellent taux de participation. Les résultats seront très significatifs.'
}

export default function SondageSuiviPage() {
  const [copied, setCopied] = useState(false)
  const { totalResponses, target, dgReceived, surveyLink, dailyResponses } = MOCK_DATA
  const progress = Math.min((totalResponses / target) * 100, 100)
  const onTarget = totalResponses >= target

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-[640px]">
      <h1 className="text-2xl font-bold mb-6">Suivi du sondage</h1>

      {/* Big counter */}
      <div
        className="rounded-xl p-8 mb-6 text-center"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <p
          className="text-5xl font-bold mb-1"
          style={{ color: onTarget ? '#1B5E3B' : 'var(--color-celsius-900)' }}
        >
          {totalResponses}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
          réponses reçues
        </p>

        {/* Progress bar */}
        <div className="max-w-xs mx-auto mt-5">
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>0</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--color-celsius-900)' }}>
              Objectif : {target}
            </span>
          </div>
          <div className="h-3 rounded-full" style={{ backgroundColor: 'var(--color-gris-200)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                backgroundColor: onTarget ? '#1B5E3B' : '#E8734A',
              }}
            />
          </div>
        </div>

        <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--color-texte-secondary)' }}>
          {getEncouragement(totalResponses)}
        </p>
      </div>

      {/* Accumulation curve */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-base font-bold mb-4">Réponses cumulées</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyResponses}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-gris-400)' }} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#1B5E3B" strokeWidth={2} dot={{ r: 3, fill: '#1B5E3B' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DG status */}
      <div
        className="rounded-xl p-5 mb-6 flex items-center justify-between"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center gap-3">
          {dgReceived ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F9F4' }}>
              <Check size={16} color="#1B5E3B" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-gold-100)' }}>
              <Clock size={16} color="#E8734A" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">Questionnaire Direction</p>
            <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>
              {dgReceived ? 'Réponse reçue ✅' : 'En attente ⏳'}
            </p>
          </div>
        </div>
        {!dgReceived && (
          <button
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--color-fond)', color: 'var(--color-celsius-900)' }}
          >
            <RefreshCw size={12} /> Renvoyer
          </button>
        )}
      </div>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-all hover:scale-[1.005]"
        style={{ borderColor: 'var(--color-celsius-900)', color: 'var(--color-celsius-900)' }}
      >
        <Copy size={14} />
        {copied ? 'Lien copié !' : 'Copier le lien du sondage'}
      </button>
    </div>
  )
}
