import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Clock, Circle, Pencil, Sparkles, Lock, Eye, Send } from 'lucide-react'
import { MOCK_DIAGNOSTICS, STATUS_CONFIG } from '@/data/mockAdminData'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const TABS = ['Questionnaire', 'Réponses', 'Sondage & DG', 'Diagnostic', 'Journal']

const SECTION_NAMES = [
  'Synthèse et recommandations', 'Vos 3 priorités', 'Votre maturité climat',
  'Écarts de perception', 'Dimensionnement', 'Empreinte carbone',
  'Échéances réglementaires', 'Cartographie des démarches', 'Feuille de route',
]

const BLOC_NAMES = ['Votre démarche', 'Votre maturité', 'Vos enjeux', 'La perception']
const BLOC_COMPLETION = ['12 janv. 2026', '15 janv. 2026', '18 janv. 2026', '20 janv. 2026']

// Mock questionnaire answers
const MOCK_ANSWERS: Record<string, { q: string; a: string; score?: number }[]> = {
  bloc1: [
    { q: 'Stratégie RSE formalisée ?', a: 'Bien engagé', score: 4 },
    { q: 'Sujet porté par la DG ?', a: 'Bien engagé', score: 4 },
    { q: 'Ressources dédiées ?', a: 'Modérément', score: 3 },
    { q: 'Bilan carbone réalisé ?', a: 'Bien engagé', score: 4 },
    { q: 'Communication régulière ?', a: 'Modérément', score: 3 },
    { q: 'Principaux freins', a: 'Manque de temps et de ressources internes dédiées. La RSE est portée par une seule personne.' },
  ],
  bloc2: [
    { q: 'Gouvernance climat', a: 'Score : 73/100', score: 73 },
    { q: 'Mesure et données', a: 'Score : 67/100', score: 67 },
    { q: 'Stratégie et trajectoire', a: 'Score : 53/100', score: 53 },
    { q: 'Culture et engagement', a: 'Score : 47/100', score: 47 },
  ],
  bloc3: [
    { q: 'Moteurs principaux', a: 'Conformité réglementaire, Réduction des coûts, Conviction direction' },
    { q: 'Frein principal', a: 'Difficulté à mesurer le ROI' },
    { q: 'CSRD', a: 'Déjà concerné' },
    { q: 'BEGES', a: 'Déjà concerné' },
    { q: 'Perte d\'appel d\'offres ?', a: 'Non' },
    { q: 'Carte blanche', a: 'Notre principal défi est de convaincre les équipes opérationnelles que le climat n\'est pas un frein au business.' },
    { q: 'Ambition', a: 'Devenir la référence RSE du secteur d\'ici 2028.' },
  ],
  bloc4: [
    { q: 'Direction engagée (P1)', a: '8.2 / 10', score: 8 },
    { q: 'Moyens suffisants (P2)', a: '5.5 / 10', score: 6 },
    { q: 'Objectifs clairs (P3)', a: '7.0 / 10', score: 7 },
    { q: 'Prédiction engagement', a: 'Moteurs 10%, Engagés 25%, Indifférents 40%, Sceptiques 20%, Réfractaires 5%' },
  ],
}

// Mock survey data
const SURVEY_AFFIRMATIONS = [
  'Direction engagée', 'Moyens suffisants', 'Objectifs clairs', 'Équipes impliquées',
  'Progrès réels', 'Climat = opportunité', 'Managers relaient', 'Communication honnête',
]
const SURVEY_SCORES = {
  direction: [8.5, 6.2, 7.1, 7.0, 6.8, 7.5, 5.5, 7.0],
  managers: [5.8, 4.0, 4.2, 5.5, 5.0, 5.2, 3.8, 4.5],
  collaborateurs: [4.5, 3.5, 2.8, 5.2, 4.5, 4.8, 2.5, 3.8],
  moyenne: [5.1, 3.8, 3.2, 5.5, 4.9, 5.2, 2.8, 4.1],
}

const MOCK_VERBATIMS = [
  { text: 'On nous demande de trier nos déchets mais les camions prennent tout ensemble.', population: 'Collaborateur' },
  { text: 'J\'aimerais comprendre ce que l\'entreprise fait concrètement.', population: 'Collaborateur' },
  { text: 'Le sujet est important mais on n\'a pas le temps.', population: 'Manager' },
  { text: 'La direction devrait montrer l\'exemple sur les déplacements.', population: 'Collaborateur' },
  { text: 'Très content que l\'entreprise prenne ça au sérieux.', population: 'Direction' },
]

