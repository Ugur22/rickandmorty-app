interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex justify-center py-16 text-red-600 dark:text-red-400" role="alert">
      Something went wrong: {message}
    </div>
  )
}
