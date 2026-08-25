import { Skeleton } from '../../../shared/components/Skeleton'
import { EpisodeListItemSkeleton } from '../../episodes/components/EpisodeListItemSkeleton'

const SKELETON_KEYS = Array.from({ length: 4 }, (_, index) => index)

export function CharacterDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading character">
      <div className="flex flex-col gap-6 sm:flex-row">
        <Skeleton className="h-48 w-48 shrink-0 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
      <Skeleton className="mt-8 mb-3 h-5 w-56" />
      <div className="flex flex-col gap-3">
        {SKELETON_KEYS.map((key) => (
          <EpisodeListItemSkeleton key={key} />
        ))}
      </div>
    </div>
  )
}
