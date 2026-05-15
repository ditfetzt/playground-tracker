import { useState, useRef, useCallback, type FormEvent } from 'react'
import type { Role, InventoryItem, Profile } from '../../lib/types'
import type { NewItemState } from './AddItemForm'
import { getMemberColor, ROLE_EMOJIS } from '../../lib/constants'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ChevronDown, Plus, Pencil } from 'lucide-react'
import { ItemRow } from './ItemRow'
import { AddItemForm } from './AddItemForm'
import { EmptyState } from './EmptyState'
import { MemberPicker } from './MemberPicker'
import { MemberPopover } from './MemberPopover'

interface RoleCardProps {
  role: Role
  items: InventoryItem[]
  isExpanded: boolean
  onToggle: () => void
  canEdit: boolean
  canEditItem: (item: InventoryItem) => boolean
  onCycleStatus: (item: InventoryItem) => void
  onDelete: (id: string) => void
  addingForRole: string | null
  onStartAdd: (roleName: string) => void
  onCancelAdd: () => void
  onAddItem: (e: FormEvent, roleName: string) => void
  newItem: NewItemState
  setNewItem: (item: NewItemState) => void
  isAdmin: boolean
  onUpdateRole: (id: string, changes: Partial<Role>) => void
  onUpdateItem: (id: string, changes: Partial<InventoryItem>) => Promise<void>
  activeMembers: Profile[]
  isFirstRole: boolean
}

