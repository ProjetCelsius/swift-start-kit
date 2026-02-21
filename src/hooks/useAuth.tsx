import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User as AppUser, UserRole } from '../types'

interface AuthState {
  user: AppUser | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

// Mock user for development (no Supabase needed)
const MOCK_CLIENT: AppUser = {
  id: 'mock-client-001',
  role: 'client',
  organization_id: 'mock-org-001',
  first_name: 'Claire',
  last_name: 'Lefèvre',
  title: 'Directrice Générale',
  photo_url: undefined,
  created_at: new Date().toISOString(),
}

const MOCK_ANALYST: AppUser = {
  id: 'mock-analyst-001',
  role: 'analyst',
  first_name: 'Guillaume',
  last_name: 'Pakula',
  title: 'Analyste Climat Senior',
  photo_url: undefined,
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In dev mode without Supabase, use mock user
    const isDev = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'http://localhost:54321'
    
    if (isDev) {
      // Default to client view - can be toggled via URL param
      const params = new URLSearchParams(window.location.search)
      const mockRole = params.get('role') as UserRole | null
      setUser(mockRole === 'analyst' || mockRole === 'admin' ? MOCK_ANALYST : MOCK_CLIENT)
      setLoading(false)
      return
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchUserProfile(authId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authId)
      .single()

    if (data && !error) {
      setUser(data as AppUser)
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      loading,
      signIn,
      signInWithMagicLink,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export { MOCK_ANALYST }
