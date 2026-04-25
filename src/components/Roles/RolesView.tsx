import { useCamp } from '../../context/CampContext'
import { EmptyState } from '../ui/EmptyState'

export function RolesView() {
  const { data } = useCamp()

  if (!data.roles.length) return <EmptyState icon="👥" message="No roles defined yet." />

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">👥 Roles</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
        {data.roles.map(r => (
          <div key={r.id} className="bg-card glass-card rounded-lg p-4 shadow-glow-purple/10">
            <h4 className="font-semibold text-sm">{r.name}</h4>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-1 ${
              r.type === 'major' ? 'glow-badge text-text-secondary' : 'btn-primary-pale text-glow-green'
            }`}>
              {r.type}
            </span>
            <div className="text-xs text-text-secondary mt-2 leading-relaxed">
              {r.lead && <div><strong>Lead:</strong> {r.lead}</div>}
              {r.key_support?.length > 0 && r.key_support[0] && (
                <div><strong>Support:</strong> {r.key_support.join(', ')}</div>
              )}
            </div>
            {r.status === 'vacant' && (
              <div className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-glow-ember/15 text-ember">
                Vacant — claim this role!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
