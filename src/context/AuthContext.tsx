import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { loginWithCode } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthState {
  profile: Profile | null
  loading: boolean
  login: (code: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  canEditItem: (assignedRole: string | null, creatorInvite: string | null) => boolean
}

const AuthContext = createContext<AuthState | null>(null)

const SESSION_KEY = 'playground_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const isAdmin = profile?.invite_code === 'playground-admin'

  const canEditItem = useCallback(
    (assignedRole: string | null, creatorInvite: string | null) => {
      if (!profile) return false
      if (isAdmin) return true
      if (assignedRole && profile.role_names?.includes(assignedRole)) return true
      return creatorInvite === profile.invite_code
    },
    [profile, isAdmin]
  )

  const login = useCallback(async (code: string) => {
    const p = await loginWithCode(code)
    localStorage.setItem(SESSION_KEY, JSON.stringify(p))
    setProfile(p)
  }, [])

  const logout = useCallback(() => {
    setProfile(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      try {
        setProfile(JSON.parse(raw))
      } catch { localStorage.removeItem(SESSION_KEY) }
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout, isAdmin, canEditItem }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
