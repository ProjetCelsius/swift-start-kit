import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Clock, Users, Timer } from 'lucide-react'
import { MOCK_DIAGNOSTICS, MOCK_ADMIN_KPIS } from '@/data/mockAdminData'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "à l'instant"
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'hier'
  return `il y a ${days}j`
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  onboarding: { bg: '#F5EDE4', color: '#B87333', label: 'Onboarding' },
  questionnaire: { bg: '#F5EDE4', color: '#B87333', label: 'Questionnaire' },
  analysis: { bg: '#E8F0EB', color: '#1B4332', label: 'Analyse' },
  restitution: { bg: '#1B4332', color: '#fff', label: 'Prêt' },
  delivered: { bg: '#F0EDE6', color: '#7A766D', label: 'Terminé' },
  draft: { bg: '#F0EDE6', color: '#7A766D', label: 'Brouillon' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [diagnostics, setDiagnostics] = useState<any[]>([])
  const [kpis, setKpis] = useState(MOCK_ADMIN_KPIS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Fallback to mock
      setDiagnostics(MOCK_DIAGNOSTICS.map(d => ({
        id: d.id,
        company: d.company,
        analyst: d.analyst,
        status: d.status,
        surveyRespondents: d.surveyRespondents,
        surveyTarget: d.surveyTarget,
        lastActivity: d.lastActivity,
      })))
      setKpis(MOCK_ADMIN_KPIS)
      setLoading(false)
      return
    }

    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: diags, error } = await supabase
        .from('diagnostics')
        .select(`
          id, status, analysis_step, created_at, updated_at, restitution_date,
          survey_target_count,
          organization:organizations(name, sector_naf, headcount_range),
          analyst:profiles!diagnostics_analyst_id_fkey(first_name, last_name)
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Also get survey counts per diagnostic
      const diagIds = (diags || []).map((d: any) => d.id)
      let surveyCountMap: Record<string, number> = {}

      if (diagIds.length > 0) {
        const { data: surveys } = await supabase
          .from('survey_responses')
          .select('diagnostic_id')
          .in('diagnostic_id', diagIds)

        if (surveys) {
          for (const s of surveys) {
            surveyCountMap[s.diagnostic_id] = (surveyCountMap[s.diagnostic_id] || 0) + 1
          }
        }
      }

      const mapped = (diags || []).map((d: any) => {
        const org = d.organization
        const an = d.analyst
        const respondents = surveyCountMap[d.id] || 0
        return {
          id: d.id,
          company: org?.name || 'Sans nom',
          analyst: an ? `${an.first_name || ''} ${an.last_name || ''}`.trim() : 'Non assigné',
          status: d.status || 'draft',
          surveyRespondents: respondents,
          surveyTarget: d.survey_target_count || 30,
          lastActivity: d.updated_at || d.created_at || new Date().toISOString(),
        }
      })

      setDiagnostics(mapped)

      // Compute KPIs
      const active = mapped.filter((d: any) => !['archived', 'draft', 'delivered'].includes(d.status)).length
      const awaiting = mapped.filter((d: any) => d.status === 'restitution').length
      const totalRate = mapped.length > 0
        ? Math.round(mapped.reduce((sum: number, d: any) => sum + (d.surveyTarget > 0 ? (d.surveyRespondents / d.surveyTarget) * 100 : 0), 0) / mapped.length)
        : 0

      setKpis({
        activeDiagnostics: active,
        awaitingRestitution: awaiting,
        avgSurveyRate: totalRate,
        avgDaysPerDiagnostic: 42,
      })
    } catch (err) {
      console.error('Error loading admin data:', err)
      // Fallback to mock
      setDiagnostics(MOCK_DIAGNOSTICS.map(d => ({
        id: d.id, company: d.company, analyst: d.analyst, status: d.status,
        surveyRespondents: d.surveyRespondents, surveyTarget: d.surveyTarget,
        lastActivity: d.lastActivity,
      })))
      setKpis(MOCK_ADMIN_KPIS)
    } finally {
      setLoading(false)
    }
  }

  const kpiCards = [
    { label: 'Diagnostics actifs', value: kpis.activeDiagnostics, icon: Activity },
    { label: 'En attente de restitution', value: kpis.awaitingRestitution, icon: Clock },
    { label: 'Taux de réponse moyen', value: `${kpis.avgSurveyRate}%`, icon: Users },
    { label: 'Délai moyen de livraison', value: `${kpis.avgDaysPerDiagnostic}j`, icon: Timer },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: '1.5rem', color: '#2A2A28', marginBottom: 4 }}>
          Tableau de bord
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#B0AB9F' }}>
          Celsius · Espace analyste
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {kpiCards.map((kpi, i) => (
          <div key={i} style={{
            backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
            padding: 20, boxShadow: '0 1px 3px rgba(42,42,40,.04)', position: 'relative',
          }}>
            <kpi.icon size={20} color="#B0AB9F" style={{ position: 'absolute', top: 16, right: 16 }} />
            <p style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '2rem', color: '#1B4332',
              marginBottom: 4, lineHeight: 1.1,
            }}>{kpi.value}</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: '#7A766D' }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Diagnostic list */}
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#2A2A28', marginBottom: 12 }}>
        Diagnostics en cours
      </p>

      {loading ? (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#B0AB9F', padding: 20 }}>Chargement...</p>
      ) : (
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #EDEAE3', backgroundColor: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#F0EDE6' }}>
                {['Entreprise', 'Analyste', 'Statut', 'Sondage', 'Dernière activité'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px', fontSize: '0.75rem',
                    fontWeight: 600, textTransform: 'uppercase' as const, color: '#B0AB9F',
                    letterSpacing: '0.08em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diagnostics.map((d: any) => {
                const st = STATUS_STYLE[d.status] || STATUS_STYLE.questionnaire
                const pct = Math.min((d.surveyRespondents / d.surveyTarget) * 100, 100)
                return (
                  <tr
                    key={d.id}
                    onClick={() => navigate(`/admin/diagnostic/${d.id}`)}
                    style={{ borderBottom: '1px solid #EDEAE3', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: 500, color: '#2A2A28' }}>
                      <span style={{ cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >{d.company}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1B4332',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.5rem', fontWeight: 600, color: '#fff', flexShrink: 0,
                        }}>{d.analyst.split(' ').map((n: string) => n[0]).join('')}</div>
                        <span style={{ fontSize: '0.82rem', color: '#2A2A28' }}>{d.analyst}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                        fontSize: '0.7rem', fontWeight: 600, backgroundColor: st.bg, color: st.color,
                      }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#2A2A28' }}>
                        {d.surveyRespondents}/{d.surveyTarget}
                      </span>
                      <div style={{ width: 40, height: 3, backgroundColor: '#F0EDE6', borderRadius: 2, marginTop: 4 }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#1B4332', borderRadius: 2 }} />
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#B0AB9F' }}>
                      {relativeTime(d.lastActivity)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