export function RoleCard({
  role,
  items,
  isExpanded,
  onToggle,
  canEdit,
  canEditItem,
  onCycleStatus,
  onDelete,
  addingForRole,
  onStartAdd,
  onCancelAdd,
  onAddItem,
  newItem,
  setNewItem,
  isAdmin,
  onUpdateRole,
  onUpdateItem,
  activeMembers,
  isFirstRole,
}: RoleCardProps) {
  const done = items.filter(i => i.status === 'acquired').length
  const total = items.length
  const [editingRole, setEditingRole] = useState(false)
  const [editLead, setEditLead] = useState<string[]>(role.lead ? [role.lead] : [])
  const [editSupport, setEditSupport] = useState<string[]>(role.key_support || [])
  const [editType, setEditType] = useState(role.type)
  const [popoverName, setPopoverName] = useState<string | null>(null)
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null)

  const openPopover = useCallback((name: string, el: HTMLElement) => {
    setPopoverName(name)
    setPopoverRect(el.getBoundingClientRect())
  }, [])
  const closePopover = useCallback(() => setPopoverName(null), [])
  const closeWithDelay = useRef<ReturnType<typeof setTimeout>>(0)
  const scheduleClose = useCallback(() => {
    closeWithDelay.current = setTimeout(closePopover, 300)
  }, [closePopover])
  const cancelClose = useCallback(() => {
    clearTimeout(closeWithDelay.current)
  }, [])

  const handleSaveRole = () => {
    onUpdateRole(role.id, {
      lead: editLead[0] || null,
      key_support: editSupport,
      type: editType,
    })
    setEditingRole(false)
  }

  const handleCancelEdit = () => {
    setEditLead(role.lead ? [role.lead] : [])
    setEditSupport(role.key_support || [])
    setEditType(role.type)
    setEditingRole(false)
  }

  return (
    <>
    <div className="glass-card p-4" onMouseLeave={scheduleClose}>
      <div className="w-full flex items-start justify-between mb-2 text-left group">
        <button onClick={onToggle} className="flex-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              <span className="mr-1.5">{ROLE_EMOJIS[role.name] || '📋'}</span>
              {role.name}
            </h2>
            <Badge variant={role.type === 'major' ? 'default' : 'secondary'}>{role.type}</Badge>
          </div>

          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {role.type === 'minor' ? (
              /* Minor roles: all members shown equally, no lead distinction */
              (() => {
                const allMembers = [...new Set([role.lead, ...(role.key_support || [])])].filter(Boolean) as string[]
                return allMembers.map((name: string) => (
                  <MemberPill key={name} name={name} onClick={openPopover} onHoverClose={scheduleClose} />
                ))
              })()
            ) : (
              /* Major roles: lead + support with distinct styling */
              <>
                {role.lead && (
                  <div className="flex items-center gap-1 text-[13px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors" onClick={(e) => { e.stopPropagation(); openPopover(role.lead!, e.currentTarget) }} onMouseEnter={(e) => openPopover(role.lead!, e.currentTarget)} onMouseLeave={scheduleClose}>
                    <span
                      className="inline-flex items-center justify-center rounded-full font-bold text-[6px] shrink-0"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: getMemberColor(role.lead) + '20',
                        color: getMemberColor(role.lead),
                      }}
                    >
                      {role.lead.slice(0, 2)}
                    </span>
                    {role.lead}
                  </div>
                )}
                {role.key_support?.filter((s: string) => s && !s.match(/^\d/) && !s.toLowerCase().includes('assistant')).map((support: string) => (
                  <MemberPill key={support} name={support} onClick={openPopover} onHoverClose={scheduleClose} />
                ))}
              </>
            )}
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <span data-tour-target={isFirstRole ? 'role-edit-btn' : undefined}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!editingRole) {
                    setEditLead(role.lead ? [role.lead] : [])
                    setEditSupport(role.key_support || [])
                    setEditType(role.type)
                  }
                  setEditingRole(!editingRole)
                }}
                className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Edit role"
              >
                <Pencil size={12} />
              </button>
            </span>
          )}
          {total > 0 && (
            <span className="text-xs text-muted-foreground font-mono">
              {done}/{total}
            </span>
          )}
          <button onClick={onToggle} className="p-1">
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Admin role edit form */}
      {editingRole && (
        <div className="flex flex-col gap-2 mb-3 p-3 rounded bg-secondary/30 border border-border">
          <label className="text-[13px] text-muted-foreground uppercase tracking-wide">Role Type</label>
          <div className="flex gap-1.5">
            {(['major', 'minor'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setEditType(t)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  editType === t
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="text-[13px] text-muted-foreground uppercase tracking-wide mt-1">Lead</label>
          <MemberPicker
            mode="single"
            members={activeMembers}
            selected={editLead}
            onChange={setEditLead}
            exclude={[]}
            placeholder="Select lead..."
          />

          <label className="text-[13px] text-muted-foreground uppercase tracking-wide mt-1">Key Support</label>
          <MemberPicker
            mode="multi"
            members={activeMembers}
            selected={editSupport}
            onChange={setEditSupport}
            exclude={editLead}
            placeholder="Add support members..."
          />

          <div className="flex gap-2 mt-1">
            <Button size="sm" onClick={handleSaveRole}>Save</Button>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      )}

      {isExpanded && (
        <>
          {items.length > 0 ? (
            <div className="flex flex-col gap-1 mt-3">
              <div className="hidden sm:grid grid-cols-[60px_1fr_60px_40px_40px_1fr_30px] gap-1.5 px-1.5 py-1 text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <span>Status</span>
                <span>Item</span>
                <span>Location</span>
                <span>Get by</span>
                <span>Value</span>
                <span>Notes</span>
                <span></span>
              </div>

              {items.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  canEdit={canEditItem(item)}
                  onCycleStatus={onCycleStatus}
                  onDelete={onDelete}
                  onUpdate={onUpdateItem}
                  isFirstItem={isFirstRole && idx === 0}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          {canEdit && (
            addingForRole === role.name ? (
              <AddItemForm
                roleName={role.name}
                item={newItem}
                onChange={setNewItem}
                onSubmit={onAddItem}
                onCancel={onCancelAdd}
              />
            ) : (
              <span data-tour-target={isFirstRole ? 'add-item-btn' : undefined}>
                <Button variant="link" size="sm" className="mt-3 h-auto p-0" onClick={() => onStartAdd(role.name)}>
                  <Plus size={13} className="mr-1" /> Add item
                </Button>
              </span>
            )
          )}
        </>
      )}
    </div>
    {popoverName && popoverRect && (
      <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
        <MemberPopover personName={popoverName} triggerRect={popoverRect} onClose={closePopover} />
      </div>
    )}
  </>
  )
}

function MemberPill({ name, onClick, onHoverClose }: { name: string; onClick: (name: string, el: HTMLElement) => void; onHoverClose: () => void }) {
  return (
    <div
      className="flex items-center gap-1 text-[13px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border cursor-pointer hover:bg-secondary/80 transition-colors"
      onClick={(e) => { e.stopPropagation(); onClick(name, e.currentTarget) }}
      onMouseEnter={(e) => onClick(name, e.currentTarget)}
      onMouseLeave={onHoverClose}
    >
      <span
        className="inline-flex items-center justify-center rounded-full font-bold text-[6px] shrink-0"
        style={{
          width: 16,
          height: 16,
          backgroundColor: getMemberColor(name) + '20',
          color: getMemberColor(name),
        }}
      >
        {name.slice(0, 2)}
      </span>
      {name}
    </div>
  )
}
