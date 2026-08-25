import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import { CHARACTER_CARD_FIELDS } from './components/CharacterCard'
import { EPISODE_LIST_ITEM_FIELDS } from '../episodes/components/EpisodeListItem'
import type { GetCharacterData, GetCharacterVars, SearchCharactersData, SearchCharactersVars } from './types'

export const SEARCH_CHARACTERS: TypedDocumentNode<SearchCharactersData, SearchCharactersVars> = gql`
  query SearchCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        ...CharacterCardFields
      }
    }
  }
  ${CHARACTER_CARD_FIELDS}
`

export const GET_CHARACTER: TypedDocumentNode<GetCharacterData, GetCharacterVars> = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      origin {
        name
      }
      location {
        name
      }
      episode {
        ...EpisodeListItemFields
      }
    }
  }
  ${EPISODE_LIST_ITEM_FIELDS}
`
