/* Kafka · Epigraph */
import { type HTMLAttributes, type ReactNode } from 'react'
import { cx } from './shared'

export interface EpigraphProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Author and, optionally, the work. */
  attribution?: ReactNode
}

/** A short quotation that opens a text, set to the right in a softer tone. */
export function Epigraph({ children, attribution, className, ...rest }: EpigraphProps) {
  return (
    <figure className={cx('ml-auto flex max-w-(--kafka-epigraph-max-width) flex-col gap-(--kafka-epigraph-gap) text-right', className)} {...rest}>
      <blockquote className="kafka-type-epigraph-type text-(--kafka-epigraph-text) italic">{children}</blockquote>
      {attribution && <figcaption className="kafka-type-epigraph-attribution-type text-(--kafka-epigraph-attribution)">{attribution}</figcaption>}
    </figure>
  )
}
