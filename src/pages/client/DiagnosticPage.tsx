import { useState, useEffect, useRef } from 'react'
import { Zap, Coins, AlertTriangle, Info, TrendingDown, TrendingUp, Check, RefreshCw, ChevronRight } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import { mockDiagnostic } from '@/data/mockDiagnosticData'

const d = mockDiagnostic
const SECTION_IDS = ['synthese', 'priorites', 'maturite', 'perception', 'dimensionnement', 'empreinte', 'echeances', 'cartographie', 'feuille']
const SECTION_LABELS = ['Synthèse', 'Priorités', 'Maturité', 'Perception', 'Dimensionnement', 'Empreinte', 'Échéances', 'Cartographie', 'Feuille de route']

const GRADE_COLOR: Record<string, string> = { A: '#1B4332', B: '#2D6A4F', C: '#B87333', D: '#DC4A4A' }
const POP_COLORS = ['#1B4332', '#2D6A4F', '#B0AB9F', '#B87333', '#DC4A4A']
const POP_LABELS = ['Moteurs', 'Engagés', 'Indifférents', 'Sceptiques', 'Réfractaires']

function SectionLabel({ num, title }: { num: number; title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p className="label-uppercase" style={{ marginBottom: 6 }}>SECTION {num}</p>
      <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 500 }}>{title}</h2>
    </div>
  )
}

