/* Kafka · Divider */
import { type HTMLAttributes, type ReactNode } from 'react'
import { cx } from './shared'

export interface DividerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  orientation?: 'horizontal' | 'vertical'
  /** Text between two rules ("o continúa con"). Horizontal only. */
  label?: ReactNode
  /** The line is ornament only: it is not announced as a separator. */
  decorative?: boolean
}

/** A line that separates content. A real `<hr>` when horizontal, so assistive technology announces it. */
export function Divider({ orientation = 'horizontal', label, decorative = false, className, ...rest }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        {...(decorative ? { role: 'none' } : { role: 'separator', 'aria-orientation': 'vertical' as const })}
        className={cx('w-(--kafka-divider-width) self-stretch bg-(--kafka-divider-color)', className)}
        {...rest}
      />
    )
  }
  if (label) {
    return (
      <div className={cx('flex items-center gap-(--kafka-divider-gap)', className)} {...rest}>
        <hr aria-hidden="true" className="m-0 h-(--kafka-divider-width) flex-1 border-0 bg-(--kafka-divider-color)" />
        <span className="kafka-type-divider-label-type text-(--kafka-divider-label-fg)">{label}</span>
        <hr aria-hidden="true" className="m-0 h-(--kafka-divider-width) flex-1 border-0 bg-(--kafka-divider-color)" />
      </div>
    )
  }
  return (
    <hr
      {...(decorative ? { role: 'none' } : {})}
      className={cx('m-0 h-(--kafka-divider-width) w-full border-0 bg-(--kafka-divider-color)', className)}
      {...rest}
    />
  )
}
