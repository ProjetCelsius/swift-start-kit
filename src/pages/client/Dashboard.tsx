import { useNavigate } from 'react-router-dom'
import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import { useDemoIfAvailable } from '../../hooks/useDemo'
import {
  Calendar,
  ArrowRight,
  Lock,
  Users,
  BarChart3,
  Target,
  FileText,
  Leaf,
} from 'lucide-react'

interface BlockInfo {
  id: number
  label: string
  duration: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const demo = useDemoIfAvailable()
  const navigate = useNavigate()
  const isDemo = demo?.enabled ?? false
  const diag = isDemo ? demo?.activeDiagnostic : null

  // Determine analyst info
  const analyst = isDemo && diag ? {
    first_name: diag.organization.analyst.name.split(' ')[0],
    last_name: diag.organization.analyst.name.split(' ').slice(1).join(' '),
    title: diag.organization.analyst.title,
    initials: diag.organization.analyst.initials,
  } : MOCK_ANALYST

  const contactName = isDemo && diag ? diag.organization.contact.name.split(' ')[0] : user?.first_name || 'Marie'

  // Determine block statuses from demo data
  function getBlockStatus(blockNum: number): BlockInfo['status'] {
    if (!isDemo || !diag) return 'not_started'
    const checklist = diag.checklist
    const key = `bloc${blockNum}`
    if (checklist[key]) return 'completed'
    // Check if partially filled
    if (blockNum === 3 && diag.bloc3.q21_drivers.length > 0 && !diag.bloc3.completed) return 'in_progress'
    if (blockNum === 1 && Object.keys(diag.bloc1.tiles).length > 0 && checklist.bloc1) return 'completed'
    return 'not_started'
  }

  const blocks: BlockInfo[] = [
    { id: 1, label: 'Votre démarche', duration: '~10 min', status: getBlockStatus(1), progress: getBlockStatus(1) === 'completed' ? 100 : getBlockStatus(1) === 'in_progress' ? 50 : 0 },
    { id: 2, label: 'Votre maturité', duration: '~15 min', status: getBlockStatus(2), progress: getBlockStatus(2) === 'completed' ? 100 : 0 },
    { id: 3, label: 'Vos enjeux', duration: '~10 min', status: getBlockStatus(3), progress: getBlockStatus(3) === 'completed' ? 100 : getBlockStatus(3) === 'in_progress' ? 60 : 0 },
    { id: 4, label: 'La perception', duration: '~15 min', status: getBlockStatus(4), progress: getBlockStatus(4) === 'completed' ? 100 : 0 },
  ]

  const surveyCount = isDemo && diag ? diag.survey.respondents : 0
  const diagnosticUnlocked = isDemo && diag ? diag.diagnosticUnlocked : false
  const totalProgress = Math.round(blocks.reduce((sum, b) => sum + b.progress, 0) / blocks.length)
  const isInProgress = blocks.some(b => b.status === 'in_progress')

  const statusColor = (status: BlockInfo['status']) => {
    switch (status) {
      case 'completed': return 'var(--color-celsius-900)'
      case 'in_progress': return 'var(--color-corail-500)'
      default: return 'var(--color-gris-300)'
    }
  }

