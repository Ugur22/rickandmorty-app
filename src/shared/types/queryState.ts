import type { ErrorLike } from '@apollo/client'

export type QueryState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: T }

export function toQueryState<T>(
  loading: boolean,
  error: ErrorLike | undefined,
  data: T | undefined,
  isEmpty: (data: T) => boolean,
): QueryState<T> {
  if (loading) return { status: 'loading' }
  if (error) return { status: 'error', message: error.message }
  if (!data || isEmpty(data)) return { status: 'empty' }
  return { status: 'success', data }
}
