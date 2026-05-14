import { cn } from '../../lib/utils'

interface TabBarProps {
  tabs: { id: string; label: string; icon: string }[]
  activeTab: string
  onChange: (id: string) => void
}

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  return (
    <div className="sticky top-0 z-10 glass-card flex rounded-lg mb-4 overflow-hidden">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5',
            activeTab === tab.id
              ? 'text-foreground border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
          )}
        >
          <span className="text-sm">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
