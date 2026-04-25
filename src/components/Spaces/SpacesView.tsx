import { useCamp } from '../../context/CampContext'
import { EmptyState } from '../ui/EmptyState'

export function SpacesView() {
  const { data } = useCamp()

  if (!data.spaces.length) return <EmptyState icon="🗺️" message="No spaces defined yet." />

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">🗺️ Spaces</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
        {data.spaces.map(s => {
          const spaceItems = data.items.filter(i => i.space_id === s.id)
          const total = spaceItems.length
          const done = spaceItems.filter(i => i.status === 'on_site' || i.status === 'acquired').length
          const pct = total ? Math.round(done / total * 100) : 0
          return (
            <div key={s.id} className="bg-card glass-card rounded-lg p-4 shadow-glow-purple/10">
              <h4 className="font-semibold text-sm">{s.name}</h4>
              <div className="text-xs text-text-secondary mt-2 leading-relaxed">
                {s.curators?.length > 0 && s.curators[0] && (
                  <div><strong>Curators:</strong> {s.curators.join(', ')}</div>
                )}
                {s.description && <div className="text-text-muted mt-1">{s.description}</div>}
                <div className="mt-2"><strong>Readiness:</strong> {done}/{total} items ({pct}%)</div>
                <div className="h-1.5 bg-border-glow/30 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full btn-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
