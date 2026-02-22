import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Linkedin, GraduationCap, Award, Globe, Mail, MessageSquare, Phone, Check, Layers, CheckCircle } from 'lucide-react'
import guillaumePhoto from '@/assets/guillaume-photo.png'
import { useDemoIfAvailable } from '@/hooks/useDemo'
import type { DemoStatus } from '@/data/demoData'

// ── Timeline step logic ──────
function getStepStates(status: DemoStatus | undefined) {
  const s = status || 'questionnaire'
  const isAnalysisOrLater = ['analysis', 'ready_for_restitution', 'delivered'].includes(s)
  const isDoneOrReady = ['ready_for_restitution', 'delivered'].includes(s)

  return [
    {
      title: 'Réception et vérification des données',
      description: 'Questionnaire, sondage interne, entretien direction, documents — tout a été reçu et vérifié.',
      state: isAnalysisOrLater ? 'done' as const : 'upcoming' as const,
      tag: isAnalysisOrLater ? '✓ Complété' : undefined,
      tagStyle: 'done' as const,
    },
    {
      title: 'Analyse croisée et rédaction du diagnostic',
      description: s === 'analysis'
        ? 'Croisement de vos réponses avec les données terrain, benchmarks sectoriels et réglementation. Rédaction des 9 sections personnalisées.'
        : isDoneOrReady
          ? '9 sections rédigées à partir de vos données, benchmarks sectoriels et cadre réglementaire.'
          : 'Croisement de vos réponses avec les données terrain, benchmarks sectoriels et réglementation. Rédaction des 9 sections personnalisées.',
      state: isDoneOrReady ? 'done' as const : s === 'analysis' ? 'current' as const : 'upcoming' as const,
      tag: isDoneOrReady ? '✓ Complété' : s === 'analysis' ? 'En cours — ~48h' : undefined,
      tagStyle: (isDoneOrReady ? 'done' : 'current') as 'done' | 'current',
    },
    {
      title: 'Restitution en visio',
      description: isDoneOrReady
        ? 'Prenez rendez-vous pour discuter de vos résultats et poser vos questions.'
        : 'Présentation de vos résultats, discussion des recommandations et réponses à vos questions.',
      state: isDoneOrReady ? 'current' as const : 'upcoming' as const,
      tag: isDoneOrReady ? 'À planifier' : undefined,
      tagStyle: 'current' as const,
    },
  ]
}

function getLineColor(fromState: string, toState: string) {
  if (fromState === 'done' && toState === 'done') return '#1B4332'
  if (fromState === 'done' && toState === 'current') return 'url(#line-gradient)'
  return '#E5E1D8'
}

