import { useState, type ReactNode } from 'react'
import { X, User, Lock, Download, ChevronRight, Compass, Mail, Phone, BookOpen, Shield, FileText } from 'lucide-react'
import clientAvatar from '@/assets/client-avatar.jpg'
import guillaumePhoto from '@/assets/guillaume-photo.png'
import { MOCK_ANALYST } from '@/hooks/useAuth'

/* ═══════════════════════════════════════════
   Overlay Panel — slides in from the right
   ═══════════════════════════════════════════ */
export function OverlayPanel({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode
}) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(42,42,40,0.25)', animation: 'overlayFadeIn 0.2s ease-out' }} />
      {/* Panel */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 520, height: '100%',
        backgroundColor: '#FFFFFF', boxShadow: '-8px 0 40px rgba(42,42,40,0.1)',
        display: 'flex', flexDirection: 'column', animation: 'overlaySlideIn 0.25s ease-out',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px', borderBottom: '1px solid #EDEAE3', flexShrink: 0,
        }}>
          <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2A2A28' }}>{title}</h2>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '50%', border: '1px solid #EDEAE3',
            backgroundColor: 'transparent', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F5F0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} color="#7A766D" />
          </button>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlaySlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Field Row (reusable)
   ═══════════════════════════════════════════ */
function FieldRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #F7F5F0' }}>
      {icon && <span style={{ color: '#B0AB9F', display: 'flex', flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#2A2A28' }}>{value}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Mon Compte Panel
   ═══════════════════════════════════════════ */
export function MonComptePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <OverlayPanel open={open} onClose={onClose} title="Mon compte">
      {/* Avatar + identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <img src={clientAvatar} alt="Sophie Duval-Martin" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EDEAE3' }} />
        <div>
          <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 500, color: '#2A2A28' }}>Sophie Duval-Martin</div>
          <span style={{
            display: 'inline-block', padding: '3px 12px', borderRadius: 12,
            border: '1px solid #EDEAE3', fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: '0.68rem', color: '#7A766D', marginTop: 4,
          }}>Directrice Générale</span>
        </div>
      </div>

      {/* Info fields */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.72rem', color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>INFORMATIONS PERSONNELLES</div>
        <FieldRow label="E-mail" value="sophie@maison-duval.fr" icon={<Mail size={15} />} />
        <FieldRow label="Téléphone" value="+33 4 72 68 45 00" icon={<Phone size={15} />} />
        <FieldRow label="Organisation" value="Maison Duval" icon={<Shield size={15} />} />
      </div>

      {/* Diagnostic info */}
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.72rem', color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>VOTRE DIAGNOSTIC</div>
        <FieldRow label="Analyste assigné" value={`${MOCK_ANALYST.first_name} ${MOCK_ANALYST.last_name}`} icon={<User size={15} />} />
        <FieldRow label="Date de démarrage" value="10 février 2025" icon={<FileText size={15} />} />
        <FieldRow label="Statut" value="En cours — Étape 2/5" icon={<Compass size={15} />} />
      </div>
    </OverlayPanel>
  )
}

/* ═══════════════════════════════════════════
   Changer le mot de passe Panel
   ═══════════════════════════════════════════ */
export function ChangePasswordPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); onClose() }, 1800)
  }

  return (
    <OverlayPanel open={open} onClose={onClose} title="Changer le mot de passe">
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', backgroundColor: '#E8F0EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Lock size={24} color="#1B4332" />
          </div>
          <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1B4332', marginBottom: 6 }}>
            Mot de passe mis à jour
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D' }}>
            Votre mot de passe a été changé avec succès.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', marginBottom: 24, lineHeight: 1.5 }}>
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
          <InputField label="Mot de passe actuel" type="password" placeholder="••••••••" />
          <InputField label="Nouveau mot de passe" type="password" placeholder="Minimum 8 caractères" />
          <InputField label="Confirmer le nouveau mot de passe" type="password" placeholder="••••••••" />
          <button type="submit" style={{
            width: '100%', padding: '13px 0', borderRadius: 8,
            backgroundColor: '#1B4332', color: '#fff', border: 'none',
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
            cursor: 'pointer', marginTop: 8, transition: 'background-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#153728')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
          >
            Mettre à jour
          </button>
        </form>
      )}
    </OverlayPanel>
  )
}

