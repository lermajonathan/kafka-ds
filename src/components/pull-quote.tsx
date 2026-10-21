/* Kafka · PullQuote */
import { type HTMLAttributes, type ReactNode } from 'react'
import { cx } from './shared'

export interface PullQuoteProps extends HTMLAttributes<HTMLElement> {
  /** The quoted text. */
  children: ReactNode
  /** Who said it: a name, or a name and a work. Rendered in a `figcaption`. */
  attribution?: ReactNode
  /** URL of the source, exposed as the `cite` attribute of the block quote. */
  cite?: string
}

/** A quotation set apart from the text, with a gold rule. Quoted from the text, so it is repeated content: pair it with the original, not instead of it. */
export function PullQuote({ children, attribution, cite, className, ...rest }: PullQuoteProps) {
  return (
    <figure
      className={cx('flex flex-col gap-(--kafka-pull-quote-gap) border-l-(length:--kafka-pull-quote-rule-width) border-(--kafka-pull-quote-rule) pl-(--kafka-pull-quote-padding)', className)}
      {...rest}
    >
      <blockquote cite={cite} className="kafka-type-pull-quote-type text-(--kafka-pull-quote-text) italic">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="kafka-type-pull-quote-attribution-type text-(--kafka-pull-quote-attribution)">— {attribution}</figcaption>
      )}
    </figure>
  )
}
