import { Skeleton } from '../../../shared/components/Skeleton'
import { CARD_SURFACE } from '../../../shared/styles'

const SPARKLINE_ROW_KEYS = Array.from({ length: 5 }, (_, index) => index)

function ChartTileSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <Skeleton className="mb-1 h-4 w-28" />
      <div className={`${CARD_SURFACE} flex h-full flex-col p-4`}>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
        <Skeleton className="mt-4 min-h-[280px] flex-1" />
      </div>
    </div>
  )
}

export function AnalyticsBoardSkeleton() {
  return (
    <div role="status" aria-label="Loading analytics" className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
      <ChartTileSkeleton />
      <ChartTileSkeleton />
      <div className="flex h-full flex-col md:col-span-2">
        <Skeleton className="mb-1 h-4 w-28" />
        <div className={`${CARD_SURFACE} flex h-full flex-col p-4`}>
          <Skeleton className="h-5 w-52" />
          <Skeleton className="mt-2 h-4 w-72" />
          <div className="mt-2 flex flex-1 flex-col justify-center">
            {SPARKLINE_ROW_KEYS.map((key) => (
              <div
                key={key}
                className="flex items-center gap-4 border-b border-neutral-100 py-2.5 last:border-b-0 dark:border-neutral-800"
              >
                <Skeleton className="h-3 w-16 shrink-0" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
