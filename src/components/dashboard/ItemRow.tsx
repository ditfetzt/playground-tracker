import { useState, type FormEvent } from 'react'
import type { InventoryItem, SourcingType } from '../../lib/types'
import { STATUS_LABELS, STATUS_STYLES } from '../../lib/constants'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Trash2, Pencil } from 'lucide-react'

interface ItemRowProps {
  item: InventoryItem
  canEdit: boolean
  onCycleStatus: (item: InventoryItem) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, changes: Partial<InventoryItem>) => Promise<void>
  isFirstItem?: boolean
}

export function ItemRow({ item, canEdit, onCycleStatus, onDelete, onUpdate, isFirstItem }: ItemRowProps) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editLocation, setEditLocation] = useState(item.storage_location || '')
  const [editSourcing, setEditSourcing] = useState<SourcingType>(item.sourcing || 'buy')
  const [editValue, setEditValue] = useState(item.actual_cost ? String(item.actual_cost) : item.cost_estimate ? String(item.cost_estimate) : '')
  const [editNotes, setEditNotes] = useState(item.notes || '')
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.needed
  const statusLabel = STATUS_LABELS[item.status] || 'Needed'

  const startEditing = () => {
    setEditName(item.name)
    setEditLocation(item.storage_location || '')
    setEditSourcing(item.sourcing || 'buy')
    setEditValue(item.actual_cost ? String(item.actual_cost) : item.cost_estimate ? String(item.cost_estimate) : '')
    setEditNotes(item.notes || '')
    setEditing(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return
    if (editSourcing === 'buy') {
      const v = parseFloat(editValue)
      if (!editValue.trim() || isNaN(v) || v <= 0) {
        setEditError('Value is required for Buy items')
        return
      }
    }
    setEditError('')
    setSaving(true)
    await onUpdate(item.id, {
      name: editName.trim(),
      storage_location: editLocation.trim() || null,
      sourcing: editSourcing,
      actual_cost: editSourcing === 'buy' && editValue ? parseFloat(editValue) : null,
      notes: editNotes.trim() || null,
    })
    setSaving(false)
    setEditing(false)
  }

  const sourcingBadge = (
    <span className={`text-[12px] font-bold px-1 py-0.5 rounded border w-fit shrink-0 ${item.sourcing === 'borrow' ? 'bg-secondary text-muted-foreground border-border' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
      {item.sourcing === 'borrow' ? 'Borr' : 'Buy'}
    </span>
  )

  const costText = item.actual_cost ? '$' + item.actual_cost : item.cost_estimate ? '$' + item.cost_estimate : null

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-2 p-2 rounded-lg bg-secondary/20 border border-border">
        <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Item name" autoFocus />
        <div className={`grid ${editSourcing === 'buy' ? 'grid-cols-2' : ''} gap-2`}>
          <Input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="Location" />
          {editSourcing === 'buy' && (
            <Input value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Value (CAD)" />
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => { setEditError(''); setEditSourcing('buy') }}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              editSourcing === 'buy'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => { setEditError(''); setEditSourcing('borrow') }}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              editSourcing === 'borrow'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Borrow
          </button>
        </div>
        {editError && <p className="text-[13px] text-destructive">{editError}</p>}
        <Input value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notes" />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[60px_1fr_60px_40px_40px_1fr_30px] gap-1 sm:gap-1.5 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors items-start sm:items-center group">
      {/* Mobile: status + name + actions in one row */}
      <div className="flex items-center gap-2 w-full sm:hidden">
        <span data-tour-target={isFirstItem ? 'status-badge' : undefined}>
          <button
            onClick={() => onCycleStatus(item)}
            disabled={!canEdit && item.id !== '__tour_demo__'}
            className={`text-[12px] font-bold px-1.5 py-0.5 rounded border-2 uppercase tracking-wide shrink-0 transition-all ${statusStyle} ${canEdit || item.id === '__tour_demo__' ? 'cursor-pointer hover:border-current hover:shadow-sm animate-status-pulse' : 'cursor-default opacity-60'}`}
          >
            {statusLabel}
          </button>
        </span>
        <span className={`text-xs truncate flex-1 ${item.status === 'acquired' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {item.name}
        </span>
        {canEdit && (
          <div className="flex gap-0.5 shrink-0">
            <button onClick={startEditing} className="p-1 rounded hover:bg-secondary text-muted-foreground" title="Edit"><Pencil size={12} /></button>
            <button onClick={() => { if (confirm('Delete?')) onDelete(item.id) }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground" title="Delete"><Trash2 size={12} /></button>
          </div>
        )}
      </div>

      {/* Mobile: detail row */}
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground sm:hidden flex-wrap">
        {item.storage_location && <span>{item.storage_location}</span>}
        {item.storage_location && (item.sourcing || costText) && <span>·</span>}
        {sourcingBadge}
        {costText && <span>{costText}</span>}
        {item.notes && <><span>·</span><span className="truncate max-w-[120px]">{item.notes}</span></>}
      </div>

      {/* Desktop: grid columns */}
      <span data-tour-target={isFirstItem ? 'status-badge' : undefined}>
        <button
          onClick={() => onCycleStatus(item)}
          disabled={!canEdit && item.id !== '__tour_demo__'}
          className={`hidden sm:inline text-[12px] font-bold px-1.5 py-0.5 rounded border-2 uppercase tracking-wide w-fit transition-all ${statusStyle} ${canEdit || item.id === '__tour_demo__' ? 'cursor-pointer hover:border-current hover:shadow-sm animate-status-pulse' : 'cursor-default opacity-60'}`}
        >
          {statusLabel}
        </button>
      </span>

      <span className={`hidden sm:inline text-xs truncate ${item.status === 'acquired' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {item.name}
      </span>

      <span className="hidden sm:inline text-[13px] text-muted-foreground truncate">
        {item.storage_location || '-'}
      </span>

      <span className="hidden sm:inline">
        {sourcingBadge}
      </span>

      <span className="hidden sm:inline text-[13px] text-muted-foreground truncate">
        {costText || '-'}
      </span>

      <span className="hidden sm:inline text-[13px] text-muted-foreground truncate">
        {item.notes || '-'}
      </span>

      <div className="hidden sm:flex justify-end gap-0.5">
        {canEdit && (
          <>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={startEditing} title="Edit">
              <Pencil size={10} />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={() => { if (confirm('Delete this item?')) onDelete(item.id) }} title="Delete">
              <Trash2 size={10} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
