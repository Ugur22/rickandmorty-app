import type { PageInfo } from '../../shared/types/pageInfo'
import type { Episode } from '../episodes/types'

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export interface CharacterSummary {
  id: string
  name: string
  status: CharacterStatus
  species: string
  image: string
}

export interface CharacterDetail {
  id: string
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  image: string
  origin: { name: string }
  location: { name: string }
  episode: Episode[]
}

export interface SearchCharactersData {
  characters: {
    info: PageInfo
    results: CharacterSummary[]
  }
}

export interface SearchCharactersVars {
  page: number
  name?: string
}

export interface GetCharacterData {
  character: CharacterDetail
}

export interface GetCharacterVars {
  id: string
}
