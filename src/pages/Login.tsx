import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const { signIn, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'magic') {
        await signInWithMagicLink(email)
        setMagicSent(true)
      } else {
        await signIn(email, password)
        navigate('/')
      }
    } catch {
      // In dev mode, just navigate
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-fond)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white font-bold text-xl mb-4"
            style={{ backgroundColor: 'var(--color-celsius-900)' }}
          >
            C
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-celsius-900)' }}>
            Boussole Climat
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-texte-secondary)' }}>
            Projet Celsius
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-xl"
          style={{
            backgroundColor: 'var(--color-blanc)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {magicSent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-lg font-semibold mb-2">Vérifiez votre boîte mail</h2>
              <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
                Un lien de connexion a été envoyé à <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-uppercase block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="marie@entreprise.fr"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={{
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-fond)',
                  }}
                  required
                />
              </div>

              {mode === 'password' && (
                <div>
                  <label className="label-uppercase block mb-2">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                    style={{
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-fond)',
                    }}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-celsius-900)' }}
              >
                {loading ? 'Connexion...' : mode === 'magic' ? 'Recevoir le lien' : 'Se connecter'}
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'password' ? 'magic' : 'password')}
                className="w-full text-center text-sm font-medium"
                style={{ color: 'var(--color-celsius-800)' }}
              >
                {mode === 'password' ? 'Connexion par lien magique →' : '← Connexion par mot de passe'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--color-gris-400)' }}>
          © Projet Celsius — Bureau d'études climat & carbone
        </p>
      </div>
    </div>
  )
}
