import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Users, User, FileText, CheckCircle2 } from 'lucide-react'
import { getDemoDiagnostic } from '@/data/demoData'

// ── Types ──
type TileState = 'none' | 'done' | 'wip'
interface TileData { state: TileState; comment: string }
type TabId = 1 | 2 | 3

// ── Constants ──
const NAF_SECTORS = [
  'A — Agriculture, sylviculture et pêche',
  'B — Industries extractives',
  'C — Industrie manufacturière',
  'D — Production et distribution d\'électricité, de gaz, de vapeur et d\'air conditionné',
  'E — Production et distribution d\'eau ; assainissement, gestion des déchets et dépollution',
  'F — Construction',
  'G — Commerce ; réparation d\'automobiles et de motocycles',
  'H — Transports et entreposage',
  'I — Hébergement et restauration',
  'J — Information et communication',
  'K — Activités financières et d\'assurance',
  'L — Activités immobilières',
  'M — Activités spécialisées, scientifiques et techniques',
  'N — Activités de services administratifs et de soutien',
  'O — Administration publique',
  'P — Enseignement',
  'Q — Santé humaine et action sociale',
  'R — Arts, spectacles et activités récréatives',
  'S — Autres activités de services',
]

const HEADCOUNT_OPTIONS = ['1–10', '11–50', '51–250', '251–500', '501–1 000', '1 001–5 000', '5 000+']
const REVENUE_OPTIONS = ['< 1 M€', '1–10 M€', '10–50 M€', '50–200 M€', '200 M€–1 Md€', '> 1 Md€']

const DOCUMENTS = [
  { label: 'Dernier Bilan Carbone / Bilan GES', sub: 'Date, périmètre, prestataire' },
  { label: 'Bilan GES réglementaire (BEGES-r)', sub: 'Si applicable (>500 salariés)' },
  { label: 'Rapport DPEF / CSRD', sub: undefined },
  { label: 'Stratégie climat / feuille de route', sub: undefined },
  { label: 'Organigramme RSE / équipe dédiée', sub: undefined },
]

const TILE_ITEMS = [
  'Bilan Carbone ou Bilan GES',
  'Bilan GES réglementaire (BEGES-r)',
  'Stratégie climat formalisée',
  'Trajectoire de réduction (SBTi ou autre)',
  'Reporting CSRD / DPEF',
  'Plan de mobilité',
  'Politique achats responsables',
  'Formation / sensibilisation collaborateurs',
  'Éco-conception produits/services',
  'Certification environnementale',
  'Budget climat/RSE dédié',
  'Poste dédié RSE/climat',
]

