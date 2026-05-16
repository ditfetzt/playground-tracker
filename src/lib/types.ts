export interface Profile {
  id: string
  name: string
  emoji: string
  invite_code: string
  is_admin: boolean
  role_names: string[]
  fee_paid: boolean
  active: boolean
  last_login: string | null
  bypass_onboarding: boolean
  onboarding_dismissed_at: string | null
  onboarding_completed_at: string | null
  created_at: string
}

export interface Role {
  id: string
  name: string
  type: 'major' | 'minor' | 'internal'
  lead: string | null
  co_lead: string[]
  key_support: string[]
  status: 'filled' | 'vacant'
  description: string | null
  created_at: string
}

export interface Space {
  id: string
  name: string
  curators: string[]
  description: string | null
  created_at: string
}

export type ItemStatus = 'needed' | 'acquired'
export type SourcingType = 'buy' | 'borrow'
export type ItemCategory = 'power' | 'tools' | 'decor' | 'furniture' | 'crafts' | 'props' | 'equipment' | 'other'

export interface InventoryItem {
  id: string
  name: string
  category: ItemCategory
  qty_needed: number
  qty_acquired: number
  sourcing: SourcingType | null
  source_name: string | null
  cost_estimate: number | null
  actual_cost: number | null
  storage_location: string | null
  brought_by: string | null
  assigned_role: string | null
  space_id: string | null
  status: ItemStatus
  notes: string | null
  link_url: string | null
  created_by_invite: string | null
  created_at: string
}

export interface FinanceEntry {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string | null
  person: string | null
  status: 'pending' | 'confirmed' | 'paid'
  date: string
  created_by_invite: string | null
  created_at: string
}

export interface VolunteerHour {
  id: string
  profile_id: string
  hours: number
  type: 'pre_camp' | 'on_site'
  task: string | null
  date: string
  created_at: string
}

export interface Ticket {
  id: string
  profile_id: string
  source: 'grant' | 'directed' | 'volunteer' | 'general'
  status: 'pending' | 'confirmed' | 'issued'
  notes: string | null
  created_at: string
}

export interface ItemComment {
  id: string
  item_id: string
  profile_id: string
  content: string
  created_at: string
  profile?: { name: string; emoji: string }
}

export interface ActivityLogEntry {
  id: string
  message: string
  profile_id: string | null
  entity_type: string | null
  entity_id: string | null
  created_by_invite: string | null
  created_at: string
}

export interface CampData {
  roles: Role[]
  items: InventoryItem[]
  finances: FinanceEntry[]
  spaces: Space[]
  volunteerHours: VolunteerHour[]
  tickets: Ticket[]
  activityLog: ActivityLogEntry[]
  profiles: Profile[]
  itemComments: ItemComment[]
}
