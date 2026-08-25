import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { match } from 'ts-pattern'
import { SearchInput } from '../../../shared/components/SearchInput'
import { Pagination } from '../../../shared/components/Pagination'
import { ErrorState } from '../../../shared/components/ErrorState'
import { EmptyState } from '../../../shared/components/EmptyState'
import { toQueryState } from '../../../shared/types/queryState'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { MIN_SEARCH_LENGTH, minSearchLengthMessage } from '../../../shared/searchConfig'
import { SEARCH_CHARACTERS } from '../queries'
import { CharacterCard } from '../components/CharacterCard'
import { CharacterCardSkeleton } from '../components/CharacterCardSkeleton'

const GRID_CLASSES = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'
const SKELETON_KEYS = Array.from({ length: 8 }, (_, index) => index)

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

  const state = toQueryState(loading, error, data?.characters, (d) => d.results.length === 0, isSearchTooShort)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900">Characters</h1>
      <SearchInput value={search} onChange={setSearch} placeholder="Search characters by name…" />
      <div className="mt-6">
        {match(state)
          .with({ status: 'idle' }, () => <EmptyState message={minSearchLengthMessage()} />)
          .with({ status: 'loading' }, () => (
            <div role="status" aria-label="Loading characters" className={GRID_CLASSES}>
              {SKELETON_KEYS.map((key) => (
                <CharacterCardSkeleton key={key} />
              ))}
            </div>
          ))
          .with({ status: 'error' }, ({ message }) => <ErrorState message={message} />)
          .with({ status: 'empty' }, () => <EmptyState message="No characters found." />)
          .with({ status: 'success' }, ({ data }) => (
            <>
              <div className={GRID_CLASSES}>
                {data.results.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
              <Pagination info={data.info} page={page} onPageChange={setPage} />
            </>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
