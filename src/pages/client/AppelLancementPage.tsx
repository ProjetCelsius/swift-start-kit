import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Phone } from 'lucide-react'
import { useDemoIfAvailable } from '@/hooks/useDemo'

export default function AppelLancementPage() {
  const navigate = useNavigate()
  const demo = useDemoIfAvailable()
  const org = demo?.enabled ? demo.activeDiagnostic.organization : null

  return (
    <div style={{ maxWidth: 720 }}>
      <button
        onClick={() => navigate('/client/dashboard')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D',
        }}
      >
        <ChevronLeft size={16} /> Retour au tableau de bord
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#2A2A28', marginBottom: 8 }}>
          Appel de lancement
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', backgroundColor: '#1B4332',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={11} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#1B4332', fontWeight: 500 }}>
            Réalisé le 10 février 2025
          </span>
        </div>
      </div>

      {/* Organization summary */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: '24px 28px', marginBottom: 20,
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 14,
        }}>
          INFORMATIONS ENTREPRISE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 32px' }}>
          {[
            { label: 'Organisation', value: org?.name || 'NovaTech Solutions' },
            { label: 'Secteur', value: org?.sector || 'Information et communication' },
            { label: 'Code NAF', value: org?.naf || 'J — Information et communication' },
            { label: 'Effectif', value: org?.headcount || '51–250' },
            { label: "Chiffre d'affaires", value: org?.revenue || '10–50 M€' },
            { label: 'Sites', value: org?.sites || '2 (Paris, Lyon)' },
            { label: 'Contact principal', value: org?.contact?.name || 'Marie Delcourt' },
            { label: 'Fonction', value: org?.contact?.title || 'Directrice RSE' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#B0AB9F', marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#2A2A28', fontWeight: 500 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: '24px 28px', marginBottom: 20,
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 14,
        }}>
          CONFIGURATION DU DIAGNOSTIC
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: <Phone size={15} style={{ color: '#1B4332' }} />, label: 'Appel de lancement', detail: 'Réalisé avec l\'analyste', done: true },
            { icon: <Check size={15} style={{ color: '#1B4332' }} />, label: 'Bloc 1 — Votre démarche', detail: 'Rempli pendant l\'appel', done: true },
            { icon: <Check size={15} style={{ color: '#1B4332' }} />, label: 'Documents demandés', detail: 'Liste configurée', done: true },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              backgroundColor: '#E8F0EB', borderRadius: 10,
            }}>
              {item.icon}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 500, color: '#2A2A28' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D' }}>{item.detail}</div>
              </div>
              {item.done && <Check size={14} style={{ color: '#1B4332' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Analyst note */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 14,
        padding: '24px 28px',
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0AB9F', marginBottom: 14,
        }}>
          NOTE DE L'ANALYSTE
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', lineHeight: 1.6, fontStyle: 'italic' }}>
          « Bonne base de départ. Le bilan carbone 2023 est exploitable. Priorité : compléter le questionnaire pour affiner le profil de maturité. »
        </p>
      </div>
    </div>
  )
}
