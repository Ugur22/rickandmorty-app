import type { AnalyticsEpisode, AnalyticsLocation } from '../types'

export interface EpisodeCastSize {
  code: string
  name: string
  count: number
}

export function castSizeByEpisode(episodes: AnalyticsEpisode[]): EpisodeCastSize[] {
  return episodes
    .map((episode) => ({ code: episode.episode, name: episode.name, count: episode.characters.length }))
    .sort((a, b) => a.code.localeCompare(b.code))
}

export interface DimensionCount {
  dimension: string
  count: number
}

const UNKNOWN_DIMENSION = 'Unknown'
const OTHER_DIMENSION = 'Other'
// The API uses several inconsistent sentinels for "no known dimension" across
// different location entries ('', 'unknown', 'Unknown dimension') — collapse
// them into one bucket so the chart shows the true single largest "unknown"
// group instead of three misleadingly small ones.
const UNKNOWN_DIMENSION_PATTERN = /^unknown\b/i

export function locationCountByDimension(locations: AnalyticsLocation[], topN = 10): DimensionCount[] {
  const counts = new Map<string, number>()
  for (const location of locations) {
    const trimmed = location.dimension.trim()
    const dimension = !trimmed || UNKNOWN_DIMENSION_PATTERN.test(trimmed) ? UNKNOWN_DIMENSION : trimmed
    counts.set(dimension, (counts.get(dimension) ?? 0) + 1)
  }

  const sorted = [...counts.entries()]
    .map(([dimension, count]) => ({ dimension, count }))
    .sort((a, b) => b.count - a.count)

  if (sorted.length <= topN) return sorted

  const top = sorted.slice(0, topN)
  const otherCount = sorted.slice(topN).reduce((sum, entry) => sum + entry.count, 0)
  return [...top, { dimension: OTHER_DIMENSION, count: otherCount }]
}
