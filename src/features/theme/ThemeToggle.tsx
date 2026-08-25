import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleTheme } from './themeSlice'

export function ThemeToggle() {
  const mode = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`ml-auto inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ease-out motion-reduce:transition-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 ${
        isDark ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'
      }`}
    >
      <span
        className={`relative flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`absolute h-3.5 w-3.5 transition-all duration-300 motion-reduce:transition-none ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`absolute h-3.5 w-3.5 transition-all duration-300 motion-reduce:transition-none ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      </span>
    </button>
  )
}
