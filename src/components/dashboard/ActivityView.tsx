import type { Profile } from '../../lib/types'
import { getMemberColor } from '../../lib/constants'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'

interface ActivityViewProps {
  profiles: Profile[]
  onBack: () => void
}

function timeLabel(lastLogin: string | null): string {
  const now = Date.now()
  const login = lastLogin ? new Date(lastLogin).getTime() : 0
  const diff = login ? now - login : Infinity
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (!login) return 'never'
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function timeColor(lastLogin: string | null): string {
  if (!lastLogin) return 'text-muted-foreground'
  const diff = Date.now() - new Date(lastLogin).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return 'text-emerald-400'
  if (mins < 1440) return 'text-amber-400'
  return 'text-muted-foreground'
}

export function ActivityView({ profiles, onBack }: ActivityViewProps) {
  const sorted = [...profiles].sort((a, b) => {
    if (!a.last_login && !b.last_login) return a.name.localeCompare(b.name)
    if (!a.last_login) return 1
    if (!b.last_login) return -1
    return new Date(b.last_login).getTime() - new Date(a.last_login).getTime()
  })

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Member Activity</h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">
        {sorted.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-xs text-muted-foreground">No members yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-1">
            {sorted.map(p => {
              const label = timeLabel(p.last_login)
              const colorClass = timeColor(p.last_login)
              return (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold text-[13px] shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      backgroundColor: getMemberColor(p.name) + '20',
                      color: getMemberColor(p.name),
                      border: `2px solid ${getMemberColor(p.name)}40`,
                    }}
                  >
                    {p.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground block truncate">{p.name}</span>
                    {p.invite_code && (
                      <span className="text-[12px] text-muted-foreground truncate block">{p.invite_code}</span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs ${colorClass}`}>{label}</span>
                    {p.fee_paid && <div className="text-[13px] text-emerald-400">fee paid ✓</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
