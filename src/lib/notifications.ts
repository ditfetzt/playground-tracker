import type { Profile, Role, InventoryItem, NotificationType } from './types'
import { supabase } from './supabase'

const DEDUP_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

function getRoleMembers(roleName: string | null, profiles: Profile[], roles: Role[]): string[] {
  if (!roleName) return []
  const role = roles.find(r => r.name === roleName)
  if (!role) return []
  const names = new Set([role.lead, ...(role.co_lead || []), ...(role.key_support || [])].filter(Boolean) as string[])
  return profiles.filter(p => p.active && names.has(p.name)).map(p => p.id)
}

function getAdminIds(profiles: Profile[]): string[] {
  return profiles.filter(p => p.active && p.is_admin).map(p => p.id)
}

async function dedupedInsert(
  recipientId: string,
  type: NotificationType,
  title: string,
  body: string | null,
  linkTo: string | null,
  relatedId: string | null,
  relatedTable: string | null,
  senderId: string | null
) {
  if (senderId && recipientId === senderId) return

  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
  const { data: existing } = await supabase
    .from('notifications')
    .select('id')
    .eq('recipient_id', recipientId)
    .eq('type', type)
    .eq('related_id', relatedId)
    .is('read_at', null)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    await supabase
      .from('notifications')
      .update({ title, body, created_at: new Date().toISOString() })
      .eq('id', existing.id)
    return
  }

  await supabase.from('notifications').insert({
    recipient_id: recipientId,
    type,
    title,
    body,
    link_to: linkTo,
    related_id: relatedId,
    related_table: relatedTable,
  })
}

export async function notifyItemCreated(
  item: InventoryItem,
  profiles: Profile[],
  roles: Role[],
  senderId: string
) {
  const recipients = new Set([
    ...getRoleMembers(item.assigned_role, profiles, roles),
    ...getAdminIds(profiles),
  ])
  recipients.delete(senderId)

  for (const id of recipients) {
    await dedupedInsert(
      id,
      'item_created',
      `New item: ${item.name}`,
      item.assigned_role ? `Added to ${item.assigned_role}` : null,
      `item:${item.id}`,
      item.id,
      'inventory_items',
      senderId
    )
  }
}

export async function notifyItemUpdated(
  item: InventoryItem,
  profiles: Profile[],
  roles: Role[],
  senderId: string,
  changedFields: string[]
) {
  const recipients = new Set([
    ...getRoleMembers(item.assigned_role, profiles, roles),
    ...getAdminIds(profiles),
  ])
  recipients.delete(senderId)

  const body = changedFields.length > 0 ? `Changed: ${changedFields.join(', ')}` : null
  for (const id of recipients) {
    await dedupedInsert(
      id,
      'item_updated',
      `Updated: ${item.name}`,
      body,
      `item:${item.id}`,
      item.id,
      'inventory_items',
      senderId
    )
  }
}

export async function notifyItemDeleted(
  item: InventoryItem,
  profiles: Profile[],
  roles: Role[],
  senderId: string
) {
  const recipients = new Set([
    ...getRoleMembers(item.assigned_role, profiles, roles),
    ...getAdminIds(profiles),
  ])
  recipients.delete(senderId)

  for (const id of recipients) {
    await dedupedInsert(
      id,
      'item_deleted',
      `Deleted: ${item.name}`,
      item.assigned_role ? `Removed from ${item.assigned_role}` : null,
      null,
      item.id,
      'inventory_items',
      senderId
    )
  }
}

export async function notifyCommentAdded(
  item: InventoryItem,
  commentAuthorName: string,
  commentContent: string,
  profiles: Profile[],
  roles: Role[],
  senderId: string
) {
  const recipients = new Set([
    ...getRoleMembers(item.assigned_role, profiles, roles),
    ...getAdminIds(profiles),
  ])
  recipients.delete(senderId)

  for (const id of recipients) {
    await dedupedInsert(
      id,
      'comment_added',
      `New comment on ${item.name}`,
      `${commentAuthorName}: ${commentContent.slice(0, 80)}${commentContent.length > 80 ? '…' : ''}`,
      `item:${item.id}`,
      item.id,
      'inventory_items',
      senderId
    )
  }
}

export async function notifyRoleUpdated(
  role: Role,
  profiles: Profile[],
  senderId: string,
  changedFields: string[]
) {
  const names = new Set([role.lead, ...(role.co_lead || []), ...(role.key_support || [])].filter(Boolean) as string[])
  const recipients = new Set([
    ...profiles.filter(p => p.active && names.has(p.name)).map(p => p.id),
    ...getAdminIds(profiles),
  ])
  recipients.delete(senderId)

  const body = changedFields.length > 0 ? `Changed: ${changedFields.join(', ')}` : null
  for (const id of recipients) {
    await dedupedInsert(
      id,
      'role_updated',
      `Role updated: ${role.name}`,
      body,
      `role:${role.id}`,
      role.id,
      'roles',
      senderId
    )
  }
}

export async function notifyMemberJoined(
  profile: Profile,
  profiles: Profile[],
  senderId: string
) {
  const recipients = new Set(getAdminIds(profiles))
  recipients.delete(senderId)

  for (const id of recipients) {
    await dedupedInsert(
      id,
      'member_joined',
      `New member: ${profile.name}`,
      null,
      `member:${profile.id}`,
      profile.id,
      'profiles',
      senderId
    )
  }
}

export async function notifyMemberUpdated(
  profile: Profile,
  profiles: Profile[],
  senderId: string,
  changedFields: string[]
) {
  const recipients = new Set(getAdminIds(profiles))
  recipients.delete(senderId)

  const body = changedFields.length > 0 ? `Changed: ${changedFields.join(', ')}` : null
  for (const id of recipients) {
    await dedupedInsert(
      id,
      'member_updated',
      `Member updated: ${profile.name}`,
      body,
      `member:${profile.id}`,
      profile.id,
      'profiles',
      senderId
    )
  }
}

export async function notifyMemberDeactivated(
  profile: Profile,
  profiles: Profile[],
  senderId: string
) {
  const recipients = new Set(getAdminIds(profiles))
  recipients.delete(senderId)

  for (const id of recipients) {
    await dedupedInsert(
      id,
      'member_deactivated',
      `Member removed: ${profile.name}`,
      null,
      null,
      profile.id,
      'profiles',
      senderId
    )
  }
}

export async function notifyFeeToggled(
  profile: Profile,
  profiles: Profile[],
  senderId: string
) {
  const recipients = new Set(getAdminIds(profiles))
  recipients.delete(senderId)

  for (const id of recipients) {
    await dedupedInsert(
      id,
      'fee_toggled',
      `Fee ${profile.fee_paid ? 'paid' : 'unpaid'}: ${profile.name}`,
      null,
      `member:${profile.id}`,
      profile.id,
      'profiles',
      senderId
    )
  }
}

export async function markNotificationRead(id: string) {
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
}

export async function markAllNotificationsRead(recipientId: string) {
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('recipient_id', recipientId).is('read_at', null)
}
