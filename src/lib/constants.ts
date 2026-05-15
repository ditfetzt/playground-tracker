import type { ItemStatus, SourcingType } from './types'

export const ART_GRANT = 415
export const CAMP_FEE_PER_PERSON = 50

export const STATUS_CYCLE: ItemStatus[] = ['needed', 'acquired']

export const STATUS_LABELS: Record<ItemStatus, string> = {
  needed: 'Needed',
  acquired: 'Got it',
}

export const STATUS_STYLES: Record<ItemStatus, string> = {
  needed: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  acquired: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
}

export const SOURCING_LABELS: Record<SourcingType, string> = {
  buy: 'Buy',
  borrow: 'Borrow',
}

export const MEMBER_COLORS = [
  '#0ea5e9', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
  '#14b8a6', '#d946ef', '#3b82f6', '#eab308', '#10b981',
  '#f43f5e', '#a855f7', '#2dd4bf', '#fb923c', '#4ade80',
]

export function getMemberColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return MEMBER_COLORS[Math.abs(hash) % MEMBER_COLORS.length]
}

export const HIDDEN_ROLE_NAMES = ['Inventory & Finance', 'Admin & Communication']

export const ROLE_EMOJIS: Record<string, string> = {
  'Playground Cabaret': '🎤',
  'Set-Up Lead': '🏗️',
  'Take-Down Lead (Leave No Trace)': '🌿',
  'Tools Daddy': '🔧',
  'Power & Generators Lead': '⚡',
  'Camps Mommy (Concierge Lead)': '🧹',
  'Workshops & Offerings Logistics': '🎨',
  'Transportation Logistics': '🚛',
  'Sound System': '🔊',
  'Building Lead': '🧱',
  'Village Sanctuary': '🏕️',
  'Stage + Tunnel Curator': '🎭',
  'Bell Tent Curator': '⛺',
  'Movement Space Curator': '💃',
  'Crafts Area Curator': '🎨',
  'Massage Tent Curator': '💆',
  'Puppets Stage Curator': '🧶',
  'Satellite Camp': '🛰️',
  'Mystic Yoni': '🌸',
  'Mobile Playground': '🧸',
  'Reception': '🏠',
}
