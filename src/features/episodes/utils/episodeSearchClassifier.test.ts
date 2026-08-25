import { describe, expect, it } from 'vitest'
import { classifyEpisodeSearch } from './episodeSearchClassifier'

describe('classifyEpisodeSearch', () => {
  it('normalizes an episode code regardless of casing or padding', () => {
    expect(classifyEpisodeSearch('S01E01')).toEqual({ type: 'code', value: 'S01E01' })
    expect(classifyEpisodeSearch('s1e1')).toEqual({ type: 'code', value: 'S01E01' })
  })

  it('treats non-code input as a name search', () => {
    expect(classifyEpisodeSearch('Pilot')).toEqual({ type: 'name', value: 'Pilot' })
  })

  it('treats blank input as empty', () => {
    expect(classifyEpisodeSearch('   ')).toEqual({ type: 'empty' })
  })
})
