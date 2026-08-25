interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <div className="flex justify-center py-16 text-neutral-500">{message}</div>
}
