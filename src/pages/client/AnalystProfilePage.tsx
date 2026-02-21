import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Linkedin, GraduationCap, Award, Globe, Mail, MessageSquare, Phone } from 'lucide-react'
import guillaumePhoto from '@/assets/guillaume-photo.png'

export default function AnalystProfilePage() {
  const navigate = useNavigate()

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

      {/* ═══ Hero: Your dedicated analyst ═══ */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 16, overflow: 'hidden' }}>
        {/* Warm intro banner */}
        <div style={{
          padding: '28px 32px 24px',
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #3A7D5C 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%',
            background: 'radial-gradient(circle at 80% 50%, rgba(184,115,51,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div className="label-uppercase" style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            VOTRE ANALYSTE DÉDIÉ
          </div>
          <div className="flex items-center gap-5">
            <img
              src={guillaumePhoto}
              alt="Guillaume Pakula"
              style={{
                width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            />
            <div>
              <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.2 }}>
                Guillaume Pakula
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                Analyste Climat Senior · Projet Celsius
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.5, maxWidth: 380 }}>
                Guillaume s'occupe personnellement de votre dossier, de l'analyse de vos réponses à la restitution finale.
              </p>
            </div>
          </div>
        </div>

        {/* Contact bar */}
        <div style={{
          display: 'flex', gap: 0, borderBottom: '1px solid #EDEAE3',
        }}>
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
                <span key={tag} style={{
                  padding: '5px 14px', borderRadius: 20,
                  backgroundColor: '#E8F0EB', color: '#1B4332',
                  fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
                }}>
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
              style={{ backgroundColor: '#F7F5F0', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28', textDecoration: 'none' }}
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
              style={{ backgroundColor: '#F7F5F0', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8F0EB')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
            >
              <Globe size={15} /> Site personnel
            </a>
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div className="mt-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14, padding: '24px 28px' }}>
        <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: '#2A2A28', marginBottom: 12 }}>
          Ce que votre analyste fait pour vous
        </h2>
        <div className="space-y-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6 }}>
          <div className="flex gap-3">
            <span style={{ color: '#1B4332', fontWeight: 600 }}>1.</span>
            <span>Analyse croisée de vos réponses au questionnaire, du sondage interne et de l'entretien DG</span>
          </div>
          <div className="flex gap-3">
            <span style={{ color: '#1B4332', fontWeight: 600 }}>2.</span>
            <span>Rédaction d'un diagnostic personnalisé en 9 sections, avec recommandations concrètes</span>
          </div>
          <div className="flex gap-3">
            <span style={{ color: '#1B4332', fontWeight: 600 }}>3.</span>
            <span>Restitution en visio pour discuter des résultats et répondre à vos questions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
