import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { match } from 'ts-pattern'
import { SearchInput } from '../../../shared/components/SearchInput'
import { Pagination } from '../../../shared/components/Pagination'
import { ErrorState } from '../../../shared/components/ErrorState'
import { EmptyState } from '../../../shared/components/EmptyState'
import { toQueryState } from '../../../shared/types/queryState'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { MIN_SEARCH_LENGTH } from '../../../shared/searchConfig'
import { SEARCH_EPISODES } from '../queries'
import { EpisodeListItem } from '../components/EpisodeListItem'
import { EpisodeListItemSkeleton } from '../components/EpisodeListItemSkeleton'
import { classifyEpisodeSearch } from '../utils/episodeSearchClassifier'
import type { SearchEpisodesVars } from '../types'

export function EpisodesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)
  const classification = classifyEpisodeSearch(debouncedSearch)
  // Only a name search needs gating — a "code" match already requires >= 3 chars by its regex.
  const isNameTooShort = classification.type === 'name' && classification.value.length < MIN_SEARCH_LENGTH

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const filterVariables: Omit<SearchEpisodesVars, 'page'> = match(classification)
    .with({ type: 'code' }, ({ value }) => ({ episode: value, name: undefined }))
    .with({ type: 'name' }, ({ value }) => ({ name: value, episode: undefined }))
    .with({ type: 'empty' }, () => ({ name: undefined, episode: undefined }))
    .exhaustive()

  const { loading, error, data } = useQuery(SEARCH_EPISODES, {
    variables: { page, ...filterVariables },
    skip: isNameTooShort,
  })

  const state = toQueryState(loading, error, data?.episodes, (d) => d.results.length === 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900">Episodes</h1>
      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or code (e.g. S01E01)…" />
      <div className="mt-6 flex flex-col gap-3">
        {isNameTooShort ? (
          <EmptyState message={`Keep typing… (at least ${MIN_SEARCH_LENGTH} characters)`} />
        ) : (
          match(state)
            .with({ status: 'loading' }, () => (
              <div role="status" aria-label="Loading episodes" className="flex flex-col gap-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <EpisodeListItemSkeleton key={index} />
                ))}
              </div>
            ))
            .with({ status: 'error' }, ({ message }) => <ErrorState message={message} />)
            .with({ status: 'empty' }, () => <EmptyState message="No episodes found." />)
            .with({ status: 'success' }, ({ data }) => (
              <>
                {data.results.map((episode) => (
                  <EpisodeListItem key={episode.id} episode={episode} />
                ))}
                <Pagination info={data.info} page={page} onPageChange={setPage} />
              </>
            ))
            .exhaustive()
        )}
      </div>
    </div>
  )
}
