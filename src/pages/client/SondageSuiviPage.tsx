import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Check, User, Copy, RefreshCw } from 'lucide-react'
import { useSurveyTracking } from '@/hooks/useSurveyTracking'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useDemoIfAvailable } from '@/hooks/useDemo'
import { isSupabaseConfigured } from '@/lib/supabase'

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
  if (count < 20) return 'Bon début. Chaque réponse renforce la fiabilité du diagnostic.'
  return 'Excellent taux de participation.'
}

export default function SondageSuiviPage() {
  const [copied, setCopied] = useState(false)
  const demo = useDemoIfAvailable()
  const diagnosticId = demo?.diagnostic?.id ?? 'demo'
  const surveyData = useSurveyTracking(diagnosticId, MOCK_DATA.target)
  const { track } = useAnalytics(diagnosticId)

  // Use Supabase data if available, otherwise mock
  const useSb = isSupabaseConfigured() && !surveyData.loading && surveyData.totalResponses > 0
  const totalResponses = useSb ? surveyData.totalResponses : MOCK_DATA.totalResponses
  const target = useSb ? surveyData.targetCount : MOCK_DATA.target
  const dailyResponses = useSb
    ? surveyData.dailyCounts.map(d => ({ day: d.date.slice(5).replace('-', '/'), count: d.count }))
    : MOCK_DATA.dailyResponses
  const dgReceived = MOCK_DATA.dgReceived
  const surveyLink = MOCK_DATA.surveyLink

  const progress = Math.min((totalResponses / target) * 100, 100)
  const onTarget = totalResponses >= target

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyLink)
    setCopied(true)
    track('survey_link_copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <p className="label-uppercase" style={{ marginBottom: 8 }}>SONDAGE INTERNE</p>

      {/* Big counter */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span className="font-display" style={{ fontSize: '3rem', fontWeight: 600, color: '#1B4332' }}>
          {totalResponses}
        </span>
        <span style={{ fontSize: '1rem', color: '#2A2A28' }}>
          réponses reçues
          {onTarget && <Check size={18} color="#1B4332" style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />}
        </span>
      </div>

      {!onTarget && (
        <p style={{ fontSize: '0.75rem', color: '#B0AB9F', marginBottom: 6 }}>
          {totalResponses} / {target} — encore {target - totalResponses} pour atteindre l'objectif
        </p>
      )}

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 8, backgroundColor: '#F0EDE6', borderRadius: 4 }}>
          <div style={{
            height: '100%', borderRadius: 4, backgroundColor: '#1B4332',
            width: `${progress}%`, transition: 'width 0.7s',
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#B0AB9F', marginTop: 4 }}>Objectif : {target} réponses</p>
      </div>

      {/* Accumulation chart */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 14, padding: 20,
        border: '1px solid #EDEAE3', boxShadow: '0 1px 3px rgba(42,42,40,.04)',
        marginBottom: 20, height: 240,
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyResponses}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B4332" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#1B4332" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#B0AB9F', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#B0AB9F', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} />
            <Area type="monotone" dataKey="count" stroke="#1B4332" strokeWidth={2} fill="url(#areaFill)" dot={{ r: 3, fill: '#1B4332', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* DG status */}
      <div style={{
        backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <User size={20} color="#7A766D" />
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Questionnaire DG</p>
            <p style={{ fontSize: '0.78rem', color: dgReceived ? '#1B4332' : '#B87333', fontWeight: 500 }}>
              {dgReceived ? 'Reçu' : 'En attente'}
            </p>
          </div>
        </div>
        {!dgReceived && (
          <button style={{
            fontSize: '0.8rem', fontWeight: 500, color: '#7A766D', background: 'none',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            textDecoration: 'underline',
          }}>
            <RefreshCw size={12} /> Renvoyer
          </button>
        )}
      </div>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        style={{
          width: '100%', padding: '12px 0', borderRadius: 8,
          border: '1.5px solid #1B4332', backgroundColor: 'transparent',
          color: '#1B4332', fontWeight: 500, fontSize: '0.85rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'var(--font-sans)', transition: 'all 0.15s',
        }}
      >
        <Copy size={14} /> {copied ? 'Lien copié !' : 'Copier le lien du sondage'}
      </button>

      {/* Encouragement */}
      <p style={{ fontSize: '0.88rem', color: '#7A766D', fontStyle: 'italic', marginTop: 20, lineHeight: 1.5 }}>
        {getEncouragement(totalResponses)}
      </p>
    </div>
  )
}
