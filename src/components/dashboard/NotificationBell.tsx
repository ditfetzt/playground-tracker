import { useState, useRef, useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { Button } from '../ui/button'
import type { Notification } from '../../lib/types'

interface NotificationBellProps {
  notifications: Notification[]
  onRead: (id: string) => void
  onReadAll: () => void
  onNavigate: (linkTo: string | null) => void
}

export function NotificationBell({ notifications, onRead, onReadAll, onNavigate }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const unread = notifications.filter(n => !n.read_at)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} title="Notifications">
        <div className="relative">
          <Bell size={14} />
          {unread.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold bg-destructive text-white rounded-full px-0.5">
              {unread.length > 9 ? '9+' : unread.length}
            </span>
          )}
        </div>
      </Button>

      {open && (
        <>
          {/* Mobile: full-screen overlay */}
          <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setOpen(false)} />
          <div className={`
            fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-2xl bg-popover border border-border shadow-xl
            flex flex-col
            sm:absolute sm:inset-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2
            sm:w-[360px] sm:max-h-[480px] sm:rounded-xl
          `}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-sm font-bold">Notifications</span>
              <div className="flex items-center gap-1">
                {unread.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => { onReadAll(); setOpen(false) }}>
                    <Check size={12} className="mr-1" /> Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                  <X size={14} />
                </Button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No notifications yet.</p>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${n.read_at ? 'opacity-60 hover:bg-secondary/30' : 'bg-secondary/40 hover:bg-secondary/60'}`}
                    onClick={() => {
                      if (!n.read_at) onRead(n.id)
                      onNavigate(n.link_to)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${n.read_at ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-foreground">{n.title}</p>
                        {n.body && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(n.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