// ── Saved indicator ──
function SaveIndicator({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity duration-300"
      style={{
        backgroundColor: '#E8F0EB',
        color: '#1B4332',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      <Check size={12} /> Sauvegardé
    </div>
  )
}

// ── Main Component ──
export default function LaunchCallSetup() {
  const { diagnosticId } = useParams<{ diagnosticId: string }>()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  // Demo data
  const diag = getDemoDiagnostic(diagnosticId || '')
  const clientName = diag?.organization.contact.name || 'Client'
  const clientTitle = diag?.organization.contact.title || ''
  const clientCompany = diag?.organization.name || ''
  const clientInitials = clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>(1)
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set<TabId>())
  const [unlockedTabs, setUnlockedTabs] = useState<Set<TabId>>(new Set<TabId>([1]))

  // Save indicator
  const [showSaved, setShowSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const triggerSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setShowSaved(true)
    saveTimer.current = setTimeout(() => setShowSaved(false), 1500)
  }, [])

  // ── Tab 1 State ──
  const [companyName, setCompanyName] = useState('')
  const [sector, setSector] = useState('')
  const [headcount, setHeadcount] = useState('')
  const [revenue, setRevenue] = useState('')
  const [sitesCount, setSitesCount] = useState('')
  const [rseYear, setRseYear] = useState('')
  const [noRse, setNoRse] = useState(false)
  const [docs, setDocs] = useState<Set<string>>(new Set())

  const tab1Valid = companyName.trim() !== '' && sector !== '' && headcount !== '' && revenue !== ''

  // ── Tab 2 State ──
  const [tiles, setTiles] = useState<TileData[]>(TILE_ITEMS.map(() => ({ state: 'none', comment: '' })))
  const tab2Valid = tiles.some(t => t.state !== 'none')

  // ── Tab 3 State ──
  const [surveyEnabled, setSurveyEnabled] = useState(true)
  const [surveyFormat, setSurveyFormat] = useState<'complet' | 'simplifie'>('complet')
  const [surveyTarget, setSurveyTarget] = useState(30)
  const [dgEnabled, setDgEnabled] = useState(true)
  const [dgFormat, setDgFormat] = useState<'exhaustif' | 'simplifie'>('exhaustif')
  const [dgEmail, setDgEmail] = useState('')
  const [dgName, setDgName] = useState('')

  // Auto-save on changes (skip initial render)
  const isInitial = useRef(true)
  useEffect(() => {
    if (isInitial.current) { isInitial.current = false; return }
    triggerSave()
  }, [companyName, sector, headcount, revenue, sitesCount, rseYear, noRse, docs, tiles, surveyEnabled, surveyFormat, surveyTarget, dgEnabled, dgFormat, dgEmail, dgName, triggerSave])

  // Navigation helpers
  const goToTab = (tab: TabId) => {
    setActiveTab(tab)
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const completeAndNext = (current: TabId, next: TabId) => {
    setCompletedTabs(prev => new Set(prev).add(current))
    setUnlockedTabs(prev => new Set(prev).add(next))
    goToTab(next)
  }

  const cycleTile = (index: number) => {
    setTiles(prev => {
      const copy = [...prev]
      const states: TileState[] = ['none', 'done', 'wip']
      const current = states.indexOf(copy[index].state)
      const next = states[(current + 1) % 3]
      copy[index] = { ...copy[index], state: next, comment: next === 'none' ? '' : copy[index].comment }
      return copy
    })
  }

  const handleValidate = () => {
    // In real app: save to Supabase here
    navigate('/client/dashboard')
  }

  // Summary text
  // Summary text

  let impactText = ''
  let impactColor = '#1B4332'
  if (surveyEnabled && dgEnabled) {
    impactText = 'Le diagnostic inclura la triple couche de perception et la perspective direction. Configuration optimale.'
  } else if (surveyEnabled && !dgEnabled) {
    impactText = 'Perception terrain incluse, pas de perspective DG.'
    impactColor = '#B87333'
  } else if (!surveyEnabled && dgEnabled) {
    impactText = 'Perspective DG incluse, pas de perception terrain.'
    impactColor = '#B87333'
  } else {
    impactText = 'Attention : sans sondage ni DG, pas de triple couche.'
    impactColor = '#B87333'
  }

  // ── Tab rendering helpers ──
  const tabDefs = [
    { id: 1 as TabId, label: 'Profil entreprise' },
    { id: 2 as TabId, label: 'Démarche actuelle' },
    { id: 3 as TabId, label: 'Configuration' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F0', fontFamily: "'DM Sans', sans-serif" }}>
      <SaveIndicator visible={showSaved} />

      {/* ── Header ── */}
      <div className="pt-10 pb-2 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#1B4332' }}>C</div>
          <div className="text-left leading-tight">
            <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#1B4332' }}>PROJET</div>
            <div className="text-sm font-semibold" style={{ color: '#1B4332', fontFamily: "'Fraunces', serif" }}>Celsius</div>
          </div>
        </div>

        <h1 className="text-[1.6rem] mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: '#2A2A28' }}>
          Appel de lancement
        </h1>
        <p className="text-[0.88rem] mb-5" style={{ color: '#7A766D' }}>
          Remplissez chaque étape avec votre client.
        </p>

        {/* Client pill */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-3xl border" style={{ backgroundColor: 'white', borderColor: '#EDEAE3', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, #B87333, #d4956a)' }}>
            {clientInitials}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium" style={{ color: '#2A2A28' }}>{clientName}</div>
            <div className="text-xs" style={{ color: '#7A766D' }}>{clientTitle} · {clientCompany}</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-0 z-40" style={{ backgroundColor: '#F7F5F0' }}>
        <div className="max-w-[780px] mx-auto flex justify-between pt-6 pb-0 px-4">
          {tabDefs.map(tab => {
            const isActive = activeTab === tab.id
            const isCompleted = completedTabs.has(tab.id)
            const isLocked = !unlockedTabs.has(tab.id)

            return (
              <button
                key={tab.id}
                onClick={() => { if (!isLocked) goToTab(tab.id) }}
                disabled={isLocked}
                className="flex flex-col items-center gap-2 pb-3 flex-1 transition-all relative"
                style={{
                  opacity: isLocked ? 0.35 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}
              >
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: isActive || isCompleted ? '#1B4332' : '#F0EDE6',
                    color: isActive || isCompleted ? 'white' : '#B0AB9F',
                  }}
                >
                  {isCompleted ? <Check size={14} /> : tab.id}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: isActive ? '#1B4332' : isCompleted ? '#7A766D' : '#B0AB9F' }}
                >
                  {tab.label}
                </span>
                {/* Active underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-[10%] right-[10%] h-[2.5px] rounded-full" style={{ backgroundColor: '#1B4332' }} />
                )}
              </button>
            )
          })}
        </div>
        <div className="max-w-[780px] mx-auto h-px" style={{ backgroundColor: '#EDEAE3' }} />
      </div>

      {/* ── Content ── */}
      <div ref={contentRef} className="max-w-[780px] mx-auto px-4 pt-8 pb-32">
        {/* ══════════ TAB 1 ══════════ */}
        {activeTab === 1 && (
          <div className="animate-fade-in">
            {/* Section: Informations générales */}
            <div className="rounded-2xl border p-7 mb-6" style={{ backgroundColor: 'white', borderColor: '#EDEAE3', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] mb-5" style={{ color: '#B0AB9F' }}>
                INFORMATIONS GÉNÉRALES
              </div>

              <FieldLabel>Raison sociale</FieldLabel>
              <Input value={companyName} onChange={setCompanyName} placeholder="Ex : Groupe Méridien SAS" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <FieldLabel>Secteur d'activité (code NAF)</FieldLabel>
                  <Select value={sector} onChange={setSector} options={NAF_SECTORS} />
                </div>
                <div>
                  <FieldLabel>Effectif total</FieldLabel>
                  <Select value={headcount} onChange={setHeadcount} options={HEADCOUNT_OPTIONS} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <FieldLabel>Chiffre d'affaires</FieldLabel>
                  <Select value={revenue} onChange={setRevenue} options={REVENUE_OPTIONS} />
                </div>
                <div>
                  <FieldLabel>Nombre de sites</FieldLabel>
                  <Input value={sitesCount} onChange={setSitesCount} placeholder="Ex : 3" type="number" />
                </div>
              </div>

              <div className="mt-4">
                <FieldLabel>Année de création de la démarche RSE</FieldLabel>
                <Input value={rseYear} onChange={setRseYear} placeholder="Ex : 2019" type="number" disabled={noRse} />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <div
                    className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                    style={{
                      borderColor: noRse ? '#1B4332' : '#EDEAE3',
                      backgroundColor: noRse ? '#1B4332' : 'white',
                    }}
                    onClick={() => { setNoRse(!noRse); if (!noRse) setRseYear('') }}
                  >
                    {noRse && <Check size={10} color="white" />}
                  </div>
                  <span className="text-sm" style={{ color: '#2A2A28' }}>Pas de démarche formalisée</span>
                </label>
              </div>
            </div>

            {/* Section: Documents disponibles */}
            <div className="rounded-2xl border p-7" style={{ backgroundColor: 'white', borderColor: '#EDEAE3', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: '#B0AB9F' }}>
                DOCUMENTS DISPONIBLES
              </div>
              <p className="text-[0.82rem] mb-5" style={{ color: '#7A766D' }}>
                Cochez les documents disponibles. Ils seront demandés après l'appel.
              </p>

              <div className="flex flex-col gap-2">
                {DOCUMENTS.map(doc => {
                  const checked = docs.has(doc.label)
                  return (
                    <button
                      key={doc.label}
                      onClick={() => {
                        setDocs(prev => {
                          const next = new Set(prev)
                          checked ? next.delete(doc.label) : next.add(doc.label)
                          return next
                        })
                      }}
                      className="flex items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors"
                      style={{
                        borderColor: checked ? '#1B4332' : '#EDEAE3',
                        backgroundColor: checked ? '#E8F0EB' : 'white',
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          borderColor: checked ? '#1B4332' : '#EDEAE3',
                          backgroundColor: checked ? '#1B4332' : 'white',
                        }}
                      >
                        {checked && <Check size={12} color="white" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: '#2A2A28' }}>{doc.label}</div>
                        {doc.sub && <div className="text-xs" style={{ color: '#B0AB9F' }}>{doc.sub}</div>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 pt-5 border-t flex justify-end" style={{ borderColor: '#EDEAE3' }}>
              <button
                disabled={!tab1Valid}
                onClick={() => completeAndNext(1, 2)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-[9px] text-sm font-medium transition-colors"
                style={{
                  backgroundColor: tab1Valid ? '#1B4332' : '#E5E1D8',
                  color: tab1Valid ? 'white' : '#B0AB9F',
                  cursor: tab1Valid ? 'pointer' : 'not-allowed',
                }}
              >
                Passer à la démarche actuelle <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ══════════ TAB 2 ══════════ */}
        {activeTab === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-[1.05rem] mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: '#2A2A28' }}>
              Démarche actuelle
            </h2>
            <p className="text-[0.82rem] mb-5" style={{ color: '#7A766D' }}>
              Cliquez pour indiquer l'état de chaque item. Un champ de commentaire s'ouvre pour les items réalisés ou en cours.
            </p>

            {/* Legend */}
            <div className="flex items-center gap-5 px-4 py-2.5 rounded-[10px] border mb-5" style={{ backgroundColor: 'white', borderColor: '#EDEAE3' }}>
              <LegendDot color="#E5E1D8" label="Pas encore" />
              <LegendDot color="#1B4332" label="Réalisé" />
              <LegendDot color="#B87333" label="En cours" />
            </div>

            {/* Tiles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TILE_ITEMS.map((item, i) => (
                <AdvancementTile key={item} label={item} data={tiles[i]} onCycle={() => cycleTile(i)}
                  onComment={c => setTiles(prev => { const copy = [...prev]; copy[i] = { ...copy[i], comment: c }; return copy })} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 pt-5 border-t flex justify-between items-center" style={{ borderColor: '#EDEAE3' }}>
              <button onClick={() => goToTab(1)} className="flex items-center gap-1 text-sm font-medium" style={{ color: '#7A766D' }}>
                <ChevronLeft size={16} /> Retour
              </button>
              <button
                disabled={!tab2Valid}
                onClick={() => completeAndNext(2, 3)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-[9px] text-sm font-medium transition-colors"
                style={{
                  backgroundColor: tab2Valid ? '#1B4332' : '#E5E1D8',
                  color: tab2Valid ? 'white' : '#B0AB9F',
                  cursor: tab2Valid ? 'pointer' : 'not-allowed',
                }}
              >
                Passer à la configuration <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ══════════ TAB 3 ══════════ */}
        {activeTab === 3 && (
          <div className="animate-fade-in">
            {/* Module: Sondage interne */}
            <ModuleCard
              icon={<Users size={18} style={{ color: '#1B4332' }} />}
              iconBg="#E8F0EB"
              title="Sondage interne"
              description="Questionnaire anonyme pour mesurer la perception climat interne."
              enabled={surveyEnabled}
              onToggle={() => setSurveyEnabled(!surveyEnabled)}
              warningWhenOff="Le diagnostic n'inclura pas la perception terrain. Écarts de perception adaptés."
            >
              <div className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] mb-3 mt-1" style={{ color: '#B0AB9F' }}>
                FORMAT DU SONDAGE
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <FormatCard selected={surveyFormat === 'complet'} onClick={() => setSurveyFormat('complet')}
                  title="Complet" line1="8 questions + verbatims" line2="~5 min / répondant" />
                <FormatCard selected={surveyFormat === 'simplifie'} onClick={() => setSurveyFormat('simplifie')}
                  title="Simplifié" line1="4 questions essentielles" line2="~2 min / répondant" />
              </div>

              <div className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: '#B0AB9F' }}>
                NOMBRE DE RÉPONDANTS CIBLÉS
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range" min={5} max={100} value={surveyTarget}
                  onChange={e => setSurveyTarget(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #1B4332 0%, #1B4332 ${((surveyTarget - 5) / 95) * 100}%, #E5E1D8 ${((surveyTarget - 5) / 95) * 100}%, #E5E1D8 100%)`,
                  }}
                />
                <div className="w-14 h-10 rounded-lg border flex items-center justify-center text-lg" style={{ borderColor: '#EDEAE3', fontFamily: "'Fraunces', serif", color: '#1B4332' }}>
                  {surveyTarget}
                </div>
              </div>
              <p className="text-xs italic mt-2" style={{ color: '#7A766D' }}>
                Recommandé : 25–50 pour significativité statistique
              </p>
            </ModuleCard>

            {/* Module: Entretien DG */}
            <ModuleCard
              icon={<User size={18} style={{ color: '#B87333' }} />}
              iconBg="#F5EDE4"
              title="Entretien direction générale"
              description="Questionnaire adressé au dirigeant pour sa vision stratégique climat."
              enabled={dgEnabled}
              onToggle={() => setDgEnabled(!dgEnabled)}
              warningWhenOff="Pas de perspective DG. Écarts direction/terrain non disponibles."
            >
              <div className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] mb-3 mt-1" style={{ color: '#B0AB9F' }}>
                FORMAT DE L'ENTRETIEN
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <FormatCard selected={dgFormat === 'exhaustif'} onClick={() => setDgFormat('exhaustif')}
                  title="Exhaustif" line1="5 questions ouvertes + note" line2="~15 min" />
                <FormatCard selected={dgFormat === 'simplifie'} onClick={() => setDgFormat('simplifie')}
                  title="Simplifié" line1="3 questions clés" line2="~5 min" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Email du dirigeant</FieldLabel>
                  <Input value={dgEmail} onChange={setDgEmail} placeholder="dg@entreprise.com" type="email" />
                </div>
                <div>
                  <FieldLabel>Nom et fonction</FieldLabel>
                  <Input value={dgName} onChange={setDgName} placeholder="Ex : Philippe Méridien, DG" />
                </div>
              </div>
            </ModuleCard>

            {/* Summary card */}
            <div className="rounded-2xl border p-6 mb-6" style={{
              background: 'linear-gradient(135deg, #E8F0EB 0%, white 50%, #F5EDE4 100%)',
              borderColor: '#EDEAE3',
            }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} style={{ color: '#2A2A28' }} />
                <span className="font-semibold" style={{ fontFamily: "'Fraunces', serif", color: '#2A2A28' }}>Récapitulatif</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: surveyEnabled ? '#1B4332' : '#B0AB9F' }} />
                <span className="text-sm"><strong>Sondage :</strong> {surveyEnabled ? `${surveyFormat === 'complet' ? 'Complet' : 'Simplifié'}, ${surveyTarget} répondants` : 'Désactivé'}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dgEnabled ? '#B87333' : '#B0AB9F' }} />
                <span className="text-sm"><strong>Entretien DG :</strong> {dgEnabled ? (dgFormat === 'exhaustif' ? 'Exhaustif' : 'Simplifié') : 'Désactivé'}</span>
              </div>
              <div className="border-t pt-3" style={{ borderColor: '#EDEAE3' }}>
                <p className="text-sm" style={{ color: '#7A766D' }}>
                  {impactText.split(/(triple couche de perception|perspective direction|pas de perspective DG|pas de perception terrain|pas de triple couche)/).map((part, i) => {
                    if (['triple couche de perception', 'perspective direction', 'pas de perspective DG', 'pas de perception terrain', 'pas de triple couche'].includes(part)) {
                      return <strong key={i} style={{ color: impactColor }}>{part}</strong>
                    }
                    return part
                  })}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => goToTab(2)} className="flex items-center gap-1 text-sm font-medium" style={{ color: '#7A766D' }}>
                <ChevronLeft size={16} /> Retour
              </button>
            </div>
            <button
              onClick={handleValidate}
              className="w-full flex items-center justify-center gap-2 py-[18px] rounded-[10px] text-sm font-semibold transition-colors"
              style={{
                backgroundColor: '#1B4332',
                color: 'white',
                boxShadow: '0 4px 16px rgba(27,67,50,0.25)',
              }}
            >
              <CheckCircle2 size={18} /> Valider et créer l'espace client →
            </button>
            <p className="text-center mt-3 text-[0.7rem]" style={{ color: '#B0AB9F' }}>
              Modifiable à tout moment depuis l'espace admin
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Reusable sub-components ──

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[0.78rem] font-medium mb-1.5" style={{ color: '#2A2A28' }}>{children}</label>
}

function Input({ value, onChange, placeholder, type = 'text', disabled = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full h-[44px] px-3.5 rounded-lg border text-sm transition-colors outline-none"
      style={{
        borderColor: '#EDEAE3',
        backgroundColor: disabled ? '#F7F5F0' : 'white',
        color: '#2A2A28',
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = '#1B4332'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(27,67,50,0.1)' }}
      onBlur={e => { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.boxShadow = 'none' }}
    />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-[44px] px-3.5 rounded-lg border text-sm outline-none appearance-none bg-white cursor-pointer"
      style={{ borderColor: '#EDEAE3', color: value ? '#2A2A28' : '#B0AB9F' }}
      onFocus={e => { e.currentTarget.style.borderColor = '#1B4332'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(27,67,50,0.1)' }}
      onBlur={e => { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <option value="" disabled>Sélectionnez</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs" style={{ color: '#7A766D' }}>{label}</span>
    </div>
  )
}

function AdvancementTile({ label, data, onCycle, onComment }: {
  label: string; data: TileData; onCycle: () => void; onComment: (c: string) => void
}) {
  const { state, comment } = data

  const styles = {
    none: { bg: 'white', border: '#EDEAE3', iconBg: '#F0EDE6', iconColor: '#B0AB9F', icon: '—', badgeBg: '#F0EDE6', badgeColor: '#B0AB9F', badgeText: 'Pas encore', labelColor: '#2A2A28' },
    done: { bg: '#E8F0EB', border: '#1B4332', iconBg: '#1B4332', iconColor: 'white', icon: '✓', badgeBg: '#1B4332', badgeColor: 'white', badgeText: 'Réalisé', labelColor: '#1B4332' },
    wip: { bg: '#F5EDE4', border: '#B87333', iconBg: '#B87333', iconColor: 'white', icon: '↻', badgeBg: '#B87333', badgeColor: 'white', badgeText: 'En cours', labelColor: '#8B5E2B' },
  }
  const s = styles[state]

  return (
    <div className="rounded-xl border transition-all" style={{ backgroundColor: s.bg, borderColor: s.border }}>
      <button
        onClick={onCycle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
          style={{ backgroundColor: s.iconBg, color: s.iconColor }}>
          {s.icon}
        </div>
        <span className="flex-1 text-sm font-medium" style={{ color: s.labelColor }}>{label}</span>
        <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: s.badgeBg, color: s.badgeColor }}>
          {s.badgeText}
        </span>
      </button>
      {/* Textarea for done/wip */}
      <div
        className="overflow-hidden transition-all duration-250"
        style={{ maxHeight: state !== 'none' ? '120px' : '0px', opacity: state !== 'none' ? 1 : 0 }}
      >
        <div className="px-4 pb-3">
          <textarea
            value={comment}
            onChange={e => onComment(e.target.value)}
            placeholder="Précisez : date, prestataire, périmètre..."
            className="w-full text-xs rounded-lg border p-2.5 resize-none outline-none"
            style={{ borderColor: '#EDEAE3', backgroundColor: 'white', color: '#2A2A28', height: '60px' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#1B4332' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#EDEAE3' }}
          />
        </div>
      </div>
    </div>
  )
}

function ModuleCard({ icon, iconBg, title, description, enabled, onToggle, warningWhenOff, children }: {
  icon: React.ReactNode; iconBg: string; title: string; description: string
  enabled: boolean; onToggle: () => void; warningWhenOff: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'white', borderColor: '#EDEAE3', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center" style={{ backgroundColor: iconBg }}>
            {icon}
          </div>
          <span className="text-base font-medium" style={{ fontFamily: "'Fraunces', serif", color: '#2A2A28' }}>{title}</span>
        </div>
        {/* Toggle */}
        <button
          onClick={onToggle}
          className="w-12 h-6 rounded-full relative transition-colors"
          style={{ backgroundColor: enabled ? '#1B4332' : '#E5E1D8' }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: enabled ? '28px' : '4px' }}
          />
        </button>
      </div>
      <p className="text-[0.82rem] mb-4" style={{ color: '#7A766D' }}>{description}</p>

      {!enabled && (
        <div className="rounded-lg px-4 py-3 text-sm italic border-l-[3px] mb-2" style={{ backgroundColor: '#F5EDE4', borderColor: '#B87333', color: '#B87333' }}>
          {warningWhenOff}
        </div>
      )}

      <div className="transition-all duration-300" style={{ opacity: enabled ? 1 : 0.3, maxHeight: enabled ? '1000px' : '0px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function FormatCard({ selected, onClick, title, line1, line2 }: {
  selected: boolean; onClick: () => void; title: string; line1: string; line2: string
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border p-4 text-left transition-colors"
      style={{
        borderColor: selected ? '#1B4332' : '#EDEAE3',
        backgroundColor: selected ? '#E8F0EB' : 'white',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: selected ? '#1B4332' : '#EDEAE3' }}>
          {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#1B4332' }} />}
        </div>
        <span className="font-semibold text-sm" style={{ color: '#2A2A28' }}>{title}</span>
      </div>
      <p className="text-xs ml-7" style={{ color: '#7A766D' }}>{line1}</p>
      <p className="text-xs ml-7" style={{ color: '#B0AB9F' }}>{line2}</p>
    </button>
  )
}
