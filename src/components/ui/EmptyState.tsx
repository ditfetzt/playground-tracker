interface EmptyStateProps {
  icon: string
  message: string
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
      <span className="text-5xl mb-3">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
