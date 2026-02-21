import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Linkedin, GraduationCap, Award, Globe } from 'lucide-react'
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

      {/* Hero card */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 16, overflow: 'hidden' }}>
        {/* Gradient header */}
        <div style={{ height: 120, background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #B87333 100%)' }} />
        
        {/* Profile section */}
        <div style={{ padding: '0 32px 32px', marginTop: -48 }}>
          <div className="flex items-end gap-5 mb-6">
            <img
              src={guillaumePhoto}
              alt="Guillaume Pakula"
              style={{
                width: 96, height: 96, borderRadius: '50%', objectFit: 'cover',
                border: '4px solid #FFFFFF', boxShadow: '0 4px 12px rgba(42,42,40,0.1)',
              }}
            />
            <div style={{ paddingBottom: 4 }}>
              <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#2A2A28', lineHeight: 1.2 }}>
                Guillaume Pakula
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D' }}>
                Analyste Climat Senior · Projet Celsius
              </p>
            </div>
          </div>

          {/* Bio */}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#2A2A28', lineHeight: 1.7, marginBottom: 28 }}>
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
