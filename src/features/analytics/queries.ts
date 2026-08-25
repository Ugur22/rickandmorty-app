import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { AllEpisodesPageData, AllLocationsPageData, PageVars } from './types'

export const ALL_EPISODES_PAGE: TypedDocumentNode<AllEpisodesPageData, PageVars> = gql`
  query AllEpisodesPage($page: Int) {
    episodes(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        episode
        characters {
          id
        }
      }
    }
  }
`

export const ALL_LOCATIONS_PAGE: TypedDocumentNode<AllLocationsPageData, PageVars> = gql`
  query AllLocationsPage($page: Int) {
    locations(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        dimension
      }
    }
  }
`
