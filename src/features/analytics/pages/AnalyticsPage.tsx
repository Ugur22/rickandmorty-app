import { ErrorState } from '../../../shared/components/ErrorState'
import { EmptyState } from '../../../shared/components/EmptyState'
import { useFetchAllPages } from '../hooks/useFetchAllPages'
import { ALL_EPISODES_PAGE, ALL_LOCATIONS_PAGE } from '../queries'
import { AnalyticsBoard } from '../components/AnalyticsBoard'
import { AnalyticsBoardSkeleton } from '../components/AnalyticsBoardSkeleton'

export function AnalyticsPage() {
  const episodesState = useFetchAllPages(ALL_EPISODES_PAGE, (data) => data.episodes)
  const locationsState = useFetchAllPages(ALL_LOCATIONS_PAGE, (data) => data.locations)

  const errorState =
    episodesState.status === 'error' ? episodesState : locationsState.status === 'error' ? locationsState : null
  const isEmpty = episodesState.status === 'empty' || locationsState.status === 'empty'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Analytics</h1>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Aggregated across every episode and location in the API — drag a tile to reorder the board.
      </p>
      {errorState ? (
        <ErrorState message={errorState.message} />
      ) : isEmpty ? (
        <EmptyState message="No data available." />
      ) : episodesState.status === 'success' && locationsState.status === 'success' ? (
        <AnalyticsBoard episodes={episodesState.data} locations={locationsState.data} />
      ) : (
        <AnalyticsBoardSkeleton />
      )}
    </div>
  )
}
