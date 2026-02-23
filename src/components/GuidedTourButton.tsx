import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { useGuidedTour } from '@/hooks/useGuidedTour'

export default function GuidedTourButton() {
  const { active, startTour } = useGuidedTour()
  const [hovered, setHovered] = useState(false)

  if (active) return null

  return (
    <button
      onClick={startTour}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 56,
        right: 24,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        borderRadius: 24,
        border: '1.5px solid #1B4332',
        backgroundColor: hovered ? '#1B4332' : '#fff',
        color: hovered ? '#fff' : '#1B4332',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
      }}
    >
      <PlayCircle size={20} />
      Visite guidée
    </button>
  )
}
