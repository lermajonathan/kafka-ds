/* Kafka · NewsBox */
import { createElement, useState } from 'react'
import { IconCalendar, IconClose, IconConfetti, IconInfo, IconMegaphone, type IconType } from '../icons'
import { IconButton } from './icon-button'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export type NewsKind = 'evento' | 'felicitacion' | 'aviso' | 'convocatoria'

export interface NewsItem {
  id: string
  kind: NewsKind
  title: string
  /** One line each, the date first. */
  meta?: Array<{ Icon: IconType; text: string }>
  /** Makes the title a link to the full news. */
  href?: string
}

const KIND_ICON: Record<NewsKind, IconType> = { evento: IconCalendar, felicitacion: IconConfetti, aviso: IconInfo, convocatoria: IconMegaphone }
const MAX_ITEMS = 3

export interface NewsBoxProps {
  items: NewsItem[]
  /** Called when the reader closes an item. The page owns the list and removes it. */
  onDismiss: (id: string) => void
  /** Where "Ver todas" goes. Without it the link is not shown. */
  viewAllHref?: string
  /** Pins the box to the bottom right of the screen. */
  floating?: boolean
  /** The region's name. Defaults to "Novedades"; change it only if the page has more than one box. */
  label?: string
  headingLevel?: 2 | 3 | 4
  className?: string
}

/** A small box of community news, up to three at a time. It never rotates by itself and does not trap focus: it is a labelled region, not a dialog. */
export function NewsBox({ items, onDismiss, viewAllHref, floating = false, label, headingLevel = 3, className }: NewsBoxProps) {
  const labels = useLabels()
  const [index, setIndex] = useState(0)
  const shown = items.slice(0, MAX_ITEMS)
  const at = Math.min(index, shown.length - 1)
  const item = shown[at]
  if (!item) return null
  const Kind = KIND_ICON[item.kind]
  return (
    <section
      aria-label={label ?? labels.news}
      className={cx(
        'kafka-news flex flex-col gap-(--kafka-news-gap) rounded-(--kafka-news-radius) border-(length:--kafka-news-border-width) border-(--kafka-news-border) bg-(--kafka-news-bg) p-(--kafka-news-padding) text-(--kafka-news-fg) shadow-(--kafka-news-shadow)',
        floating && 'fixed right-(--kafka-news-offset) bottom-(--kafka-news-offset)',
        className,
      )}
    >
      <div className="flex items-start gap-(--kafka-news-gap)">
        <div aria-live="polite" aria-atomic="true" className="flex min-w-0 flex-1 flex-col gap-(--kafka-news-gap)">
          <p className="kafka-type-news-kind-type flex items-center gap-(--kafka-news-meta-gap) text-(--kafka-news-soft-fg)">
            <span aria-hidden="true" className="grid size-(--kafka-news-kind-size) shrink-0 place-items-center rounded-full bg-(--kafka-news-kind-bg) text-(--kafka-news-kind-fg)">
              <Kind className="size-(--kafka-size-icon-sm)" />
            </span>
            {labels.newsKinds[item.kind]}
          </p>
          {createElement(
            `h${headingLevel}`,
            { className: 'kafka-type-news-title text-(--kafka-news-fg)' },
            item.href ? (
              <a href={item.href} className={cx('underline underline-offset-4 rounded-sm', focus)}>{item.title}</a>
            ) : (
              item.title
            ),
          )}
          {item.meta && item.meta.length > 0 && (
            <ul className="kafka-type-news-meta-type flex flex-col gap-(--kafka-news-meta-gap) text-(--kafka-news-soft-fg)">
              {item.meta.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-(--kafka-news-meta-gap)">
                  <Icon aria-hidden="true" className="mt-0.5 size-(--kafka-size-icon-sm) shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <IconButton Icon={IconClose} label={labels.dismissNews(item.title)} variant="soft" onClick={() => onDismiss(item.id)} />
      </div>
      {(shown.length > 1 || viewAllHref) && (
        <div className="flex items-center justify-between gap-(--kafka-news-gap)">
          {shown.length > 1 ? (
            <div className="flex items-center">
              {shown.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  aria-label={labels.newsGoTo(i + 1, shown.length)}
                  aria-current={i === at ? 'true' : undefined}
                  onClick={() => setIndex(i)}
                  className={cx('grid size-(--kafka-news-dot-hit) place-items-center rounded-full', focus)}
                >
                  <span aria-hidden="true" className={cx('size-(--kafka-news-dot-size) rounded-full', i === at ? 'bg-(--kafka-news-dot-active)' : 'bg-(--kafka-news-dot-bg)')} />
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {viewAllHref && (
            <a href={viewAllHref} className={cx('kafka-type-news-meta-type rounded-sm py-(--kafka-news-meta-gap) font-semibold text-(--kafka-color-fg-link) underline underline-offset-4', focus)}>
              {labels.newsViewAll}
            </a>
          )}
        </div>
      )}
    </section>
  )
}
