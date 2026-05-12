import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './Paginator.module.scss'

export interface PaginatorProps {
  page: number
  lastPage: number
  displayCount?: number
  query?: string
  enableQuickPaging?: boolean
  baseURL: string
}

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

  useEffect(() => {}, [])

  const buildURL = (page: number) => {
    let url = `${baseURL}/${page}`
    if (query) url += `?query=${query}`

    return url
  }

  return (
    <div className={styles.container}>
      <ul>
        {page > 1 && (
          <li>
            <a href={buildURL(page - 1)}>
              <ChevronLeft />
            </a>
          </li>
        )}

        {page > 1 && !pageList.includes(1) && (
          <>
            <li>
              <a href={buildURL(1)}>{1}</a>
            </li>
            <MoreHorizontal />
          </>
        )}

        {pageList.map((pageNum) => (
          <li key={pageNum}>
            <a href={buildURL(pageNum)} className={page === pageNum ? styles.currentPage : ''}>
              {pageNum}
            </a>
          </li>
        ))}

        {page < lastPage && !pageList.includes(lastPage) && (
          <>
            <MoreHorizontal />
            <li>
              <a href={buildURL(lastPage)}>{lastPage}</a>
            </li>
          </>
        )}
        {page < lastPage && (
          <li>
            <a href={buildURL(page + 1)}>
              <ChevronRight />
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Paginator
