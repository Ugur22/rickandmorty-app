import { describe, expect, it } from 'vitest'
import { castSizeByEpisode, locationCountByDimension } from './aggregate'
import type { AnalyticsEpisode, AnalyticsLocation } from '../types'

function episode(episode: string, name: string, characterCount: number): AnalyticsEpisode {
  return {
    id: episode,
    name,
    episode,
    characters: Array.from({ length: characterCount }, (_, index) => ({ id: `${episode}-${index}` })),
  }
}

function location(id: string, dimension: string): AnalyticsLocation {
  return { id, name: id, dimension }
}

describe('castSizeByEpisode', () => {
  it('maps each episode to its cast size, sorted by episode code', () => {
    const episodes = [episode('S01E02', 'Lawnmower Dog', 5), episode('S01E01', 'Pilot', 3)]

    expect(castSizeByEpisode(episodes)).toEqual([
      { code: 'S01E01', name: 'Pilot', count: 3 },
      { code: 'S01E02', name: 'Lawnmower Dog', count: 5 },
    ])
  })
})

describe('locationCountByDimension', () => {
  it('counts locations per dimension, sorted by count descending', () => {
    const locations = [
      location('1', 'Dimension C-137'),
      location('2', 'Dimension C-137'),
      location('3', 'Post-Apocalyptic Dimension'),
    ]

    expect(locationCountByDimension(locations)).toEqual([
      { dimension: 'Dimension C-137', count: 2 },
      { dimension: 'Post-Apocalyptic Dimension', count: 1 },
    ])
  })

  it('collapses inconsistent unknown-dimension sentinels into one Unknown bucket', () => {
    const locations = [location('1', ''), location('2', 'unknown'), location('3', 'Unknown dimension')]

    expect(locationCountByDimension(locations)).toEqual([{ dimension: 'Unknown', count: 3 }])
  })

  it('collapses overflow past topN into an Other bucket', () => {
    const locations = [
      location('1', 'A'),
      location('2', 'A'),
      location('3', 'B'),
      location('4', 'C'),
      location('5', 'D'),
    ]

    expect(locationCountByDimension(locations, 2)).toEqual([
      { dimension: 'A', count: 2 },
      { dimension: 'B', count: 1 },
      { dimension: 'Other', count: 2 },
    ])
  })
})
