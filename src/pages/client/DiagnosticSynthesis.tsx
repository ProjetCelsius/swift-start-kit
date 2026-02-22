import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Clock, Lock, Check } from 'lucide-react'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import { useDiagnosticReading, type ReadingState } from '@/hooks/useDiagnosticReading'
import { useDemoIfAvailable } from '@/hooks/useDemo'
import type { DemoStatus } from '@/data/demoData'

const d = mockDiagnostic

// ── Helpers ────────────────────────────
function gradeColor(grade: string) {
  if (grade === 'A') return '#1B4332'
  if (grade === 'B') return '#2D6A4F'
  if (grade === 'C') return '#B87333'
  return '#DC4A4A'
}

function getPageState(status: DemoStatus | undefined): 'unlocked' | 'analysis' | 'locked' {
  if (status === 'delivered' || status === 'ready_for_restitution') return 'unlocked'
  if (status === 'analysis') return 'analysis'
  return 'locked'
}

function getCompletedSteps(status: DemoStatus | undefined) {
  const s = status || 'questionnaire'
  const steps = [
    { label: 'Lancement', done: true },
    { label: 'Questionnaire', done: s !== 'onboarding' && s !== 'questionnaire' ? true : s === 'questionnaire' ? 'current' : false },
    { label: 'Sondages', done: ['analysis', 'ready_for_restitution', 'delivered'].includes(s) ? true : s === 'survey_pending' ? 'current' : false },
    { label: 'Documents', done: ['analysis', 'ready_for_restitution', 'delivered'].includes(s) ? true : false },
    { label: 'Analyse', done: ['ready_for_restitution', 'delivered'].includes(s) ? true : s === 'analysis' ? 'current' : false },
  ]
  const doneCount = steps.filter(st => st.done === true).length
  return { steps, doneCount }
}

