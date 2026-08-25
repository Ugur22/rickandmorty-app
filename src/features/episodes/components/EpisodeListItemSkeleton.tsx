import { Skeleton } from '../../../shared/components/Skeleton'
import { CARD_SURFACE } from '../../../shared/styles'

export function EpisodeListItemSkeleton() {
  return (
    <div className={`flex items-center justify-between ${CARD_SURFACE} px-4 py-3`}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  )
}
