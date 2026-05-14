import { useState, type FormEvent } from 'react'
import type { Profile } from '../../lib/types'
import { getMemberColor } from '../../lib/constants'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Plus, Trash2, Users } from 'lucide-react'

interface MembersSectionProps {
  members: Profile[]
  onAdd: (name: string, code: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function generateCode() {
  const adj = ['dusty', 'neon', 'wild', 'lunar', 'solar', 'cosmic', 'funky', 'spark', 'glow', 'zen']
  const noun = ['phoenix', 'owl', 'fox', 'wolf', 'bear', 'hawk', 'lynx', 'deer', 'raven', 'newt']
  const a = adj[Math.floor(Math.random() * adj.length)]
  const n = noun[Math.floor(Math.random() * noun.length)]
  return `${a}-${n}`
}

export function MembersSection({ members, onAdd, onDelete }: MembersSectionProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    await onAdd(name.trim(), code.trim() || generateCode())
    setName('')
    setCode('')
    setAdding(false)
  }

  const activeMembers = members.filter(m => m.active)

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-1.5">
        <Users size={12} /> Members ({activeMembers.length})
      </h3>

      <div className="flex flex-col gap-0.5">
        {activeMembers.map(m => (
          <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/30 transition-colors group">
            <span
              className="inline-flex items-center justify-center rounded-full font-bold text-[7px] shrink-0"
              style={{
                width: 20,
                height: 20,
                backgroundColor: getMemberColor(m.name) + '20',
                color: getMemberColor(m.name),
              }}
            >
              {m.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
            <span className="text-xs text-foreground flex-1 truncate">{m.name}</span>
            <span className="text-[12px] text-muted-foreground hidden sm:inline">{m.invite_code}</span>
            <button
              onClick={() => { if (confirm(`Remove ${m.name}?`)) onDelete(m.id) }}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
              title="Remove member"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {open ? (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 p-3 rounded bg-secondary/20 border border-border">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            autoFocus
          />
          <Input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={generateCode()}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={adding || !name.trim()}>
              {adding ? 'Adding...' : 'Add'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); setName(''); setCode('') }}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="link" size="sm" className="h-auto p-0 self-start" onClick={() => { setOpen(true); setCode(generateCode()) }}>
          <Plus size={13} className="mr-1" /> Add member
        </Button>
      )}
    </div>
  )
}