const MOCK_DG_ANSWERS = [
  { q: 'Gouvernance climat', a: 'Sujet délégué avec reporting' },
  { q: 'Budget annuel climat', a: '50-100k€' },
  { q: 'Horizon ROI attendu', a: '1-3 ans' },
  { q: 'Bénéfice principal', a: 'Réduction des coûts' },
  { q: 'Adéquation des moyens (1-10)', a: '6 / 10' },
]

const MOCK_JOURNAL = [
  { id: '1', author: 'analyst' as const, name: 'Guillaume Pakula', initials: 'GP', date: '14 fév.', text: 'Questionnaire complété, 23 répondants au sondage. Je lance l\'analyse.', badge: 'Étape : Analyse', internal: false },
  { id: '2', author: 'analyst' as const, name: 'Guillaume Pakula', initials: 'GP', date: '12 fév.', text: 'Les écarts de perception sur P3 (objectifs clairs) sont significatifs : 7.0 RSE vs 3.2 terrain. À creuser dans la synthèse.', badge: null, internal: true },
  { id: '3', author: 'analyst' as const, name: 'Guillaume Pakula', initials: 'GP', date: '10 fév.', text: 'Appel de lancement réalisé. Bon échange avec le responsable RSE. L\'historique de la démarche est solide depuis 2019.', badge: 'Étape : Questionnaire', internal: false },
  { id: '4', author: 'client' as const, name: 'Julien Marchand', initials: 'JM', date: '11 fév.', text: 'Merci Guillaume, j\'ai hâte de voir les résultats. N\'hésitez pas si vous avez des questions sur nos réponses.', badge: null, internal: false },
  { id: '5', author: 'analyst' as const, name: 'Guillaume Pakula', initials: 'GP', date: '8 fév.', text: 'Note interne : le Q27 mentionne un décalage entre discours et budget. À intégrer dans la synthèse avec diplomatie.', badge: null, internal: true },
]

export default function AdminDiagnosticDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [sbDiag, setSbDiag] = useState<any>(null)
  const [sbResponses, setSbResponses] = useState<any[]>([])
  const [sbSurvey, setSbSurvey] = useState<any[]>([])
  const [sbSections, setSbSections] = useState<any[]>([])
  const [sbJournal, setSbJournal] = useState<any[]>([])
  const [sbDg, setSbDg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const useSb = isSupabaseConfigured()

  // Mock fallback
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.5rem', fontWeight: 600, color: '#fff',
          }}>{diagData.analyst.split(' ').map(n => n[0]).join('')}</div>
          <span style={{ fontSize: '0.82rem', color: '#2A2A28', fontFamily: 'DM Sans, sans-serif' }}>{diagData.analyst}</span>
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

      {activeTab === 0 && <TabQuestionnaire sbResponses={sbResponses} useSb={useSb} />}
      {activeTab === 1 && <TabReponses sbResponses={sbResponses} useSb={useSb} />}
      {activeTab === 2 && <TabSondageDG sbSurvey={sbSurvey} sbDg={sbDg} useSb={useSb} />}
      {activeTab === 3 && <TabDiagnostic diagnosticId={id || ''} sbSections={sbSections} useSb={useSb} userId={user?.id} refreshSections={loadDiagnostic} />}
      {activeTab === 4 && <TabJournal diagnosticId={id || ''} sbJournal={sbJournal} useSb={useSb} userId={user?.id} refreshJournal={loadJournal} />}
    </div>
  )
}

