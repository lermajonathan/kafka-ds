/* Kafka · IconButton */
import { type ButtonHTMLAttributes } from 'react'
import { type IconType } from '../icons'
import { BUTTON_VARIANT, type ButtonVariant } from './button'
import { cx, focus } from './shared'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** The icon: any Phosphor icon component. */
  Icon: IconType
  /** What the button does, as a short phrase ("Cerrar", "Compartir"). It is the accessible name, because the icon has no text. */
  label: string
  variant?: ButtonVariant
}

/** A button with only an icon. 44 × 44 px and always named: the `label` is required. */
export function IconButton({ Icon, label, variant = 'soft', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(focus, 'inline-flex size-(--kafka-icon-button-size) shrink-0 cursor-pointer items-center justify-center rounded-(--kafka-icon-button-radius) disabled:cursor-not-allowed disabled:opacity-(--kafka-button-disabled-opacity)', BUTTON_VARIANT[variant], className)}
      {...rest}
    >
      <Icon aria-hidden="true" className="size-(--kafka-icon-button-icon)" />
    </button>
  )
}
