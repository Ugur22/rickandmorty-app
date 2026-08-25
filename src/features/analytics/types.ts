import type { PageInfo } from '../../shared/types/pageInfo'

export interface AnalyticsEpisode {
  id: string
  name: string
  episode: string
  characters: { id: string }[]
}

export interface AnalyticsLocation {
  id: string
  name: string
  dimension: string
}

export interface AllEpisodesPageData {
  episodes: {
    info: PageInfo
    results: AnalyticsEpisode[]
  }
}

export interface AllLocationsPageData {
  locations: {
    info: PageInfo
    results: AnalyticsLocation[]
  }
}

export interface PageVars {
  page: number
}
