import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom doesn't implement matchMedia; themeSlice's system-preference fallback needs it.
window.matchMedia ??= ((query: string) => ({ matches: false, media: query })) as typeof window.matchMedia

afterEach(() => {
  cleanup()
})
