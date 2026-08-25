import { describe, expect, it } from 'vitest'
import themeReducer, { toggleTheme } from './themeSlice'

describe('themeSlice', () => {
  it('toggles from light to dark and back', () => {
    const dark = themeReducer({ mode: 'light' }, toggleTheme())
    expect(dark.mode).toBe('dark')

    const light = themeReducer(dark, toggleTheme())
    expect(light.mode).toBe('light')
  })
})
