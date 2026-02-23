import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Clock, Circle, Pencil, Sparkles, Lock, Eye, Send, Copy, RefreshCw } from 'lucide-react'
import { MOCK_DIAGNOSTICS, STATUS_CONFIG } from '@/data/mockAdminData'
import { getDemoDiagnostic } from '@/data/demoData'
import type { DemoDiagnostic } from '@/data/demoData'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useDemoIfAvailable } from '@/hooks/useDemo'

const TABS = ['Questionnaire', 'Réponses', 'Sondage & DG', 'Diagnostic', 'Journal']

const SECTION_NAMES = [
  'Synthèse et recommandations', 'Vos 3 priorités', 'Votre maturité climat',
  'Écarts de perception', 'Dimensionnement', 'Empreinte carbone',
  'Échéances réglementaires', 'Cartographie des démarches', 'Feuille de route',
]

const BLOC_NAMES = ['Votre démarche', 'Votre maturité', 'Vos enjeux', 'La perception']

export default function AdminDiagnosticDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const demo = useDemoIfAvailable()
  const [activeTab, setActiveTab] = useState(0)
  const [sbDiag, setSbDiag] = useState<any>(null)
  const [sbResponses, setSbResponses] = useState<any[]>([])
  const [sbSurvey, setSbSurvey] = useState<any[]>([])
  const [sbSections, setSbSections] = useState<any[]>([])
  const [sbJournal, setSbJournal] = useState<any[]>([])
  const [sbDg, setSbDg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const useSb = isSupabaseConfigured()

  // Demo data fallback
  const demoData = id ? getDemoDiagnostic(id) : undefined
  const mockDiag = MOCK_DIAGNOSTICS.find(d => d.id === id)

  const loadDiagnostic = useCallback(async () => {
    if (!useSb || !id) return
    try {
      const { data } = await supabase
        .from('diagnostics')
        .select(`
          *,
          organization:organizations(*),
          client:profiles!diagnostics_client_user_id_fkey(*),
          sections:diagnostic_sections(*)
        `)
        .eq('id', id)
        .single()
      if (data) {
        setSbDiag(data)
        setSbSections(data.sections || [])
      }
    } catch (err) {
      console.error('Error loading diagnostic:', err)
    }
  }, [id, useSb])

  const loadResponses = useCallback(async () => {
    if (!useSb || !id) return
    try {
      const { data } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('diagnostic_id', id)
      if (data) setSbResponses(data)
    } catch (err) {
      console.error('Error loading responses:', err)
    }
  }, [id, useSb])

  const loadSurvey = useCallback(async () => {
    if (!useSb || !id) return
    try {
      const { data } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('diagnostic_id', id)
      if (data) setSbSurvey(data)
    } catch (err) {
      console.error('Error loading survey:', err)
    }
  }, [id, useSb])

  const loadDg = useCallback(async () => {
    if (!useSb || !id) return
    try {
      const { data } = await supabase
        .from('dg_responses')
        .select('*')
        .eq('diagnostic_id', id)
        .maybeSingle()
      if (data) setSbDg(data)
    } catch (err) {
      console.error('Error loading DG:', err)
    }
  }, [id, useSb])

  const loadJournal = useCallback(async () => {
    if (!useSb || !id) return
    try {
      const { data } = await supabase
        .from('journal_entries')
        .select('*, replies:journal_replies(*)')
        .eq('diagnostic_id', id)
        .order('created_at', { ascending: false })
      if (data) setSbJournal(data)
    } catch (err) {
      console.error('Error loading journal:', err)
    }
  }, [id, useSb])

  useEffect(() => {
    async function init() {
      setLoading(true)
      if (useSb && id) {
        await Promise.all([loadDiagnostic(), loadResponses(), loadSurvey(), loadDg(), loadJournal()])
      }
      setLoading(false)
    }
    init()
  }, [id, useSb, loadDiagnostic, loadResponses, loadSurvey, loadDg, loadJournal])

  // Realtime subscriptions
  useEffect(() => {
    if (!useSb || !id) return
    const channel = supabase.channel(`admin-diag-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'survey_responses', filter: `diagnostic_id=eq.${id}` }, () => loadSurvey())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questionnaire_responses', filter: `diagnostic_id=eq.${id}` }, () => loadResponses())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'diagnostic_sections', filter: `diagnostic_id=eq.${id}` }, () => loadDiagnostic())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries', filter: `diagnostic_id=eq.${id}` }, () => loadJournal())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id, useSb, loadSurvey, loadResponses, loadDiagnostic, loadJournal])

  // Determine display data
  const diagData = useSb && sbDiag ? {
    company: sbDiag.organization?.name || 'Sans nom',
    analyst: sbDiag.analyst_id ? 'Analyste' : 'Non assigné',
    status: sbDiag.status || 'draft',
    sector: sbDiag.organization?.sector_naf || '',
    headcount: sbDiag.organization?.headcount_range || '',
    revenue: sbDiag.organization?.revenue_range || '',
  } : mockDiag ? {
    company: mockDiag.company,
    analyst: mockDiag.analyst,
    status: mockDiag.status,
    sector: mockDiag.sector,
    headcount: mockDiag.headcount,
    revenue: mockDiag.revenue,
  } : null

  if (loading) return <div style={{ padding: 32, fontFamily: 'DM Sans, sans-serif', color: '#B0AB9F' }}>Chargement...</div>
  if (!diagData) return <div style={{ padding: 32, fontFamily: 'DM Sans, sans-serif', color: '#7A766D' }}>Diagnostic introuvable.</div>

  const st = STATUS_CONFIG[diagData.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.questionnaire

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate('/admin')}
        style={{
          display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, border: 'none',
          background: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.85rem', color: '#7A766D', padding: 0,
        }}
      >
        <ChevronLeft size={16} /> Diagnostics
      </button>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: '1.5rem', color: '#2A2A28', marginBottom: 10 }}>
          {diagData.company}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {[diagData.sector, diagData.headcount ? diagData.headcount + ' sal.' : '', diagData.revenue].filter(Boolean).map((pill, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: 12, backgroundColor: '#F0EDE6',
              fontSize: '0.75rem', color: '#7A766D', fontFamily: 'DM Sans, sans-serif',
            }}>{pill}</span>
          ))}
          <span style={{
            padding: '4px 12px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600,
            backgroundColor: st.bg, color: st.color,
          }}>{st.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1B4332',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.5rem', fontWeight: 600, color: '#fff',
            }}>{diagData.analyst.split(' ').map(n => n[0]).join('')}</div>
            <span style={{ fontSize: '0.82rem', color: '#2A2A28', fontFamily: 'DM Sans, sans-serif' }}>{diagData.analyst}</span>
          </div>
          {diagData.status === 'delivered' && (
            <button
              onClick={() => {
                if (demo) {
                  demo.setRole('client')
                  demo.setStep(6)
                }
                navigate('/client/synthesis')
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                borderRadius: 8, border: '1px solid #EDEAE3', backgroundColor: '#fff',
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 500,
                color: '#1B4332', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E8F0EB' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff' }}
            >
              <Eye size={14} /> Voir la vue client →
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #EDEAE3', marginBottom: 28 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500,
              color: activeTab === i ? '#1B4332' : '#7A766D',
              borderBottom: activeTab === i ? '2px solid #1B4332' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = '#2D6A4F' }}
            onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = '#7A766D' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <TabQuestionnaire sbResponses={sbResponses} useSb={useSb} demoData={demoData} />}
      {activeTab === 1 && <TabReponses sbResponses={sbResponses} useSb={useSb} demoData={demoData} />}
      {activeTab === 2 && <TabSondageDG sbSurvey={sbSurvey} sbDg={sbDg} useSb={useSb} demoData={demoData} />}
      {activeTab === 3 && <TabDiagnostic diagnosticId={id || ''} sbSections={sbSections} useSb={useSb} userId={user?.id} refreshSections={loadDiagnostic} />}
      {activeTab === 4 && <TabJournal diagnosticId={id || ''} sbJournal={sbJournal} useSb={useSb} userId={user?.id} refreshJournal={loadJournal} demoData={demoData} />}
    </div>
  )
}

// ── TAB 1: QUESTIONNAIRE ──────────────────────────
function TabQuestionnaire({ sbResponses, useSb, demoData }: { sbResponses: any[]; useSb: boolean; demoData?: DemoDiagnostic }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const buildDemoAnswers = (blocIdx: number) => {
    if (!demoData) return []
    if (blocIdx === 0) {
      return Object.entries(demoData.bloc1.tiles).map(([key, val]) => ({
        q: key.replace(/_/g, ' '), a: val.comment || val.status, score: undefined,
      }))
    }
    if (blocIdx === 1) {
      return Object.entries(demoData.bloc2.scores).map(([key, val]) => ({
        q: key.charAt(0).toUpperCase() + key.slice(1), a: `Score : ${val}/100`, score: val,
      }))
    }
    if (blocIdx === 2) {
      const b3 = demoData.bloc3
      return [
        { q: 'Moteurs principaux', a: b3.q21_drivers.join(', ') || 'Non renseigné' },
        { q: 'Frein principal', a: b3.q22_barrier || 'Non renseigné' },
        ...(b3.q25_carte_blanche ? [{ q: 'Carte blanche', a: b3.q25_carte_blanche }] : []),
        ...(b3.q26_ambition ? [{ q: 'Ambition', a: b3.q26_ambition }] : []),
      ]
    }
    if (blocIdx === 3) {
      const b4 = demoData.bloc4
      if (!b4.completed) return [{ q: 'Perception', a: 'Non complété' }]
      return [
        ...b4.partA.map((v, i) => ({ q: `P${i + 1}`, a: `${v} / 10`, score: v })),
      ]
    }
    return []
  }

  const getAnswers = (blocIdx: number) => {
    if (useSb && sbResponses.length > 0) {
      const blocResponses = sbResponses.filter(r => r.block === blocIdx + 1)
      if (blocResponses.length > 0) {
        return blocResponses.map(r => ({
          q: r.question_key,
          a: r.response_text || (r.response_value !== null ? String(r.response_value) : JSON.stringify(r.response_json)),
          score: r.response_value ?? undefined,
        }))
      }
    }
    return buildDemoAnswers(blocIdx)
  }

  const blocStatuses: ('complete' | 'in_progress' | 'not_started')[] = BLOC_NAMES.map((_, i) => {
    if (useSb && sbResponses.length > 0) {
      const blocResponses = sbResponses.filter(r => r.block === i + 1)
      return blocResponses.length > 0 ? 'complete' : 'not_started'
    }
    return 'complete'
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {BLOC_NAMES.map((name, i) => {
        const status = blocStatuses[i]
        const isExpanded = expanded === i
        const answers = getAnswers(i)
        return (
          <div key={i} style={{
            backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
            overflow: 'hidden', boxShadow: '0 1px 3px rgba(42,42,40,.04)',
          }}>
            <button
              onClick={() => setExpanded(isExpanded ? null : i)}
              style={{
                width: '100%', padding: '18px 22px', border: 'none', background: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                backgroundColor: status === 'complete' ? '#1B4332' : '#F0EDE6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '0.75rem',
                  color: status === 'complete' ? '#fff' : '#7A766D',
                }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.88rem', color: '#2A2A28' }}>
                  Bloc {i + 1} — {name}
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: '0.8rem', color: '#B0AB9F' }}>
                  {status === 'complete' ? 'Complété' : status === 'in_progress' ? 'En cours' : 'Non commencé'}
                </p>
              </div>
              {status === 'complete' && <Check size={18} color="#1B4332" />}
              {status === 'in_progress' && <Clock size={18} color="#B87333" />}
              {status === 'not_started' && <Circle size={18} color="#B0AB9F" />}
            </button>
            <div style={{
              maxHeight: isExpanded ? 600 : 0, overflow: 'hidden',
              transition: 'max-height 300ms ease',
            }}>
              <div style={{ padding: '0 22px 18px', borderTop: '1px solid #EDEAE3' }}>
                {answers.map((a: any, j: number) => (
                  <div key={j} style={{ padding: '10px 0', borderBottom: j < answers.length - 1 ? '1px solid #F0EDE6' : 'none' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.82rem', color: '#2A2A28', marginBottom: 4 }}>
                      {a.q}
                    </p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400, fontSize: '0.82rem', color: '#7A766D' }}>
                      {a.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── TAB 2: RÉPONSES ──────────────────────────────
function TabReponses({ sbResponses, useSb, demoData }: { sbResponses: any[]; useSb: boolean; demoData?: DemoDiagnostic }) {
  const md = mockDiagnostic

  const buildDemoAnswers = (blocIdx: number) => {
    if (!demoData) return []
    if (blocIdx === 1) {
      return Object.entries(demoData.bloc2.scores).map(([key, val]) => ({
        q: key.charAt(0).toUpperCase() + key.slice(1), a: `Score : ${val}/100`, score: val,
      }))
    }
    return []
  }

  const getAnswers = (blocIdx: number) => {
    if (useSb && sbResponses.length > 0) {
      const blocResponses = sbResponses.filter(r => r.block === blocIdx + 1)
      if (blocResponses.length > 0) {
        return blocResponses.map(r => ({
          q: r.question_key,
          a: r.response_text || (r.response_value !== null ? String(r.response_value) : JSON.stringify(r.response_json)),
          score: r.response_value ?? undefined,
        }))
      }
    }
    return buildDemoAnswers(blocIdx)
  }

  return (
    <div>
      {/* Profil Climat card */}
      <div style={{
        background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)', borderRadius: 14,
        padding: 24, marginBottom: 28,
      }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 8 }}>
          PROFIL CLIMAT
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', border: '3px solid #1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1.8rem', color: '#1B4332' }}>
              {md.section3.globalGrade}
            </span>
          </div>
          <div>
            <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>
              {md.client.profilClimat.code} — {md.client.profilClimat.name}
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D' }}>
              {md.client.profilClimat.family} · {md.section3.globalScore}/100
            </p>
          </div>
        </div>
      </div>

      {/* Answers by bloc */}
      {['bloc1', 'bloc2', 'bloc3', 'bloc4'].map((blocKey, bi) => {
        const answers = getAnswers(bi)
        return (
          <div key={blocKey} style={{ marginBottom: 28 }}>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem',
              textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 12,
            }}>
              BLOC {bi + 1} — {BLOC_NAMES[bi].toUpperCase()}
            </p>
            {answers.map((a: any, j: number) => {
              const isOpen = !a.score && a.a.length > 60
              return (
                <div key={j} style={{ marginBottom: 12 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28', marginBottom: 4 }}>
                    {a.q}
                    {a.score !== undefined && bi === 1 && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 22, height: 22, borderRadius: '50%', marginLeft: 8, fontSize: '0.65rem', fontWeight: 600,
                        backgroundColor: a.score >= 60 ? '#E8F0EB' : a.score >= 40 ? '#F5EDE4' : '#FEE2E2',
                        color: a.score >= 60 ? '#1B4332' : a.score >= 40 ? '#B87333' : '#DC4A4A',
                      }}>{Math.round(a.score / 25)}</span>
                    )}
                  </p>
                  {isOpen ? (
                    <div style={{
                      backgroundColor: '#F7F5F0', borderRadius: 10, padding: 12,
                      fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6,
                    }}>{a.a}</div>
                  ) : (
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#7A766D' }}>{a.a}</p>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ── TAB 3: SONDAGE & DG ──────────────────────────
function TabSondageDG({ sbSurvey, sbDg, useSb, demoData }: { sbSurvey: any[]; sbDg: any; useSb: boolean; demoData?: DemoDiagnostic }) {
  const POP_COLORS = ['#1B4332', '#2D6A4F', '#B0AB9F', '#B87333', '#DC4A4A']
  const POP_LABELS = ['Moteurs', 'Engagés', 'Indifférents', 'Sceptiques', 'Réfractaires']

  const surveyCount = useSb && sbSurvey.length > 0 ? sbSurvey.length : (demoData?.survey.respondents ?? 0)
  const surveyTarget = demoData?.survey.target ?? 30

  const popValues = demoData?.survey.profiles?.length === 5
    ? demoData.survey.profiles
    : [12, 28, 32, 20, 8]
  const popTotal = popValues.reduce((a, b) => a + b, 0) || 1

  // DG answers
  const dgAnswers = useSb && sbDg ? [
    { q: 'Gouvernance climat', a: sbDg.dg1_governance },
    { q: 'Budget annuel climat', a: sbDg.dg2_budget },
    { q: 'Horizon ROI attendu', a: sbDg.dg3_roi_horizon },
    { q: 'Bénéfice principal', a: sbDg.dg4_main_benefit },
    { q: 'Adéquation des moyens (1-10)', a: `${sbDg.dg5_means_score} / 10` },
  ] : demoData?.dg.received ? [
    { q: 'Vision climat', a: demoData.dg.dg1 || '' },
    { q: 'Principaux défis', a: demoData.dg.dg2 || '' },
    { q: 'Budget et moyens', a: demoData.dg.dg3 || '' },
    { q: 'Positionnement perçu', a: demoData.dg.dg4 || '' },
    { q: 'Adéquation des moyens (1-10)', a: `${demoData.dg.dg5 || 0} / 10` },
  ] : []

  // Survey affirmations from demo
  const SURVEY_AFFIRMATIONS = [
    'Direction engagée', 'Moyens suffisants', 'Objectifs clairs', 'Équipes impliquées',
    'Progrès réels', 'Climat = opportunité', 'Managers relaient', 'Communication honnête',
  ]
  const demoAvg = demoData?.survey.averages ?? []

  // Verbatims
  const verbatims = useSb && sbSurvey.length > 0
    ? sbSurvey.filter(s => s.s10_verbatim).map(s => ({ text: s.s10_verbatim, population: s.population || 'Collaborateur' }))
    : (demoData?.survey.verbatims ?? []).map(v => ({ text: v, population: 'Collaborateur' }))

  const scoreColor = (v: number) => v >= 7 ? '#E8F0EB' : v >= 5 ? '#F5EDE4' : '#FEE2E2'
  const scoreTextColor = (v: number) => v >= 7 ? '#1B4332' : v >= 5 ? '#B87333' : '#DC4A4A'

  return (
    <div>
      {/* Survey stats */}
      <div style={{
        backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '2rem', color: '#1B4332' }}>{surveyCount}</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#B0AB9F' }}>/{surveyTarget} réponses</span>
        </div>
        {popTotal > 1 && (<>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 8 }}>
            DISTRIBUTION DE LA POPULATION
          </p>
          <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
            {popValues.map((v, i) => (
              <div key={i} style={{ width: `${(v / popTotal) * 100}%`, backgroundColor: POP_COLORS[i] }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {POP_LABELS.map((label, i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontFamily: 'DM Sans, sans-serif' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: POP_COLORS[i] }} />
                {label}: {popValues[i]}%
              </span>
            ))}
          </div>
        </>)}
      </div>

      {/* Affirmation averages */}
      {demoAvg.length > 0 && (
        <div style={{
          backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
          overflow: 'hidden', marginBottom: 24,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#F0EDE6' }}>
                {['Affirmation', 'Moyenne'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 14px', fontSize: '0.7rem',
                    fontWeight: 600, textTransform: 'uppercase' as const, color: '#B0AB9F',
                    letterSpacing: '0.08em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SURVEY_AFFIRMATIONS.map((aff: string, i: number) => {
                const v = demoAvg[i] ?? 0
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #EDEAE3' }}>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontWeight: 500, color: '#2A2A28' }}>{aff}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500,
                        backgroundColor: scoreColor(v), color: scoreTextColor(v),
                      }}>{v.toFixed(1)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Verbatims */}
      {verbatims.length > 0 && (<>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem',
          textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 12,
        }}>RÉPONSES OUVERTES</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {verbatims.map((v: any, i: number) => (
            <div key={i} style={{
              backgroundColor: '#F7F5F0', borderRadius: 10, padding: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
            }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#2A2A28', lineHeight: 1.5, flex: 1 }}>
                « {v.text} »
              </p>
              <span style={{
                padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
                backgroundColor: '#F5EDE4', color: '#B87333', whiteSpace: 'nowrap', flexShrink: 0,
              }}>{v.population}</span>
            </div>
          ))}
        </div>
      </>)}

      {/* DG responses */}
      {dgAnswers.length > 0 && (<>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem',
          textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 12,
        }}>QUESTIONNAIRE DIRECTION</p>
        <div style={{
          backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: 20,
        }}>
          {dgAnswers.map((a: any, i: number) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: i < dgAnswers.length - 1 ? '1px solid #F0EDE6' : 'none', gap: 16,
            }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D', flexShrink: 0 }}>{a.q}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500, color: '#2A2A28', textAlign: 'right' }}>{a.a}</span>
            </div>
          ))}
        </div>
      </>)}
    </div>
  )
}

// ── TAB 4: DIAGNOSTIC EDITOR ──────────────────────
// ── MOCK SECTION CONTENT for AI generation ──────
function getMockSectionContent(idx: number): string {
  const md = mockDiagnostic
  switch (idx) {
    case 0: return md.section1.paragraphs.join('\n\n')
    case 1: return md.section2.priorities.map((p, i) => `**Priorité ${i + 1} — ${p.title}**\n${p.why}\nEffort : ${p.effort} | Budget : ${p.budget}`).join('\n\n') + `\n\n**Ce que nous ne recommandons PAS**\n${md.section2.antiRecommendation}`
    case 2: return `Score global : ${md.section3.globalScore}/100 (${md.section3.globalGrade})\n\n` + md.section3.dimensions.map(d => `${d.name} : ${d.score}/100 (${d.grade})`).join('\n') + `\n\n${md.section3.profileSummary}`
    case 3: return md.section4.perceptionData.map(d => `${d.label} — RSE: ${d.rse} | Prédiction: ${d.prediction} | Terrain: ${d.terrain}`).join('\n') + `\n\nVerbatims :\n` + md.section4.verbatims.map(v => `• « ${v.text} » (${v.department})`).join('\n')
    case 4: return `ETP actuels : ${md.section5.currentFTE}\nETP recommandés : ${md.section5.recommendedFTE}\n\n${md.section5.analysisText}\n\nRecommandations :\n` + md.section5.recommendations.map(r => `• ${r}`).join('\n')
    case 5: return `Empreinte totale : ${md.section6.total} tCO₂e\nScope 1 : ${md.section6.scope1} | Scope 2 : ${md.section6.scope2} | Scope 3 : ${md.section6.scope3}\n\nIntensité : ${md.section6.perEmployee} tCO₂e/salarié (moyenne secteur : ${md.section6.sectorAverage})`
    case 6: return md.section7.deadlines.map(d => `${d.date} — ${d.obligation}\n${d.description} (${d.status})`).join('\n\n')
    case 7: return md.section8.tiles.map(t => `${t.name} : ${t.status}${t.relevance ? ` [${t.relevance}]` : ''}`).join('\n')
    case 8: return md.section9.quarters.map(q => `**${q.label}**\n` + q.actions.map(a => `• ${a}`).join('\n')).join('\n\n')
    default: return ''
  }
}

function TabDiagnostic({ diagnosticId, sbSections, useSb, userId, refreshSections }: {
  diagnosticId: string; sbSections: any[]; useSb: boolean; userId?: string; refreshSections: () => Promise<void>
}) {
  const [editing, setEditing] = useState<number | null>(null)
  const [validated, setValidated] = useState<boolean[]>(Array(9).fill(false))
  const [aiContent, setAiContent] = useState<Record<number, string>>({})
  const [aiGenerated, setAiGenerated] = useState<Record<number, boolean>>({})
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState<number[]>([])
  const [genDone, setGenDone] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Init from Supabase sections
  useEffect(() => {
    if (useSb && sbSections.length > 0) {
      const newValidated = Array(9).fill(false)
      const newContent: Record<number, string> = {}
      const newAiGen: Record<number, boolean> = {}
      for (const sec of sbSections) {
        const idx = sec.section_number - 1
        if (idx >= 0 && idx < 9) {
          newValidated[idx] = sec.status === 'validated'
          if (sec.content_json) {
            newContent[idx] = typeof sec.content_json === 'string' ? sec.content_json : JSON.stringify(sec.content_json, null, 2)
            newAiGen[idx] = sec.generated_by_ai || false
          }
        }
      }
      setValidated(newValidated)
      setAiContent(newContent)
      setAiGenerated(newAiGen)
    }
  }, [sbSections, useSb])

  const validatedCount = validated.filter(Boolean).length
  const allValidated = validatedCount === 9
  const hasAnyContent = Object.keys(aiContent).length > 0

  // Generate ALL sections
  const handleGenerateAll = async () => {
    if (useSb) {
      setGenerating(true)
      setGenProgress([])
      setGenDone(false)
      try {
        const session = await supabase.auth.getSession()
        const token = session.data.session?.access_token
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-diagnostic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ diagnostic_id: diagnosticId }),
        })
        if (res.ok) {
          // Simulate progress for UX
          for (let i = 0; i < 9; i++) {
            await new Promise(r => setTimeout(r, 400))
            setGenProgress(p => [...p, i])
          }
          setGenDone(true)
          await refreshSections()
          return
        }
      } catch { /* fallback to mock */ }
    }
    // Mock generation with progressive reveal
    setGenerating(true)
    setGenProgress([])
    setGenDone(false)
    for (let i = 0; i < 9; i++) {
      await new Promise(r => setTimeout(r, 500))
      setAiContent(prev => ({ ...prev, [i]: getMockSectionContent(i) }))
      setAiGenerated(prev => ({ ...prev, [i]: true }))
      setGenProgress(p => [...p, i])
    }
    setGenDone(true)
  }

  const handleSaveSection = async (idx: number, content: string, markValidated: boolean) => {
    if (useSb) {
      try {
        const sectionKeys = ['synthesis', 'priorities', 'maturity', 'perception', 'sizing', 'carbon', 'regulatory', 'mapping', 'roadmap']
        await supabase
          .from('diagnostic_sections')
          .upsert({
            diagnostic_id: diagnosticId,
            section_number: idx + 1,
            section_key: sectionKeys[idx],
            content_json: content,
            status: markValidated ? 'validated' : 'draft',
            last_edited_by: userId || null,
          }, { onConflict: 'diagnostic_id,section_key' })
        await refreshSections()
      } catch (err) {
        console.error('Error saving section:', err)
      }
    }
    if (markValidated) {
      setValidated(p => p.map((v, j) => j === idx ? true : v))
    }
    setEditing(null)
  }

  const handleRegenerateOne = (idx: number) => {
    setAiContent(prev => ({ ...prev, [idx]: getMockSectionContent(idx) }))
    setAiGenerated(prev => ({ ...prev, [idx]: true }))
  }

  const handleCopy = (idx: number) => {
    if (aiContent[idx]) {
      navigator.clipboard.writeText(aiContent[idx])
    }
  }

  const handlePublish = async () => {
    if (useSb) {
      try {
        await supabase
          .from('diagnostics')
          .update({ status: 'delivered', unlocked_at: new Date().toISOString() })
          .eq('id', diagnosticId)
        await supabase
          .from('journal_entries')
          .insert({
            diagnostic_id: diagnosticId,
            author_id: userId || '',
            content: 'Diagnostic publié et rendu accessible au client.',
            step_change: 'review → delivered',
          })
      } catch (err) {
        console.error('Error publishing:', err)
      }
    }
    setShowPublishModal(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Generation overlay */}
      {generating && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(42,42,40,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 16, padding: '32px 40px', maxWidth: 480, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {!genDone ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <span style={{
                    width: 20, height: 20, border: '2.5px solid #EDEAE3', borderTopColor: '#1B4332',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                  }} />
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>
                    Génération en cours…
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SECTION_NAMES.map((name, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {genProgress.includes(i) ? (
                        <Check size={16} color="#1B4332" />
                      ) : (
                        <Circle size={16} color="#EDEAE3" />
                      )}
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem',
                        color: genProgress.includes(i) ? '#2A2A28' : '#B0AB9F',
                        fontWeight: genProgress.includes(i) ? 500 : 400,
                      }}>
                        {i + 1}. {name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', backgroundColor: '#E8F0EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={18} color="#1B4332" />
                  </div>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.1rem', color: '#1B4332' }}>
                    Diagnostic généré — 9 sections prêtes à valider
                  </span>
                </div>
                <button
                  onClick={() => setGenerating(false)}
                  style={{
                    width: '100%', padding: '12px 20px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: '#fff',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Commencer la relecture
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Publish confirmation modal */}
      {showPublishModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(42,42,40,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 16, padding: '28px 36px', maxWidth: 440, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28', marginBottom: 12 }}>
              Publier le diagnostic ?
            </h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 24 }}>
              Le client recevra une notification et pourra consulter son diagnostic. Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPublishModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: '1px solid #EDEAE3',
                  backgroundColor: '#fff', color: '#7A766D', fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handlePublish}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  backgroundColor: '#1B4332', color: '#fff', fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Confirmer la publication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{
        backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: '16px 22px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>
            {validatedCount}/9 sections validées
          </span>
          {allValidated && (
            <span style={{
              padding: '3px 10px', borderRadius: 20, backgroundColor: '#E8F0EB',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#1B4332',
            }}>
              ✓ Prêt à publier
            </span>
          )}
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: '#F0EDE6', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            backgroundColor: allValidated ? '#1B4332' : '#2D6A4F',
            width: `${(validatedCount / 9) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Section sidebar nav */}
        <div style={{
          width: 200, flexShrink: 0, position: 'sticky', top: 20, alignSelf: 'flex-start',
        }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.6rem',
            textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 10,
          }}>SECTIONS</p>
          {SECTION_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 8px',
                border: 'none', background: editing === i ? '#F0EDE6' : 'none', borderRadius: 6,
                cursor: 'pointer', textAlign: 'left', marginBottom: 2,
              }}
            >
              {validated[i] ? (
                <Check size={14} color="#1B4332" />
              ) : aiContent[i] !== undefined ? (
                <Circle size={14} color="#4A90D9" fill="#4A90D9" />
              ) : (
                <Circle size={14} color="#EDEAE3" />
              )}
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem',
                color: validated[i] ? '#1B4332' : '#7A766D', fontWeight: validated[i] ? 500 : 400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {i + 1}. {name}
              </span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Generate All CTA */}
          {!hasAnyContent && (
            <button
              onClick={handleGenerateAll}
              style={{
                width: '100%', padding: 16, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: '#fff',
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
                cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10,
              }}
            >
              <Sparkles size={18} /> Générer le diagnostic par IA
            </button>
          )}

          {/* Section cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SECTION_NAMES.map((name, i) => {
              const isEditing = editing === i
              const hasContent = aiContent[i] !== undefined
              const isAI = aiGenerated[i] || false
              const isValidated = validated[i]

              const statusBadge = isValidated
                ? { label: 'Validé', bg: '#E8F0EB', color: '#1B4332' }
                : isAI
                ? { label: 'Brouillon IA', bg: '#E8F0FF', color: '#4A90D9' }
                : { label: 'Vide', bg: '#F0EDE6', color: '#B0AB9F' }

              return (
                <div
                  key={i}
                  ref={el => { sectionRefs.current[i] = el }}
                  style={{
                    backgroundColor: '#fff',
                    border: `1px solid ${isEditing ? '#E5E1D8' : '#EDEAE3'}`,
                    borderRadius: 14, padding: '18px 22px',
                    boxShadow: isEditing ? '0 2px 8px rgba(42,42,40,.04), 0 8px 32px rgba(42,42,40,.06)' : '0 1px 3px rgba(42,42,40,.04)',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isEditing || hasContent ? 14 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem',
                        textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F',
                      }}>SECTION {i + 1}</span>
                      <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}>{name}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600,
                        backgroundColor: statusBadge.bg, color: statusBadge.color,
                      }}>{statusBadge.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {hasContent && !isEditing && (
                        <>
                          <button onClick={() => handleCopy(i)} title="Copier" style={{
                            border: 'none', background: 'none', cursor: 'pointer', color: '#B0AB9F', padding: 4,
                          }}><Copy size={14} /></button>
                          <button onClick={() => handleRegenerateOne(i)} title="Régénérer" style={{
                            border: 'none', background: 'none', cursor: 'pointer', color: '#B0AB9F', padding: 4,
                          }}><RefreshCw size={14} /></button>
                          <button onClick={() => setEditing(i)} title="Modifier" style={{
                            border: 'none', background: 'none', cursor: 'pointer', color: '#7A766D', padding: 4,
                          }}><Pencil size={14} /></button>
                        </>
                      )}
                      {!hasContent && !isEditing && (
                        <button onClick={() => { handleRegenerateOne(i); setEditing(i) }} style={{
                          display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none',
                          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#4A90D9',
                        }}>
                          <Sparkles size={14} /> Générer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI banner */}
                  {hasContent && isAI && !isValidated && !isEditing && (
                    <div style={{
                      backgroundColor: '#F0F4FF', borderLeft: '3px solid #4A90D9',
                      borderRadius: '0 8px 8px 0', padding: '8px 14px', marginBottom: 12,
                      fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: '#4A90D9', fontWeight: 500,
                    }}>
                      Généré par IA — à relire et valider
                    </div>
                  )}

                  {/* Content preview (not editing) */}
                  {hasContent && !isEditing && (
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D',
                      lineHeight: 1.6, whiteSpace: 'pre-wrap',
                      maxHeight: 120, overflow: 'hidden',
                    }}>
                      {aiContent[i].slice(0, 300)}{aiContent[i].length > 300 ? '…' : ''}
                    </p>
                  )}

                  {/* Editor */}
                  {isEditing && (
                    <div>
                      {isAI && !isValidated && (
                        <div style={{
                          backgroundColor: '#F0F4FF', borderLeft: '3px solid #4A90D9',
                          borderRadius: '0 8px 8px 0', padding: '8px 14px', marginBottom: 12,
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: '#4A90D9', fontWeight: 500,
                        }}>
                          Généré par IA — à relire et valider
                        </div>
                      )}
                      <textarea
                        defaultValue={aiContent[i] || ''}
                        onChange={e => setAiContent(prev => ({ ...prev, [i]: e.target.value }))}
                        style={{
                          width: '100%', minHeight: 300, padding: 14, borderRadius: 10,
                          border: '1px solid #EDEAE3', fontFamily: 'DM Sans, sans-serif',
                          fontSize: '0.85rem', lineHeight: 1.7, color: '#2A2A28', resize: 'vertical',
                          backgroundColor: isAI ? '#FAFCFF' : '#fff',
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        <button onClick={() => handleSaveSection(i, aiContent[i] || '', true)} style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
                          border: 'none', backgroundColor: '#1B4332', color: '#fff',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        }}>
                          <Check size={14} /> Valider
                        </button>
                        <button onClick={() => handleSaveSection(i, aiContent[i] || '', false)} style={{
                          padding: '8px 16px', borderRadius: 8, border: '1px solid #EDEAE3',
                          backgroundColor: '#fff', color: '#7A766D',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
                        }}>
                          Sauvegarder brouillon
                        </button>
                        <button onClick={() => handleRegenerateOne(i)} style={{
                          display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 8,
                          border: '1px solid #EDEAE3', backgroundColor: '#fff', color: '#7A766D',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
                        }}>
                          <RefreshCw size={14} /> Régénérer
                        </button>
                        <button onClick={() => handleCopy(i)} style={{
                          display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 8,
                          border: '1px solid #EDEAE3', backgroundColor: '#fff', color: '#7A766D',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
                        }}>
                          <Copy size={14} /> Copier
                        </button>
                        <button onClick={() => setEditing(null)} style={{
                          padding: '8px 16px', borderRadius: 8, border: 'none',
                          backgroundColor: 'transparent', color: '#B0AB9F',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
                        }}>
                          Fermer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick validate toggle */}
                  {hasContent && !isEditing && !isValidated && (
                    <button
                      onClick={() => {
                        setValidated(p => p.map((v, j) => j === i ? true : v))
                        if (useSb && aiContent[i]) handleSaveSection(i, aiContent[i], true)
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginTop: 10,
                        border: 'none', background: 'none', cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#1B4332', fontWeight: 500,
                      }}
                    >
                      <Check size={14} /> Valider cette section
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Publish button */}
          <button
            onClick={() => allValidated && setShowPublishModal(true)}
            disabled={!allValidated}
            style={{
              width: '100%', padding: '14px 24px', borderRadius: 10, border: 'none',
              backgroundColor: allValidated ? '#1B4332' : '#F0EDE6',
              color: allValidated ? '#fff' : '#B0AB9F',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
              cursor: allValidated ? 'pointer' : 'not-allowed', marginTop: 24,
            }}
          >
            {allValidated ? '🚀 Publier le diagnostic' : `Publier le diagnostic (${validatedCount}/9 validées)`}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── TAB 5: JOURNAL ──────────────────────────────
function TabJournal({ diagnosticId, sbJournal, useSb, userId, refreshJournal, demoData }: {
  diagnosticId: string; sbJournal: any[]; useSb: boolean; userId?: string; refreshJournal: () => Promise<void>; demoData?: DemoDiagnostic
}) {
  const [note, setNote] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const demoEntries = (demoData?.journal ?? []).map(e => ({
    id: e.id,
    author: e.author as 'analyst' | 'client',
    name: e.authorName,
    initials: e.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2),
    date: new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    text: e.text,
    badge: e.badge || null,
    internal: false,
  }))

  const entries = useSb && sbJournal.length > 0
    ? sbJournal.map(e => ({
        id: e.id,
        author: e.author_id === userId ? 'analyst' as const : 'client' as const,
        name: e.author_id === userId ? 'Vous' : 'Client',
        initials: e.author_id === userId ? 'GP' : 'SD',
        date: new Date(e.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        text: e.content,
        badge: e.step_change ? `Étape : ${e.step_change}` : null,
        internal: false,
      }))
    : demoEntries

  const handlePublish = async () => {
    if (!note.trim()) return
    if (useSb && userId) {
      try {
        await supabase
          .from('journal_entries')
          .insert({
            diagnostic_id: diagnosticId,
            author_id: userId,
            content: note,
          })
        setNote('')
        await refreshJournal()
      } catch (err) {
        console.error('Error publishing journal entry:', err)
      }
    } else {
      setNote('')
    }
  }

  return (
    <div>
      {/* New entry form */}
      <div style={{
        backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
      }}>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Écrire une note..."
          style={{
            width: '100%', minHeight: 80, padding: 12, borderRadius: 10,
            border: '1px solid #EDEAE3', fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem', color: '#2A2A28', resize: 'vertical', marginBottom: 12,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div
              onClick={() => setIsInternal(!isInternal)}
              style={{
                width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
                backgroundColor: isInternal ? '#B87333' : '#EDEAE3', position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff',
                position: 'absolute', top: 2,
                left: isInternal ? 18 : 2, transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: isInternal ? '#B87333' : '#7A766D' }}>
              {isInternal ? 'Note interne' : 'Visible par le client'}
            </span>
          </label>
          <button
            onClick={handlePublish}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px',
              borderRadius: 8, border: 'none', backgroundColor: '#1B4332', color: '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <Send size={14} /> Publier
          </button>
        </div>
      </div>

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {entries.map((entry: any) => (
          <div
            key={entry.id}
            style={{
              backgroundColor: entry.internal ? '#FEF6E6' : '#fff',
              border: entry.internal ? 'none' : '1px solid #EDEAE3',
              borderLeft: entry.internal ? '4px solid #B87333' : undefined,
              borderRadius: 14, padding: '18px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: entry.author === 'analyst' ? '#1B4332' : '#E8F0EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 600,
                color: entry.author === 'analyst' ? '#fff' : '#1B4332',
              }}>{entry.initials}</div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>
                {entry.name}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: '0.75rem', color: '#B0AB9F' }}>
                {entry.date}
              </span>
              {entry.internal && <Lock size={14} color="#B87333" style={{ marginLeft: 'auto' }} />}
            </div>
            {entry.badge && (
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 20, marginBottom: 8,
                backgroundColor: '#F5EDE4', color: '#B87333', fontSize: '0.7rem', fontWeight: 500,
              }}>{entry.badge}</span>
            )}
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: '#2A2A28', lineHeight: 1.6 }}>
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}