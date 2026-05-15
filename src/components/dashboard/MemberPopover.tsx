import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Role } from '../../lib/types'
import { getMemberColor, ROLE_EMOJIS } from '../../lib/constants'
import { useCamp } from '../../context/CampContext'
import { Badge } from '../ui/badge'

interface MemberPopoverProps {
  personName: string
  triggerRect: DOMRect
  onClose: () => void
}

export function MemberPopover({ personName, triggerRect, onClose }: MemberPopoverProps) {
  const { data } = useCamp()
  const ref = useRef<HTMLDivElement>(null)

  const personRoles = data.roles.filter(
    (r) => r.lead === personName || r.key_support?.includes(personName),
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const left = Math.max(8, Math.min(triggerRect.left, window.innerWidth - 220 - 8))
  const top = (triggerRect.bottom + 6 + 120 > window.innerHeight)
    ? triggerRect.top - personRoles.length * 32 - 70
    : triggerRect.bottom + 6

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[300] glass-card rounded-xl p-3 min-w-[200px] max-w-[220px] border-border shadow-xl"
      style={{ top: Math.max(8, top), left }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center justify-center rounded-full font-bold text-[11px] shrink-0"
          style={{
            width: 26,
            height: 26,
            backgroundColor: getMemberColor(personName) + '20',
            color: getMemberColor(personName),
            border: `2px solid ${getMemberColor(personName)}40`,
          }}
        >
          {personName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
        </span>
        <span className="text-sm font-semibold text-foreground truncate">{personName}</span>
      </div>

      {personRoles.length === 0 ? (
        <p className="text-xs text-muted-foreground">No roles assigned.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {personRoles.map((r) => (
            <RoleLine key={r.id} role={r} personName={personName} />
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}

function RoleLine({ role, personName }: { role: Role; personName: string }) {
  const isLead = role.lead === personName
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="shrink-0">{ROLE_EMOJIS[role.name] || '📋'}</span>
      <span className="text-foreground truncate flex-1">{role.name}</span>
      <Badge variant={role.type === 'major' ? 'default' : 'secondary'} className="text-[9px] px-1 py-0 shrink-0">
        {isLead ? 'lead' : role.type === 'major' ? 'support' : role.type}
      </Badge>
    </div>
  )
}
