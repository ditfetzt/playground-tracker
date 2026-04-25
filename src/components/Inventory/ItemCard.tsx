import { useDraggable } from '@dnd-kit/core'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { InventoryItem } from '../../lib/types'

interface ItemCardProps {
  item: InventoryItem
  canEdit: boolean
  spaceName?: string
  onEdit: () => void
  onDelete: () => void
}

const CAT_COLORS: Record<string, string> = {
  power: '#d4a84b', tools: '#5b7b5a', decor: '#d4733a',
  furniture: '#c4a882', crafts: '#5b4a6b', props: '#8b6a7a',
  equipment: '#4a7a7a', other: '#b0a090',
}

const SOURCE_ICONS: Record<string, string> = {
  borrow: '🤝', buy: '🛒', already_have: '✅',
}

export function ItemCard({ item, canEdit, spaceName, onEdit, onDelete }: ItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const meta: string[] = []
  if (item.qty_needed > 1) meta.push(`×${item.qty_needed}`)
  if (item.source_name) meta.push(`📎 ${item.source_name}`)
  if (item.storage_location) meta.push(`📦 ${item.storage_location}`)
  if (item.brought_by) meta.push(`🧑 ${item.brought_by}`)
  if (item.actual_cost) meta.push(`$${Number(item.actual_cost).toFixed(0)}`)
  else if (item.cost_estimate) meta.push(`~$${Number(item.cost_estimate).toFixed(0)}`)
  if (spaceName) meta.push(`📍 ${spaceName}`)

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: CAT_COLORS[item.category] || CAT_COLORS.other, opacity: isDragging ? 0.5 : 1 }}
      className="bg-card glass-card rounded-md px-3 py-2.5 mb-1.5 shadow-glow-purple/10 text-xs border-l-[3px] cursor-grab relative group hover:wobble transition-shadow"
    >
      <div className="flex items-start gap-1">
        <button {...attributes} {...listeners} className="mt-0.5 text-text-muted cursor-grab shrink-0">
          <GripVertical size={12} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-0.5 truncate">
            {SOURCE_ICONS[item.sourcing || ''] || ''} {item.name}
          </div>
          <div className="flex flex-wrap gap-1.5 text-text-secondary">
            <span className="text-[10px] font-semibold uppercase px-1 py-0.5 rounded bg-surface/50">{item.category}</span>
            {meta.map((m, i) => <span key={i} className="truncate">{m}</span>)}
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1 rounded hover:bg-card-hover/50 text-text-muted"><Pencil size={12} /></button>
            <button onClick={onDelete} className="p-1 rounded hover:bg-glow-ember/15 text-text-muted hover:text-glow-ember"><Trash2 size={12} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
