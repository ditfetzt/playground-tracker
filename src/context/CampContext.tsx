/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { CampData, InventoryItem, Role, Profile } from '../lib/types'
import { useAuth } from './AuthContext'

interface CampContextValue {
  data: CampData
  loading: boolean
  refresh: () => Promise<void>
  addItem: (item: Partial<InventoryItem>) => Promise<void>
  updateItem: (id: string, changes: Partial<InventoryItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  updateRole: (id: string, changes: Partial<Role>) => Promise<void>
  toggleFeePaid: (profileId: string) => Promise<void>
  addProfile: (name: string, inviteCode: string) => Promise<void>
  updateProfile: (id: string, changes: Partial<Profile>) => Promise<void>
  deleteProfile: (id: string) => Promise<void>
}

const CampContext = createContext<CampContextValue | null>(null)

const EMPTY_DATA: CampData = {
  roles: [], items: [], finances: [], spaces: [],
  volunteerHours: [], tickets: [], activityLog: [], profiles: [],
}

export function CampProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [data, setData] = useState<CampData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const channels = useRef<ReturnType<typeof supabase.channel>[]>([])

  const refresh = useCallback(async () => {
    if (!profile) return
    const tables = [
      { key: 'roles' as const, table: 'roles' as const },
      { key: 'items' as const, table: 'inventory_items' as const },
      { key: 'profiles' as const, table: 'profiles' as const },
    ]
    const results = await Promise.all(
      tables.map(async ({ table }) => {
        const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false })
        return data || []
      })
    )
    setData({
      ...EMPTY_DATA,
      roles: results[0] as CampData['roles'],
      items: results[1] as CampData['items'],
      profiles: results[2] as CampData['profiles'],
    })
    setLoading(false)
  }, [profile])

  useEffect(() => {
    if (!profile) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
    channels.current.forEach(c => supabase.removeChannel(c))
    channels.current = []
    ;['roles', 'inventory_items', 'profiles'].forEach(table => {
      const channel = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => refresh())
        .subscribe()
      channels.current.push(channel)
    })
    return () => { channels.current.forEach(c => supabase.removeChannel(c)) }
  }, [profile, refresh])

  const addItem = useCallback(async (item: Partial<InventoryItem>) => {
    await supabase.from('inventory_items').insert({ ...item, created_by_invite: profile?.invite_code })
    await refresh()
  }, [profile, refresh])

  const updateItem = useCallback(async (id: string, changes: Partial<InventoryItem>) => {
    await supabase.from('inventory_items').update(changes).eq('id', id)
    await refresh()
  }, [refresh])

  const deleteItem = useCallback(async (id: string) => {
    await supabase.from('inventory_items').delete().eq('id', id)
    await refresh()
  }, [refresh])

  const updateRole = useCallback(async (id: string, changes: Partial<Role>) => {
    await supabase.from('roles').update(changes).eq('id', id)
    await refresh()
  }, [refresh])

  const toggleFeePaid = useCallback(async (profileId: string) => {
    const target = data.profiles.find(p => p.id === profileId)
    if (!target) return
    await supabase.from('profiles').update({ fee_paid: !target.fee_paid }).eq('id', profileId)
    await refresh()
  }, [data.profiles, refresh])

  const addProfile = useCallback(async (name: string, inviteCode: string) => {
    await supabase.from('profiles').insert({ name, invite_code: inviteCode, active: true, fee_paid: false, is_admin: false, role_names: [] })
    await refresh()
  }, [refresh])

  const updateProfile = useCallback(async (id: string, changes: Partial<Profile>) => {
    await supabase.from('profiles').update(changes).eq('id', id)
    await refresh()
  }, [refresh])

  const deleteProfile = useCallback(async (id: string) => {
    await supabase.from('profiles').update({ active: false }).eq('id', id)
    await refresh()
  }, [refresh])

  return (
    <CampContext.Provider value={{ data, loading, refresh, addItem, updateItem, deleteItem, updateRole, toggleFeePaid, addProfile, updateProfile, deleteProfile }}>
      {children}
    </CampContext.Provider>
  )
}

export function useCamp() {
  const ctx = useContext(CampContext)
  if (!ctx) throw new Error('useCamp must be inside CampProvider')
  return ctx
}
