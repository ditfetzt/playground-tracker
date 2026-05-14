import type { FormEvent } from 'react'
import type { Role, InventoryItem, Profile } from '../../lib/types'
import type { NewItemState } from './AddItemForm'
import { RoleCard } from './RoleCard'

interface MyRolesPanelProps {
  roles: Role[]
  items: InventoryItem[]
  expandedRole: string | null
  onToggleRole: (roleName: string | null) => void
  canEditRole: (roleName: string) => boolean
  canEditItem: (item: InventoryItem) => boolean
  onCycleStatus: (item: InventoryItem) => void
  onDelete: (id: string) => void
  onUpdateItem: (id: string, changes: Partial<InventoryItem>) => Promise<void>
  addingForRole: string | null
  onStartAdd: (roleName: string) => void
  onCancelAdd: () => void
  onAddItem: (e: FormEvent, roleName: string) => void
  newItem: NewItemState
  setNewItem: (item: NewItemState) => void
  emptyMessage?: string
  isAdmin: boolean
  onUpdateRole: (id: string, changes: Partial<Role>) => void
  activeMembers: Profile[]
  demoItem?: InventoryItem | null
  demoRoleName?: string | null
}

export function MyRolesPanel({
  roles,
  items,
  expandedRole,
  onToggleRole,
  canEditRole,
  canEditItem,
  onCycleStatus,
  onDelete,
  addingForRole,
  onStartAdd,
  onCancelAdd,
  onAddItem,
  newItem,
  setNewItem,
  emptyMessage = 'No roles assigned.',
  isAdmin,
  onUpdateRole,
  onUpdateItem,
  activeMembers,
  demoItem,
  demoRoleName,
}: MyRolesPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      {roles.length === 0 ? (
        <div className="glass-card p-6 text-center">
          <p className="text-xs text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {roles.map((role, idx) => {
            const roleItems = items.filter(i => i.assigned_role === role.name)
            const hasDemo = demoItem && demoRoleName === role.name
            const displayItems = hasDemo ? [...roleItems, demoItem] : roleItems
            return (
              <RoleCard
                key={role.id}
                role={role}
                items={displayItems}
                isExpanded={expandedRole === role.name}
                onToggle={() => onToggleRole(expandedRole === role.name ? null : role.name)}
                canEdit={canEditRole(role.name)}
                canEditItem={canEditItem}
                onCycleStatus={onCycleStatus}
                onDelete={onDelete}
                addingForRole={addingForRole}
                onStartAdd={onStartAdd}
                onCancelAdd={onCancelAdd}
                onAddItem={onAddItem}
                newItem={newItem}
                setNewItem={setNewItem}
                isAdmin={isAdmin}
                onUpdateRole={onUpdateRole}
                onUpdateItem={onUpdateItem}
                activeMembers={activeMembers}
                isFirstRole={idx === 0}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
