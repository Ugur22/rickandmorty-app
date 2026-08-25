import type { ThemeMode } from './themeSlice'
import { THEME_STORAGE_KEY } from './themeSlice'

interface ThemeStore {
  getState: () => { theme: { mode: ThemeMode } }
  subscribe: (listener: () => void) => void
}

// Applies the current theme to <html> and persists explicit changes, kept
// independent of whichever component happens to mount rather than tied to
// App's render lifecycle. Called once, synchronously, before the app renders
// so the correct class is already in place for the first paint.
export function syncThemeToDom(store: ThemeStore) {
  let lastMode = store.getState().theme.mode
  document.documentElement.classList.toggle('dark', lastMode === 'dark')

  store.subscribe(() => {
    const mode = store.getState().theme.mode
    if (mode === lastMode) return
    lastMode = mode
    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  })
}
