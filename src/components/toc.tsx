/* Kafka · TableOfContents */
import { useEffect, useState, type HTMLAttributes } from 'react'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface TocItem {
  /** Id of the heading in the text; the link goes to `#id`. */
  id: string
  label: string
  /** Heading level: 2 is a top-level entry, 3 is indented. */
  level?: 2 | 3
}

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  items: TocItem[]
  /** Heading above the list. Defaults to the localised "On this page". */
  title?: string
  /** Id of the section that is current. When omitted, the component watches the headings as the reader scrolls. */
  activeId?: string
}

/** The sections of a text, with the current one marked. A navigation landmark with a list of links. */
export function TableOfContents({ items, title, activeId, className, ...rest }: TableOfContentsProps) {
  const labels = useLabels()
  const [observed, setObserved] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (activeId !== undefined || typeof IntersectionObserver === 'undefined') return
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setObserved(visible.target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items, activeId])
  const current = activeId ?? observed
  const heading = title ?? labels.tocTitle
  return (
    <nav aria-label={heading} className={cx('flex flex-col', className)} {...rest}>
      <p aria-hidden="true" className="kafka-type-toc-title-type mb-(--kafka-prose-heading-gap) text-(--kafka-toc-title)">{heading}</p>
      <ol className="flex list-none flex-col border-l-(length:--kafka-toc-rule-width) border-(--kafka-toc-rule)">
        {items.map((item) => {
          const isCurrent = item.id === current
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isCurrent ? 'location' : undefined}
                className={cx(
                  focus,
                  'kafka-type-toc-type -ml-(--kafka-toc-rule-width) flex min-h-(--kafka-toc-min-height) items-center rounded-r-(--kafka-toc-radius) border-l-(length:--kafka-toc-rule-width) py-(--kafka-prose-list-gap) pr-(--kafka-toc-padding-x) no-underline hover:bg-(--kafka-toc-hover-bg) hover:text-(--kafka-toc-link-hover)',
                  isCurrent ? 'border-(--kafka-toc-current-rule) font-bold text-(--kafka-toc-current)' : 'border-transparent text-(--kafka-toc-link)',
                )}
                style={{ paddingLeft: item.level === 3 ? 'calc(var(--kafka-toc-padding-x) + var(--kafka-toc-indent))' : 'var(--kafka-toc-padding-x)' }}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