function InputField({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 500, color: '#2A2A28', display: 'block', marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} style={{
        width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #EDEAE3',
        fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#2A2A28',
        outline: 'none', transition: 'border-color 0.15s', backgroundColor: '#FAFAF8',
      }}
        onFocus={e => (e.currentTarget.style.borderColor = '#1B4332')}
        onBlur={e => (e.currentTarget.style.borderColor = '#EDEAE3')}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════
   Exporter mes données Panel
   ═══════════════════════════════════════════ */
export function ExportDataPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <OverlayPanel open={open} onClose={onClose} title="Exporter mes données">
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F5EDE4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <Download size={24} color="#B87333" />
        </div>
        <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: '#2A2A28', marginBottom: 8 }}>
          Bientôt disponible
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
          L'export de vos données (réponses, diagnostic, journal) sera disponible dans une prochaine mise à jour. Vous pourrez télécharger l'ensemble de vos données au format PDF.
        </p>
      </div>
    </OverlayPanel>
  )
}

/* ═══════════════════════════════════════════
   Aide & Support Panel
   ═══════════════════════════════════════════ */
export function AideSupportPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const analyst = MOCK_ANALYST

  const faqItems = [
    { q: 'Combien de temps dure le diagnostic ?', a: "Le parcours complet prend en moyenne 4 à 6 semaines, de l'appel de lancement à la restitution finale." },
    { q: 'Mes réponses sont-elles confidentielles ?', a: 'Absolument. Seul votre analyste dédié a accès à vos réponses individuelles. Les résultats du sondage interne sont anonymisés.' },
    { q: 'Puis-je modifier mes réponses après validation ?', a: "Oui, vous pouvez revenir sur chaque bloc du questionnaire tant que l'analyse n'a pas démarré." },
    { q: 'Comment fonctionne le sondage interne ?', a: 'Vous invitez vos collaborateurs via un lien unique. Ils répondent anonymement en 5 minutes. Vous suivez le taux de réponse en temps réel.' },
  ]

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <OverlayPanel open={open} onClose={onClose} title="Aide & support">
      {/* Contact analyste */}
      <div style={{
        background: 'linear-gradient(135deg, #E8F0EB 0%, #FFFFFF 50%, #F5EDE4 100%)',
        borderRadius: 14, padding: '18px 20px', border: '1px solid #EDEAE3', marginBottom: 28,
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.68rem', color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>VOTRE CONTACT DÉDIÉ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={guillaumePhoto} alt={analyst.first_name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: '#2A2A28' }}>{analyst.first_name} {analyst.last_name}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>Analyste Climat Senior</div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button style={{
            flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #1B4332',
            backgroundColor: '#1B4332', color: '#FFFFFF', fontFamily: 'var(--font-sans)',
            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Mail size={14} /> Envoyer un message
          </button>
        </div>
      </div>

      {/* Méthodo link */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.72rem', color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>RESSOURCES</div>
        <button
          onClick={onClose}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 12, border: '1px solid #EDEAE3',
            backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B4332'; e.currentTarget.style.backgroundColor = '#F7F5F0' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#E8F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Compass size={16} color="#1B4332" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>Notre méthodologie</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>Le parcours diagnostic en 5 étapes</div>
          </div>
          <ChevronRight size={16} color="#B0AB9F" />
        </button>
        <button
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 12, border: '1px solid #EDEAE3', marginTop: 8,
            backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B4332'; e.currentTarget.style.backgroundColor = '#F7F5F0' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F5EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={16} color="#B87333" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28' }}>Guide utilisateur</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>Conseils pour tirer le meilleur de votre diagnostic</div>
          </div>
          <ChevronRight size={16} color="#B0AB9F" />
        </button>
      </div>

      {/* FAQ */}
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.72rem', color: '#B0AB9F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>QUESTIONS FRÉQUENTES</div>
        {faqItems.map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid #F7F5F0' }}>
            <button
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', border: 'none', backgroundColor: 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 500,
                color: '#2A2A28', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ flex: 1 }}>{item.q}</span>
              <ChevronRight size={14} color="#B0AB9F" style={{ transform: expandedFaq === i ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 8 }} />
            </button>
            {expandedFaq === i && (
              <div style={{
                padding: '0 0 14px', fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                color: '#7A766D', lineHeight: 1.6, animation: 'overlayFadeIn 0.15s ease-out',
              }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </OverlayPanel>
  )
}
