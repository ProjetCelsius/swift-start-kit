import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Pencil, Eye, Sparkles } from 'lucide-react'
import { MOCK_DIAGNOSTICS, STATUS_CONFIG, type DiagnosticStatus } from '@/data/mockAdminData'

const TABS = ['Résumé', 'Réponses client', 'Sondage & DG', 'Diagnostic', 'Journal']

const CHECKLIST_LABELS: Record<string, string> = {
  appel_lancement: 'Appel de lancement réalisé',
  bloc1: 'Bloc 1 complété',
  bloc2: 'Bloc 2 complété',
  bloc3: 'Bloc 3 complété',
  bloc4: 'Bloc 4 complété',
  sondage: 'Sondage lancé',
  dg: 'Questionnaire DG reçu',
  ia_generated: 'Diagnostic généré par IA',
  validated: 'Diagnostic relu et validé',
  restitution_planned: 'Restitution planifiée',
  unlocked: 'Diagnostic déverrouillé',
}

const SECTION_NAMES = [
  'Synthèse éditoriale', 'Priorités', 'Score de maturité', 'Écarts de perception',
  'Capital humain', 'Empreinte carbone', 'Échéances clés', "Profil d'avancement", 'Prochaines étapes',
]

export default function AdminDiagnosticDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const diag = MOCK_DIAGNOSTICS.find(d => d.id === id)

  if (!diag) return <div className="p-8">Diagnostic introuvable.</div>

  const st = STATUS_CONFIG[diag.status]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg hover:bg-[var(--color-gris-100)]">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{diag.company}</h1>
          <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>{diag.analyst} · {diag.sector}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
          {st.label}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="px-4 py-2.5 text-sm font-medium transition-colors -mb-px"
            style={{
              borderBottom: activeTab === i ? '2px solid #1B5E3B' : '2px solid transparent',
              color: activeTab === i ? '#1B5E3B' : 'var(--color-texte-secondary)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && <TabResume diag={diag} />}
      {activeTab === 1 && <TabResponses />}
      {activeTab === 2 && <TabSurvey diag={diag} />}
      {activeTab === 3 && <TabDiagnostic />}
      {activeTab === 4 && <TabJournal />}
    </div>
  )
}

