import { Skeleton } from '../../../shared/components/Skeleton'
import { CARD_SURFACE } from '../../../shared/styles'

export function CharacterCardSkeleton() {
  return (
    <div className={`flex flex-col overflow-hidden ${CARD_SURFACE}`}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
