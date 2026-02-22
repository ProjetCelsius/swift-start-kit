import { useState, useCallback, useEffect } from 'react'

export type ReadingState = 'nouveau' | 'lu' | 'locked'

const STORAGE_KEY = 'diagnosticReadProgress'

function getInitialState(): Record<string, ReadingState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  // Default: section 1 is nouveau, rest locked
  return {
    '1': 'nouveau',
    '2': 'locked',
    '3': 'locked',
    '4': 'locked',
    '5': 'locked',
    '6': 'locked',
    '7': 'locked',
    '8': 'locked',
    '9': 'locked',
  }
}

export function useDiagnosticReading() {
  const [progress, setProgress] = useState<Record<string, ReadingState>>(getInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const markAsRead = useCallback((sectionId: string) => {
    setProgress(prev => {
      const next = { ...prev }
      if (next[sectionId] === 'locked') return prev // can't read locked
      next[sectionId] = 'lu'
      // Unlock next section
      const num = parseInt(sectionId)
      const nextId = String(num + 1)
      if (next[nextId] === 'locked') {
        next[nextId] = 'nouveau'
      }
      return next
    })
  }, [])

  const unlockAll = useCallback(() => {
    const all: Record<string, ReadingState> = {}
    for (let i = 1; i <= 9; i++) all[String(i)] = 'lu'
    setProgress(all)
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(getInitialState())
  }, [])

  const allRead = Object.values(progress).every(s => s === 'lu')

  return { progress, markAsRead, unlockAll, resetProgress, allRead }
}
