/* Kafka · PrevNext */
import { type HTMLAttributes } from 'react'
import { IconArrowLeft, IconArrowRight } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface PrevNextLink {
  href: string
  title: string
}

export interface PrevNextProps extends HTMLAttributes<HTMLElement> {
  prev?: PrevNextLink
  next?: PrevNextLink
  /** Accessible name of the navigation. Defaults to the localised "More to read". Give each one a different name if a page has more than one. */
  label?: string
}

const card =
  'flex min-h-(--kafka-prev-next-min-height) flex-col gap-(--kafka-prev-next-gap) rounded-(--kafka-prev-next-radius) border-(length:--kafka-prev-next-border-width) border-(--kafka-prev-next-border) bg-(--kafka-prev-next-bg) p-(--kafka-prev-next-padding) no-underline hover:border-(--kafka-prev-next-border-hover) hover:bg-(--kafka-prev-next-bg-hover)'

/** Two links to the texts before and after this one. They are plain `<a href>`: with a router, wrap the page in your own link handler. */
export function PrevNext({ prev, next, label, className, ...rest }: PrevNextProps) {
  const labels = useLabels()
  return (
    <nav aria-label={label ?? labels.articleNav} className={cx('grid gap-(--kafka-prev-next-gap) sm:grid-cols-2', className)} {...rest}>
      {prev ? (
        <a href={prev.href} rel="prev" className={cx(focus, card)}>
          <span className="kafka-type-prev-next-direction-type inline-flex items-center gap-(--kafka-prev-next-gap) text-(--kafka-prev-next-direction)">
            <IconArrowLeft aria-hidden="true" className="size-(--kafka-size-icon-sm)" />
            {labels.previous}
          </span>
          <span className="kafka-type-prev-next-title-type text-(--kafka-prev-next-title)">{prev.title}</span>
        </a>
      ) : <span className="hidden sm:block" />}
      {next && (
        <a href={next.href} rel="next" className={cx(focus, card, 'sm:col-start-2 sm:items-end sm:text-right')}>
          <span className="kafka-type-prev-next-direction-type inline-flex items-center gap-(--kafka-prev-next-gap) text-(--kafka-prev-next-direction)">
            {labels.next}
            <IconArrowRight aria-hidden="true" className="size-(--kafka-size-icon-sm)" />
          </span>
          <span className="kafka-type-prev-next-title-type text-(--kafka-prev-next-title)">{next.title}</span>
        </a>
      )}
    </nav>
  )
}
