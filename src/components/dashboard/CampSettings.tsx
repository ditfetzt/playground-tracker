import { useState, type FormEvent } from 'react'
import type { Profile } from '../../lib/types'
import { getMemberColor } from '../../lib/constants'
import { resetOnboardingForAll } from '../../lib/onboarding'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ArrowLeft, Plus, Trash2, RotateCcw, Eye, EyeOff, Check } from 'lucide-react'

interface CampSettingsProps {
  members: Profile[]
  onAdd: (name: string, code: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onBack: () => void
  currentProfileId: string | null
}

function generateCode() {
  const adj = ['dusty', 'neon', 'wild', 'lunar', 'solar', 'cosmic', 'funky', 'spark', 'glow', 'zen']
  const noun = ['phoenix', 'owl', 'fox', 'wolf', 'bear', 'hawk', 'lynx', 'deer', 'raven', 'newt']
  const a = adj[Math.floor(Math.random() * adj.length)]
  const n = noun[Math.floor(Math.random() * noun.length)]
  return `${a}-${n}`
}

function timeLabel(lastLogin: string | null): string {
  if (!lastLogin) return 'never'
  const diff = Date.now() - new Date(lastLogin).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(diff / 86400000)
  return `${days}d ago`
}

function onboardingLabel(p: Profile): { text: string; color: string } {
  if (p.onboarding_completed_at) return { text: 'Completed', color: 'text-emerald-400' }
  if (p.onboarding_dismissed_at) return { text: 'Dismissed', color: 'text-amber-400' }
  return { text: 'Not seen', color: 'text-muted-foreground' }
}

export function CampSettings({ members, onAdd, onDelete, onBack, currentProfileId }: CampSettingsProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [adding, setAdding] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showInviteCodes, setShowInviteCodes] = useState(false)

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

  const handleResetOnboarding = async () => {
    setResetting(true)
    await resetOnboardingForAll(currentProfileId || '')
    alert('Onboarding has been reset for all other members.\nThey will see the welcome prompt on their next login.')
    setResetting(false)
  }

  const sorted = [...members].sort((a, b) => {
    if (!a.last_login && !b.last_login) return a.name.localeCompare(b.name)
    if (!a.last_login) return 1
    if (!b.last_login) return -1
    return new Date(b.last_login).getTime() - new Date(a.last_login).getTime()
  })

  const dismissedCount = members.filter(p => p.onboarding_dismissed_at).length
  const completedCount = members.filter(p => p.onboarding_completed_at).length
  const unseenCount = members.filter(p => !p.onboarding_dismissed_at && !p.onboarding_completed_at).length

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Camp Settings</h1>
        <span className="text-xs text-muted-foreground">({members.length} members)</span>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr_300px] gap-4 min-h-0">
        <div className="overflow-y-auto hide-scrollbar min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">Members</h2>
            <button
              onClick={() => setShowInviteCodes(!showInviteCodes)}
              className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {showInviteCodes ? <EyeOff size={12} /> : <Eye size={12} />}
              {showInviteCodes ? 'Hide codes' : 'Show codes'}
            </button>
          </div>

          {sorted.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-xs text-muted-foreground">No members yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {sorted.map(m => {
                const onb = onboardingLabel(m)
                return (
                  <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors group">
                    <span
                      className="inline-flex items-center justify-center rounded-full font-bold text-[11px] shrink-0"
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
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-foreground truncate">{m.name}</span>
                        {m.is_admin && (
                          <span className="text-[10px] font-bold uppercase px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">Admin</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <span>{timeLabel(m.last_login)}</span>
                        {showInviteCodes && m.invite_code && (
                          <>
                            <span>·</span>
                            <span className="font-mono truncate">{m.invite_code}</span>
                          </>
                        )}
                        <span>·</span>
                        <span className={onb.color}>{onb.text}</span>
                        {m.fee_paid && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-400 flex items-center gap-0.5"><Check size={10} /> paid</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { if (confirm(`Remove ${m.name}?`)) onDelete(m.id) }}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 shrink-0">
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

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Onboarding</h3>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 text-center">
                <span className="block text-lg font-bold text-emerald-400">{completedCount}</span>
                <span className="text-[11px] text-muted-foreground">Completed</span>
              </div>
              <div className="flex-1 text-center">
                <span className="block text-lg font-bold text-amber-400">{dismissedCount}</span>
                <span className="text-[11px] text-muted-foreground">Dismissed</span>
              </div>
              <div className="flex-1 text-center">
                <span className="block text-lg font-bold text-muted-foreground">{unseenCount}</span>
                <span className="text-[11px] text-muted-foreground">Not seen</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={resetting}
              onClick={handleResetOnboarding}
            >
              <RotateCcw size={12} className="mr-1" />
              {resetting ? 'Resetting...' : 'Reset for everyone'}
            </Button>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">
              This forces the welcome prompt for all other members on their next login.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
