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
import { SEARCH_CHARACTERS } from '../queries'
import { CharacterCard } from '../components/CharacterCard'
import { CharacterCardSkeleton } from '../components/CharacterCardSkeleton'

export function CharactersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)
  const trimmedSearch = debouncedSearch.trim()
  const isSearchTooShort = trimmedSearch.length > 0 && trimmedSearch.length < MIN_SEARCH_LENGTH

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { loading, error, data } = useQuery(SEARCH_CHARACTERS, {
    variables: { page, name: trimmedSearch || undefined },
    skip: isSearchTooShort,
  })

  const state = toQueryState(loading, error, data?.characters, (d) => d.results.length === 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900">Characters</h1>
      <SearchInput value={search} onChange={setSearch} placeholder="Search characters by name…" />
      <div className="mt-6">
        {isSearchTooShort ? (
          <EmptyState message={`Keep typing… (at least ${MIN_SEARCH_LENGTH} characters)`} />
        ) : (
          match(state)
            .with({ status: 'loading' }, () => (
              <div
                role="status"
                aria-label="Loading characters"
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <CharacterCardSkeleton key={index} />
                ))}
              </div>
            ))
            .with({ status: 'error' }, ({ message }) => <ErrorState message={message} />)
            .with({ status: 'empty' }, () => <EmptyState message="No characters found." />)
            .with({ status: 'success' }, ({ data }) => (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {data.results.map((character) => (
                    <CharacterCard key={character.id} character={character} />
                  ))}
                </div>
                <Pagination info={data.info} page={page} onPageChange={setPage} />
              </>
            ))
            .exhaustive()
        )}
      </div>
    </div>
  )
}
