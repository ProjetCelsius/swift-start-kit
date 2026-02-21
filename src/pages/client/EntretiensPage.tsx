import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, Copy, ExternalLink, FileText, User, Users, CheckCircle, Clock } from 'lucide-react'

export default function EntretiensPage() {
  const navigate = useNavigate()
  const [dgLinkCopied, setDgLinkCopied] = useState(false)
  const [rseStatus] = useState<'not_started' | 'in_progress' | 'done'>('not_started')
  const [dgStatus] = useState<'not_sent' | 'sent' | 'done'>('not_sent')

  const dgLink = `${window.location.origin}/dg/demo`

  function copyLink() {
    navigator.clipboard.writeText(dgLink)
    setDgLinkCopied(true)
    setTimeout(() => setDgLinkCopied(false), 2000)
  }

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate('/client/dashboard')}
        className="flex items-center gap-2 mb-6"
        style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A766D', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} /> Retour au tableau de bord
      </button>

      <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#2A2A28', marginBottom: 6 }}>
        Entretiens & questionnaire direction
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#7A766D', marginBottom: 28, maxWidth: 560, lineHeight: 1.6 }}>
        Deux questionnaires complémentaires pour enrichir votre diagnostic : le vôtre en tant que responsable RSE, et celui de votre direction générale.
      </p>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ── LEFT: RSE questionnaire ── */}
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 16,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #F0EDE6' }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                width: 40, height: 40, borderRadius: 10, backgroundColor: '#E8F0EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={20} color="#1B4332" />
              </div>
              <div>
                <div className="label-uppercase" style={{ fontSize: '0.5rem', letterSpacing: '0.1em' }}>VOTRE QUESTIONNAIRE</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.95rem', color: '#2A2A28' }}>
                  Responsable RSE
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D', lineHeight: 1.5 }}>
              5 questions sur votre vision stratégique, le budget climat et les priorités de votre organisation.
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {rseStatus === 'done' ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={36} color="#1B4332" style={{ margin: '0 auto 12px' }} />
                <div className="font-display" style={{ fontSize: '1rem', fontWeight: 500, color: '#1B4332', marginBottom: 4 }}>
                  Complété
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>
                  Vos réponses ont été enregistrées.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 mb-5">
                  {['Portage climat & gouvernance', 'Budget transition', 'Horizon de ROI', 'Bénéfice principal attendu', 'Moyens suffisants ?'].map((q, i) => (
                    <div key={i} className="flex items-center gap-3" style={{ padding: '8px 12px', borderRadius: 8, backgroundColor: '#F7F5F0' }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        border: '2px solid #E5E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#E5E1D8' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>{q}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/client/questionnaire-rse')}
                  style={{
                    width: '100%', padding: '12px 0', borderRadius: 10, backgroundColor: '#1B4332',
                    color: '#fff', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Répondre <ChevronRight size={16} />
                </button>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F', textAlign: 'center', marginTop: 8 }}>
                  Durée estimée : 3 minutes
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: DG questionnaire ── */}
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 16,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #F0EDE6' }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #F5EDE4 0%, #E8D5BF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={20} color="#B87333" />
              </div>
              <div>
                <div className="label-uppercase" style={{ fontSize: '0.5rem', letterSpacing: '0.1em' }}>QUESTIONNAIRE EXTERNE</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.95rem', color: '#2A2A28' }}>
                  Direction générale
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D', lineHeight: 1.5 }}>
              Envoyez ce lien à votre DG. Les réponses seront agrégées automatiquement à votre diagnostic.
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {dgStatus === 'done' ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={36} color="#1B4332" style={{ margin: '0 auto 12px' }} />
                <div className="font-display" style={{ fontSize: '1rem', fontWeight: 500, color: '#1B4332', marginBottom: 4 }}>
                  Réponse reçue
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>
                  Les réponses de votre DG ont été intégrées.
                </p>
                <button
                  onClick={() => {}}
                  className="mt-4"
                  style={{
                    padding: '8px 16px', borderRadius: 8, backgroundColor: '#F7F5F0',
                    fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#2A2A28',
                    border: '1px solid #EDEAE3', cursor: 'pointer',
                  }}
                >
                  Voir les réponses
                </button>
              </div>
            ) : (
              <>
                {/* Status indicator */}
                <div className="flex items-center gap-2 mb-5 p-3 rounded-lg" style={{ backgroundColor: dgStatus === 'sent' ? '#FDFAF6' : '#F7F5F0', border: `1px solid ${dgStatus === 'sent' ? '#E8D5BF' : '#EDEAE3'}` }}>
                  {dgStatus === 'sent' ? (
                    <>
                      <Clock size={14} color="#B87333" />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#B87333', fontWeight: 500 }}>
                        Lien envoyé · en attente de réponse
                      </span>
                    </>
                  ) : (
                    <>
                      <FileText size={14} color="#B0AB9F" />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D' }}>
                        Pas encore envoyé
                      </span>
                    </>
                  )}
                </div>

                {/* Link box */}
                <div style={{
                  padding: '12px 14px', borderRadius: 10, backgroundColor: '#F7F5F0', border: '1px solid #EDEAE3',
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
                }}>
                  <div style={{
                    flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#7A766D',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {dgLink}
                  </div>
                  <button
                    onClick={copyLink}
                    style={{
                      padding: '6px 12px', borderRadius: 6, backgroundColor: dgLinkCopied ? '#E8F0EB' : '#FFFFFF',
                      border: `1px solid ${dgLinkCopied ? '#1B4332' : '#EDEAE3'}`, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500,
                      color: dgLinkCopied ? '#1B4332' : '#2A2A28', transition: 'all 0.2s',
                    }}
                  >
                    {dgLinkCopied ? <><Check size={12} /> Copié</> : <><Copy size={12} /> Copier</>}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={copyLink}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 10, backgroundColor: '#1B4332',
                      color: '#fff', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <Copy size={14} /> Copier le lien
                  </button>
                  <a
                    href={dgLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '12px 16px', borderRadius: 10, backgroundColor: '#F7F5F0',
                      color: '#2A2A28', fontSize: '0.85rem', border: '1px solid #EDEAE3', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'var(--font-sans)', textDecoration: 'none', fontWeight: 500,
                    }}
                  >
                    <ExternalLink size={14} /> Aperçu
                  </a>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F', textAlign: 'center', marginTop: 10 }}>
                  Le questionnaire est anonyme · 5 questions · 3 minutes
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
