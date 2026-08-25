import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleTheme } from './themeSlice'

export function ThemeToggle() {
  const mode = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="ml-auto rounded-md border border-neutral-300 p-1.5 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
