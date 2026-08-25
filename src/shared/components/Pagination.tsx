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

export function Pagination({ info, page, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        type="button"
        onClick={() => info.prev && onPageChange(info.prev)}
        disabled={!info.prev}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-neutral-100"
      >
        Previous
      </button>
      <span className="text-sm text-neutral-600">
        Page {page} of {info.pages}
      </span>
      <button
        type="button"
        onClick={() => info.next && onPageChange(info.next)}
        disabled={!info.next}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-neutral-100"
      >
        Next
      </button>
    </div>
  )
}
