import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCamp } from '../../context/CampContext'
import { useAuth } from '../../context/AuthContext'
import { useConfetti } from '../../hooks/useConfetti'
import { ItemCard } from './ItemCard'
import { ItemModal } from './ItemModal'
import { Select } from '../ui/Select'
import { Plus } from 'lucide-react'
import type { InventoryItem, ItemStatus } from '../../lib/types'
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'

const STATUSES: ItemStatus[] = ['needed', 'sourcing', 'acquired', 'on_site']
const STATUS_LABELS: Record<ItemStatus, string> = {
  needed: 'Needed', sourcing: 'Sourcing', acquired: 'Acquired', on_site: 'On-Site ✓',
}

const CATEGORIES = ['power', 'tools', 'decor', 'furniture', 'crafts', 'props', 'equipment', 'other']

export function InventoryView() {
  const { data, updateItem, addItem, deleteItem } = useCamp()
  const { canEditItem } = useAuth()
  const { fire: fireConfetti } = useConfetti()

  const [catFilter, setCatFilter] = useState('')
  const [spaceFilter, setSpaceFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [draggedItem, setDraggedItem] = useState<InventoryItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const filtered = data.items.filter(i => {
    if (catFilter && i.category !== catFilter) return false
    if (spaceFilter) {
      const sp = data.spaces.find(s => s.id === i.space_id)
      if (!sp || sp.name !== spaceFilter) return false
    }
    if (roleFilter && i.assigned_role !== roleFilter) return false
    return true
  })

  const handleDragStart = (e: DragStartEvent) => {
    const item = data.items.find(i => i.id === e.active.id)
    if (item) setDraggedItem(item)
  }

  const handleDragEnd = async (e: DragEndEvent) => {
    setDraggedItem(null)
    const { active, over } = e
    if (!over || !active) return

    const item = data.items.find(i => i.id === active.id)
    if (!item) return

    // Check if dropped on a column
    const overId = over.id.toString()
    if (STATUSES.includes(overId as ItemStatus) && item.status !== overId) {
      await updateItem(item.id, { status: overId as ItemStatus })
      if (overId === 'on_site') fireConfetti()
    }
  }

  const openNew = () => { setEditingItem(null); setModalOpen(true) }
  const openEdit = (item: InventoryItem) => { setEditingItem(item); setModalOpen(true) }

  const handleSave = async (data: Partial<InventoryItem>) => {
    if (editingItem) {
      await updateItem(editingItem.id, data)
    } else {
      await addItem(data)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) await deleteItem(id)
  }

  return (
    <div>
      <div className="section-header flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📦 Inventory</h2>
        <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 rounded-lg btn-primary text-white text-sm font-semibold">
          <Plus size={15} /> Add Item
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        <Select value={catFilter} onChange={setCatFilter}
          options={CATEGORIES.map(c => ({ value: c, label: c }))} placeholder="All categories" />
        <Select value={spaceFilter} onChange={setSpaceFilter}
          options={data.spaces.map(s => ({ value: s.name, label: s.name }))} placeholder="All spaces" />
        <Select value={roleFilter} onChange={setRoleFilter}
          options={data.roles.map(r => ({ value: r.name, label: r.name }))} placeholder="All roles" />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-2.5">
          {STATUSES.map(status => {
            const items = filtered.filter(i => i.status === status)
            return (
              <div
                key={status}
                id={status}
                className="bg-surface/50 rounded-lg p-3 min-h-32 border border-border-glow"
              >
                <h3 className="text-xs font-semibold text-text-secondary mb-2 flex items-center justify-between">
                  {STATUS_LABELS[status]}
                  <span className="text-xs bg-border-glow/30 px-1.5 py-0.5 rounded-full">{items.length}</span>
                </h3>
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ItemCard
                        item={item}
                        canEdit={canEditItem(item.assigned_role, item.created_by_invite)}
                        spaceName={data.spaces.find(s => s.id === item.space_id)?.name}
                        onEdit={() => openEdit(item)}
                        onDelete={() => handleDelete(item.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <div className="text-xs text-text-muted text-center py-6">Drop items here</div>
                )}
              </div>
            )
          })}
        </div>
        <DragOverlay>
          {draggedItem && <ItemCard item={draggedItem} canEdit={false} onEdit={() => {}} onDelete={() => {}} />}
        </DragOverlay>
      </DndContext>

      <ItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
        roles={data.roles}
        spaces={data.spaces}
      />
    </div>
  )
}