// ── SVG Radar ────────────────────────────
function RadarSVG() {
  const dims = d.section3.dimensions
  const sa = d.section3.sectorAverages as Record<string, number>
  const w = 220, h = 180
  const cx = w / 2, cy = h / 2 + 5
  const r = 70

  // Diamond orientation: top, right, bottom, left
  const angles = [-90, 0, 90, 180].map(a => (a * Math.PI) / 180)

  function point(angle: number, value: number) {
    const ratio = value / 100
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) }
  }

  const levels = [25, 50, 75, 100]
  const clientPoints = dims.map((dim, i) => point(angles[i], dim.score))
  const sectorPoints = dims.map((dim, i) => point(angles[i], sa[dim.name] || 55))

  const clientPath = clientPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'
  const sectorPath = sectorPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'

  const labels = [
    { name: 'Gouvernance', score: dims[0].score, anchor: 'middle' as const, dx: 0, dy: -8 },
    { name: 'Mes', score: dims[1].score, anchor: 'start' as const, dx: 8, dy: 4 },
    { name: 'Stratégie', score: dims[2].score, anchor: 'middle' as const, dx: 0, dy: 16 },
    { name: 'ture', score: dims[3].score, anchor: 'end' as const, dx: -8, dy: 4 },
  ]

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Grid levels */}
      {levels.map(lev => {
        const pts = angles.map(a => point(a, lev))
        return <polygon key={lev} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#EDEAE3" strokeWidth={0.8} />
      })}
      {/* Axes */}
      {angles.map((a, i) => {
        const end = point(a, 100)
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#EDEAE3" strokeWidth={0.8} />
      })}
      {/* Sector polygon */}
      <path d={sectorPath} fill="rgba(176,171,159,0.08)" stroke="#B0AB9F" strokeWidth={1.5} strokeDasharray="4 3" />
      {/* Client polygon */}
      <path d={clientPath} fill="rgba(27,67,50,0.1)" stroke="#1B4332" strokeWidth={2} />
      {/* Labels */}
      {labels.map((lb, i) => {
        const p = point(angles[i], 100)
        return (
          <g key={i}>
            <text x={p.x + lb.dx} y={p.y + lb.dy - 6} textAnchor={lb.anchor}
              style={{ fontSize: 10, fontFamily: 'var(--font-sans)', fontWeight: 500, fill: '#2A2A28' }}>
              {lb.name}
            </text>
            <text x={p.x + lb.dx} y={p.y + lb.dy + 6} textAnchor={lb.anchor}
              style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 600, fill: gradeColor(dims[i].grade) }}>
              {lb.score}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Section teasers ────────────────────────────
const SECTION_CARDS = [
  { num: 1, title: 'Synthèse éditoriale', teaser: '3 constats clés pour votre organisation — l\'avis de votre analyste.', highlight: true },
  { num: 2, title: 'Ce que nous ferions à votre place', teaser: '3 priorités d\'action + 1 anti-recommandation pour éviter les faux pas.' },
  { num: 3, title: 'Score de maturité', teaser: `${d.section3.globalScore}/100 — Note ${d.section3.globalGrade}. 4 dimensions analysées, comparaison sectorielle.` },
  { num: 4, title: 'Écarts de perception', teaser: 'Le triple regard : RSE, prédiction, terrain. Écart moyen de 2.3 points.', highlight: true },
  { num: 5, title: 'Moyens et ressources', teaser: `${d.section5.currentFTE} ETP actuel vs ${d.section5.recommendedFTE} ETP recommandés — un écart critique à combler.` },
  { num: 6, title: 'Empreinte carbone', teaser: `${d.section6.total.toLocaleString('fr-FR')} tCO₂e · ${d.section6.perEmployee} t/collaborateur · Inférieur à la moyenne sectorielle.` },
  { num: 7, title: 'Échéancier réglementaire', teaser: '6 échéances identifiées dont 2 urgentes dans les 6 prochains mois.' },
  { num: 8, title: 'Cartographie des dispositifs', teaser: '4 réalisés · 2 en cours · 6 à démarrer dont 2 essentiels.' },
  { num: 9, title: 'Feuille de route', teaser: 'Plan d\'action sur 4 trimestres — de T1 à T4 2026.' },
]

// ── Key insights data ────────────────────────────
function getKeyInsights() {
  // Perception gap: find max |rse - terrain|
  const gaps = d.section4.perceptionData.map(item => ({ ...item, gap: Math.abs(item.rse - item.terrain) }))
  const maxGap = gaps.reduce((a, b) => a.gap > b.gap ? a : b)

  // First priority
  const prio = d.section2.priorities[0]

  // Next deadline not started
  const nextDeadline = d.section7.deadlines.find(dl => dl.status === 'Pas commence') || d.section7.deadlines[1]

  return [
    {
      icon: <AlertTriangle size={16} />, iconBg: '#FEF2F2', iconColor: '#DC4A4A',
      label: 'ALERTE PERCEPTION', labelColor: '#DC4A4A',
      value: `–${maxGap.gap.toFixed(1)} points`,
      detail: `Écart majeur sur « ${maxGap.label} » — vos équipes ne voient pas ce que vous pensez avoir communiqué.`,
      link: 'Section 4 : Détails →', route: '/client/diagnostic/4',
    },
    {
      icon: <CheckCircle size={16} />, iconBg: '#E8F0EB', iconColor: '#1B4332',
      label: 'PRIORITÉ N°1', labelColor: '#1B4332',
      value: 'Reporting COMEX',
      detail: prio.why.length > 80 ? prio.why.slice(0, 80) + '…' : prio.why,
      link: 'Section 2 : Plan d\'action →', route: '/client/diagnostic/2',
    },
    {
      icon: <Clock size={16} />, iconBg: '#F5EDE4', iconColor: '#B87333',
      label: 'PROCHAINE ÉCHÉANCE', labelColor: '#B87333',
      value: `CSRD — Juin 2026`,
      detail: `${nextDeadline.description} ${nextDeadline.status === 'Pas commence' ? 'Pas encore commencé' : nextDeadline.status} — 4 mois restants.`,
      link: 'Section 7 : Échéancier →', route: '/client/diagnostic/7',
    },
  ]
}

// ═══════ MAIN COMPONENT ═══════
export default function DiagnosticSynthesis() {
  const navigate = useNavigate()
  const { progress } = useDiagnosticReading()
  const demo = useDemoIfAvailable()
  const demoStatus = demo?.enabled ? demo.activeDiagnostic.status : 'delivered'
  const org = demo?.enabled ? demo.activeDiagnostic.organization : null
  const pageState = getPageState(demoStatus as DemoStatus)

  // ── Analysis state ──
  if (pageState === 'analysis') return <AnalysisView status={demoStatus as DemoStatus} org={org} />

  // ── Locked state ──
  if (pageState === 'locked') return <LockedView status={demoStatus as DemoStatus} org={org} />

  // ── Unlocked state ──
  const insights = getKeyInsights()
  const scoreColor = gradeColor(d.section3.globalGrade)
  const circumference = 2 * Math.PI * 58
  const dashLength = (d.section3.globalScore / 100) * circumference

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Stagger animation styles */}
      <style>{`
        @keyframes synthFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .synth-stagger > * { opacity: 0; animation: synthFadeIn 500ms ease-out forwards; }
        .synth-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .synth-stagger > *:nth-child(2) { animation-delay: 50ms; }
        .synth-stagger > *:nth-child(3) { animation-delay: 100ms; }
        .synth-stagger > *:nth-child(4) { animation-delay: 150ms; }
        .synth-stagger > *:nth-child(5) { animation-delay: 200ms; }
        .synth-stagger > *:nth-child(6) { animation-delay: 250ms; }
      `}</style>

      <div className="synth-stagger">
        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 8 }}>
            SYNTHÈSE DU DIAGNOSTIC
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.65rem', color: '#2A2A28', margin: '0 0 8px' }}>
            Votre diagnostic climat est prêt
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', margin: '0 0 14px' }}>
            9 sections d'analyse personnalisées pour {org?.name || d.client.name} — {org?.sector || d.client.sector} · {org?.headcount || d.client.employees} collaborateurs
          </p>
          {/* Analyst attribution */}
          <div className="flex items-center gap-2.5">
            <div style={{
              width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1B4332',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.65rem', color: '#fff',
            }}>GP</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.76rem', color: '#7A766D', margin: 0 }}>
              Rédigé par <strong style={{ color: '#2A2A28', fontWeight: 600 }}>{d.client.analyst.name}</strong>, {d.client.analyst.title.toLowerCase()} · Celsius — {d.section1.date}
            </p>
          </div>
        </div>

        {/* ── HERO BAND ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '200px 1fr 260px', gap: 0,
          backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #EDEAE3',
          padding: 28, marginBottom: 20,
        }}>
          {/* Score ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 12 }}>
              <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%' }}>
                <circle cx="70" cy="70" r="58" fill="none" stroke="#EDEAE3" strokeWidth="10" />
                <circle cx="70" cy="70" r="58" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={circumference * 0.25}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, color: '#2A2A28', lineHeight: 1 }}>
                  {d.section3.globalScore}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: '#B0AB9F' }}>/ 100</span>
              </div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 8, backgroundColor: '#E8F0EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6,
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500, color: '#1B4332' }}>
                {d.section3.globalGrade}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>Score de maturité</span>
          </div>

          {/* Radar chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 4 }}>
              VOS 4 DIMENSIONS
            </div>
            <RadarSVG />
            {/* Legend */}
            <div className="flex items-center gap-4" style={{ marginTop: 4 }}>
              <div className="flex items-center gap-1.5">
                <span style={{ width: 16, height: 2, backgroundColor: '#1B4332', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: '#7A766D' }}>Votre score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ width: 16, height: 2, backgroundColor: '#B0AB9F', display: 'inline-block', borderTop: '1px dashed #B0AB9F' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: '#B0AB9F' }}>Moyenne sectorielle</span>
              </div>
            </div>
          </div>

          {/* Profil Climat */}
          <div style={{
            background: 'linear-gradient(135deg, #E8F0EB, #FFFFFF 50%, #F5EDE4)',
            border: '1px solid #EDEAE3', borderRadius: 12, padding: 20,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 10 }}>
              VOTRE PROFIL CLIMAT
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: '#1B4332', letterSpacing: '0.15em', marginBottom: 6 }}>
              {d.client.profilClimat.code.split('').join(' · ')}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: '#2A2A28', marginBottom: 6 }}>
              {d.client.profilClimat.name}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.76rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10, margin: '0 0 10px' }}>
              « {d.client.profilClimat.phrase} »
            </p>
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 4,
              backgroundColor: '#E8F0EB', fontFamily: 'var(--font-sans)', fontSize: '0.6rem',
              fontWeight: 600, color: '#1B4332', textTransform: 'uppercase', letterSpacing: '0.05em',
              alignSelf: 'flex-start',
            }}>
              {d.client.profilClimat.family}
            </span>
          </div>
        </div>

        {/* ── 3 KEY INSIGHTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
          {insights.map((ins, i) => (
            <button
              key={i}
              onClick={() => navigate(ins.route)}
              className="insight-card"
              style={{
                backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #EDEAE3',
                padding: '20px 18px', textAlign: 'left', cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(42,42,40,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div className="flex items-center gap-2.5" style={{ marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: ins.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ins.iconColor }}>
                  {ins.icon}
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: ins.labelColor }}>
                  {ins.label}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: '#2A2A28', marginBottom: 6 }}>
                {ins.value}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D', lineHeight: 1.5, margin: '0 0 12px' }}>
                {ins.detail}
              </p>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, color: '#1B4332' }}>
                {ins.link}
              </span>
            </button>
          ))}
        </div>

        {/* ── DIMENSION BARS ── */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EDEAE3',
          padding: '22px 24px', marginBottom: 24,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: '#2A2A28', marginBottom: 16 }}>
            Scores par dimension
          </div>
          {d.section3.dimensions.map((dim, i) => {
            const sectorAvg = (d.section3.sectorAverages as Record<string, number>)[dim.name] || 55
            const isGood = dim.grade === 'A' || dim.grade === 'B'
            const barColor = isGood
              ? `linear-gradient(90deg, #1B4332, #2D6A4F)`
              : `linear-gradient(90deg, #B87333, #D4956B)`

            return (
              <div key={i} className="flex items-center gap-3" style={{ marginBottom: i < 3 ? 14 : 0 }}>
                <span style={{ width: 160, fontFamily: 'var(--font-sans)', fontSize: '0.76rem', fontWeight: 500, color: '#2A2A28', flexShrink: 0 }}>
                  {dim.name}
                </span>
                <div style={{ flex: 1, position: 'relative', height: 8, backgroundColor: '#F0EDE6', borderRadius: 4 }}>
                  <div style={{
                    height: 8, borderRadius: 4, width: `${dim.score}%`,
                    background: barColor,
                    transition: 'width 0.8s ease',
                  }} />
                  {/* Sector marker */}
                  <div style={{
                    position: 'absolute', top: -3, left: `${sectorAvg}%`,
                    width: 2, height: 14, backgroundColor: '#B0AB9F', opacity: 0.5,
                    borderRadius: 1,
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 500, color: gradeColor(dim.grade), width: 28, textAlign: 'right' }}>
                  {dim.score}
                </span>
                <div style={{
                  width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isGood ? '#E8F0EB' : '#F5EDE4',
                  fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 600,
                  color: isGood ? '#1B4332' : '#B87333',
                }}>
                  {dim.grade}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── 9-SECTION GRID ── */}
        <div style={{ marginBottom: 28 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: '#2A2A28', margin: 0 }}>
              Votre diagnostic en détail
            </h2>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F' }}>
              9 SECTIONS
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {SECTION_CARDS.map(card => {
              const state: ReadingState = progress[String(card.num)] || 'locked'
              const isLocked = state === 'locked'
              const isNouveau = state === 'nouveau'
              const isHighlight = card.highlight && !isLocked

              return (
                <button
                  key={card.num}
                  onClick={() => { if (!isLocked) navigate(`/client/diagnostic/${card.num}`) }}
                  style={{
                    position: 'relative',
                    backgroundColor: isLocked ? '#FAFAF8' : '#FFFFFF',
                    borderRadius: 12,
                    border: isHighlight ? '1.5px solid #2D6A4F' : `1px solid #EDEAE3`,
                    padding: '18px 16px',
                    textAlign: 'left',
                    cursor: isLocked ? 'default' : 'pointer',
                    opacity: isLocked ? 0.45 : 1,
                    pointerEvents: isLocked ? 'none' : 'auto',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={e => { if (!isLocked) { e.currentTarget.style.borderColor = '#1B4332'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(42,42,40,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isHighlight ? '#2D6A4F' : '#EDEAE3'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {/* Top row: number + title */}
                  <div className="flex items-start gap-3" style={{ marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: isHighlight ? '#1B4332' : isLocked ? '#F0EDE6' : '#E8F0EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 600,
                      color: isHighlight ? '#FFFFFF' : isLocked ? '#B0AB9F' : '#1B4332',
                    }}>
                      {card.num}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 500,
                      color: isLocked ? '#B0AB9F' : '#2A2A28', lineHeight: 1.3, paddingTop: 4,
                    }}>
                      {card.title}
                    </span>
                  </div>

                  {/* Teaser */}
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                    color: isLocked ? '#B0AB9F' : '#7A766D', lineHeight: 1.5,
                    margin: '0 0 14px',
                  }}>
                    {card.teaser}
                  </p>

                  {/* Footer: link + badge */}
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, color: isLocked ? '#B0AB9F' : '#1B4332' }}>
                      Consulter →
                    </span>
                    {isNouveau && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 4,
                        backgroundColor: '#F5EDE4', color: '#B87333',
                        fontFamily: 'var(--font-sans)', fontSize: '0.52rem', fontWeight: 600,
                      }}>
                        Nouveau
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════ ANALYSIS VIEW ═══════
function AnalysisView({ status }: { status: DemoStatus; org: any }) {
  const { steps } = getCompletedSteps(status)
  return (
    <div style={{ maxWidth: 960 }}>
      <style>{`
        @keyframes synthFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes analysisPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(27,67,50,0.2); } 50% { box-shadow: 0 0 0 12px rgba(27,67,50,0); } }
        .synth-stagger > * { opacity: 0; animation: synthFadeIn 500ms ease-out forwards; }
        .synth-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .synth-stagger > *:nth-child(2) { animation-delay: 50ms; }
      `}</style>
      <div className="synth-stagger">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 8 }}>
            SYNTHÈSE DU DIAGNOSTIC
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.65rem', color: '#2A2A28', opacity: 0.5, margin: '0 0 8px' }}>
            Diagnostic en cours de préparation
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D' }}>
            Toutes vos données ont été reçues. Guillaume prépare votre diagnostic personnalisé.
          </p>
        </div>

        <div style={{
          position: 'relative', minHeight: 500, backgroundColor: '#FFFFFF',
          borderRadius: 16, border: '1px solid #EDEAE3', overflow: 'hidden',
        }}>
          {/* Blurred background blobs */}
          <div style={{ position: 'absolute', inset: 0, filter: 'blur(40px)', opacity: 0.3, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(27,67,50,0.2)', top: '20%', left: '10%' }} />
            <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(184,115,51,0.15)', top: '30%', right: '15%' }} />
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(45,106,79,0.2)', bottom: '20%', left: '40%' }} />
          </div>
          {/* Geometric shapes suggestion */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', filter: 'blur(16px)' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 500">
              <rect x="80" y="60" width="180" height="12" rx="4" fill="#1B4332" />
              <rect x="80" y="85" width="140" height="12" rx="4" fill="#2D6A4F" />
              <rect x="80" y="110" width="100" height="12" rx="4" fill="#5B8C6E" />
              <circle cx="600" cy="120" r="50" fill="none" stroke="#1B4332" strokeWidth="8" />
              <rect x="350" y="200" width="120" height="80" rx="8" fill="#B87333" opacity="0.3" />
              <line x1="80" y1="250" x2="300" y2="250" stroke="#EDEAE3" strokeWidth="3" />
              <line x1="80" y1="270" x2="260" y2="270" stroke="#EDEAE3" strokeWidth="3" />
              <line x1="80" y1="290" x2="220" y2="290" stroke="#EDEAE3" strokeWidth="3" />
            </svg>
          </div>

          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(247,245,240,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Pulsing avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: '50%', backgroundColor: '#1B4332',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: '#fff',
              marginBottom: 16, animation: 'analysisPulse 2s ease-in-out infinite',
            }}>GP</div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.2rem', color: '#2A2A28', margin: '0 0 8px' }}>
              Guillaume analyse vos résultats
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D', textAlign: 'center', maxWidth: 360, margin: '0 0 24px', lineHeight: 1.5 }}>
              Votre analyste a bien reçu toutes vos réponses et celles de vos équipes. Le diagnostic personnalisé sera prêt sous 48h.
            </p>

            {/* Progress bar */}
            <div style={{ width: 220, height: 4, borderRadius: 2, backgroundColor: '#EDEAE3', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #1B4332, #B87333)' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: '#B0AB9F', margin: '0 0 16px' }}>
              5 / 5 étapes complétées — Analyse en cours
            </p>

            {/* Step pills */}
            <div className="flex items-center gap-1.5" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {steps.map((step, i) => {
                const isDone = step.done === true
                const isCurrent = step.done === 'current'
                return (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 12px', borderRadius: 16,
                    backgroundColor: isDone ? '#E8F0EB' : isCurrent ? '#F5EDE4' : '#F0EDE6',
                    border: `1px solid ${isDone ? '#2D6A4F22' : isCurrent ? '#B8733322' : '#EDEAE3'}`,
                    fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500,
                    color: isDone ? '#1B4332' : isCurrent ? '#B87333' : '#B0AB9F',
                  }}>
                    {isDone ? <Check size={10} /> : isCurrent ? '⏳' : null}
                    {step.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════ LOCKED VIEW ═══════
function LockedView({ status }: { status: DemoStatus; org: any }) {
  const { steps, doneCount } = getCompletedSteps(status)
  const progressWidth = (doneCount / 5) * 100

  return (
    <div style={{ maxWidth: 960 }}>
      <style>{`
        @keyframes synthFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .synth-stagger > * { opacity: 0; animation: synthFadeIn 500ms ease-out forwards; }
        .synth-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .synth-stagger > *:nth-child(2) { animation-delay: 50ms; }
      `}</style>
      <div className="synth-stagger">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 8 }}>
            SYNTHÈSE DU DIAGNOSTIC
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.65rem', color: '#2A2A28', opacity: 0.5, margin: '0 0 8px' }}>
            Votre diagnostic n'est pas encore disponible
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D' }}>
            Complétez les étapes restantes pour débloquer votre analyse personnalisée.
          </p>
        </div>

        <div style={{
          position: 'relative', minHeight: 500, backgroundColor: '#FFFFFF',
          borderRadius: 16, border: '1px solid #EDEAE3', overflow: 'hidden',
        }}>
          {/* Blurred blobs */}
          <div style={{ position: 'absolute', inset: 0, filter: 'blur(40px)', opacity: 0.25, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(27,67,50,0.15)', top: '15%', left: '20%' }} />
            <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(184,115,51,0.1)', bottom: '25%', right: '20%' }} />
          </div>
          {/* Geometric shapes */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', filter: 'blur(16px)' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 500">
              <rect x="100" y="80" width="160" height="10" rx="4" fill="#1B4332" />
              <rect x="100" y="100" width="120" height="10" rx="4" fill="#2D6A4F" />
              <circle cx="580" cy="140" r="45" fill="none" stroke="#B87333" strokeWidth="6" />
              <rect x="300" y="250" width="100" height="60" rx="6" fill="#EDEAE3" />
            </svg>
          </div>

          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(247,245,240,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Lock icon */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5EDE4, #F0EDE6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Lock size={24} color="#B87333" strokeWidth={1.5} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.2rem', color: '#2A2A28', margin: '0 0 8px' }}>
              Votre diagnostic en 9 sections
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D', textAlign: 'center', maxWidth: 360, margin: '0 0 24px', lineHeight: 1.5 }}>
              Complétez le questionnaire, les sondages et l'envoi de vos documents pour débloquer votre analyse.
            </p>

            {/* Progress bar */}
            <div style={{ width: 220, height: 4, borderRadius: 2, backgroundColor: '#EDEAE3', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${progressWidth}%`, borderRadius: 2, background: 'linear-gradient(90deg, #1B4332, #B87333)', transition: 'width 0.5s ease' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: '#B0AB9F', margin: '0 0 16px' }}>
              {doneCount} / 5 étapes complétées
            </p>

            {/* Step pills */}
            <div className="flex items-center gap-1.5" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {steps.map((step, i) => {
                const isDone = step.done === true
                const isCurrent = step.done === 'current'
                return (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 12px', borderRadius: 16,
                    backgroundColor: isDone ? '#E8F0EB' : isCurrent ? '#F5EDE4' : '#F0EDE6',
                    border: `1px solid ${isDone ? '#2D6A4F22' : isCurrent ? '#B8733322' : '#EDEAE3'}`,
                    fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500,
                    color: isDone ? '#1B4332' : isCurrent ? '#B87333' : '#B0AB9F',
                  }}>
                    {isDone ? <Check size={10} /> : isCurrent ? '◉' : null}
                    {step.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
