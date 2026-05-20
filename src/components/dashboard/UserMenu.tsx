import { useState, useRef, useEffect } from 'react'
import { Settings, HelpCircle, Palette, LogOut } from 'lucide-react'
import { getMemberColor } from '../../lib/constants'

interface UserMenuProps {
  name: string
  isAdmin: boolean
  onSettings: () => void
  onHelp: () => void
  onToggleTheme: () => void
  onLogout: () => void
}

export function UserMenu({ name, isAdmin, onSettings, onHelp, onToggleTheme, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const initials = name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const color = getMemberColor(name)

  const menuItem = (icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean) => (
    <button
      key={label}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors ${
        danger
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-secondary/60'
      }`}
      onClick={() => { onClick(); setOpen(false) }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-full font-bold text-[13px] shrink-0 transition-transform hover:scale-105"
        style={{
          width: 32,
          height: 32,
          backgroundColor: color + '20',
          color: color,
          border: `2px solid ${color}40`,
        }}
        title={name}
      >
        {initials}
      </button>

      {open && (
        <>
          {/* Mobile overlay */}
          <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setOpen(false)} />
          <div className={`
            fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-popover border border-border shadow-xl p-3 pb-6
            flex flex-col gap-1
            sm:absolute sm:inset-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2
            sm:w-56 sm:rounded-xl sm:p-2 sm:pb-2
          `}>
            {/* Profile header */}
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <span
                className="inline-flex items-center justify-center rounded-full font-bold text-[13px] shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: color + '20',
                  color: color,
                  border: `2px solid ${color}40`,
                }}
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{name}</p>
                <p className="text-[11px] text-muted-foreground">Member</p>
              </div>
            </div>

            <div className="h-px bg-border mx-1 my-1" />

            {isAdmin && menuItem(<Settings size={14} />, 'Camp Settings', onSettings)}
            {menuItem(<HelpCircle size={14} />, 'Help', onHelp)}
            {menuItem(<Palette size={14} />, 'Switch theme', onToggleTheme)}

            <div className="h-px bg-border mx-1 my-1" />

            {menuItem(<LogOut size={14} />, 'Log out', onLogout, true)}
          </div>
        </>
      )}
    </div>
  )
}
