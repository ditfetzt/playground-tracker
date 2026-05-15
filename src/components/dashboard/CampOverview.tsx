import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { ChevronDown } from 'lucide-react'
import type { Role, InventoryItem, Profile } from '../../lib/types'
import { getMemberColor, CAMP_FEE_PER_PERSON, ART_GRANT, ROLE_EMOJIS } from '../../lib/constants'

interface CampOverviewProps {
  readyCount: number
  totalCount: number
  progressPct: number
  budgetUsed: number
  budgetTotal: number
  paidCount: number
  roles: Role[]
  items: InventoryItem[]
  profiles: Profile[]
  isAdmin: boolean
  onToggleFeePaid: (profileId: string) => void
  tourStepId?: string
}

const CONFETTI_KEY = 'playground_confetti_100'

const RING_RADIUS = 70
const RING_STROKE = 8
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
const RING_SIZE = (RING_RADIUS + RING_STROKE) * 2

export function CampOverview({
  readyCount,
  totalCount,
  progressPct,
  budgetUsed,
  budgetTotal,
  paidCount,
  roles,
  items,
  profiles,
  isAdmin,
  onToggleFeePaid,
  tourStepId,
}: CampOverviewProps) {
  const firedRef = useRef(false)
  const [showFees, setShowFees] = useState(false)
  const [showBuying, setShowBuying] = useState(false)
  const [showSourcing, setShowSourcing] = useState(false)
  const offset = RING_CIRCUMFERENCE - (progressPct / 100) * RING_CIRCUMFERENCE

  useEffect(() => {
    if (progressPct === 100 && (totalCount + profiles.length) > 0 && !localStorage.getItem(CONFETTI_KEY)) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
      localStorage.setItem(CONFETTI_KEY, '1')
      firedRef.current = true
    }
    if (progressPct < 100 && localStorage.getItem(CONFETTI_KEY)) {
      localStorage.removeItem(CONFETTI_KEY)
    }
  }, [progressPct, totalCount, profiles.length])

  useEffect(() => {
    const feesIds = new Set(['camp-fees', 'fee-toggle'])
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowFees(feesIds.has(tourStepId ?? ''))
    setShowBuying(tourStepId === 'needs-buying')
    setShowSourcing(tourStepId === 'needs-sourcing')
  }, [tourStepId])

  const roleReadiness = roles
    .map(role => {
      const roleItems = items.filter(i => i.assigned_role === role.name)
      const ready = roleItems.filter(i => i.status === 'acquired').length
      return { role, ready, total: roleItems.length, pct: roleItems.length ? Math.round((ready / roleItems.length) * 100) : 0 }
    })
    .sort((a, b) => b.pct - a.pct)

  const feeCollected = paidCount * CAMP_FEE_PER_PERSON

  const buyingItems = items.filter(i => i.status === 'needed' && i.sourcing === 'buy')
  const sourcingItems = items.filter(i => i.status === 'needed' && i.sourcing !== 'buy')

  const UrgentItem = ({ item }: { item: InventoryItem }) => {
    const role = roles.find(r => r.name === item.assigned_role)
    return (
      <div className="flex flex-col gap-0.5 py-1.5 px-2 rounded bg-secondary/20 border border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground">{item.name}</span>
          {role && (
            <span className="text-[12px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{role.name}</span>
          )}
          {item.sourcing === 'buy' && (item.actual_cost ? (
            <span className="text-[13px] font-semibold text-amber-600 dark:text-amber-400">${item.actual_cost}</span>
          ) : item.cost_estimate ? (
            <span className="text-[13px] text-muted-foreground">~${item.cost_estimate}</span>
          ) : null)}
          {item.sourcing !== 'buy' && (
            <span className="text-[12px] font-bold px-1 py-0.5 rounded border bg-secondary text-muted-foreground border-border">
              {item.sourcing === 'borrow' ? 'Borrow' : 'Have'}
            </span>
          )}
        </div>
        {(item.storage_location || item.notes) && (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground flex-wrap">
            {item.storage_location && <span>📍 {item.storage_location}</span>}
            {item.notes && <span className="truncate max-w-[200px]">📝 {item.notes}</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress Ring */}
      <div data-tour-target="progress-ring" className="relative flex items-center justify-center">
        <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke="var(--color-secondary)" strokeWidth={RING_STROKE} />
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke="var(--color-primary)" strokeWidth={RING_STROKE} strokeLinecap="round" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-foreground">{progressPct}%</span>
          <span className="text-[13px] text-muted-foreground uppercase tracking-widest">Camp Ready</span>
        </div>
      </div>

      {/* Budget bar */}
      <div className="bg-secondary/10 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">Budget</span>
          <span className="text-xs font-mono text-foreground">
            ${budgetUsed.toFixed(0)} <span className="text-muted-foreground">/ ${budgetTotal.toLocaleString()}</span>
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-emerald-500/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min((budgetUsed / budgetTotal) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Art Grant ${ART_GRANT.toLocaleString()} + {profiles.length} members × ${CAMP_FEE_PER_PERSON} = ${budgetTotal.toLocaleString()}
        </p>
      </div>

      {/* E-transfer */}
      <div className="glass-card p-3 text-center border-primary/20">
        <p className="text-[13px] text-muted-foreground">
          E-transfer camp fees to{' '}
          <span className="text-foreground font-bold">hi@builtwithmaxim.com</span> or pay in Cash
        </p>
      </div>

      {/* Camp Fees */}
      {profiles.length > 0 && (
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Camp Fees</h3>
          <div className="glass-card border-border">
            <button data-tour-target="camp-fees" onClick={() => setShowFees(!showFees)} className="w-full p-3 flex items-center gap-2 text-left">
              <span className="text-xs text-muted-foreground flex-1">
                <span className="font-semibold text-foreground">{paidCount}/{profiles.length}</span> paid · ${feeCollected} collected
              </span>
              <ChevronDown size={12} className={`text-muted-foreground transition-transform shrink-0 ${showFees ? 'rotate-180' : ''}`} />
            </button>
            {showFees && (
              <div className="px-3 pb-3">
                <div className="grid grid-cols-3 gap-1">
                  {profiles.map((p, idx) => (
                    <span key={p.id} data-tour-target={idx === 0 ? 'fee-toggle' : undefined}>
                      <button disabled={!isAdmin} onClick={() => onToggleFeePaid(p.id)}
                        className={`flex items-center gap-1 px-1.5 py-1 rounded text-[13px] transition-colors ${isAdmin ? 'cursor-pointer hover:bg-secondary/50' : 'cursor-default'} ${p.fee_paid ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                        <span className="inline-flex items-center justify-center rounded-full font-bold text-[7px] shrink-0" style={{ width: 16, height: 16, backgroundColor: getMemberColor(p.name) + '20', color: getMemberColor(p.name) }}>
                          {p.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                        <span className="truncate">{p.name}</span>
                        <span className="ml-auto shrink-0">{p.fee_paid ? '✓' : '○'}</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items section */}
      {totalCount > 0 && (
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Items · {readyCount}/{totalCount} ready
          </h3>

          {buyingItems.length > 0 && (
            <div className="glass-card border-amber-500/20 mb-2">
              <button data-tour-target="needs-buying" onClick={() => setShowBuying(!showBuying)} className="w-full p-3 flex items-center gap-2 text-left">
                <span className="text-xs text-muted-foreground flex-1">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{buyingItems.length}</span> need buying
                </span>
                <ChevronDown size={12} className={`text-muted-foreground transition-transform shrink-0 ${showBuying ? 'rotate-180' : ''}`} />
              </button>
              {showBuying && (
                <div className="px-3 pb-3 flex flex-col gap-2">
                  {buyingItems.map(item => <UrgentItem key={item.id} item={item} />)}
                </div>
              )}
            </div>
          )}

          {sourcingItems.length > 0 && (
            <div className="glass-card border-border">
              <button data-tour-target="needs-sourcing" onClick={() => setShowSourcing(!showSourcing)} className="w-full p-3 flex items-center gap-2 text-left">
                <span className="text-xs text-muted-foreground flex-1">
                  <span className="font-semibold text-foreground">{sourcingItems.length}</span> need sourcing
                </span>
                <ChevronDown size={12} className={`text-muted-foreground transition-transform shrink-0 ${showSourcing ? 'rotate-180' : ''}`} />
              </button>
              {showSourcing && (
                <div className="px-3 pb-3 flex flex-col gap-2">
                  {sourcingItems.map(item => <UrgentItem key={item.id} item={item} />)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Role Leaderboard */}
      {roleReadiness.length > 0 && (
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Role Readiness</h3>
          <div className="flex flex-col gap-1">
            {roleReadiness.filter(rr => rr.total > 0).map((rr) => (
              <div key={rr.role.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-secondary/30 transition-colors">
                <span className="text-sm w-5 text-center shrink-0">
                  {ROLE_EMOJIS[rr.role.name] || '📋'}
                </span>
                <span className="text-xs text-foreground flex-1 truncate">{rr.role.name}</span>
                <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden shrink-0">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${rr.pct}%` }} />
                </div>
                <span className="text-[13px] font-mono text-muted-foreground w-10 text-right shrink-0">{rr.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