export default function AnalystProfilePage() {
  const navigate = useNavigate()
  const demo = useDemoIfAvailable()
  const demoStatus = demo?.enabled ? demo.activeDiagnostic.status : undefined
  const steps = getStepStates(demoStatus)

  const isAnalysisOrLater = ['analysis', 'ready_for_restitution', 'delivered'].includes(demoStatus || '')
  const isDoneOrReady = ['ready_for_restitution', 'delivered'].includes(demoStatus || '')

  const timelineHeading = isDoneOrReady
    ? 'Ce que Guillaume a fait pour vous'
    : 'Ce que Guillaume fait pour vous'

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6"
        style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} /> Retour
      </button>

      {/* ═══ Hero ═══ */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 16, overflow: 'hidden' }}>
        {/* Light gradient header */}
        <div style={{
          padding: '28px 32px 24px',
          background: 'linear-gradient(160deg, #E8F0EB 0%, #F0EDE6 40%, #F5EDE4 100%)',
        }}>
          <div className="label-uppercase" style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: '#B0AB9F', marginBottom: 8 }}>
            VOTRE ANALYSTE DÉDIÉ
          </div>
          <div className="flex items-center gap-5">
            <img
              src={guillaumePhoto}
              alt="Guillaume Pakula"
              style={{
                width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                border: '3px solid rgba(27,67,50,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}
            />
            <div>
              <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 500, color: '#1B4332', lineHeight: 1.2 }}>
                Guillaume Pakula
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', marginTop: 2 }}>
                Analyste Climat Senior · Projet Celsius
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A766D', marginTop: 6, lineHeight: 1.5, maxWidth: 380 }}>
                Guillaume s'occupe personnellement de votre dossier, de l'analyse de vos réponses à la restitution finale.
              </p>
            </div>
          </div>
        </div>

        {/* Contact bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #EDEAE3' }}>
          {[
            { icon: <Mail size={15} />, label: 'Email', value: 'guillaume@projetcelsius.fr', href: 'mailto:guillaume@projetcelsius.fr' },
            { icon: <MessageSquare size={15} />, label: 'Message', value: 'Envoyer', href: '/client/messages' },
            { icon: <Phone size={15} />, label: 'Téléphone', value: '06 12 34 56 78', href: 'tel:+33612345678' },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={item.label === 'Message' ? (e) => { e.preventDefault(); navigate('/client/messages') } : undefined}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 20px', textDecoration: 'none',
                borderRight: i < 2 ? '1px solid #EDEAE3' : 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F7F5F0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ color: '#1B4332' }}>{item.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: '#B0AB9F', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#2A2A28', fontWeight: 500 }}>{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Bio */}
        <div style={{ padding: '24px 32px 28px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#2A2A28', lineHeight: 1.7, marginBottom: 24 }}>
            <p>
              Docteur en physique et professeur dans l'enseignement supérieur, Guillaume vulgarise le climat et les sujets environnementaux depuis 2019 de manière simple et ludique. Spécialisé dans le <strong>calcul d'impact environnemental</strong> et de <strong>l'empreinte carbone</strong>, il accompagne les organisations dans leur compréhension des enjeux climatiques.
            </p>
            <p className="mt-3">
              Au sein du Projet Celsius, il conçoit et rédige les diagnostics de maturité climat, en croisant données quantitatives, perception interne et analyse sectorielle pour produire des recommandations actionnables et sur mesure.
            </p>
          </div>

          {/* Expertise tags */}
          <div className="mb-6">
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F', marginBottom: 10 }}>
              DOMAINES D'EXPERTISE
            </div>
            <div className="flex flex-wrap gap-2">
              {['Bilan Carbone', 'CSRD & BEGES', 'Analyse sectorielle', 'Empreinte carbone', 'Vulgarisation climat', 'Ordres de grandeur'].map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '5px 14px', borderRadius: 20,
                    backgroundColor: 'transparent', color: '#2A2A28',
                    fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
                    border: '1px solid #EDEAE3',
                    transition: 'all 0.15s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#E8F0EB'
                    e.currentTarget.style.borderColor = '#2D6A4F'
                    e.currentTarget.style.color = '#1B4332'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#EDEAE3'
                    e.currentTarget.style.color = '#2A2A28'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F7F5F0' }}>
              <GraduationCap size={18} color="#1B4332" />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>Docteur en physique</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>Professeur dans le supérieur</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F7F5F0' }}>
              <Award size={18} color="#B87333" />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>Depuis 2019</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>Vulgarisation & conseil climat</div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/guillaume-pakula-72883b89/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#F7F5F0', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28', textDecoration: 'none', border: '1px solid #EDEAE3' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8F0EB')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            <a
              href="https://projetcelsius.notion.site/guillaumepakula"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#F7F5F0', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28', textDecoration: 'none', border: '1px solid #EDEAE3' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8F0EB')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
            >
              <Globe size={15} /> Site personnel
            </a>
          </div>
        </div>
      </div>

      {/* ═══ Dynamic Timeline ═══ */}
      <div className="mt-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14, padding: '24px 28px' }}>
        <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: '#2A2A28', marginBottom: 20 }}>
          {timelineHeading}
        </h2>

        {/* SVG gradient def for line */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B4332" />
              <stop offset="100%" stopColor="#B87333" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1
            const nextStep = steps[i + 1]
            const lineColor = !isLast ? getLineColor(step.state, nextStep?.state || 'upcoming') : undefined

            return (
              <div key={i} style={{ display: 'flex', gap: 16 }}>
                {/* Circle + line column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                  {/* Circle */}
                  {step.state === 'done' ? (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', backgroundColor: '#1B4332',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Check size={14} color="#fff" strokeWidth={2.5} />
                    </div>
                  ) : step.state === 'current' ? (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', backgroundColor: '#fff',
                      border: '2px solid #B87333',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', backgroundColor: '#B87333',
                        animation: 'pulse-dot 1.5s ease-in-out infinite',
                      }} />
                    </div>
                  ) : (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', backgroundColor: '#fff',
                      border: '1.5px solid #E5E1D8', flexShrink: 0,
                    }} />
                  )}
                  {/* Vertical line */}
                  {!isLast && (
                    <div style={{
                      width: 1.5, flex: 1, minHeight: 24,
                      background: lineColor || '#E5E1D8',
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: isLast ? 0 : 20, paddingTop: 2, flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                    fontWeight: step.state === 'current' ? 600 : 500,
                    color: step.state === 'current' ? '#B87333' : step.state === 'done' ? '#2A2A28' : '#B0AB9F',
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.7rem', marginTop: 3, lineHeight: 1.5,
                    color: step.state === 'upcoming' ? '#B0AB9F' : '#7A766D',
                  }}>
                    {step.description}
                  </div>
                  {step.tag && (
                    <span style={{
                      display: 'inline-block', marginTop: 6,
                      padding: '3px 10px', borderRadius: 6,
                      fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 600,
                      backgroundColor: step.tagStyle === 'done' ? '#E8F0EB' : '#F5EDE4',
                      color: step.tagStyle === 'done' ? '#1B4332' : '#B87333',
                    }}>
                      {step.tag}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══ Status Card (only if analysis or later) ═══ */}
      {isAnalysisOrLater && (
        <div
          onClick={() => navigate(isDoneOrReady ? '/client/synthesis' : '/client/overview')}
          className="mt-6"
          style={{
            background: 'linear-gradient(135deg, #E8F0EB, #FFFFFF 60%, #F5EDE4)',
            border: '1px solid #EDEAE3', borderRadius: 14, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#2D6A4F'
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,67,50,0.08)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#EDEAE3'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {/* Icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 10, backgroundColor: '#1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isDoneOrReady
              ? <CheckCircle size={20} color="#fff" />
              : <Layers size={20} color="#fff" />
            }
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div className="font-display" style={{ fontSize: '0.88rem', fontWeight: 500, color: '#2A2A28' }}>
              {isDoneOrReady ? 'Votre diagnostic est prêt' : 'Votre diagnostic est en cours de préparation'}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#7A766D', marginTop: 2 }}>
              {isDoneOrReady
                ? "9 sections d'analyse personnalisées vous attendent."
                : 'Toutes vos données ont été reçues. Résultats attendus sous 48h.'
              }
            </div>
          </div>

          {/* CTA */}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#1B4332', fontWeight: 500, flexShrink: 0 }}>
            {isDoneOrReady ? 'Consulter' : 'Voir le statut'} ›
          </div>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
