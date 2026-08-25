import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { match } from 'ts-pattern'
import { ErrorState } from '../../../shared/components/ErrorState'
import { toQueryState } from '../../../shared/types/queryState'
import { GET_CHARACTER } from '../queries'
import { EpisodeListItem } from '../../episodes/components/EpisodeListItem'
import { CharacterDetailSkeleton } from '../components/CharacterDetailSkeleton'
import { STATUS_DOT } from '../statusDot'

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: { id: id! },
  })

  const state = toQueryState(loading, error, data?.character)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="mb-6 inline-block text-sm text-emerald-700 hover:underline">
        ← Back to characters
      </Link>
      {match(state)
        .with({ status: 'idle' }, { status: 'loading' }, () => <CharacterDetailSkeleton />)
        .with({ status: 'error' }, ({ message }) => <ErrorState message={message} />)
        .with({ status: 'empty' }, () => <ErrorState message="Character not found." />)
        .with({ status: 'success' }, ({ data: character }) => (
          <div>
            <div className="flex flex-col gap-6 sm:flex-row">
              <img
                src={character.image}
                alt={character.name}
                className="h-48 w-48 rounded-lg object-cover shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{character.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[character.status]}`} />
                  {character.status} · {character.species}
                  {character.type ? ` (${character.type})` : ''}
                </p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-neutral-500 dark:text-neutral-400">Gender</dt>
                  <dd className="text-neutral-900 dark:text-neutral-100">{character.gender}</dd>
                  <dt className="text-neutral-500 dark:text-neutral-400">Origin</dt>
                  <dd className="text-neutral-900 dark:text-neutral-100">{character.origin.name}</dd>
                  <dt className="text-neutral-500 dark:text-neutral-400">Last known location</dt>
                  <dd className="text-neutral-900 dark:text-neutral-100">{character.location.name}</dd>
                </dl>
              </div>
            </div>

            <h2 className="mt-8 mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Appears in {character.episode.length} episode{character.episode.length === 1 ? '' : 's'}
            </h2>
            <div className="flex flex-col gap-3">
              {character.episode.map((episode) => (
                <EpisodeListItem key={episode.id} episode={episode} />
              ))}
            </div>
          </div>
        ))
        .exhaustive()}
    </div>
  )
}
