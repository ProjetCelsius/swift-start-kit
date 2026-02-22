import { useNavigate } from 'react-router-dom'
import { Lock, Lightbulb, Target, TrendingUp } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import { mockDiagnostic } from '@/data/mockDiagnosticData'
import { useDiagnosticReading, type ReadingState } from '@/hooks/useDiagnosticReading'

const d = mockDiagnostic

const SECTION_CARDS = [
  { num: 1, title: 'Synthèse éditoriale', teaser: '3 constats clés pour votre organisation' },
  { num: 2, title: 'Nos recommandations', teaser: '3 priorités d\'action identifiées' },
  { num: 3, title: 'Score de maturité', teaser: `Score global : ${d.section3.globalScore}/100 — Note ${d.section3.globalGrade}` },
  { num: 4, title: 'Écarts de perception', teaser: 'Écart moyen de perception : 2.3 points' },
  { num: 5, title: 'Moyens & ressources', teaser: `Moyens actuels : ${d.section5.currentFTE} ETP vs ${d.section5.recommendedFTE} recommandés` },
  { num: 6, title: 'Empreinte carbone', teaser: `${d.section6.total.toLocaleString('fr-FR')} tCO₂e — ${d.section6.perEmployee} tCO₂e/collaborateur` },
  { num: 7, title: 'Échéancier réglementaire', teaser: '6 échéances réglementaires dont 2 urgentes' },
  { num: 8, title: 'Cartographie', teaser: '4 dispositifs réalisés, 4 essentiels manquants' },
  { num: 9, title: 'Feuille de route', teaser: 'Plan d\'action sur 4 trimestres' },
]

const KEY_FINDINGS = [
  {
    icon: <Lightbulb size={18} color="#B87333" />,
    text: 'Des fondations solides mais fragiles : la démarche repose sur une seule personne. Si elle part, tout s\'arrête.',
  },
  {
    icon: <Target size={18} color="#DC4A4A" />,
    text: 'Écart perception critique : vous estimiez 60% d\'engagés, la réalité mesurée est de 38%. Un problème de communication, pas d\'adhésion.',
  },
  {
    icon: <TrendingUp size={18} color="#1B4332" />,
    text: 'Scope 3 cartographié et CSRD en approche : 18 mois pour transformer la conformité en avantage concurrentiel.',
  },
]

const GRADE_COLOR: Record<string, string> = { A: '#1B4332', B: '#2D6A4F', C: '#B87333', D: '#DC4A4A' }

export default function DiagnosticSynthesis() {
  const navigate = useNavigate()
  const { progress } = useDiagnosticReading()

  const radarData = d.section3.dimensions.map(dim => ({
    subject: dim.name.replace('et ', '& '),
    value: dim.score,
    fullMark: 100,
  }))

  const scoreColor = GRADE_COLOR[d.section3.globalGrade] || '#2D6A4F'
  const scorePercent = d.section3.globalScore

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#2A2A28', marginBottom: 4 }}>
          Synthèse du diagnostic
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D' }}>
          {d.client.name} · {d.section1.date}
        </p>
      </div>

      {/* ── TOP BAND: Score + Radar + Profil Climat ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '200px 1fr 260px', gap: 20, marginBottom: 28,
      }}>
        {/* Score */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EDEAE3',
          padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 12 }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#F0EDE6" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="6"
                strokeDasharray={`${scorePercent * 2.64} ${264 - scorePercent * 2.64}`}
                strokeLinecap="round" />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="font-display" style={{ fontSize: '2.2rem', fontWeight: 500, color: scoreColor, lineHeight: 1 }}>
                {d.section3.globalGrade}
              </span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, color: '#2A2A28' }}>
            {d.section3.globalScore}/100
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>
            Structuré
          </div>
        </div>

        {/* Radar */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EDEAE3',
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#EDEAE3" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)', fill: '#2A2A28' }} />
                <Radar dataKey="value" stroke="#1B4332" strokeWidth={2} fill="#1B4332" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profil Climat */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EDEAE3',
          padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 10,
          }}>
            PROFIL CLIMAT
          </div>
          <div className="font-display" style={{
            fontSize: '1.4rem', fontWeight: 500, color: '#1B4332', letterSpacing: '0.05em', marginBottom: 8,
          }}>
            {d.client.profilClimat.code}
          </div>
          <div className="font-display" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#2A2A28', marginBottom: 6 }}>
            {d.client.profilClimat.name}
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 8 }}>
            {d.client.profilClimat.phrase}
          </p>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 12,
            backgroundColor: '#E8F0EB', fontFamily: 'var(--font-sans)', fontSize: '0.65rem',
            fontWeight: 500, color: '#1B4332', alignSelf: 'flex-start',
          }}>
            {d.client.profilClimat.family}
          </span>
        </div>
      </div>

      {/* ── MIDDLE: 3 Key Findings ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 12,
        }}>
          CONSTATS CLÉS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {KEY_FINDINGS.map((f, i) => (
            <div key={i} style={{
              backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #EDEAE3',
              padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0EDE6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28', lineHeight: 1.5 }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM: 9-Section Grid ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 12,
        }}>
          9 SECTIONS D'ANALYSE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {SECTION_CARDS.map(card => {
            const state: ReadingState = progress[String(card.num)] || 'locked'
            const isLocked = state === 'locked'
            const isNouveau = state === 'nouveau'

            return (
              <button
                key={card.num}
                onClick={() => { if (!isLocked) navigate(`/client/diagnostic/${card.num}`) }}
                style={{
                  position: 'relative',
                  backgroundColor: isLocked ? '#F7F5F0' : '#FFFFFF',
                  borderRadius: 12,
                  border: `1px solid ${isNouveau ? '#B8733344' : '#EDEAE3'}`,
                  padding: '18px 16px',
                  textAlign: 'left',
                  cursor: isLocked ? 'default' : 'pointer',
                  opacity: isLocked ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isLocked) e.currentTarget.style.boxShadow = '0 2px 8px rgba(42,42,40,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Badge */}
                {isNouveau && (
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    padding: '2px 8px', borderRadius: 10,
                    backgroundColor: '#F5EDE4', color: '#B87333',
                    fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 600,
                  }}>
                    Nouveau
                  </span>
                )}
                {isLocked && (
                  <span style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Lock size={12} color="#B0AB9F" />
                  </span>
                )}

                {/* Number circle */}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', marginBottom: 10,
                  backgroundColor: isLocked ? '#E5E1D8' : '#1B4332',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 600,
                  color: isLocked ? '#B0AB9F' : '#FFFFFF',
                }}>
                  {card.num}
                </div>

                <div className="font-display" style={{
                  fontSize: '0.88rem', fontWeight: 500, color: isLocked ? '#B0AB9F' : '#2A2A28',
                  marginBottom: 4,
                }}>
                  {card.title}
                </div>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
                  color: isLocked ? '#B0AB9F' : '#7A766D', lineHeight: 1.4,
                }}>
                  {card.teaser}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
