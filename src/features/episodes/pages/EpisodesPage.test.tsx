import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing/react'
import { EpisodesPage } from './EpisodesPage'
import { SEARCH_EPISODES } from '../queries'

function episodeMock(variables: { page: number; name?: string; episode?: string }, name: string, code: string) {
  return {
    request: { query: SEARCH_EPISODES, variables },
    result: {
      data: {
        episodes: {
          info: { count: 1, pages: 1, next: null, prev: null },
          results: [{ __typename: 'Episode', id: '1', name, episode: code, air_date: 'December 2, 2013' }],
        },
      },
    },
  }
}

describe('EpisodesPage', () => {
  it('searches by episode code when the input matches the code pattern', async () => {
    const mocks = [episodeMock({ page: 1, name: undefined, episode: 'S01E01' }, 'Pilot', 'S01E01')]

    render(
      <MockedProvider mocks={mocks}>
        <EpisodesPage />
      </MockedProvider>,
    )

    await userEvent.type(screen.getByPlaceholderText(/search by name or code/i), 'S01E01')

    expect(await screen.findByText('Pilot')).toBeInTheDocument()
  })

  it('searches by name when the input does not match the code pattern', async () => {
    const mocks = [episodeMock({ page: 1, name: 'Pilot', episode: undefined }, 'Pilot', 'S01E01')]

    render(
      <MockedProvider mocks={mocks}>
        <EpisodesPage />
      </MockedProvider>,
    )

    await userEvent.type(screen.getByPlaceholderText(/search by name or code/i), 'Pilot')

    expect(await screen.findByText('S01E01')).toBeInTheDocument()
  })

  it('shows a hint and skips the query while a name search is under the minimum length', async () => {
    const mocks = [episodeMock({ page: 1, name: undefined, episode: undefined }, 'Pilot', 'S01E01')]

    render(
      <MockedProvider mocks={mocks}>
        <EpisodesPage />
      </MockedProvider>,
    )

    await screen.findByText('Pilot')

    await userEvent.type(screen.getByPlaceholderText(/search by name or code/i), 'Pi')

    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument()
    expect(screen.queryByText('Pilot')).not.toBeInTheDocument()
  })
})
