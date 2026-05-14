interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No items yet.' }: EmptyStateProps) {
  return (
    <p className="text-xs text-muted-foreground py-2">{message}</p>
  )
}
