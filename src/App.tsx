import { NavLink, Outlet } from 'react-router-dom'
import { ThemeToggle } from './features/theme/ThemeToggle'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive
      ? 'bg-emerald-600 text-white'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
  }`

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <span className="mr-4 font-semibold text-neutral-900 dark:text-neutral-100">Rick &amp; Morty Lookup</span>
          <NavLink to="/" end className={linkClasses}>
            Characters
          </NavLink>
          <NavLink to="/episodes" className={linkClasses}>
            Episodes
          </NavLink>
          <ThemeToggle />
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

export default App
