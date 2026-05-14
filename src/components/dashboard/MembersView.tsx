import { useState, type FormEvent } from 'react'
import type { Profile } from '../../lib/types'
import { getMemberColor } from '../../lib/constants'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface MembersViewProps {
  members: Profile[]
  onAdd: (name: string, code: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onBack: () => void
}

function generateCode() {
  const adj = ['dusty', 'neon', 'wild', 'lunar', 'solar', 'cosmic', 'funky', 'spark', 'glow', 'zen']
  const noun = ['phoenix', 'owl', 'fox', 'wolf', 'bear', 'hawk', 'lynx', 'deer', 'raven', 'newt']
  const a = adj[Math.floor(Math.random() * adj.length)]
  const n = noun[Math.floor(Math.random() * noun.length)]
  return `${a}-${n}`
}

export function MembersView({ members, onAdd, onDelete, onBack }: MembersViewProps) {
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
    setOpen(false)
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Members</h1>
        <span className="text-xs text-muted-foreground">({members.length})</span>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr_280px] gap-4 min-h-0">
        <div className="overflow-y-auto hide-scrollbar">
          {members.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-xs text-muted-foreground">No members yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-1">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors group">
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold text-[13px] shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      backgroundColor: getMemberColor(m.name) + '20',
                      color: getMemberColor(m.name),
                      border: `2px solid ${getMemberColor(m.name)}40`,
                    }}
                  >
                    {m.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground block truncate">{m.name}</span>
                    <span className="text-[12px] text-muted-foreground truncate block">{m.invite_code}</span>
                  </div>
                  <button
                    onClick={() => { if (confirm(`Remove ${m.name}?`)) onDelete(m.id) }}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0">
          {open ? (
            <form onSubmit={handleAdd} className="flex flex-col gap-3 p-4 rounded-xl glass-card">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" autoFocus />
              <Input value={code} onChange={e => setCode(e.target.value)} placeholder={generateCode()} />
              <div className="flex gap-2">
                <Button type="submit" disabled={adding || !name.trim()}>{adding ? 'Adding...' : 'Add member'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setOpen(false); setName(''); setCode('') }}>Cancel</Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => { setOpen(true); setCode(generateCode()) }}>
              <Plus size={14} className="mr-1" /> Add member
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
