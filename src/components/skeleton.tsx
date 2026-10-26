/* Kafka · Skeleton */
import { type HTMLAttributes } from 'react'
import { useLabels } from './labels'
import { cx } from './shared'

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `line` is a row of text, `block` a rectangle (an image, a card), `circle` an avatar. */
  shape?: 'line' | 'block' | 'circle'
  /** How many lines of text. The last one is shorter. Only for `shape="line"`. */
  lines?: number
}

const SHAPE: Record<NonNullable<SkeletonProps['shape']>, string> = {
  line: 'h-(--kafka-skeleton-line-height) w-full',
  block: 'h-(--kafka-skeleton-block-height) w-full',
  circle: 'size-(--kafka-skeleton-circle-size) rounded-full',
}

/** A placeholder while content loads. The group announces "Cargando" once; the shapes are hidden from assistive technology and stop shimmering under reduced motion. */
export function Skeleton({ shape = 'line', lines = 1, className, ...rest }: SkeletonProps) {
  const labels = useLabels()
  const count = shape === 'line' ? Math.max(1, lines) : 1
  return (
    <div role="status" aria-busy="true" className={cx('flex flex-col gap-(--kafka-skeleton-gap)', shape === 'circle' && 'w-fit', className)} {...rest}>
      <span className="sr-only">{labels.loading}</span>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cx('kafka-skeleton block rounded-(--kafka-skeleton-radius)', SHAPE[shape], shape === 'line' && count > 1 && i === count - 1 && 'w-3/5')}
        />
      ))}
    </div>
  )
}
