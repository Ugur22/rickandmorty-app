import type { PageInfo } from '../../shared/types/pageInfo'

export interface Episode {
  id: string
  name: string
  episode: string
  air_date: string
}

export interface SearchEpisodesData {
  episodes: {
    info: PageInfo
    results: Episode[]
  }
}

export interface SearchEpisodesVars {
  page: number
  name?: string
  episode?: string
}