// ── TAB 1: Résumé ──────────────────────────────
function TabResume({ diag }: { diag: typeof MOCK_DIAGNOSTICS[0] }) {
  const [checklist, setChecklist] = useState({ ...diag.checklist })
  const [status, setStatus] = useState(diag.status)

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Info card */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
          Informations client
        </h3>
        <div className="space-y-3 text-sm">
          <InfoRow label="Entreprise" value={diag.company} />
          <InfoRow label="Email" value={diag.contactEmail} />
          <InfoRow label="Secteur" value={diag.sector} />
          <InfoRow label="Effectif" value={diag.headcount} />
          <InfoRow label="CA" value={diag.revenue} />
          <InfoRow label="Analyste" value={diag.analyst} />
          <InfoRow label="Créé le" value={new Date(diag.createdAt).toLocaleDateString('fr-FR')} />
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-texte-secondary)' }}>Statut</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as DiagnosticStatus)}
            className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-texte-secondary)', letterSpacing: '0.05em' }}>
          Avancement
        </h3>
        <div className="space-y-2">
          {Object.entries(CHECKLIST_LABELS).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 py-1.5 cursor-pointer text-sm">
              <div
                className="w-5 h-5 rounded flex items-center justify-center border transition-colors"
                style={{
                  backgroundColor: checklist[key] ? '#1B5E3B' : 'transparent',
                  borderColor: checklist[key] ? '#1B5E3B' : 'var(--color-gris-300)',
                }}
                onClick={() => setChecklist(p => ({ ...p, [key]: !p[key] }))}
              >
                {checklist[key] && <Check size={12} color="white" />}
              </div>
              <span style={{ color: checklist[key] ? 'var(--color-texte)' : 'var(--color-texte-secondary)' }}>
                {label}
                {key === 'sondage' && ` (${diag.surveyRespondents} répondants)`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--color-texte-secondary)' }}>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

// ── TAB 2: Réponses client ─────────────────────
function TabResponses() {
  const blocks = [
    { name: 'Bloc 1 — Votre démarche', desc: '12 tuiles d\'avancement, effectif, CA, code NAF' },
    { name: 'Bloc 2 — Maturité climat', desc: '20 questions sur 4 dimensions (score calculé)' },
    { name: 'Bloc 3 — Enjeux et vision', desc: 'Moteurs, freins, réglementation, ambitions' },
    { name: 'Bloc 4 — Perception', desc: 'P1-P8 scores, prédictions, population, Q27 confidentiel' },
  ]

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <div key={i} className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold">{b.name}</h3>
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-gris-100)', color: 'var(--color-texte-secondary)' }}>
              <Eye size={12} /> Voir les réponses
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>{b.desc}</p>
          {i === 3 && (
            <div className="mt-3 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--color-gold-100)', color: '#E8734A' }}>
              ⚠️ Q27 — Contient une note confidentielle destinée uniquement à l'analyste
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── TAB 3: Sondage & DG ───────────────────────
function TabSurvey({ diag }: { diag: typeof MOCK_DIAGNOSTICS[0] }) {
  const gapColors = (gap: number) => gap > 2 ? '#DC4A4A' : gap >= 1 ? '#E8734A' : '#1B5E3B'

  const mockGaps = [
    { question: 'Implication des équipes', rse: 7.8, emp: 4.6, gap: 3.2 },
    { question: 'Objectifs clairs', rse: 6.8, emp: 4.0, gap: 2.8 },
    { question: 'Moyens suffisants', rse: 7.5, emp: 4.3, gap: 3.2 },
  ]

  return (
    <div className="space-y-6">
      {/* Survey summary */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-sm font-bold mb-4">Résultats sondage — {diag.surveyRespondents} répondants</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
          Moyennes S1-S8, distribution S9, verbatims S10 disponibles ci-dessous.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {mockGaps.map((g, i) => (
            <div key={i} className="rounded-lg p-3 border-l-3" style={{ backgroundColor: 'var(--color-fond)', borderLeftColor: gapColors(g.gap) }}>
              <p className="text-xs font-medium mb-1">{g.question}</p>
              <div className="flex gap-2 text-xs">
                <span>RSE: <strong>{g.rse}</strong></span>
                <span>Terrain: <strong>{g.emp}</strong></span>
              </div>
              <p className="text-xs font-bold mt-1" style={{ color: gapColors(g.gap) }}>Écart: {g.gap.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DG */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-sm font-bold mb-3">Questionnaire Direction</h3>
        <div className="flex items-center gap-2">
          {diag.dgReceived ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-celsius-100)', color: '#1B5E3B' }}>
              Reçu ✅
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-gold-100)', color: '#E8734A' }}>
              En attente ⏳
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── TAB 4: Diagnostic editor ───────────────────
function TabDiagnostic() {
  const [showAIModal, setShowAIModal] = useState(false)
  const [sectionStatuses, setSectionStatuses] = useState<string[]>(
    SECTION_NAMES.map(() => 'empty')
  )

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    empty: { label: 'Vide', bg: 'var(--color-gris-100)', color: 'var(--color-gris-400)' },
    draft: { label: 'Brouillon', bg: 'var(--color-gold-100)', color: '#E8734A' },
    validated: { label: 'Validé', bg: 'var(--color-celsius-100)', color: '#1B5E3B' },
  }

  const allValidated = sectionStatuses.every(s => s === 'validated')

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: '#1B5E3B' }}
        >
          <Sparkles size={16} /> Pré-remplir par IA
        </button>
        <button
          className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.02]"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-texte-secondary)' }}
        >
          Prévisualiser côté client
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {SECTION_NAMES.map((name, i) => {
          const sc = statusConfig[sectionStatuses[i]]
          return (
            <div key={i} className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
              <span className="text-xs font-bold w-6 text-center" style={{ color: 'var(--color-gris-400)' }}>{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{name}</span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
              <button
                onClick={() => {
                  const next = sectionStatuses[i] === 'empty' ? 'draft' : sectionStatuses[i] === 'draft' ? 'validated' : 'empty'
                  setSectionStatuses(p => p.map((s, j) => j === i ? next : s))
                }}
                className="p-1.5 rounded-lg hover:bg-[var(--color-gris-100)]"
                title="Modifier"
              >
                <Pencil size={14} style={{ color: 'var(--color-texte-secondary)' }} />
              </button>
            </div>
          )
        })}
      </div>

      <button
        disabled={!allValidated}
        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.005]"
        style={{ backgroundColor: '#1B5E3B' }}
      >
        Déverrouiller le diagnostic
      </button>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAIModal(false)}>
          <div className="rounded-xl p-6 max-w-md w-full mx-4" style={{ backgroundColor: 'var(--color-blanc)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Pré-remplir par IA</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--color-texte-secondary)' }}>
              L'IA va générer un brouillon pour les 9 sections à partir des données collectées. Vous pourrez relire et modifier chaque section avant validation.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAIModal(false)} className="px-4 py-2 text-sm rounded-lg" style={{ color: 'var(--color-texte-secondary)' }}>
                Annuler
              </button>
              <button
                onClick={() => {
                  setSectionStatuses(SECTION_NAMES.map(() => 'draft'))
                  setShowAIModal(false)
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white"
                style={{ backgroundColor: '#1B5E3B' }}
              >
                Générer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── TAB 5: Journal ─────────────────────────────
function TabJournal() {
  const [note, setNote] = useState('')
  const [step, setStep] = useState('')

  const steps = ['Démarrage', 'Questionnaire en cours', 'Analyse en cours', 'Restitution', 'Livré']

  return (
    <div>
      {/* Add form */}
      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-sm font-bold mb-3">Publier une note</h3>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Écrire une note visible par le client..."
          className="w-full text-sm p-3 rounded-lg border-none resize-none focus:outline-none mb-3"
          style={{ backgroundColor: 'var(--color-fond)', minHeight: '80px' }}
          rows={3}
        />
        <div className="flex items-center gap-3">
          <select
            value={step}
            onChange={e => setStep(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <option value="">Changement d'étape (optionnel)</option>
            {steps.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold ml-auto"
            style={{ backgroundColor: '#1B5E3B' }}
          >
            Publier
          </button>
        </div>
      </div>

      <p className="text-sm text-center py-8" style={{ color: 'var(--color-texte-secondary)' }}>
        Les notes publiées apparaîtront ici et dans le journal de bord du client.
      </p>
    </div>
  )
}
