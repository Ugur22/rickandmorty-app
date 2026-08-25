import { memo } from 'react'
import { gql } from '@apollo/client'
import type { Episode } from '../types'

// Colocated with the component so any query feeding EpisodeListItem stays in
// sync with what it actually renders — change the fields in one place.
export const EPISODE_LIST_ITEM_FIELDS = gql`
  fragment EpisodeListItemFields on Episode {
    id
    name
    episode
    air_date
  }
`

interface EpisodeListItemProps {
  episode: Episode
}

export const EpisodeListItem = memo(function EpisodeListItem({ episode }: EpisodeListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="font-medium text-neutral-900">{episode.name}</p>
        <p className="text-sm text-neutral-500">{episode.air_date}</p>
      </div>
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        {episode.episode}
      </span>
    </div>
  )
})
