/* Kafka · Spinner */
import { type HTMLAttributes } from 'react'
import { useLabels } from './labels'
import { cx } from './shared'

export type SpinnerSize = 'sm' | 'md' | 'lg'

const SIZE: Record<SpinnerSize, string> = {
  sm: 'size-(--kafka-spinner-size-sm)',
  md: 'size-(--kafka-spinner-size-md)',
  lg: 'size-(--kafka-spinner-size-lg)',
}

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: SpinnerSize
  /** What is happening, announced to screen readers. Defaults to the localised "Loading". */
  label?: string
}

/** Progress with no known duration. It announces itself as a status; under reduced motion it turns slowly instead of stopping, so it still reads as "in progress". For a known percentage use `Progress`. */
export function Spinner({ size = 'md', label, className, ...rest }: SpinnerProps) {
  const labels = useLabels()
  return (
    <span role="status" className={cx('inline-flex', className)} {...rest}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cx('animate-spin', SIZE[size])}>
        <circle cx="12" cy="12" r="9" stroke="var(--kafka-spinner-track)" strokeWidth="var(--kafka-spinner-stroke-width)" />
        <path d="M12 3a9 9 0 0 1 9 9" stroke="var(--kafka-spinner-arc)" strokeWidth="var(--kafka-spinner-stroke-width)" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label ?? labels.loading}</span>
    </span>
  )
}
