import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { MOCK_ANALYSTS } from '@/data/mockAdminData'

export default function NewDiagnostic() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [analyst, setAnalyst] = useState(MOCK_ANALYSTS[0])
  const [created, setCreated] = useState(false)

  if (created) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-celsius-100)' }}>
          <CheckCircle size={32} color="#1B5E3B" />
        </div>
        <h1 className="text-xl font-bold mb-2">Diagnostic créé</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-texte-secondary)' }}>
          Un email d'invitation a été envoyé à <strong>{email}</strong>.
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: '#1B5E3B' }}
        >
          Retour au tableau de bord
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg hover:bg-[var(--color-gris-100)]">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Nouveau diagnostic</h1>
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
        <div>
          <label className="text-sm font-medium block mb-1">Nom de l'entreprise</label>
          <input
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Ex: TechVert Solutions"
            className="w-full px-3 py-2.5 text-sm rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email du client</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="rse@entreprise.fr"
            className="w-full px-3 py-2.5 text-sm rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Analyste assigné</label>
          <select
            value={analyst}
            onChange={e => setAnalyst(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {MOCK_ANALYSTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <button
          onClick={() => setCreated(true)}
          disabled={!company || !email}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.005] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1B5E3B' }}
        >
          Créer le diagnostic
        </button>
      </div>
    </div>
  )
}
