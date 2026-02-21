import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDemoIfAvailable } from '../hooks/useDemo'
import { Mail, Eye } from 'lucide-react'
import celsiusLogo from '@/assets/celsius-logo.svg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const { signIn, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()
  const demo = useDemoIfAvailable()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/client/questionnaire/bloc1')
    } catch {
      navigate('/client/questionnaire/bloc1')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!email) return
    setLoading(true)
    try {
      await signInWithMagicLink(email)
      setMagicSent(true)
    } catch {
      setMagicSent(true)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { num: 1, name: 'Questionnaire', desc: '~ 45 min, à votre rythme' },
    { num: 2, name: 'Analyse', desc: 'votre analyste rédige votre diagnostic' },
    { num: 3, name: 'Restitution', desc: 'on découvre ensemble vos résultats' },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* === RIGHT HALF (dark) — shown as banner on mobile === */}
      <div
        className="md:hidden flex flex-col items-center justify-center px-8 py-10"
        style={{ backgroundColor: '#1B4332' }}
      >
        <h2 className="font-display text-white text-center" style={{ fontSize: '1.3rem' }}>
          Votre maturité climat,<br />en 3 étapes claires.
        </h2>
      </div>

      {/* === LEFT HALF === */}
      <div
        className="flex-1 flex items-center justify-center px-8 md:px-20 py-12 md:py-0"
        style={{ backgroundColor: '#F7F5F0' }}
      >
        <div className="w-full" style={{ maxWidth: 480 }}>
          {/* Celsius logo */}
          <div className="mb-8">
            <img src={celsiusLogo} alt="Projet Celsius" style={{ height: 30 }} />
          </div>

          {/* Title */}
          <h1 className="font-display" style={{ fontSize: '1.85rem', color: '#2A2A28', fontWeight: 400 }}>
            Accédez à votre diagnostic
          </h1>
          <p
            className="mt-3"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A766D', lineHeight: 1.5 }}
          >
            Connectez-vous pour retrouver votre questionnaire, suivre votre diagnostic et communiquer avec votre analyste.
          </p>

          {magicSent ? (
            <div className="mt-8 text-center py-8">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="font-display" style={{ fontSize: '1.2rem', color: '#2A2A28' }}>
                Vérifiez votre boîte mail
              </h2>
              <p className="mt-2" style={{ fontSize: '0.85rem', color: '#7A766D' }}>
                Un lien de connexion a été envoyé à <strong>{email}</strong>.
              </p>
              <button
                onClick={() => setMagicSent(false)}
                className="mt-4"
                style={{ fontSize: '0.85rem', color: '#1B4332', fontWeight: 500 }}
              >
                ← Retour
              </button>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    className="block mb-2"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem', color: '#2A2A28' }}
                  >
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="marie.dupont@entreprise.com"
                    required
                    className="w-full outline-none transition-colors"
                    style={{
                      height: 48,
                      padding: '0 16px',
                      border: '1px solid #EDEAE3',
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      color: '#2A2A28',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#1B4332')}
                    onBlur={e => (e.target.style.borderColor = '#EDEAE3')}
                  />
                </div>

                <div>
                  <label
                    className="block mb-2"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8rem', color: '#2A2A28' }}
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full outline-none transition-colors"
                    style={{
                      height: 48,
                      padding: '0 16px',
                      border: '1px solid #EDEAE3',
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      color: '#2A2A28',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#1B4332')}
                    onBlur={e => (e.target.style.borderColor = '#EDEAE3')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full transition-colors disabled:opacity-50"
                  style={{
                    height: 50,
                    backgroundColor: '#1B4332',
                    color: 'white',
                    borderRadius: 8,
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#153728')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1" style={{ height: 1, backgroundColor: '#EDEAE3' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F' }}>ou</span>
                <div className="flex-1" style={{ height: 1, backgroundColor: '#EDEAE3' }} />
              </div>

              {/* Magic link */}
              <button
                onClick={handleMagicLink}
                className="w-full flex items-center justify-center gap-2 transition-colors"
                style={{
                  height: 48,
                  border: '1px solid #EDEAE3',
                  borderRadius: 8,
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  color: '#2A2A28',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0EDE6')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Mail size={16} />
                Recevoir un lien par email
              </button>

              {/* Demo access */}
              <button
                onClick={() => {
                  if (demo) { demo.setEnabled(true); navigate('/client/dashboard') }
                }}
                className="w-full flex items-center justify-center gap-2 transition-colors mt-3"
                style={{
                  height: 48,
                  border: '1px solid #EDEAE3',
                  borderRadius: 8,
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  color: '#7A766D',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0EDE6')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Eye size={16} />
                Accéder à la démo
              </button>

              {/* Footer */}
              <p className="mt-6" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A766D' }}>
                Première visite ?{' '}
                <span
                  className="cursor-pointer hover:underline"
                  style={{ fontWeight: 500, color: '#1B4332' }}
                >
                  Votre analyste vous enverra un accès.
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* === RIGHT HALF (desktop) === */}
      <div
        className="hidden md:flex flex-1 flex-col items-center justify-center px-12"
        style={{ backgroundColor: '#1B4332', position: 'relative' }}
      >
        <div style={{ maxWidth: 400 }}>
          <h2
            className="font-display text-center text-white"
            style={{ fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.3 }}
          >
            Votre maturité climat,<br />en 3 étapes claires.
          </h2>
          <p
            className="text-center mt-4"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}
          >
            Un diagnostic complet, rédigé sur mesure par votre analyste Celsius.
          </p>

          {/* Steps */}
          <div className="mt-8 space-y-5">
            {steps.map(s => (
              <div key={s.num} className="flex items-start gap-4">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    border: '1px solid rgba(255,255,255,0.25)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {s.num}
                </div>
                <div>
                  <span
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: 'white' }}
                  >
                    {s.name}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {' '}— {s.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  )
}
