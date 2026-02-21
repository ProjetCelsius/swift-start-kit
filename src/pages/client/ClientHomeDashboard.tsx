import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check, Users, Lock, HelpCircle, BookOpen } from 'lucide-react'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import ProtocolModal, { useProtocolModal } from '../../components/ProtocolModal'

// ── Journey pieces (non-sequential, "gems to unlock") ──────
type PieceStatus = 'done' | 'active' | 'locked'
const PIECES: { label: string; icon: React.ReactNode; statusText: string; status: PieceStatus }[] = [
  { label: 'Appel', icon: <span style={{ fontSize: '1rem' }}>📞</span>, statusText: 'Réalisé', status: 'done' },
  { label: 'Questionnaire', icon: <span style={{ fontSize: '1rem' }}>📋</span>, statusText: '2/3 blocs', status: 'active' },
  { label: 'Sondage', icon: <span style={{ fontSize: '1rem' }}>👥</span>, statusText: '12 réponses', status: 'active' },
  { label: 'Analyse', icon: <span style={{ fontSize: '1rem' }}>📊</span>, statusText: 'En attente', status: 'locked' },
  { label: 'Restitution', icon: <span style={{ fontSize: '1rem' }}>🎯</span>, statusText: 'Verrouillé', status: 'locked' },
]

