import { useState, useEffect } from 'react'
import { useGuidedTour } from '@/hooks/useGuidedTour'

export default function GuidedTourTooltip() {
  const { active, tourStep, currentStep } = useGuidedTour()
  const [visible, setVisible] = useState(false)

  // Show tooltip when step changes
  useEffect(() => {
    if (!active || !tourStep) {
      setVisible(false)
      return
    }

    setVisible(true)

    // Auto-hide after 8 seconds
    const timer = setTimeout(() => setVisible(false), 8000)

    // Hide on scroll
    const handleScroll = () => setVisible(false)
    window.addEventListener('scroll', handleScroll, { once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [active, currentStep, tourStep])

  if (!active || !tourStep || !visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9998,
      maxWidth: 480,
      width: 'calc(100% - 32px)',
      backgroundColor: '#FFF9F0',
      border: '1px solid #E5E1D8',
      borderRadius: 12,
      padding: '14px 18px',
      fontFamily: 'DM Sans, sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      animation: 'tooltipFadeIn 0.3s ease',
    }}>
      <p style={{
        fontWeight: 600, fontSize: '0.85rem', color: '#2A2A28',
        marginBottom: 4,
      }}>
        {tourStep.tooltipTitle}
      </p>
      <p style={{
        fontSize: '0.78rem', color: '#7A766D', lineHeight: 1.5,
        margin: 0,
      }}>
        {tourStep.tooltipText}
      </p>

      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