export default function DiagnosticPage() {
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setActiveSection(idx)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    sectionRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const radarData = d.section3.dimensions.map(dim => ({
    subject: dim.name.replace('et ', '& '),
    value: dim.score,
  }))

  const perceptionChartData = d.section4.perceptionData.map(p => ({
    name: p.label,
    RSE: p.rse,
    Prédiction: p.prediction,
    Terrain: p.terrain,
  }))

  const popEst = d.section4.populationEstimated
  const popReal = d.section4.populationReal
  const popEstData = [
    { name: 'Moteurs', value: popEst.moteurs },
    { name: 'Engagés', value: popEst.engages },
    { name: 'Indifférents', value: popEst.indifferents },
    { name: 'Sceptiques', value: popEst.sceptiques },
    { name: 'Réfractaires', value: popEst.refractaires },
  ]
  const popRealData = [
    { name: 'Moteurs', value: popReal.moteurs },
    { name: 'Engagés', value: popReal.engages },
    { name: 'Indifférents', value: popReal.indifferents },
    { name: 'Sceptiques', value: popReal.sceptiques },
    { name: 'Réfractaires', value: popReal.refractaires },
  ]

  // Check divergence
  const maxDivergence = Math.max(
    Math.abs(popEst.moteurs - popReal.moteurs),
    Math.abs(popEst.engages - popReal.engages),
    Math.abs(popEst.indifferents - popReal.indifferents),
    Math.abs(popEst.sceptiques - popReal.sceptiques),
    Math.abs(popEst.refractaires - popReal.refractaires),
  )

  const s6 = d.section6
  const scopeTotal = s6.scope1 + s6.scope2 + s6.scope3
  const s1Pct = (s6.scope1 / scopeTotal) * 100
  const s2Pct = (s6.scope2 / scopeTotal) * 100
  const s3Pct = (s6.scope3 / scopeTotal) * 100

  return (
    <div style={{ maxWidth: 960, position: 'relative' }}>
      {/* Mini nav */}
      <div style={{
        position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 50,
      }}>
        {SECTION_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            title={SECTION_LABELS[i]}
            style={{
              width: activeSection === i ? 10 : 8,
              height: activeSection === i ? 10 : 8,
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              backgroundColor: activeSection === i ? '#1B4332' : '#E5E1D8',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: 10 }}>
          Votre diagnostic climat
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
            backgroundColor: '#E8F0EB', color: '#1B4332',
          }}>
            {d.client.name}
          </span>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
            backgroundColor: '#1B4332', color: '#fff',
          }}>
            Prêt
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#B0AB9F', marginBottom: 16 }}>{d.section1.date}</p>

        {/* Analyst card */}
        <div style={{
          backgroundColor: '#E8F0EB', borderRadius: 14, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 600, color: '#fff', flexShrink: 0,
          }}>
            {d.client.analyst.initials}
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d.client.analyst.name}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 300, color: '#B0AB9F' }}>{d.client.analyst.title}</p>
          </div>
        </div>
      </div>

      {/* SECTION 1 — SYNTHESE */}
      <div ref={el => { sectionRefs.current[0] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={1} title="Synthèse et recommandations" />
        {d.section1.paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 680, marginBottom: 20, color: '#2A2A28' }}>{p}</p>
        ))}
      </div>

      {/* SECTION 2 — PRIORITES */}
      <div ref={el => { sectionRefs.current[1] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={2} title="Vos 3 priorités" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {d.section2.priorities.map((p, i) => (
            <div key={i} style={{
              backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: 24,
              boxShadow: '0 1px 3px rgba(42,42,40,.04)',
            }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1B4332',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span className="font-display" style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{i + 1}</span>
                </div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: '#2A2A28' }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 14 }}>{p.why}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                  borderRadius: 20, backgroundColor: '#F0EDE6', fontSize: '0.7rem', fontWeight: 500,
                }}>
                  <Zap size={12} /> {p.effort}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                  borderRadius: 20, backgroundColor: '#F5EDE4', fontSize: '0.7rem', fontWeight: 500,
                }}>
                  <Coins size={12} /> {p.budget}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Anti-recommendation */}
        <div style={{
          backgroundColor: '#FEF6E6', borderLeft: '4px solid #B87333', borderRadius: 10, padding: 20,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <AlertTriangle size={18} color="#B87333" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#B87333', marginBottom: 6 }}>
              Ce que nous ne recommandons PAS
            </p>
            <p style={{ fontSize: '0.85rem', color: '#2A2A28', lineHeight: 1.6 }}>{d.section2.antiRecommendation}</p>
          </div>
        </div>
      </div>

      {/* SECTION 3 — MATURITE */}
      <div ref={el => { sectionRefs.current[2] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={3} title="Votre maturité climat" />

        {/* Global score */}
        <div style={{
          background: 'linear-gradient(135deg, #E8F0EB, #F5EDE4)', borderRadius: 14, padding: 32,
          textAlign: 'center', marginBottom: 24,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', border: '3px solid #1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <span className="font-display" style={{ fontSize: '4rem', fontWeight: 600, color: '#1B4332', lineHeight: 1 }}>
              {d.section3.globalGrade}
            </span>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 4 }}>{d.section3.globalScore}/100</p>
          <p className="font-display" style={{ fontSize: '1rem', fontWeight: 400, color: '#2A2A28' }}>Structuré</p>
        </div>

        {/* Radar */}
        <div style={{ width: '100%', maxWidth: 360, height: 320, margin: '0 auto 24px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#EDEAE3" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)', fill: '#2A2A28' }} />
              <Radar dataKey="value" stroke="#1B4332" strokeWidth={2} fill="#1B4332" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension rows */}
        {d.section3.dimensions.map(dim => (
          <div key={dim.name} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
            borderBottom: '1px solid #EDEAE3',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, width: 180, flexShrink: 0 }}>{dim.name}</span>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: GRADE_COLOR[dim.grade] || '#B0AB9F', flexShrink: 0,
            }}>
              <span className="font-display" style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 500 }}>{dim.grade}</span>
            </div>
            <div style={{ flex: 1, height: 6, backgroundColor: '#F0EDE6', borderRadius: 3 }}>
              <div style={{
                height: '100%', borderRadius: 3, width: `${dim.score}%`,
                backgroundColor: GRADE_COLOR[dim.grade] || '#B0AB9F', transition: 'width 0.5s',
              }} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#7A766D', width: 40, textAlign: 'right' }}>
              {dim.score}
            </span>
          </div>
        ))}
      </div>

      {/* SECTION 4 — PERCEPTION */}
      <div ref={el => { sectionRefs.current[3] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={4} title="Écarts de perception" />

        <div style={{
          backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: 20,
          marginBottom: 24, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
        }}>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perceptionChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE3" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: '#B0AB9F' }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#2A2A28', fontFamily: 'var(--font-sans)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }} />
                <Bar dataKey="RSE" fill="#1B4332" barSize={8} radius={[0, 4, 4, 0]} />
                <Bar dataKey="Prédiction" fill="#B87333" barSize={8} radius={[0, 4, 4, 0]} />
                <Bar dataKey="Terrain" fill="#7A766D" barSize={8} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Population comparison */}
        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>Cartographie estimée vs réelle</p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { label: 'Votre estimation', data: popEstData },
            { label: 'Réalité mesurée', data: popRealData },
          ].map(({ label, data }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: 8, color: '#7A766D' }}>{label}</p>
              <div style={{ width: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={2} stroke="#fff">
                      {data.map((_, i) => <Cell key={i} fill={POP_COLORS[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* Shared legend */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {POP_LABELS.map((label, i) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: POP_COLORS[i] }} />
              {label}
            </span>
          ))}
        </div>

        {maxDivergence > 15 && (
          <div style={{
            backgroundColor: '#FEE2E2', borderRadius: 10, padding: '14px 18px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <AlertTriangle size={16} color="#DC4A4A" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.85rem', color: '#2A2A28' }}>
              Écart significatif détecté ({maxDivergence}pp) entre votre estimation et la réalité mesurée. La population "Engagés" est surestimée de {popEst.engages - popReal.engages}pp.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 5 — DIMENSIONNEMENT */}
      <div ref={el => { sectionRefs.current[4] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={5} title="Dimensionnement de la fonction climat" />

        <div style={{
          backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: 24,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
        }}>
          {/* Scale labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, paddingLeft: 100 }}>
            {[0, 0.5, 1, 1.5, 2, 2.5, 3].map(v => (
              <span key={v} style={{ fontSize: '0.7rem', color: '#B0AB9F', width: 0, textAlign: 'center' }}>{v}</span>
            ))}
          </div>

          {/* Actuel bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, width: 88, textAlign: 'right' }}>Actuel</span>
            <div style={{ flex: 1, height: 24, backgroundColor: '#F0EDE6', borderRadius: 6, position: 'relative' }}>
              <div style={{
                height: '100%', borderRadius: 6, width: `${(d.section5.currentFTE / 3) * 100}%`,
                background: 'linear-gradient(90deg, #DC4A4A, #B87333)',
              }} />
              <span style={{
                position: 'absolute', left: `${(d.section5.currentFTE / 3) * 100}%`, top: '50%',
                transform: 'translate(-50%, -50%)', fontSize: '0.7rem', fontWeight: 600, color: '#fff',
                ...(d.section5.currentFTE / 3 * 100 > 10 ? {} : { color: '#2A2A28', left: `calc(${(d.section5.currentFTE / 3) * 100}% + 20px)` }),
              }}>
                {d.section5.currentFTE} ETP
              </span>
            </div>
          </div>

          {/* Recommandé bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, width: 88, textAlign: 'right' }}>Recommandé</span>
            <div style={{ flex: 1, height: 24, backgroundColor: '#F0EDE6', borderRadius: 6, position: 'relative' }}>
              <div style={{
                height: '100%', borderRadius: 6, width: `${(d.section5.recommendedFTE / 3) * 100}%`,
                backgroundColor: '#1B4332',
              }} />
              <span style={{
                position: 'absolute', left: `${(d.section5.recommendedFTE / 3) * 100}%`, top: '50%',
                transform: 'translate(-50%, -50%)', fontSize: '0.7rem', fontWeight: 600, color: '#fff',
              }}>
                {d.section5.recommendedFTE} ETP
              </span>
            </div>
          </div>

          <span style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: 20,
            backgroundColor: '#FEE2E2', color: '#DC4A4A', fontSize: '0.75rem', fontWeight: 500,
          }}>
            +{(d.section5.recommendedFTE - d.section5.currentFTE).toFixed(1)} ETP nécessaire
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 680, color: '#2A2A28' }}>
          {d.section5.analysisText}
        </p>
      </div>

      {/* SECTION 6 — EMPREINTE */}
      <div ref={el => { sectionRefs.current[5] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={6} title="Votre empreinte carbone" />

        {!s6.hasFootprint ? (
          <div style={{
            backgroundColor: '#E8F0EB', borderRadius: 14, padding: 24,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <Info size={20} color="#1B4332" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.9rem', color: '#2A2A28', lineHeight: 1.6 }}>
              Aucun bilan carbone n'a été réalisé. Un premier bilan est essentiel pour piloter votre stratégie climat.
            </p>
          </div>
        ) : (
          <>
            {/* Key metric */}
            <div style={{
              backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: 24,
              textAlign: 'center', marginBottom: 20, boxShadow: '0 1px 3px rgba(42,42,40,.04)',
            }}>
              <span className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#1B4332' }}>
                {s6.total.toLocaleString('fr-FR')}
              </span>
              <p style={{ fontSize: '0.9rem', color: '#B0AB9F' }}>tCO2e / an</p>
            </div>

            {/* Scope breakdown bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', height: 40, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${s1Pct}%`, backgroundColor: '#1B4332' }} />
                <div style={{ width: `${s2Pct}%`, backgroundColor: '#2D6A4F' }} />
                <div style={{ width: `${s3Pct}%`, backgroundColor: '#B87333' }} />
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Scope 1', value: s6.scope1, pct: s1Pct, color: '#1B4332' },
                  { label: 'Scope 2', value: s6.scope2, pct: s2Pct, color: '#2D6A4F' },
                  { label: 'Scope 3', value: s6.scope3, pct: s3Pct, color: '#B87333' },
                ].map(s => (
                  <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: s.color }} />
                    {s.label}: {s.value.toLocaleString('fr-FR')} tCO2e ({Math.round(s.pct)}%)
                  </span>
                ))}
              </div>
            </div>

            {/* Intensity cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { value: s6.perEmployee, unit: 'tCO2e / salarié', avg: s6.sectorAverage, avgLabel: 'Moyenne secteur' },
                { value: s6.perRevenue, unit: 'tCO2e / k€ CA', avg: s6.sectorAverageRevenue, avgLabel: 'Moyenne secteur' },
              ].map((card, i) => {
                const below = card.value < card.avg
                return (
                  <div key={i} style={{
                    border: '1px solid #EDEAE3', borderRadius: 14, padding: 20,
                  }}>
                    <p className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1B4332', marginBottom: 2 }}>
                      {card.value}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#B0AB9F', marginBottom: 10 }}>{card.unit}</p>
                    <p style={{ fontSize: '0.78rem', color: '#7A766D', marginBottom: 6 }}>
                      {card.avgLabel} : {card.avg}
                    </p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: '0.75rem', fontWeight: 500,
                      color: below ? '#1B4332' : '#DC4A4A',
                    }}>
                      {below ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                      {below ? 'Sous la moyenne' : 'Au-dessus de la moyenne'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* SECTION 7 — ECHEANCES */}
      <div ref={el => { sectionRefs.current[6] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={7} title="Vos échéances réglementaires" />
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, backgroundColor: '#EDEAE3' }} />
          {d.section7.deadlines.map((dl, i) => {
            const year = parseInt(dl.date)
            const isPast = dl.date.includes('2026') && dl.date.includes('Janvier')
            const isUpcoming = dl.date.includes('2026') || (year >= 2026 && year <= 2027)
            const dateBg = isPast ? '#FEE2E2' : isUpcoming ? '#F5EDE4' : '#E8F0EB'
            const dateColor = isPast ? '#DC4A4A' : isUpcoming ? '#B87333' : '#1B4332'
            return (
              <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                {/* Dot on line */}
                <div style={{
                  position: 'absolute', left: -32 + 0, top: 20, width: 12, height: 12,
                  borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #EDEAE3',
                }} />
                <div style={{
                  backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14,
                  padding: '18px 22px', boxShadow: '0 1px 3px rgba(42,42,40,.04)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                }}>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                      backgroundColor: dateBg, color: dateColor, fontSize: '0.7rem', fontWeight: 600,
                      marginBottom: 8,
                    }}>{dl.date}</span>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2A2A28', marginBottom: 4 }}>{dl.obligation}</p>
                    <p style={{ fontSize: '0.8rem', color: '#7A766D' }}>{dl.description}</p>
                  </div>
                  <span style={{
                    flexShrink: 0, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 500, whiteSpace: 'nowrap',
                    backgroundColor: dl.status === 'En cours' ? '#F5EDE4' : '#F0EDE6',
                    color: dl.status === 'En cours' ? '#B87333' : '#7A766D',
                  }}>{dl.status === 'Pas commence' ? 'Pas commencé' : dl.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 8 — CARTOGRAPHIE */}
      <div ref={el => { sectionRefs.current[7] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={8} title="Cartographie de vos démarches" />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20,
        }}>
          {d.section8.tiles.map((tile, i) => {
            const statusBg = tile.status === 'Realise' ? '#E8F0EB' : tile.status === 'En cours' ? '#F5EDE4' : '#F0EDE6'
            const statusColor = tile.status === 'Realise' ? '#1B4332' : tile.status === 'En cours' ? '#B87333' : '#7A766D'
            const statusLabel = tile.status === 'Realise' ? 'Réalisé' : tile.status === 'En cours' ? 'En cours' : 'Pas fait'
            const relBg = tile.relevance === 'Essentiel' ? '#FEE2E2' : tile.relevance === 'Recommande' ? '#F5EDE4' : '#F0EDE6'
            const relColor = tile.relevance === 'Essentiel' ? '#DC4A4A' : tile.relevance === 'Recommande' ? '#B87333' : '#7A766D'
            return (
              <div key={i} style={{
                backgroundColor: '#fff', border: '1px solid #EDEAE3', borderRadius: 14, padding: 16,
                display: 'flex', flexDirection: 'column', gap: 8, minHeight: 90,
              }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                    borderRadius: 20, backgroundColor: statusBg, color: statusColor,
                    fontSize: '0.65rem', fontWeight: 600,
                  }}>
                    {tile.status === 'Realise' && <Check size={12} />}
                    {tile.status === 'En cours' && <RefreshCw size={12} />}
                    {statusLabel}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>{tile.name}</p>
                {tile.status === 'Pas fait' && tile.relevance && (
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 20,
                    backgroundColor: relBg, color: relColor, fontSize: '0.65rem', fontWeight: 600,
                    alignSelf: 'flex-start',
                  }}>{tile.relevance === 'Recommande' ? 'Recommandé' : tile.relevance}</span>
                )}
              </div>
            )
          })}
        </div>
        {/* Summary */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'Réalisé', count: d.section8.tiles.filter(t => t.status === 'Realise').length, color: '#1B4332', bg: '#E8F0EB' },
            { label: 'En cours', count: d.section8.tiles.filter(t => t.status === 'En cours').length, color: '#B87333', bg: '#F5EDE4' },
            { label: 'Pas fait', count: d.section8.tiles.filter(t => t.status === 'Pas fait').length, color: '#7A766D', bg: '#F0EDE6' },
          ].map(s => (
            <span key={s.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, backgroundColor: s.bg,
              color: s.color, fontSize: '0.8rem', fontWeight: 600,
            }}>{s.count} {s.label}</span>
          ))}
        </div>
      </div>

      {/* SECTION 9 — FEUILLE DE ROUTE */}
      <div ref={el => { sectionRefs.current[8] = el }} style={{ marginBottom: 56 }}>
        <SectionLabel num={9} title="Feuille de route" />
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', marginBottom: 20 }}>
          {d.section9.quarters.map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ minWidth: 200, flex: 1 }}>
                <div style={{
                  backgroundColor: '#1B4332', color: '#fff', textAlign: 'center',
                  padding: 10, borderRadius: i === 0 ? '10px 0 0 0' : i === 3 ? '0 10px 0 0' : 0,
                  fontSize: '0.85rem', fontWeight: 600,
                }}>{q.label}</div>
                <div style={{
                  backgroundColor: '#fff', border: '1px solid #EDEAE3',
                  borderRadius: i === 0 ? '0 0 0 10px' : i === 3 ? '0 0 10px 0' : 0,
                  padding: 16, minHeight: 120,
                }}>
                  {q.actions.map((a, j) => (
                    <div key={j} style={{
                      backgroundColor: '#F7F5F0', borderRadius: 8, padding: '8px 12px',
                      fontSize: '0.8rem', marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8,
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#1B4332', marginTop: 6, flexShrink: 0 }} />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
              {i < 3 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 2px' }}>
                  <ChevronRight size={16} color="#B0AB9F" />
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#7A766D' }}>
          Cette feuille de route est indicative. Elle sera ajustée lors de la restitution.
        </p>
      </div>
    </div>
  )
}