export default function ClientHomeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const analyst = MOCK_ANALYST
  const firstName = user?.first_name || 'Marie'
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const protocol = useProtocolModal()

  return (
    <div>
      <ProtocolModal open={protocol.open} onClose={() => protocol.setOpen(false)} />

      {/* ZONE 1 — Header */}
      <div className="dash-fadein" style={{ animationDelay: '0ms' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.85rem', color: '#2A2A28', fontWeight: 400, lineHeight: 1.25 }}>
              Bienvenue {firstName},<br />
              <span>votre diagnostic </span>
              <span style={{ color: '#1B4332', fontWeight: 500 }}>prend forme.</span>
            </h1>
            <p className="mt-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A766D' }}>
              Vous êtes à l'étape 2. Complétez les 3 blocs restants pour avancer vers l'analyse.
            </p>
          </div>
          <button
            onClick={() => protocol.setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
              borderRadius: 12, border: '1px solid #EDEAE3', background: '#FFFFFF',
              fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#2A2A28',
              cursor: 'pointer', flexShrink: 0, marginTop: 4,
              transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(42,42,40,0.04)',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E8F0EB'; e.currentTarget.style.borderColor = '#1B4332' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#EDEAE3' }}
          >
            <HelpCircle size={15} color="#1B4332" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#2A2A28' }}>Comment ça marche ?</div>
              <div style={{ fontSize: '0.65rem', color: '#B0AB9F' }}>Le parcours en 5 étapes</div>
            </div>
          </button>
        </div>
      </div>

      {/* Analyst message */}
      <div className="mt-6 dash-fadein" style={{
        background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
        borderRadius: 14, padding: '16px 20px', border: '1px solid #EDEAE3', animationDelay: '70ms',
      }}>
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: '#1B4332', fontFamily: 'var(--font-display)', fontSize: '0.65rem' }}>
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', color: '#2A2A28' }}>{analyst.first_name} {analyst.last_name}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>il y a 2h</span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', fontStyle: 'italic', lineHeight: 1.5 }}>
              « Vos deux premiers blocs sont très bien renseignés, {firstName}. Votre profil de maturité est intéressant — j'ai hâte de voir la suite ! »
            </p>
          </div>
        </div>
      </div>

      {/* ZONE 2 — JOURNEY PIECES (non-sequential) */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '140ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VOTRE PARCOURS</div>
        <div className="grid grid-cols-5 gap-2">
          {PIECES.map((piece, i) => {
            const isDone = piece.status === 'done'
            const isActive = piece.status === 'active'
            const isLocked = piece.status === 'locked'
            return (
              <div
                key={i}
                style={{
                  backgroundColor: isDone ? '#E8F0EB' : '#FFFFFF',
                  border: `1.5px solid ${isDone ? '#1B4332' : isActive ? '#B87333' : '#EDEAE3'}`,
                  borderRadius: 14, padding: '16px 10px', textAlign: 'center',
                  opacity: isLocked ? 0.5 : 1,
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                {/* Glow for active */}
                {isActive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #B87333, #E8A66A)' }} />}
                {isDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#1B4332' }} />}
                
                <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>
                  {isLocked ? <Lock size={20} color="#B0AB9F" /> : piece.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.72rem', color: isDone ? '#1B4332' : isLocked ? '#B0AB9F' : '#2A2A28', marginBottom: 2 }}>
                  {piece.label}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: isDone ? '#2D6A4F' : '#B0AB9F' }}>
                  {isDone && <Check size={10} className="inline mr-1" />}
                  {piece.statusText}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-2 text-center" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F' }}>
          Complétez les éléments actifs pour débloquer l'analyse et la restitution
        </div>
      </div>

      {/* ZONE 3 — CURRENT ACTION (hero card) */}
      <div className="mt-6 dash-fadein" style={{ animationDelay: '210ms' }}>
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 14,
          border: '1px solid #EDEAE3',
          overflow: 'hidden',
        }}>
          {/* Gradient top border */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, #1B4332, #B87333)' }} />
          <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.52rem',
                letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B87333',
                marginBottom: 6,
              }}>À FAIRE MAINTENANT</div>
              <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 400, color: '#2A2A28', marginBottom: 4 }}>
                Bloc 3 — Vos enjeux et votre vision
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D' }}>
                Encore 4 questions · environ 5 min
              </div>
            </div>
            <button
              onClick={() => navigate('/client/questionnaire/bloc3')}
              style={{
                padding: '13px 28px', borderRadius: 8,
                backgroundColor: '#1B4332', color: '#fff',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background-color 0.2s', flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#153728')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
            >
              Reprendre <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ZONE 4 — SECONDARY ACTIONS */}
      <div className="mt-6 dash-fadein grid grid-cols-1 md:grid-cols-2 gap-3" style={{ animationDelay: '280ms' }}>
        <div
          onClick={() => navigate('/client/sondage')}
          className="cursor-pointer"
          style={{
            backgroundColor: hoveredCard === 'sondage' ? '#FEFEFE' : '#FFFFFF',
            border: `${hoveredCard === 'sondage' ? '1.5px' : '1px'} solid ${hoveredCard === 'sondage' ? '#1B4332' : '#EDEAE3'}`,
            borderRadius: 14, padding: '20px 22px',
            boxShadow: hoveredCard === 'sondage' ? '0 2px 8px rgba(42,42,40,.04), 0 8px 32px rgba(42,42,40,.06)' : 'none',
            transform: hoveredCard === 'sondage' ? 'translateY(-2px)' : 'none',
            background: hoveredCard === 'sondage' ? 'linear-gradient(135deg, #FFFFFF 0%, #E8F0EB 100%)' : '#FFFFFF',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={() => setHoveredCard('sondage')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#F5EDE4' }}>
              <Users size={18} color="#B87333" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="label-uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.45rem' }}>SONDAGE</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: '#2A2A28' }}>Relancer le sondage</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A766D' }}>12/30 réponses collectées</div>
            </div>
            <ChevronRight size={16} color="#B0AB9F" className="shrink-0" />
          </div>
        </div>

        <div
          onClick={() => navigate('/client/journal')}
          className="cursor-pointer"
          style={{
            backgroundColor: hoveredCard === 'journal' ? '#FEFEFE' : '#FFFFFF',
            border: `${hoveredCard === 'journal' ? '1.5px' : '1px'} solid ${hoveredCard === 'journal' ? '#1B4332' : '#EDEAE3'}`,
            borderRadius: 14, padding: '20px 22px',
            boxShadow: hoveredCard === 'journal' ? '0 2px 8px rgba(42,42,40,.04), 0 8px 32px rgba(42,42,40,.06)' : 'none',
            transform: hoveredCard === 'journal' ? 'translateY(-2px)' : 'none',
            background: hoveredCard === 'journal' ? 'linear-gradient(135deg, #FFFFFF 0%, #E8F0EB 100%)' : '#FFFFFF',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={() => setHoveredCard('journal')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#E8F0EB' }}>
              <BookOpen size={18} color="#1B4332" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="label-uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.45rem' }}>JOURNAL</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: '#2A2A28' }}>Journal de bord</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A766D' }}>2 nouvelles entrées</div>
            </div>
            <ChevronRight size={16} color="#B0AB9F" className="shrink-0" />
          </div>
        </div>
      </div>

      {/* ZONE 5 — EN UN COUP D'ŒIL */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '350ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>EN UN COUP D'ŒIL</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>SONDAGE INTERNE</div>
            <div>
              <span className="font-display" style={{ fontWeight: 500, fontSize: '1.4rem', color: '#2A2A28' }}>12</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#B0AB9F' }}> / 30</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>réponses collectées</div>
            <div className="flex gap-[3px] mt-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="h-[4px] rounded-full" style={{ width: 6, backgroundColor: i < 12 ? '#1B4332' : '#E5E1D8' }} />
              ))}
            </div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>ANALYSE EN COURS</div>
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>Phase 1</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>{analyst.first_name} étudie vos réponses</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 12, padding: 20 }}>
            <div className="label-uppercase mb-2" style={{ letterSpacing: '0.1em' }}>PROCHAINE ÉTAPE</div>
            <div className="font-display" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#2A2A28' }}>Restitution</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>Visio planifiée après finalisation</div>
          </div>
        </div>
      </div>

      {/* ZONE 6 — BLURRED DIAGNOSTIC */}
      <div className="mt-8 dash-fadein" style={{ animationDelay: '420ms' }}>
        <div className="label-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VOTRE FUTUR DIAGNOSTIC</div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14, overflow: 'hidden', position: 'relative', height: 280 }}>
          <div style={{ padding: '28px 32px', filter: 'blur(6px)', opacity: 0.6 }}>
            <div className="font-display" style={{ fontSize: '1.3rem', color: '#2A2A28', fontWeight: 400, marginBottom: 16 }}>Synthèse éditoriale</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 12 }}>
              Votre organisation présente un profil de maturité climat de niveau intermédiaire, avec des fondations solides sur le volet réglementaire mais des lacunes identifiées sur l'intégration opérationnelle des enjeux carbone.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, marginBottom: 12 }}>
              Les résultats du sondage interne révèlent un écart significatif entre la perception de la direction et celle des équipes terrain.
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(247,245,240,0.7)' }}>
            <Lock size={32} color="#B0AB9F" strokeWidth={1.5} />
            <div className="mt-3" style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.9rem', color: '#7A766D' }}>
              Déverrouillé après votre restitution
            </div>
            <div style={{ width: 40, height: 1, backgroundColor: '#EDEAE3', margin: '12px 0' }} />
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>
              9 sections d'analyse sur mesure
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dashFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dash-fadein { animation: dashFadeIn 0.5s ease-out both; }
      `}</style>
    </div>
  )
}
