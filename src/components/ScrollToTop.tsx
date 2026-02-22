// ============================================
// BOUSSOLE CLIMAT — ScrollToTop
// Resets scroll position on route change
// Add inside <BrowserRouter> in App.tsx
// ============================================

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
