/* Kafka · Pagination */
import { type HTMLAttributes, type ReactNode } from 'react'
import { IconArrowLeft, IconArrowRight } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, starting at 1. */
  page: number
  pageCount: number
  /** Called with the new page. Use it for in-page paging (buttons). */
  onPageChange?: (page: number) => void
  /** Builds the URL of a page. When given, items are real links (`<a href>`): better for search engines and "open in a new tab". */
  hrefFor?: (page: number) => string
  /** Pages shown on each side of the current one. */
  siblings?: number
  label?: string
}

/** The pages to show: first, last, the current one and its neighbours, with `…` for the gaps. */
export function pageRange(page: number, count: number, siblings = 1): Array<number | 'gap'> {
  const total = siblings * 2 + 5
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1)
  const left = Math.max(page - siblings, 2), right = Math.min(page + siblings, count - 1)
  const out: Array<number | 'gap'> = [1]
  if (left > 2) out.push(left === 3 ? 2 : 'gap')
  for (let p = left; p <= right; p++) out.push(p)
  if (right < count - 1) out.push(right === count - 2 ? count - 1 : 'gap')
  out.push(count)
  return out
}

/** Moves between pages of results. The current page is `aria-current="page"`; every target is 44 px. */
export function Pagination({ page, pageCount, onPageChange, hrefFor, siblings = 1, label, className, ...rest }: PaginationProps) {
  const labels = useLabels()
  const item = 'kafka-type-pagination-type inline-flex size-(--kafka-pagination-item-size) items-center justify-center rounded-(--kafka-pagination-radius) no-underline'
  const go = (p: number, content: ReactNode, name: string, current = false, disabled = false) => {
    const cls = cx(focus, item, current ? 'bg-(--kafka-pagination-current-bg) font-bold text-(--kafka-pagination-current-fg)' : 'text-(--kafka-pagination-fg) hover:bg-(--kafka-pagination-hover-bg)', disabled && 'pointer-events-none opacity-(--kafka-pagination-disabled-opacity)')
    if (hrefFor && !disabled) return <a href={hrefFor(p)} aria-label={name} aria-current={current ? 'page' : undefined} className={cls}>{content}</a>
    return <button type="button" aria-label={name} aria-current={current ? 'page' : undefined} disabled={disabled} onClick={() => onPageChange?.(p)} className={cx(cls, 'cursor-pointer')}>{content}</button>
  }
  return (
    <nav aria-label={label ?? labels.pagination} className={className} {...rest}>
      <ul className="m-0 flex list-none flex-wrap items-center gap-(--kafka-pagination-gap) p-0">
        <li>{go(page - 1, <IconArrowLeft aria-hidden="true" className="size-(--kafka-size-icon-md)" />, labels.previousPage, false, page <= 1)}</li>
        {pageRange(page, pageCount, siblings).map((p, i) => (
          <li key={p === 'gap' ? `gap-${i}` : p}>
            {p === 'gap' ? <span aria-hidden="true" className={cx(item, 'text-(--kafka-pagination-ellipsis)')}>…</span> : go(p, p, labels.page(p), p === page)}
          </li>
        ))}
        <li>{go(page + 1, <IconArrowRight aria-hidden="true" className="size-(--kafka-size-icon-md)" />, labels.nextPage, false, page >= pageCount)}</li>
      </ul>
    </nav>
  )
}
