import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface PaginatorProps {
  page: number
  lastPage: number
  displayCount?: number
  query?: string
  enableQuickPaging?: boolean
  baseURL: string
}

// Shared box for every paginator cell (page numbers, prev/next, ellipsis):
// 32×32 on mobile, 36×36 from md up. tabular-nums keeps page digits aligned.
const cellClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm tabular-nums md:h-9 md:w-9'

const Paginator = ({ page, lastPage, displayCount = 5, query, baseURL }: PaginatorProps) => {
  const [pageList, setPageList] = useState<number[]>([])
  useEffect(() => {
    const prevPages = []
    const nextPages = []

    const minItemCount = Math.floor(displayCount / 2)

    for (let i = 0; i < minItemCount; i++) {
      const prevPage = page - minItemCount + i
      if (prevPage > 0) prevPages.push(prevPage)

      const nextPage = page + 1 + i
      if (nextPage <= lastPage) nextPages.push(nextPage)
    }

    setPageList([...prevPages, page, ...nextPages])
  }, [page, lastPage, displayCount])

  const buildURL = (target: number) => {
    let url = `${baseURL}/${target}`
    if (query) url += `?query=${query}`
    return url
  }

  // A non-current page link.
  const pageLink = (target: number) => (
    <a href={buildURL(target)} className={`${cellClass} text-text-muted hover:bg-bg-subtle hover:text-text-heading`}>
      {target}
    </a>
  )

  // Prev/Next arrow: a real link when in range, a disabled box at the bounds.
  const arrow = (direction: 'prev' | 'next') => {
    const disabled = direction === 'prev' ? page <= 1 : page >= lastPage
    const target = direction === 'prev' ? page - 1 : page + 1
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
    const label = direction === 'prev' ? 'Previous page' : 'Next page'

    if (disabled) {
      return (
        <span aria-disabled className={`${cellClass} pointer-events-none text-text-muted opacity-40`}>
          <Icon size={18} strokeWidth={1.5} />
        </span>
      )
    }

    return (
      <a href={buildURL(target)} aria-label={label} className={`${cellClass} text-text-muted hover:bg-bg-subtle hover:text-text-heading`}>
        <Icon size={18} strokeWidth={1.5} />
      </a>
    )
  }

  return (
    <nav aria-label="Pagination" className="mt-12 border-t border-divider pt-6">
      <ul role="list" className="flex list-none items-center justify-center gap-1 p-0">
        <li>{arrow('prev')}</li>

        {/* Desktop: full numbered list with leading/trailing ellipsis. */}
        {page > 1 && !pageList.includes(1) && (
          <>
            <li className="hidden md:inline-flex">{pageLink(1)}</li>
            <li aria-hidden className="hidden md:inline-flex">
              <span className={cellClass}>…</span>
            </li>
          </>
        )}

        {pageList.map((pageNum) => (
          <li key={pageNum} className="hidden md:inline-flex">
            {page === pageNum ? (
              <a
                href={buildURL(pageNum)}
                aria-current="page"
                className={`${cellClass} bg-accent-strong text-accent-on`}
              >
                {pageNum}
              </a>
            ) : (
              pageLink(pageNum)
            )}
          </li>
        ))}

        {page < lastPage && !pageList.includes(lastPage) && (
          <>
            <li aria-hidden className="hidden md:inline-flex">
              <span className={cellClass}>…</span>
            </li>
            <li className="hidden md:inline-flex">{pageLink(lastPage)}</li>
          </>
        )}

        {/* Mobile: compact "{page} / {lastPage}" indicator between the arrows. */}
        <li className="md:hidden">
          <span className="px-2 text-sm tabular-nums text-text-muted">
            {page} / {lastPage}
          </span>
        </li>

        <li>{arrow('next')}</li>
      </ul>
    </nav>
  )
}

export default Paginator
