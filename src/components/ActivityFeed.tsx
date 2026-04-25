import { useCamp } from '../context/CampContext'

export function ActivityFeed() {
  const { data } = useCamp()

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mt-4 max-h-48 overflow-y-auto">
      <h3 className="text-sm font-semibold text-ink-secondary mb-2">📜 Activity</h3>
      {data.activityLog.length === 0 ? (
        <p className="text-xs text-ink-muted">No activity yet.</p>
      ) : (
        data.activityLog.slice(0, 20).map(a => {
          const p = data.profiles.find(pp => pp.invite_code === a.created_by_invite)
          const name = p?.name || 'Someone'
          const time = a.created_at
            ? new Date(a.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
            : ''
          return (
            <div key={a.id} className="text-xs py-1.5 border-t border-surface first:border-t-0 flex gap-2 text-ink-secondary">
              <span className="font-mono text-ink-muted whitespace-nowrap shrink-0">{time}</span>
              <span><strong className="text-ink">{name}</strong> {a.message}</span>
            </div>
          )
        })
      )}
    </div>
  )
}
