import { useState, useEffect, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import type { InventoryItem, Role, Space } from '../../lib/types'

interface ItemModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Partial<InventoryItem>) => Promise<void>
  item: InventoryItem | null
  roles: Role[]
  spaces: Space[]
}

const CATEGORIES = ['power', 'tools', 'decor', 'furniture', 'crafts', 'props', 'equipment', 'other']
const SOURCING = ['borrow', 'buy', 'already_have']

export function ItemModal({ open, onClose, onSave, item, roles, spaces }: ItemModalProps) {
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        name: item?.name || '',
        category: item?.category || 'other',
        qty_needed: String(item?.qty_needed || 1),
        sourcing: item?.sourcing || '',
        source_name: item?.source_name || '',
        cost_estimate: item?.cost_estimate ? String(item.cost_estimate) : '',
        actual_cost: item?.actual_cost ? String(item.actual_cost) : '',
        storage_location: item?.storage_location || '',
        brought_by: item?.brought_by || '',
        space_name: item?.space_id ? (spaces.find(s => s.id === item.space_id)?.name || '') : '',
        assigned_role: item?.assigned_role || '',
        notes: item?.notes || '',
      })
    }
  }, [open, item])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        name: form.name,
        category: form.category as any,
        qty_needed: parseInt(form.qty_needed) || 1,
        sourcing: (form.sourcing || null) as any,
        source_name: form.source_name || null,
        cost_estimate: form.cost_estimate ? parseFloat(form.cost_estimate) : null,
        actual_cost: form.actual_cost ? parseFloat(form.actual_cost) : null,
        storage_location: form.storage_location || null,
        brought_by: form.brought_by || null,
        space_id: form.space_name ? (spaces.find(s => s.name === form.space_name)?.id || null) : null,
        assigned_role: form.assigned_role || null,
        notes: form.notes || null,
        status: item?.status || 'needed',
      })
      onClose()
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit Item' : 'New Item'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-ink-secondary block mb-1">Item name</label>
          <input value={form.name} onChange={set('name')} required className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Category</label>
            <select value={form.category} onChange={set('category')} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Quantity</label>
            <input value={form.qty_needed} onChange={set('qty_needed')} type="number" min="1" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Sourcing</label>
            <select value={form.sourcing} onChange={set('sourcing')} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss">
              <option value="">Select...</option>
              {SOURCING.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Source / from whom</label>
            <input value={form.source_name} onChange={set('source_name')} placeholder="e.g. Will" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Cost estimate ($)</label>
            <input value={form.cost_estimate} onChange={set('cost_estimate')} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Actual cost ($)</label>
            <input value={form.actual_cost} onChange={set('actual_cost')} type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Storage location</label>
            <input value={form.storage_location} onChange={set('storage_location')} placeholder="e.g. Hailey's carport" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Who brings it</label>
            <input value={form.brought_by} onChange={set('brought_by')} placeholder="e.g. Will" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Space</label>
            <select value={form.space_name} onChange={set('space_name')} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss">
              <option value="">None</option>
              {spaces.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Assigned role</label>
            <select value={form.assigned_role} onChange={set('assigned_role')} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss">
              <option value="">None</option>
              {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-secondary block mb-1">Notes</label>
          <textarea value={form.notes} onChange={set('notes')} rows={2} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss resize-none" />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink-secondary text-sm font-semibold hover:bg-wood transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-moss text-white text-sm font-semibold hover:bg-moss-light disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
