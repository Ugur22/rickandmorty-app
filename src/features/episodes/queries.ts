import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import { EPISODE_LIST_ITEM_FIELDS } from './components/EpisodeListItem'
import type { SearchEpisodesData, SearchEpisodesVars } from './types'

export const SEARCH_EPISODES: TypedDocumentNode<SearchEpisodesData, SearchEpisodesVars> = gql`
  query SearchEpisodes($page: Int, $name: String, $episode: String) {
    episodes(page: $page, filter: { name: $name, episode: $episode }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        ...EpisodeListItemFields
      }
    }
  }
  ${EPISODE_LIST_ITEM_FIELDS}
`
