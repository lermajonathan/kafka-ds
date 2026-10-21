/* Kafka · Badge */
import { type HTMLAttributes } from 'react'
import { IconCheck, IconDanger, IconInfo, IconWarning, type IconType } from '../icons'
import { cx } from './shared'

export type BadgeTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger'

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-(--kafka-badge-neutral-bg) text-(--kafka-badge-neutral-fg) border-(--kafka-badge-neutral-bg)',
  brand: 'bg-(--kafka-badge-brand-bg) text-(--kafka-badge-brand-fg) border-(--kafka-badge-brand-bg)',
  info: 'bg-(--kafka-badge-info-bg) text-(--kafka-badge-info-fg) border-(--kafka-badge-info-border)',
  success: 'bg-(--kafka-badge-success-bg) text-(--kafka-badge-success-fg) border-(--kafka-badge-success-border)',
  warning: 'bg-(--kafka-badge-warning-bg) text-(--kafka-badge-warning-fg) border-(--kafka-badge-warning-border)',
  danger: 'bg-(--kafka-badge-danger-bg) text-(--kafka-badge-danger-fg) border-(--kafka-badge-danger-border)',
}
const TONE_ICON: Partial<Record<BadgeTone, IconType>> = { info: IconInfo, success: IconCheck, warning: IconWarning, danger: IconDanger }

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The meaning. Status tones carry an icon so colour is never the only signal. */
  tone?: BadgeTone
  /** Replaces the tone's icon. Use `null` to remove it. */
  Icon?: IconType | null
}

/** A short label for a status or category: "Inscripciones abiertas", "Agotado". Not interactive. */
export function Badge({ tone = 'neutral', Icon, className, children, ...rest }: BadgeProps) {
  const Glyph = Icon === null ? undefined : (Icon ?? TONE_ICON[tone])
  return (
    <span
      className={cx('kafka-type-badge-type inline-flex items-center gap-(--kafka-badge-gap) rounded-(--kafka-badge-radius) border-(length:--kafka-badge-border-width) px-(--kafka-badge-padding-x) py-(--kafka-badge-padding-y)', TONE[tone], className)}
      {...rest}
    >
      {Glyph && <Glyph aria-hidden="true" className="size-(--kafka-size-icon-sm) shrink-0" />}
      {children}
    </span>
  )
}
