/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import type { CampData, InventoryItem, Role, Profile, ItemComment, Notification } from '../lib/types'
import { useAuth } from './AuthContext'
import {
  notifyItemCreated,
  notifyItemUpdated,
  notifyItemDeleted,
  notifyCommentAdded,
  notifyRoleUpdated,
  notifyMemberJoined,
  notifyMemberUpdated,
  notifyMemberDeactivated,
  notifyFeeToggled,
  markNotificationRead,
  markAllNotificationsRead,
} from '../lib/notifications'

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
  addItemComment: (itemId: string, content: string) => Promise<void>
  deleteItemComment: (commentId: string) => Promise<void>
  readNotification: (id: string) => Promise<void>
  readAllNotifications: () => Promise<void>
}

const CampContext = createContext<CampContextValue | null>(null)

const EMPTY_DATA: CampData = {
  roles: [], items: [], finances: [], spaces: [],
  volunteerHours: [], tickets: [], activityLog: [], profiles: [],
  itemComments: [], notifications: [],
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
      { key: 'itemComments' as const, table: 'item_comments' as const, select: '*, profile:profiles(name, emoji)' },
      { key: 'notifications' as const, table: 'notifications' as const },
    ]
    const results = await Promise.all(
      tables.map(async ({ table, select }) => {
        const { data } = await supabase.from(table).select(select || '*').order('created_at', { ascending: false })
        return data || []
      })
    )
    setData({
      ...EMPTY_DATA,
      roles: results[0] as unknown as CampData['roles'],
      items: results[1] as unknown as CampData['items'],
      profiles: results[2] as unknown as CampData['profiles'],
      itemComments: results[3] as unknown as ItemComment[],
      notifications: (results[4] as unknown as Notification[]).filter(n => n.recipient_id === profile.id),
    })
    setLoading(false)
  }, [profile])

  useEffect(() => {
    if (!profile) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
    channels.current.forEach(c => supabase.removeChannel(c))
    channels.current = []
    ;['roles', 'inventory_items', 'profiles', 'item_comments', 'notifications'].forEach(table => {
      const channel = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
          if (table === 'notifications' && payload.eventType === 'INSERT') {
            const n = payload.new as Notification
            if (n.recipient_id === profile.id && !n.read_at) {
              toast(n.title, { description: n.body || undefined })
            }
          }
          refresh()
        })
        .subscribe()
      channels.current.push(channel)
    })
    return () => { channels.current.forEach(c => supabase.removeChannel(c)) }
  }, [profile, refresh])

  const addItem = useCallback(async (item: Partial<InventoryItem>) => {
    const { data: inserted } = await supabase.from('inventory_items').insert({ ...item, created_by_invite: profile?.invite_code }).select().single()
    if (inserted && profile) {
      await notifyItemCreated(inserted as unknown as InventoryItem, data.profiles, data.roles, profile.id)
    }
    await refresh()
  }, [profile, data.profiles, data.roles, refresh])

  const updateItem = useCallback(async (id: string, changes: Partial<InventoryItem>) => {
    const old = data.items.find(i => i.id === id)
    await supabase.from('inventory_items').update(changes).eq('id', id)
    if (old && profile) {
      const changedFields = Object.keys(changes).filter(k => ((old as unknown) as Record<string, unknown>)[k] !== ((changes as unknown) as Record<string, unknown>)[k])
      await notifyItemUpdated(old, data.profiles, data.roles, profile.id, changedFields)
    }
    await refresh()
  }, [data.items, data.profiles, data.roles, profile, refresh])

  const deleteItem = useCallback(async (id: string) => {
    const old = data.items.find(i => i.id === id)
    await supabase.from('inventory_items').delete().eq('id', id)
    if (old && profile) {
      await notifyItemDeleted(old, data.profiles, data.roles, profile.id)
    }
    await refresh()
  }, [data.items, data.profiles, data.roles, profile, refresh])

  const updateRole = useCallback(async (id: string, changes: Partial<Role>) => {
    const old = data.roles.find(r => r.id === id)
    await supabase.from('roles').update(changes).eq('id', id)
    if (old && profile) {
      const changedFields = Object.keys(changes).filter(k => ((old as unknown) as Record<string, unknown>)[k] !== ((changes as unknown) as Record<string, unknown>)[k])
      await notifyRoleUpdated(old, data.profiles, profile.id, changedFields)
    }
    await refresh()
  }, [data.roles, data.profiles, profile, refresh])

  const toggleFeePaid = useCallback(async (profileId: string) => {
    const target = data.profiles.find(p => p.id === profileId)
    if (!target) return
    await supabase.from('profiles').update({ fee_paid: !target.fee_paid }).eq('id', profileId)
    if (profile) {
      await notifyFeeToggled({ ...target, fee_paid: !target.fee_paid }, data.profiles, profile.id)
    }
    await refresh()
  }, [data.profiles, profile, refresh])

  const addProfile = useCallback(async (name: string, inviteCode: string) => {
    const { data: inserted } = await supabase.from('profiles').insert({ name, invite_code: inviteCode, active: true, fee_paid: false, is_admin: false, role_names: [] }).select().single()
    if (inserted && profile) {
      await notifyMemberJoined(inserted as unknown as Profile, data.profiles, profile.id)
    }
    await refresh()
  }, [data.profiles, profile, refresh])

  const updateProfile = useCallback(async (id: string, changes: Partial<Profile>) => {
    const old = data.profiles.find(p => p.id === id)
    await supabase.from('profiles').update(changes).eq('id', id)
    if (old && profile) {
      const changedFields = Object.keys(changes).filter(k => ((old as unknown) as Record<string, unknown>)[k] !== ((changes as unknown) as Record<string, unknown>)[k])
      await notifyMemberUpdated({ ...old, ...changes }, data.profiles, profile.id, changedFields)
    }
    await refresh()
  }, [data.profiles, profile, refresh])

  const deleteProfile = useCallback(async (id: string) => {
    const old = data.profiles.find(p => p.id === id)
    await supabase.from('profiles').update({ active: false }).eq('id', id)
    if (old && profile) {
      await notifyMemberDeactivated(old, data.profiles, profile.id)
    }
    await refresh()
  }, [data.profiles, profile, refresh])

  const addItemComment = useCallback(async (itemId: string, content: string) => {
    if (!profile) return
    const { error } = await supabase.from('item_comments').insert({ item_id: itemId, profile_id: profile.id, content })
    if (error) {
      toast.error('Failed to add comment: ' + error.message)
      return
    }
    const item = data.items.find(i => i.id === itemId)
    if (item) {
      await notifyCommentAdded(item, profile.name, content, data.profiles, data.roles, profile.id)
    }
    await refresh()
  }, [profile, data.items, data.profiles, data.roles, refresh])

  const deleteItemComment = useCallback(async (commentId: string) => {
    const { error } = await supabase.from('item_comments').delete().eq('id', commentId)
    if (error) {
      toast.error('Failed to delete comment: ' + error.message)
      return
    }
    await refresh()
  }, [refresh])

  const readNotification = useCallback(async (id: string) => {
    await markNotificationRead(id)
    await refresh()
  }, [refresh])

  const readAllNotifications = useCallback(async () => {
    if (!profile) return
    await markAllNotificationsRead(profile.id)
    await refresh()
  }, [profile, refresh])

  return (
    <CampContext.Provider value={{ data, loading, refresh, addItem, updateItem, deleteItem, updateRole, toggleFeePaid, addProfile, updateProfile, deleteProfile, addItemComment, deleteItemComment, readNotification, readAllNotifications }}>
      {children}
    </CampContext.Provider>
  )
}

export function useCamp() {
  const ctx = useContext(CampContext)
  if (!ctx) throw new Error('useCamp must be inside CampProvider')
  return ctx
}