// ── TAB 1: QUESTIONNAIRE ──────────────────────────
function TabQuestionnaire({ sbResponses, useSb }: { sbResponses: any[]; useSb: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  // Build answers from Supabase responses if available
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
    return MOCK_ANSWERS[`bloc${blocIdx + 1}`] || []
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
                  {status === 'complete' ? `Complété le ${BLOC_COMPLETION[i]}` : status === 'in_progress' ? 'En cours' : 'Non commencé'}
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
function TabReponses({ sbResponses, useSb }: { sbResponses: any[]; useSb: boolean }) {
  const md = mockDiagnostic

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
    return MOCK_ANSWERS[`bloc${blocIdx + 1}`] || []
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
function TabSondageDG({ sbSurvey, sbDg, useSb }: { sbSurvey: any[]; sbDg: any; useSb: boolean }) {
  const POP_COLORS = ['#1B4332', '#2D6A4F', '#B0AB9F', '#B87333', '#DC4A4A']
  const POP_LABELS = ['Moteurs', 'Engagés', 'Indifférents', 'Sceptiques', 'Réfractaires']
  const popReal = mockDiagnostic.section4.populationReal

  // Use Supabase survey data if available
  const surveyCount = useSb && sbSurvey.length > 0 ? sbSurvey.length : 23
  const surveyTarget = 30

  const popValues = [popReal.moteurs, popReal.engages, popReal.indifferents, popReal.sceptiques, popReal.refractaires]
  const popTotal = popValues.reduce((a, b) => a + b, 0)

  // DG answers
  const dgAnswers = useSb && sbDg ? [
    { q: 'Gouvernance climat', a: sbDg.dg1_governance },
    { q: 'Budget annuel climat', a: sbDg.dg2_budget },
    { q: 'Horizon ROI attendu', a: sbDg.dg3_roi_horizon },
    { q: 'Bénéfice principal', a: sbDg.dg4_main_benefit },
    { q: 'Adéquation des moyens (1-10)', a: `${sbDg.dg5_means_score} / 10` },
  ] : MOCK_DG_ANSWERS

  const scoreColor = (v: number) => {
    if (v >= 7) return '#E8F0EB'
    if (v >= 5) return '#F5EDE4'
    return '#FEE2E2'
  }
  const scoreTextColor = (v: number) => {
    if (v >= 7) return '#1B4332'
    if (v >= 5) return '#B87333'
    return '#DC4A4A'
  }

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

        {/* Population stacked bar */}
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
      </div>

      {/* Affirmation results table */}
      <div style={{
        backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
        overflow: 'hidden', marginBottom: 24,
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
          <thead>
            <tr style={{ backgroundColor: '#F0EDE6' }}>
              {['Affirmation', 'Direction', 'Managers', 'Collaborateurs', 'Moyenne'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 14px', fontSize: '0.7rem',
                  fontWeight: 600, textTransform: 'uppercase' as const, color: '#B0AB9F',
                  letterSpacing: '0.08em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SURVEY_AFFIRMATIONS.map((aff, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #EDEAE3' }}>
                <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontWeight: 500, color: '#2A2A28' }}>{aff}</td>
                {(['direction', 'managers', 'collaborateurs', 'moyenne'] as const).map(seg => {
                  const v = SURVEY_SCORES[seg][i]
                  return (
                    <td key={seg} style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500,
                        backgroundColor: scoreColor(v), color: scoreTextColor(v),
                      }}>{v.toFixed(1)}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Open responses */}
      <p style={{
        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem',
        textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 12,
      }}>RÉPONSES OUVERTES (S10)</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {(useSb && sbSurvey.length > 0
          ? sbSurvey.filter(s => s.s10_verbatim).map(s => ({ text: s.s10_verbatim, population: s.population || 'Collaborateur' }))
          : MOCK_VERBATIMS
        ).map((v: any, i: number) => (
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

      {/* DG responses */}
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
            borderBottom: i < dgAnswers.length - 1 ? '1px solid #F0EDE6' : 'none',
          }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D' }}>{a.q}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500, color: '#2A2A28' }}>{a.a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── TAB 4: DIAGNOSTIC EDITOR ──────────────────────
function TabDiagnostic({ diagnosticId, sbSections, useSb, userId, refreshSections }: {
  diagnosticId: string; sbSections: any[]; useSb: boolean; userId?: string; refreshSections: () => Promise<void>
}) {
  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [validated, setValidated] = useState<boolean[]>(Array(9).fill(false))
  const [aiLoading, setAiLoading] = useState<number | null>(null)
  const [aiContent, setAiContent] = useState<Record<number, string>>({})

  // Init validated state from Supabase sections
  useEffect(() => {
    if (useSb && sbSections.length > 0) {
      const newValidated = Array(9).fill(false)
      for (const sec of sbSections) {
        const idx = sec.section_number - 1
        if (idx >= 0 && idx < 9) {
          newValidated[idx] = sec.status === 'validated'
          if (sec.content_json) {
            setAiContent(prev => ({
              ...prev,
              [idx]: typeof sec.content_json === 'string' ? sec.content_json : JSON.stringify(sec.content_json),
            }))
          }
        }
      }
      setValidated(newValidated)
    }
  }, [sbSections, useSb])

  const allValidated = validated.every(Boolean)
  const DATA_SECTIONS = [2, 3, 5]

  const handleAIFill = async (idx: number) => {
    if (useSb) {
      // Try calling the edge function
      setAiLoading(idx)
      try {
        const session = await supabase.auth.getSession()
        const token = session.data.session?.access_token
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-diagnostic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ diagnostic_id: diagnosticId, section_number: idx + 1 }),
        })

        if (res.status === 404) {
          // Edge function not deployed yet, fallback to mock
          doMockAIFill(idx)
        } else if (res.ok) {
          await refreshSections()
        } else {
          console.error('AI generation error:', res.status)
          doMockAIFill(idx)
        }
      } catch {
        doMockAIFill(idx)
      } finally {
        setAiLoading(null)
      }
      return
    }
    doMockAIFill(idx)
  }

  const doMockAIFill = (idx: number) => {
    setAiLoading(idx)
    setTimeout(() => {
      setAiLoading(null)
      setAiContent(prev => ({
        ...prev,
        [idx]: idx === 0
          ? mockDiagnostic.section1.paragraphs.join('\n\n')
          : `Contenu généré par IA pour la section "${SECTION_NAMES[idx]}". Ce brouillon a été créé à partir des données collectées dans le questionnaire, le sondage et le questionnaire DG. Il doit être relu et validé par l'analyste avant publication.`,
      }))
    }, 2000)
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

  const handleUnlock = async () => {
    if (useSb) {
      try {
        await supabase
          .from('diagnostics')
          .update({ status: 'delivered', unlocked_at: new Date().toISOString() })
          .eq('id', diagnosticId)
        alert('Diagnostic déverrouillé !')
      } catch (err) {
        console.error('Error unlocking:', err)
        alert('Erreur lors du déverrouillage.')
      }
    } else {
      alert('Diagnostic déverrouillé ! (mode démo)')
    }
  }

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => { setEditMode(false); setEditing(null) }}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #EDEAE3',
            backgroundColor: !editMode ? '#1B4332' : '#fff', color: !editMode ? '#fff' : '#7A766D',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          <Eye size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Mode lecture
        </button>
        <button
          onClick={() => setEditMode(true)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #EDEAE3',
            backgroundColor: editMode ? '#1B4332' : '#fff', color: editMode ? '#fff' : '#7A766D',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          <Pencil size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Mode édition
        </button>
      </div>

      {!editMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {SECTION_NAMES.map((name, i) => (
            <div key={i} style={{
              backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: '18px 22px',
            }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 4 }}>
                SECTION {i + 1}
              </p>
              <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1rem', color: '#2A2A28', marginBottom: 8 }}>{name}</p>
              {validated[i] ? (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#7A766D', lineHeight: 1.6 }}>
                  {aiContent[i] ? aiContent[i].slice(0, 200) + '...' : 'Contenu validé.'}
                </p>
              ) : (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#B0AB9F', fontStyle: 'italic' }}>
                  Section non validée.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SECTION_NAMES.map((name, i) => {
            const isData = DATA_SECTIONS.includes(i)
            const isEditing = editing === i
            const hasAI = aiContent[i] !== undefined
            const isLoading = aiLoading === i

            return (
              <div key={i} style={{
                backgroundColor: '#fff', border: `1px solid ${isEditing ? '#E5E1D8' : '#EDEAE3'}`,
                borderRadius: 14, padding: '18px 22px',
                boxShadow: isEditing ? '0 2px 8px rgba(42,42,40,.04), 0 8px 32px rgba(42,42,40,.06)' : '0 1px 3px rgba(42,42,40,.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isEditing ? 16 : 0 }}>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginBottom: 4 }}>
                      SECTION {i + 1}
                    </p>
                    <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1rem', color: '#2A2A28' }}>{name}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <div
                        onClick={() => {
                          const newVal = !validated[i]
                          setValidated(p => p.map((v, j) => j === i ? newVal : v))
                          if (useSb && aiContent[i]) {
                            handleSaveSection(i, aiContent[i], newVal)
                          }
                        }}
                        style={{
                          width: 18, height: 18, borderRadius: 4, border: '1.5px solid',
                          borderColor: validated[i] ? '#1B4332' : '#EDEAE3',
                          backgroundColor: validated[i] ? '#1B4332' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        {validated[i] && <Check size={12} color="#fff" />}
                      </div>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.82rem', color: '#1B4332' }}>
                        Validée
                      </span>
                    </label>
                    {!isData && !isEditing && (
                      <button
                        onClick={() => setEditing(i)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none',
                          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: '#7A766D',
                        }}
                      >
                        <Pencil size={14} /> Modifier
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && !isData && (
                  <div>
                    {(i === 0 || i === 1) && !hasAI && (
                      <button
                        onClick={() => handleAIFill(i)}
                        disabled={isLoading}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                          borderRadius: 8, border: 'none', cursor: isLoading ? 'wait' : 'pointer',
                          background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: '#fff',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500, marginBottom: 14,
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span style={{
                              width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                              borderTopColor: '#fff', borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite',
                            }} />
                            Génération en cours...
                          </>
                        ) : (
                          <><Sparkles size={16} /> Pré-remplir par IA</>
                        )}
                      </button>
                    )}

                    {hasAI && (
                      <div style={{ marginBottom: 14 }}>
                        <textarea
                          defaultValue={aiContent[i]}
                          onChange={e => setAiContent(prev => ({ ...prev, [i]: e.target.value }))}
                          style={{
                            width: '100%', minHeight: 200, padding: 14, borderRadius: 10,
                            border: '1px solid #EDEAE3', fontFamily: 'DM Sans, sans-serif',
                            fontSize: '0.85rem', lineHeight: 1.7, color: '#2A2A28', resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button onClick={() => handleSaveSection(i, aiContent[i], true)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: '#1B4332', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                            Accepter
                          </button>
                          <button onClick={() => handleAIFill(i)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #EDEAE3', backgroundColor: '#fff', color: '#7A766D', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Régénérer
                          </button>
                          <button onClick={() => { setAiContent(p => { const n = { ...p }; delete n[i]; return n }); setEditing(null) }}
                            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#B0AB9F', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {!hasAI && i !== 0 && i !== 1 && (
                      <div>
                        <textarea
                          placeholder={`Contenu de la section "${name}"...`}
                          onChange={e => setAiContent(prev => ({ ...prev, [i]: e.target.value }))}
                          style={{
                            width: '100%', minHeight: 200, padding: 14, borderRadius: 10,
                            border: '1px solid #EDEAE3', fontFamily: 'DM Sans, sans-serif',
                            fontSize: '0.85rem', lineHeight: 1.7, color: '#2A2A28', resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button onClick={() => handleSaveSection(i, aiContent[i] || '', false)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: '#1B4332', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                            Sauvegarder
                          </button>
                          <button onClick={() => setEditing(null)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#B0AB9F', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isData && (
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#B0AB9F', fontStyle: 'italic', marginTop: 8 }}>
                    Les données sont calculées automatiquement à partir des réponses.
                  </p>
                )}
              </div>
            )
          })}

          <button
            onClick={handleUnlock}
            disabled={!allValidated}
            style={{
              width: '100%', padding: '14px 24px', borderRadius: 8, border: 'none',
              backgroundColor: allValidated ? '#1B4332' : '#F0EDE6',
              color: allValidated ? '#fff' : '#B0AB9F',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', fontWeight: 600,
              cursor: allValidated ? 'pointer' : 'not-allowed', marginTop: 8,
            }}
          >
            Déverrouiller le diagnostic
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── TAB 5: JOURNAL ──────────────────────────────
function TabJournal({ diagnosticId, sbJournal, useSb, userId, refreshJournal }: {
  diagnosticId: string; sbJournal: any[]; useSb: boolean; userId?: string; refreshJournal: () => Promise<void>
}) {
  const [note, setNote] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const entries = useSb && sbJournal.length > 0
    ? sbJournal.map(e => ({
        id: e.id,
        author: e.author_id === userId ? 'analyst' as const : 'client' as const,
        name: e.author_id === userId ? 'Vous' : 'Client',
        initials: e.author_id === userId ? 'GP' : 'CL',
        date: new Date(e.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        text: e.content,
        badge: e.step_change ? `Étape : ${e.step_change}` : null,
        internal: false,
      }))
    : MOCK_JOURNAL

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
