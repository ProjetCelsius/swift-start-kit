import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const SECTORS = ['Industrie manufacturière', 'Numérique', 'Construction', 'Transport & Logistique', 'Agroalimentaire', 'Énergie', 'Services', 'Commerce', 'Santé', 'Autre']
const HEADCOUNTS = ['1-10', '11-50', '51-250', '251-500', '501-1000', '1001-5000', '>5000']
const REVENUES = ['<1M', '1-10M', '10-50M', '50-200M', '200M-1Md', '>1Md']
const ANALYSTS = ['Guillaume Pakula', 'Thomas Martin']

const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, padding: '0 14px', borderRadius: 8,
  border: '1px solid #EDEAE3', fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.85rem', color: '#2A2A28', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.8rem',
  color: '#2A2A28', display: 'block', marginBottom: 6,
}

export default function NewDiagnostic() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [created, setCreated] = useState(false)
  const [creating, setCreating] = useState(false)

  // Step 1
  const [company, setCompany] = useState('')
  const [sector, setSector] = useState('')
  const [headcount, setHeadcount] = useState('')
  const [revenue, setRevenue] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Step 2
  const [analyst, setAnalyst] = useState(ANALYSTS[0])
  const [offer, setOffer] = useState<'essentiel' | 'premium' | 'sur-mesure'>('premium')
  const [optDG, setOptDG] = useState(true)
  const [optPop, setOptPop] = useState(false)
  const [optBench, setOptBench] = useState(false)

  // Step 3
  const [sendEmail, setSendEmail] = useState(true)
  const [genLinks, setGenLinks] = useState(true)

  const step1Valid = company && sector && headcount && revenue && contactName && contactEmail

  const handleCreate = async () => {
    if (!isSupabaseConfigured()) {
      setCreated(true)
      return
    }

    setCreating(true)
    try {
      // 1. Create organization
      const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .insert({
          name: company,
          sector_naf: sector,
          headcount_range: headcount,
          revenue_range: revenue,
        })
        .select()
        .single()

      if (orgErr) throw orgErr

      // 2. Create diagnostic
      const { data: diag, error: diagErr } = await supabase
        .from('diagnostics')
        .insert({
          organization_id: org.id,
          analyst_id: user?.id || null,
          status: 'onboarding',
          survey_distinguish_populations: optPop,
        })
        .select()
        .single()

      if (diagErr) throw diagErr

      setCreated(true)

      // After a short delay, could navigate to the new diagnostic
      setTimeout(() => {
        navigate(`/admin/diagnostics/${diag.id}`)
      }, 3000)
    } catch (err) {
      console.error('Error creating diagnostic:', err)
      alert('Erreur lors de la création du diagnostic. Veuillez réessayer.')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setCreated(false)
    setStep(0)
    setCompany('')
    setSector('')
    setHeadcount('')
    setRevenue('')
    setContactName('')
    setContactEmail('')
    setContactPhone('')
  }

  if (created) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
        <CheckCircle size={48} color="#1B4332" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.3rem', color: '#2A2A28', marginBottom: 8 }}>
          Diagnostic créé avec succès
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#7A766D', marginBottom: 24 }}>
          Un email d'invitation a été envoyé à {contactEmail}.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/admin')}
            style={{ padding: '12px 24px', borderRadius: 8, backgroundColor: '#1B4332', color: '#fff', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
            Voir le diagnostic
          </button>
          <button onClick={resetForm}
            style={{ padding: '12px 24px', borderRadius: 8, backgroundColor: '#fff', color: '#1B4332', border: '1px solid #EDEAE3', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
            Créer un autre
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: '1.5rem', color: '#2A2A28', marginBottom: 28 }}>
        Nouveau diagnostic
      </h1>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
        {['Client', 'Configuration', 'Confirmation'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                backgroundColor: i <= step ? '#1B4332' : '#F0EDE6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i < step
                  ? <Check size={16} color="#fff" />
                  : <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.8rem', color: i <= step ? '#fff' : '#B0AB9F' }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.75rem', color: i <= step ? '#2A2A28' : '#B0AB9F' }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, backgroundColor: i < step ? '#1B4332' : '#EDEAE3', margin: '0 12px', marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Raison sociale *</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Ex: Groupe Méridien" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#1B4332'} onBlur={e => e.currentTarget.style.borderColor = '#EDEAE3'} />
          </div>
          <div>
            <label style={labelStyle}>Secteur *</label>
            <select value={sector} onChange={e => setSector(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
              <option value="">Sélectionner...</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Effectif *</label>
              <select value={headcount} onChange={e => setHeadcount(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                <option value="">Sélectionner...</option>
                {HEADCOUNTS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Chiffre d'affaires *</label>
              <select value={revenue} onChange={e => setRevenue(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                <option value="">Sélectionner...</option>
                {REVENUES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.56rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#B0AB9F', marginTop: 8 }}>CONTACT PRINCIPAL</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Prénom Nom" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#1B4332'} onBlur={e => e.currentTarget.style.borderColor = '#EDEAE3'} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="email@..." style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#1B4332'} onBlur={e => e.currentTarget.style.borderColor = '#EDEAE3'} />
            </div>
            <div>
              <label style={labelStyle}>Téléphone</label>
              <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="06..." style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#1B4332'} onBlur={e => e.currentTarget.style.borderColor = '#EDEAE3'} />
            </div>
          </div>
          <button disabled={!step1Valid} onClick={() => setStep(1)}
            style={{
              marginTop: 8, padding: '12px 32px', borderRadius: 8, border: 'none',
              backgroundColor: step1Valid ? '#1B4332' : '#F0EDE6', color: step1Valid ? '#fff' : '#B0AB9F',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', fontWeight: 500,
              cursor: step1Valid ? 'pointer' : 'not-allowed', alignSelf: 'flex-end',
            }}>
            Suivant
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Analyste assigné</label>
            <select value={analyst} onChange={e => setAnalyst(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
              {ANALYSTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Offre</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { key: 'essentiel' as const, name: 'Essentiel', desc: 'Questionnaire + Score + 3 priorités', price: '2 500 €' },
                { key: 'premium' as const, name: 'Premium', desc: 'Tout Essentiel + Sondage + Perception + Feuille de route', price: '4 500 €', recommended: true },
                { key: 'sur-mesure' as const, name: 'Sur-mesure', desc: 'À définir', price: 'Sur devis' },
              ]).map(o => (
                <button key={o.key} onClick={() => setOffer(o.key)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 20px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                    border: `1.5px solid ${offer === o.key ? '#1B4332' : '#EDEAE3'}`,
                    backgroundColor: offer === o.key ? '#F7F5F0' : '#fff',
                    position: 'relative',
                  }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#2A2A28' }}>{o.name}</span>
                      {o.recommended && (
                        <span style={{ padding: '2px 8px', borderRadius: 20, backgroundColor: '#E8F0EB', color: '#1B4332', fontSize: '0.6rem', fontWeight: 600 }}>Recommandé</span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#7A766D', marginTop: 2 }}>{o.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1rem', color: '#1B4332', whiteSpace: 'nowrap', marginLeft: 16 }}>{o.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Options supplémentaires</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Questionnaire DG', value: optDG, set: setOptDG },
                { label: 'Distinction populations sondage', value: optPop, set: setOptPop },
                { label: 'Benchmark sectoriel', value: optBench, set: setOptBench },
              ].map(opt => (
                <div key={opt.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#2A2A28' }}>{opt.label}</span>
                  <div onClick={() => opt.set(!opt.value)} style={{
                    width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                    backgroundColor: opt.value ? '#1B4332' : '#EDEAE3', position: 'relative', transition: 'background-color 0.2s',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
                      position: 'absolute', top: 2, left: opt.value ? 20 : 2, transition: 'left 0.2s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <button onClick={() => setStep(0)}
              style={{ padding: '12px 24px', borderRadius: 8, border: '1px solid #EDEAE3', backgroundColor: '#fff', color: '#7A766D', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', cursor: 'pointer' }}>
              Retour
            </button>
            <button onClick={() => setStep(2)}
              style={{ padding: '12px 32px', borderRadius: 8, border: 'none', backgroundColor: '#1B4332', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer' }}>
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Summary card */}
          <div style={{ backgroundColor: '#E8F0EB', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.2rem', color: '#2A2A28', marginBottom: 16 }}>{company}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Secteur', sector],
                ['Effectif', headcount],
                ['CA', revenue],
                ['Contact', `${contactName} — ${contactEmail}`],
                ['Analyste', analyst],
                ['Offre', offer === 'essentiel' ? 'Essentiel — 2 500 €' : offer === 'premium' ? 'Premium — 4 500 €' : 'Sur-mesure'],
                ['Options', [optDG && 'DG', optPop && 'Populations', optBench && 'Benchmark'].filter(Boolean).join(', ') || 'Aucune'],
              ].map(([k, v]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#7A766D' }}>{k}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: '#2A2A28', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: "Envoyer l'email de bienvenue au client", value: sendEmail, set: setSendEmail },
              { label: 'Générer les liens de sondage', value: genLinks, set: setGenLinks },
            ].map(opt => (
              <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div onClick={() => opt.set(!opt.value)}
                  style={{
                    width: 18, height: 18, borderRadius: 4, border: '1.5px solid',
                    borderColor: opt.value ? '#1B4332' : '#EDEAE3',
                    backgroundColor: opt.value ? '#1B4332' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                  {opt.value && <Check size={12} color="#fff" />}
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#2A2A28' }}>{opt.label}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <button onClick={() => setStep(1)}
              style={{ padding: '12px 24px', borderRadius: 8, border: '1px solid #EDEAE3', backgroundColor: '#fff', color: '#7A766D', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', cursor: 'pointer' }}>
              Retour
            </button>
            <button onClick={handleCreate} disabled={creating}
              style={{
                padding: '14px 32px', borderRadius: 8, border: 'none',
                backgroundColor: '#1B4332', color: '#fff',
                fontFamily: 'Fraunces, serif', fontSize: '0.95rem', fontWeight: 500,
                cursor: creating ? 'wait' : 'pointer',
                opacity: creating ? 0.7 : 1,
              }}>
              {creating ? 'Création en cours...' : 'Créer le diagnostic'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
