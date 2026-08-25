import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing/react'
import { CharactersPage } from './CharactersPage'
import { SEARCH_CHARACTERS } from '../queries'

const mocks = [
  {
    request: {
      query: SEARCH_CHARACTERS,
      variables: { page: 1, name: undefined },
    },
    result: {
      data: {
        characters: {
          info: { count: 2, pages: 1, next: null, prev: null },
          results: [
            {
              __typename: 'Character',
              id: '1',
              name: 'Rick Sanchez',
              status: 'Alive',
              species: 'Human',
              image: 'rick.png',
            },
            {
              __typename: 'Character',
              id: '2',
              name: 'Morty Smith',
              status: 'Alive',
              species: 'Human',
              image: 'morty.png',
            },
          ],
        },
      },
    },
  },
]

describe('CharactersPage', () => {
  it('shows a loading state and then the character results', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <CharactersPage />
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
  })

  it('shows a hint and skips the query while the search term is under the minimum length', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <CharactersPage />
        </MemoryRouter>
      </MockedProvider>,
    )

    await screen.findByText('Rick Sanchez')

    await userEvent.type(screen.getByPlaceholderText('Search characters by name…'), 'Ri')

    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument()
    expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument()
  })
})