  const statusBg = (status: BlockInfo['status']) => {
    switch (status) {
      case 'completed': return 'var(--color-celsius-100)'
      case 'in_progress': return 'var(--color-corail-100)'
      default: return 'var(--color-gris-100)'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold mb-3">
          Bienvenue {contactName}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-texte-secondary)' }}>
          {diagnosticUnlocked
            ? "Votre diagnostic Boussole Climat est prêt ! Parcourez chaque section pour découvrir l'analyse de votre analyste."
            : "Votre diagnostic Boussole Climat est en préparation. La première étape : répondre au questionnaire ci-dessous. Comptez environ 45 minutes, à votre rythme."
          }
        </p>
      </div>

      {/* Segmented Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Questionnaire</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-texte-secondary)' }}>
            {totalProgress}%
          </span>
        </div>
        <div className="flex gap-1.5 mb-3">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => navigate(`/questionnaire/${block.id}`)}
              className="flex-1 h-2.5 rounded-full transition-all duration-300 hover:scale-y-150 cursor-pointer"
              style={{ backgroundColor: statusColor(block.status) }}
              title={`${block.label} — ${block.duration}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => navigate(`/questionnaire/${block.id}`)}
              className="text-left p-3 rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer group"
              style={{ backgroundColor: statusBg(block.status) }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColor(block.status) }} />
                <span className="text-xs font-semibold" style={{ color: statusColor(block.status) }}>Bloc {block.id}</span>
              </div>
              <div className="text-xs font-medium truncate" style={{ color: 'var(--color-texte)' }}>{block.label}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-texte-secondary)' }}>{block.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!diagnosticUnlocked && (
        <button
          onClick={() => {
            const nextBlock = blocks.find(b => b.status !== 'completed')
            navigate(`/questionnaire/${nextBlock?.id || 1}`)
          }}
          className="w-full py-4 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: '0 4px 14px rgba(27, 94, 59, 0.25)' }}
        >
          {isInProgress ? 'Reprendre le questionnaire' : totalProgress === 100 ? 'Questionnaire terminé ✓' : 'Commencer le questionnaire'}
          <ArrowRight size={20} />
        </button>
      )}

      {/* Survey counter + Analyst */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl flex items-center gap-4" style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: surveyCount > 0 ? 'var(--color-celsius-100)' : 'var(--color-gris-100)' }}>
            <Users size={22} style={{ color: surveyCount > 0 ? 'var(--color-celsius-900)' : 'var(--color-gris-400)' }} />
          </div>
          <div>
            <div className="label-uppercase mb-1">Sondage interne</div>
            <div className="text-lg font-bold" style={{ color: surveyCount > 0 ? 'var(--color-celsius-900)' : 'var(--color-texte)' }}>
              {surveyCount} réponse{surveyCount === 1 ? '' : 's'}
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--color-celsius-50) 0%, var(--color-blanc) 60%, var(--color-corail-100) 100%)', boxShadow: 'var(--shadow-card)' }}>
          <div className="label-uppercase mb-3">Votre analyste</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0" style={{ backgroundColor: 'var(--color-celsius-800)', boxShadow: '0 2px 8px rgba(27, 94, 59, 0.3)' }}>
              {analyst.first_name[0]}{analyst.last_name[0]}
            </div>
            <div>
              <div className="font-semibold text-sm">{analyst.first_name} {analyst.last_name}</div>
              <div className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>{analyst.title}</div>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--color-corail-500), var(--color-corail-600))', color: 'white', boxShadow: '0 3px 10px rgba(232, 115, 74, 0.3)' }}>
            <Calendar size={16} />
            {diagnosticUnlocked ? 'Contacter votre analyste' : 'Planifier l\'appel de lancement'}
          </button>
        </div>
      </div>

      {/* Blurred Diagnostic Preview — only when locked */}
      {!diagnosticUnlocked && (
        <div className="relative rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="p-6 space-y-5" style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }}>
            <div className="flex items-center gap-3">
              <FileText size={20} style={{ color: 'var(--color-celsius-900)' }} />
              <div className="h-5 w-44 rounded" style={{ backgroundColor: 'var(--color-gris-200)' }} />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
              <div className="h-3.5 w-5/6 rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
              <div className="h-3.5 w-3/4 rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
            </div>
            <div className="flex gap-3">
              {['A', 'B', 'C'].map((grade, i) => (
                <div key={grade} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: i === 0 ? 'var(--color-celsius-100)' : i === 1 ? 'var(--color-gold-100)' : 'var(--color-corail-100)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: i === 0 ? 'var(--color-celsius-900)' : i === 1 ? 'var(--color-gold-500)' : 'var(--color-corail-500)' }}>{grade}</div>
                  <div className="h-3 w-16 rounded" style={{ backgroundColor: 'var(--color-gris-200)' }} />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center" style={{ borderColor: 'var(--color-celsius-100)' }}>
                <div className="w-20 h-20 rounded-full border-4" style={{ borderColor: 'var(--color-celsius-700)', opacity: 0.4 }} />
              </div>
              <div className="flex-1 space-y-3 pt-2">
                {[85, 62, 45, 70, 55].map((w, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--color-gris-200)' }} />
                    <div className="h-3 rounded flex-1" style={{ backgroundColor: 'var(--color-gris-100)' }}>
                      <div className="h-full rounded" style={{ width: `${w}%`, backgroundColor: 'var(--color-celsius-600)', opacity: 0.5 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ icon: <BarChart3 size={16} />, label: 'Score de maturité' }, { icon: <Target size={16} />, label: 'Priorités' }, { icon: <Leaf size={16} />, label: 'Empreinte carbone' }].map((s, i) => (
                <div key={i} className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--color-gris-100)' }}>
                  <span style={{ color: 'var(--color-celsius-700)', opacity: 0.6 }}>{s.icon}</span>
                  <div className="h-3 flex-1 rounded" style={{ backgroundColor: 'var(--color-gris-200)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-gris-100)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <Lock size={28} style={{ color: 'var(--color-gris-400)' }} />
            </div>
            <span className="text-sm font-semibold mb-1" style={{ color: 'var(--color-texte)' }}>Diagnostic verrouillé</span>
            <span className="text-xs" style={{ color: 'var(--color-texte-secondary)' }}>Déverrouillé après votre restitution avec votre analyste</span>
          </div>
        </div>
      )}

      {/* Unlocked diagnostic quick access */}
      {diagnosticUnlocked && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
            Votre diagnostic
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FileText size={18} />, label: 'Synthèse', path: '/diagnostic/1' },
              { icon: <Target size={18} />, label: 'Priorités', path: '/diagnostic/2' },
              { icon: <BarChart3 size={18} />, label: 'Maturité', path: '/diagnostic/3' },
              { icon: <Users size={18} />, label: 'Perception', path: '/diagnostic/4' },
              { icon: <Leaf size={18} />, label: 'Empreinte', path: '/diagnostic/6' },
              { icon: <ArrowRight size={18} />, label: 'Prochaines étapes', path: '/diagnostic/9' },
            ].map(s => (
              <button
                key={s.path}
                onClick={() => navigate(s.path)}
                className="p-4 rounded-xl text-left flex items-center gap-3 transition-all hover:scale-[1.01] cursor-pointer"
                style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
              >
                <span style={{ color: 'var(--color-celsius-900)' }}>{s.icon}</span>
                <span className="text-sm font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
