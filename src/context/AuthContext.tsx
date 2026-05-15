/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { loginWithCode, supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthState {
  profile: Profile | null
  loading: boolean
  login: (code: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthState | null>(null)

const SESSION_KEY = 'playground_session'

async function syncRoleNames(profile: Profile): Promise<Profile> {
  const { data: roles } = await supabase.from('roles').select('name, lead, co_lead, key_support')
  if (!roles) return profile

  const myRoles = roles
    .filter(r => r.lead === profile.name || r.co_lead?.includes(profile.name) || r.key_support?.includes(profile.name))
    .map(r => r.name)

  const updated = { ...profile, role_names: myRoles }
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  await supabase.from('profiles').update({ role_names: myRoles }).eq('id', profile.id)
  return updated
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = profile?.is_admin === true

  const login = useCallback(async (code: string) => {
    const p = await loginWithCode(code)
    await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', p.id)
    const synced = await syncRoleNames(p)
    setProfile(synced)
  }, [])

  const logout = useCallback(() => {
    setProfile(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }
    let cancelled = false
    try {
      const p: Profile = JSON.parse(raw)
      supabase
        .from('profiles')
        .select('id')
        .eq('invite_code', p.invite_code)
        .single()
        .then(async ({ data, error }) => {
          if (cancelled) return
          if (error || !data) {
            localStorage.removeItem(SESSION_KEY)
            setProfile(null)
          } else {
            const synced = await syncRoleNames(p)
            if (!cancelled) setProfile(synced)
          }
          if (!cancelled) setLoading(false)
        })
    } catch {
      if (!cancelled) {
        localStorage.removeItem(SESSION_KEY)
        setLoading(false)
      }
    }
    return () => { cancelled = true }
  }, [])

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
