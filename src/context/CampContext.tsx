import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { CampData, InventoryItem, FinanceEntry, VolunteerHour, Ticket } from '../lib/types'
import { useAuth } from './AuthContext'

type TableName = 'roles' | 'inventory_items' | 'finance_entries' | 'spaces' | 'volunteer_hours' | 'tickets' | 'activity_log' | 'profiles'

const ALL_TABLES: { key: keyof CampData; table: TableName }[] = [
  { key: 'roles', table: 'roles' },
  { key: 'items', table: 'inventory_items' },
  { key: 'finances', table: 'finance_entries' },
  { key: 'spaces', table: 'spaces' },
  { key: 'volunteerHours', table: 'volunteer_hours' },
  { key: 'tickets', table: 'tickets' },
  { key: 'activityLog', table: 'activity_log' },
  { key: 'profiles', table: 'profiles' },
]

interface CampContextValue {
  data: CampData
  loading: boolean
  refresh: () => Promise<void>
  // Mutations
  addItem: (item: Partial<InventoryItem>) => Promise<void>
  updateItem: (id: string, changes: Partial<InventoryItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  addFinance: (entry: Partial<FinanceEntry>) => Promise<void>
  deleteFinance: (id: string) => Promise<void>
  addVolunteerHours: (entry: Partial<VolunteerHour>) => Promise<void>
  addTicket: (ticket: Partial<Ticket>) => Promise<void>
  addLog: (message: string, entityType?: string) => Promise<void>
}

const CampContext = createContext<CampContextValue | null>(null)

const INITIAL_DATA: CampData = {
  roles: [], items: [], finances: [], spaces: [],
  volunteerHours: [], tickets: [], activityLog: [], profiles: [],
}

export function CampProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [data, setData] = useState<CampData>(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const channels = useRef<ReturnType<typeof supabase.channel>[]>([])

  const refresh = useCallback(async () => {
    if (!profile) return
    const results = await Promise.all(
      ALL_TABLES.map(async ({ table }) => {
        const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false })
        return data || []
      })
    )
    const newData: CampData = {} as CampData
    ALL_TABLES.forEach(({ key }, i) => {
      (newData as any)[key] = results[i]
    })
    setData(newData)
    setLoading(false)
  }, [profile])

  // Set up realtime subscriptions
  useEffect(() => {
    if (!profile) return
    refresh()

    // Clean up old channels
    channels.current.forEach(c => supabase.removeChannel(c))
    channels.current = []

    const tables = ALL_TABLES.filter(t => t.table !== 'profiles')
    tables.forEach(({ table }) => {
      const channel = supabase
        .channel(`public:${table}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table },
          () => { refresh() }
        )
        .subscribe()
      channels.current.push(channel)
    })

    return () => {
      channels.current.forEach(c => supabase.removeChannel(c))
    }
  }, [profile])

  // Mutations
  const addItem = useCallback(async (item: Partial<InventoryItem>) => {
    await supabase.from('inventory_items').insert({ ...item, created_by_invite: profile?.invite_code })
    await addLog(`added "${item.name}" to inventory`, 'inventory')
    await refresh()
  }, [profile])

  const updateItem = useCallback(async (id: string, changes: Partial<InventoryItem>) => {
    await supabase.from('inventory_items').update(changes).eq('id', id)
    await refresh()
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const item = data.items.find(i => i.id === id)
    await supabase.from('inventory_items').delete().eq('id', id)
    if (item) await addLog(`removed "${item.name}" from inventory`, 'inventory')
    await refresh()
  }, [data.items])

  const addFinance = useCallback(async (entry: Partial<FinanceEntry>) => {
    await supabase.from('finance_entries').insert({ ...entry, created_by_invite: profile?.invite_code })
    await addLog(`added ${entry.type}: ${entry.description}`, 'finance')
    await refresh()
  }, [profile])

  const deleteFinance = useCallback(async (id: string) => {
    await supabase.from('finance_entries').delete().eq('id', id)
    await refresh()
  }, [])

  const addVolunteerHours = useCallback(async (entry: Partial<VolunteerHour>) => {
    await supabase.from('volunteer_hours').insert(entry)
    await addLog(`logged ${entry.hours}h volunteer hours`, 'volunteer')
    await refresh()
  }, [])

  const addTicket = useCallback(async (ticket: Partial<Ticket>) => {
    await supabase.from('tickets').insert(ticket)
    await addLog(`added ${ticket.source} ticket`, 'ticket')
    await refresh()
  }, [])

  const addLog = useCallback(async (message: string, entityType?: string) => {
    await supabase.from('activity_log').insert({
      message,
      entity_type: entityType || null,
      created_by_invite: profile?.invite_code,
    })
    await refresh()
  }, [profile])

  return (
    <CampContext.Provider value={{ data, loading, refresh, addItem, updateItem, deleteItem, addFinance, deleteFinance, addVolunteerHours, addTicket, addLog }}>
      {children}
    </CampContext.Provider>
  )
}

export function useCamp() {
  const ctx = useContext(CampContext)
  if (!ctx) throw new Error('useCamp must be inside CampProvider')
  return ctx
}
