export type EpisodeSearchQuery =
  | { type: 'code'; value: string }
  | { type: 'name'; value: string }
  | { type: 'empty' }

const CODE_PATTERN = /^s?(\d{1,2})e(\d{1,2})$/i

export function classifyEpisodeSearch(input: string): EpisodeSearchQuery {
  const trimmed = input.trim()
  if (!trimmed) return { type: 'empty' }

  const match = trimmed.match(CODE_PATTERN)
  if (match) {
    return { type: 'code', value: `S${match[1].padStart(2, '0')}E${match[2].padStart(2, '0')}` }
  }

  return { type: 'name', value: trimmed }
}
