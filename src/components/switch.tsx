/* Kafka · Switch */
import { type InputHTMLAttributes, type ReactNode } from 'react'
import { IconCheck } from '../icons'
import { cx, peerFocus } from './shared'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'> {
  /** What the switch controls, as a noun phrase ("Notificaciones por correo"). The state is announced by the role, so do not write "activar". */
  label: ReactNode
  description?: ReactNode
}

/** An on/off control for settings that apply immediately (`role="switch"`). In a form that is submitted later, use a checkbox. */
export function Switch({ label, description, className, ...rest }: SwitchProps) {
  return (
    <label className={cx('flex min-h-(--kafka-switch-min-height) cursor-pointer items-center justify-between gap-(--kafka-switch-gap) has-disabled:cursor-not-allowed has-disabled:opacity-(--kafka-switch-disabled-opacity)', className)}>
      <span className="flex flex-col">
        <span className="kafka-type-switch-label-type text-(--kafka-switch-label)">{label}</span>
        {description && <span className="kafka-type-switch-description-type text-(--kafka-switch-description)">{description}</span>}
      </span>
      <span className="relative inline-block h-(--kafka-switch-track-height) w-(--kafka-switch-track-width) shrink-0">
        <input type="checkbox" role="switch" className="kafka-switch-input peer absolute inset-0 m-0 size-full cursor-[inherit] appearance-none opacity-0" {...rest} />
        <span
          aria-hidden="true"
          className={cx(peerFocus, 'pointer-events-none absolute inset-0 rounded-full border-(length:--kafka-switch-track-border-width) border-(--kafka-switch-track-border) bg-(--kafka-switch-track-bg) transition-colors duration-(--kafka-switch-duration) peer-checked:border-(--kafka-switch-track-on-bg) peer-checked:bg-(--kafka-switch-track-on-bg)')}
        />
        <span
          aria-hidden="true"
          className="kafka-switch-thumb pointer-events-none absolute top-1/2 left-(--kafka-switch-thumb-offset) grid size-(--kafka-switch-thumb-size) -translate-y-1/2 place-items-center rounded-full bg-(--kafka-switch-thumb) transition-all duration-(--kafka-switch-duration) peer-checked:left-[calc(var(--kafka-switch-track-width)-var(--kafka-switch-thumb-size)-var(--kafka-switch-thumb-offset))] peer-checked:bg-(--kafka-switch-thumb-on)"
        >
          <IconCheck className="hidden size-(--kafka-size-icon-sm) text-(--kafka-switch-track-on-bg)" />
        </span>
      </span>
    </label>
  )
}
