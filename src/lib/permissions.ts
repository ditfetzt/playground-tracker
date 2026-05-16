import type { Profile, InventoryItem, ItemComment } from './types'

export function canEditRole(profile: Profile | null, roleName: string): boolean {
  if (!profile) return false
  if (profile.is_admin) return true
  return profile.role_names?.includes(roleName) ?? false
}

export function canEditItem(profile: Profile | null, item: InventoryItem): boolean {
  if (!profile) return false
  if (profile.is_admin) return true
  if (item.assigned_role && profile.role_names?.includes(item.assigned_role)) return true
  return item.created_by_invite === profile.invite_code
}

export function canDeleteComment(profile: Profile | null, comment: ItemComment): boolean {
  if (!profile) return false
  if (profile.is_admin) return true
  return comment.profile_id === profile.id
}
