/* Kafka · Card */
import { type HTMLAttributes } from 'react'
import { cx } from './shared'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** A brand-coloured, thicker border for the one card that should stand out. */
  featured?: boolean
}

/** A bordered surface with a resting shadow that groups related content. Presentational: put a heading inside so the section has a name. For a header, actions or a footer use `Panel`. */
export function Card({ featured = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cx(
        'kafka-card flex flex-col gap-(--kafka-card-gap) rounded-(--kafka-card-radius) bg-(--kafka-card-bg) p-(--kafka-card-padding) shadow-(--kafka-card-shadow)',
        featured
          ? 'border-(length:--kafka-card-featured-border-width) border-(--kafka-card-featured-border)'
          : 'border-(length:--kafka-card-border-width) border-(--kafka-card-border)',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
