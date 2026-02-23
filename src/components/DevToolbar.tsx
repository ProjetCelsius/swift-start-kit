import { useState } from 'react'
import { useDemo } from '@/hooks/useDemo'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronUp, ChevronDown, Unlock, RotateCcw, Play, RotateCw } from 'lucide-react'
import { useDiagnosticReading } from '@/hooks/useDiagnosticReading'
import { STEP_LABELS, type DemoRole } from '@/data/demoData'
import { useGuidedTour } from '@/hooks/useGuidedTour'

const ROLE_OPTIONS: { value: DemoRole; label: string }[] = [
  { value: 'client', label: 'Client' },
  { value: 'admin', label: 'Admin' },
  { value: 'guest', label: 'Lecteur invité' },
]

export default function DevToolbar() {
  const demo = useDemo()
  const { active: tourActive } = useGuidedTour()
  const navigate = useNavigate()
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const { unlockAll, resetProgress } = useDiagnosticReading()

  // Hide completely when guided tour is active
  if (tourActive) return null

  if (!demo.enabled) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-center"
        style={{ height: '28px', backgroundColor: 'rgba(26, 26, 26, 0.85)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={() => demo.setEnabled(true)}
          className="text-[10px] font-medium px-3 py-0.5 rounded-full transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          Mode Démo
        </button>
        <span className="text-[9px] ml-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Ctrl+Shift+D</span>
      </div>
    )
  }

  const isLastStep = demo.currentStep === 6

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] transition-all"
      style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(12px)' }}
    >
      {/* Compact bar */}
      <div className="flex items-center gap-3 px-4" style={{ height: '40px' }}>
        {/* Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => demo.setEnabled(false)}
            className="w-8 h-4 rounded-full relative transition-colors"
            style={{ backgroundColor: '#1B4332' }}
          >
            <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white transition-transform" />
          </button>
          <span className="text-[11px] font-semibold text-white">DÉMO</span>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* Company name */}
        <span className="text-[10px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' as const }}>
          MAISON DUVAL
        </span>

        <div className="w-px h-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* Step indicator */}
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Étape {demo.currentStep}/6 : <span style={{ color: 'white', fontWeight: 500 }}>{STEP_LABELS[demo.currentStep]}</span>
        </span>

        {/* Advance / Reset button */}
        <button
          onClick={() => {
            if (isLastStep) {
              demo.resetDemo()
            } else {
              demo.advanceStep()
            }
          }}
          className="text-[10px] font-bold px-3 py-1 rounded-md transition-colors flex items-center gap-1.5"
          style={{
            backgroundColor: isLastStep ? 'rgba(255,255,255,0.1)' : '#1B4332',
            color: 'white',
          }}
        >
          {isLastStep ? (
            <><RotateCw size={11} /> Recommencer</>
          ) : (
            <><Play size={10} fill="white" /> Étape suivante</>
          )}
        </button>

        <div className="w-px h-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* Role */}
        <div className="flex gap-0.5">
          {ROLE_OPTIONS.map(r => (
            <button
              key={r.value}
              onClick={() => {
                demo.setRole(r.value)
                if (r.value === 'admin' && !location.pathname.startsWith('/admin')) navigate('/admin/dashboard')
                if (r.value === 'client' && location.pathname.startsWith('/admin')) navigate('/client/dashboard')
              }}
              className="text-[10px] font-medium px-2 py-0.5 rounded transition-colors"
              style={{
                backgroundColor: demo.role === r.value ? '#1B4332' : 'rgba(255,255,255,0.08)',
                color: demo.role === r.value ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* Unlock all sections button */}
        <button
          onClick={unlockAll}
          className="text-[9px] font-medium px-2 py-0.5 rounded transition-colors flex items-center gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
          title="Débloquer toutes les sections du diagnostic"
        >
          <Unlock size={10} /> Débloquer
        </button>

        {/* Reset reading progress */}
        <button
          onClick={resetProgress}
          className="text-[9px] font-medium px-2 py-0.5 rounded transition-colors flex items-center gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
          title="Remettre la lecture à l'état initial"
        >
          <RotateCcw size={10} /> Reset
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Navigation rapide</p>
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Dashboard', path: '/client/dashboard' },
                  { label: 'Synthèse', path: '/client/synthesis' },
                  { label: 'Bloc 1', path: '/client/questionnaire/bloc1' },
                  { label: 'Bloc 2', path: '/client/questionnaire/bloc2' },
                  { label: 'Bloc 3', path: '/client/questionnaire/bloc3' },
                  { label: 'Perception', path: '/client/perception' },
                  { label: 'Sondage', path: '/client/sondage' },
                  { label: 'Documents', path: '/client/documents' },
                  { label: 'Journal', path: '/client/journal' },
                  { label: 'Messages', path: '/client/messages' },
                ].map(n => (
                  <button
                    key={n.path}
                    onClick={() => navigate(n.path)}
                    className="text-[9px] px-1.5 py-0.5 rounded transition-colors"
                    style={{
                      backgroundColor: location.pathname === n.path ? '#1B4332' : 'rgba(255,255,255,0.08)',
                      color: location.pathname === n.path ? 'white' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Diagnostic</p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 9 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/client/diagnostic/${i + 1}`)}
                    className="text-[9px] px-1.5 py-0.5 rounded transition-colors"
                    style={{
                      backgroundColor: location.pathname === `/client/diagnostic/${i + 1}` ? '#1B4332' : 'rgba(255,255,255,0.08)',
                      color: location.pathname === `/client/diagnostic/${i + 1}` ? 'white' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    S{i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin</p>
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Dashboard', path: '/admin/dashboard' },
                  { label: 'Stats', path: '/admin/stats' },
                  { label: 'Nouveau', path: '/admin/nouveau' },
                ].map(n => (
                  <button
                    key={n.path}
                    onClick={() => { demo.setRole('admin'); navigate(n.path) }}
                    className="text-[9px] px-1.5 py-0.5 rounded transition-colors"
                    style={{
                      backgroundColor: location.pathname === n.path ? '#1B4332' : 'rgba(255,255,255,0.08)',
                      color: location.pathname === n.path ? 'white' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Répondant</p>
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Sondage', path: '/sondage/demo' },
                  { label: 'DG', path: '/dg/demo' },
                  { label: 'Setup', path: `/setup/${demo.diagnostic.id}` },
                ].map(n => (
                  <button
                    key={n.path}
                    onClick={() => navigate(n.path)}
                    className="text-[9px] px-1.5 py-0.5 rounded transition-colors"
                    style={{
                      backgroundColor: location.pathname === n.path ? '#1B4332' : 'rgba(255,255,255,0.08)',
                      color: location.pathname === n.path ? 'white' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
