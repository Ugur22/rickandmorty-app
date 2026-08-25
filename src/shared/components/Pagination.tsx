interface PaginationInfo {
  pages: number
  next: number | null
  prev: number | null
}

interface PaginationProps {
  info: PaginationInfo
  page: number
  onPageChange: (page: number) => void
}

const BUTTON_CLASSES =
  'rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'

export function Pagination({ info, page, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        type="button"
        onClick={() => info.prev && onPageChange(info.prev)}
        disabled={!info.prev}
        className={BUTTON_CLASSES}
      >
        Previous
      </button>
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        Page {page} of {info.pages}
      </span>
      <button
        type="button"
        onClick={() => info.next && onPageChange(info.next)}
        disabled={!info.next}
        className={BUTTON_CLASSES}
      >
        Next
      </button>
    </div>
  )
}
