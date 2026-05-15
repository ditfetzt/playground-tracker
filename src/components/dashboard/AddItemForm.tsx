import { useState, type FormEvent } from 'react'
import type { SourcingType } from '../../lib/types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export interface NewItemState {
  name: string
  location: string
  sourcing: SourcingType
  value: string
  notes: string
  linkUrl: string
}

interface AddItemFormProps {
  roleName: string
  item: NewItemState
  onChange: (item: NewItemState) => void
  onSubmit: (e: FormEvent, roleName: string) => void
  onCancel: () => void
}

export function AddItemForm({ roleName, item, onChange, onSubmit, onCancel }: AddItemFormProps) {
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    if (!item.name.trim()) return
    if (item.sourcing === 'buy') {
      const v = parseFloat(item.value)
      if (!item.value.trim() || isNaN(v) || v <= 0) {
        setError('Value is required for Buy items')
        e.preventDefault()
        return
      }
    }
    setError('')
    onSubmit(e, roleName)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <Input
        value={item.name}
        onChange={e => onChange({ ...item, name: e.target.value })}
        placeholder="Item name"
        autoFocus
      />
      <div className={`grid ${item.sourcing === 'buy' ? 'grid-cols-2' : ''} gap-2`}>
        <Input
          value={item.location}
          onChange={e => onChange({ ...item, location: e.target.value })}
          placeholder="Current location"
        />
        {item.sourcing === 'buy' && (
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={item.value}
            onChange={e => { setError(''); onChange({ ...item, value: e.target.value }) }}
            placeholder="Value (CAD) *"
          />
        )}
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => { setError(''); onChange({ ...item, sourcing: 'buy' }) }}
          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            item.sourcing === 'buy'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => { setError(''); onChange({ ...item, sourcing: 'borrow' }) }}
          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            item.sourcing === 'borrow'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          Borrow
        </button>
      </div>
      {error && <p className="text-[13px] text-destructive">{error}</p>}
      <Input
        value={item.notes}
        onChange={e => onChange({ ...item, notes: e.target.value })}
        placeholder="Notes (optional)"
      />
      <Input
        value={item.linkUrl}
        onChange={e => onChange({ ...item, linkUrl: e.target.value })}
        placeholder="🔗 Link (optional)"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
