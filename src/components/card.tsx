/* Kafka · Card */
import { createElement, type HTMLAttributes } from 'react'
import { cx } from './shared'

export type CardHighlight = 'none' | 'featured' | 'vip'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** `featured`: a brand-coloured, thicker border for the one card that should stand out. `vip`: the membership card, gold with a shining edge. */
  highlight?: CardHighlight
  /** The element to render. Use `article` for a self-standing item and `li` inside a list. */
  as?: 'div' | 'article' | 'li' | 'section'
  /** Set to false when the content (a cover image, say) must reach the edges of the card. */
  padded?: boolean
}

/** A bordered surface with a resting shadow that groups related content. Presentational: put a heading inside so the section has a name. For a header, actions or a footer use `Panel`. */
export function Card({ highlight = 'none', as = 'div', padded = true, className, children, ...rest }: CardProps) {
  return createElement(
    as,
    {
      'data-highlight': highlight === 'none' ? undefined : highlight,
      className: cx(
        'kafka-card relative flex flex-col rounded-(--kafka-card-radius) shadow-(--kafka-card-shadow)',
        padded ? 'gap-(--kafka-card-gap) p-(--kafka-card-padding)' : 'gap-0',
        highlight === 'vip' && 'bg-(image:--kafka-vip-bg) text-(--kafka-vip-fg)',
        highlight !== 'vip' && 'bg-(--kafka-card-bg)',
        highlight === 'featured'
          ? 'border-(length:--kafka-card-featured-border-width) border-(--kafka-card-featured-border)'
          : 'border-(length:--kafka-card-border-width) border-(--kafka-card-border)',
        className,
      ),
      ...rest,
    },
    children,
  )
}
