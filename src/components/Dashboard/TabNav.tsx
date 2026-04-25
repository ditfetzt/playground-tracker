import { Package, DollarSign, Users, Map, Timer, Ticket } from 'lucide-react'

export interface TabDef {
  id: string
  label: string
  icon: typeof Package
}

export const TABS: TabDef[] = [
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'roles', label: 'Roles', icon: Users },
  { id: 'spaces', label: 'Spaces', icon: Map },
  { id: 'volunteers', label: 'Hours', icon: Timer },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
]

interface TabNavProps {
  active: string
  onChange: (id: string) => void
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="flex gap-1 bg-card glass-card rounded-lg p-1 shadow-glow-purple/10 mb-4 overflow-x-auto">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              active === tab.id
                ? 'tab-active text-text'
                : 'text-text-secondary hover:bg-card-hover/50 hover:text-text'
          }`}
        >
          <tab.icon size={15} />
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
