/* Kafka · CountBadge */
import { type HTMLAttributes } from 'react'
import { cx } from './shared'

export type CountBadgeTone = 'neutral' | 'danger'

export interface CountBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  count: number
  /** `danger` is red, for notifications that need attention; `neutral` is ink. The number still carries the meaning. */
  tone?: CountBadgeTone
  /** Above this the badge shows "max+" (for 9: "9+"). */
  max?: number
  /** Renders a zero instead of nothing. */
  showZero?: boolean
  /** What the number counts, spoken instead of the digits ("5 mensajes sin leer"). Without it the number is read as plain text. */
  label?: string
}

const TONE: Record<CountBadgeTone, string> = {
  neutral: 'bg-(--kafka-count-badge-bg) text-(--kafka-count-badge-fg)',
  danger: 'bg-(--kafka-count-badge-danger-bg) text-(--kafka-count-badge-danger-fg)',
}

/** A small number for pending items. At zero it renders nothing. When it sits on a button, put the count in the button's name and hide this one from assistive technology. */
export function CountBadge({ count, tone = 'neutral', max = 9, showZero = false, label, className, ...rest }: CountBadgeProps) {
  if (count <= 0 && !showZero) return null
  const text = count > max ? `${max}+` : String(Math.max(0, count))
  return (
    <span
      {...(label ? { role: 'img', 'aria-label': label } : {})}
      className={cx('kafka-count-badge kafka-type-count-badge-type inline-flex min-w-(--kafka-count-badge-min-size) items-center justify-center rounded-(--kafka-count-badge-radius) px-(--kafka-count-badge-padding-x) font-semibold', TONE[tone], className)}
      {...rest}
    >
      <span aria-hidden={label ? true : undefined}>{text}</span>
    </span>
  )
}
