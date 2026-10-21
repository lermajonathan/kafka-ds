/* Kafka · Button */
import { type ComponentPropsWithRef } from 'react'
import { IconSpinner, type IconType } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export type ButtonVariant = 'primary' | 'soft' | 'outline'

// Every value is a component token (tokens/components.json → button.*). Class strings are written out in full
// so Tailwind can see them. Hover and active come from tokens too; none of them lowers the label contrast.
export const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-(--kafka-button-primary-bg) text-(--kafka-button-primary-fg) hover:bg-(--kafka-button-primary-bg-hover) active:bg-(--kafka-button-primary-bg-active)',
  soft: 'bg-(--kafka-button-soft-bg) text-(--kafka-button-soft-fg) hover:bg-(--kafka-button-soft-bg-hover) active:bg-(--kafka-button-soft-bg-active)',
  outline:
    'border-(length:--kafka-border-width-medium) border-(--kafka-button-outline-border) text-(--kafka-button-outline-fg) hover:bg-(--kafka-button-outline-bg-hover) active:bg-(--kafka-button-outline-bg-active)',
}

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** How loud the button is. `primary` is the gold call to action; use one per view. */
  variant?: ButtonVariant
  /** Icon before the label (any Phosphor icon component). */
  Icon?: IconType
  /** Icon after the label, for example an arrow that moves forward. */
  TrailingIcon?: IconType
  /** Shows a spinner, disables the button and sets `aria-busy`. The label stays visible. */
  loading?: boolean
  /** Stretches the button to the full width of its container. */
  block?: boolean
}

/** A button with a gold primary, a soft and an outline variant. Always at least 44 px tall. */
export function Button({ variant = 'primary', Icon, TrailingIcon, loading = false, block = false, disabled, className, children, type = 'button', ...rest }: ButtonProps) {
  const labels = useLabels()
  const Lead = loading ? IconSpinner : Icon
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        focus,
        'kafka-type-button-type inline-flex min-h-(--kafka-button-min-height) cursor-pointer items-center justify-center gap-(--kafka-button-gap) rounded-(--kafka-button-radius) px-(--kafka-button-padding-x) py-(--kafka-button-padding-y) no-underline',
        'disabled:cursor-not-allowed disabled:opacity-(--kafka-button-disabled-opacity)',
        block && 'w-full',
        BUTTON_VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {Lead && <Lead aria-hidden="true" className={cx('size-(--kafka-size-icon-md) shrink-0', loading && 'animate-spin')} />}
      {children}
      {TrailingIcon && !loading && <TrailingIcon aria-hidden="true" className="size-(--kafka-size-icon-md) shrink-0" />}
      {loading && <span className="sr-only">{labels.loading}</span>}
    </button>
  )
}
