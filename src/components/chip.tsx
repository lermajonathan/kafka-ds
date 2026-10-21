/* Kafka · Chip */
import { type ButtonHTMLAttributes } from 'react'
import { IconCheck, type IconType } from '../icons'
import { cx, focus } from './shared'

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  /** Whether the filter is on. A selected chip also shows a check, so it does not depend on colour. */
  selected?: boolean
  /** Icon before the label, shown when the chip is not selected. */
  Icon?: IconType
}

/** A toggle for filtering: "Talleres", "Poesía". A button with `aria-pressed`. Put several in a `ButtonGroup` with a label. */
export function Chip({ selected = false, Icon, className, children, type = 'button', ...rest }: ChipProps) {
  const Lead = selected ? IconCheck : Icon
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cx(
        focus,
        'kafka-type-chip-type inline-flex min-h-(--kafka-chip-min-height) cursor-pointer items-center gap-(--kafka-badge-gap) rounded-(--kafka-chip-radius) border-(length:--kafka-border-width-hairline) px-(--kafka-chip-padding-x) py-(--kafka-chip-padding-y) disabled:cursor-not-allowed disabled:opacity-(--kafka-button-disabled-opacity)',
        selected
          ? 'border-(--kafka-chip-selected-bg) bg-(--kafka-chip-selected-bg) text-(--kafka-chip-selected-fg)'
          : 'border-(--kafka-chip-border) bg-(--kafka-chip-bg) text-(--kafka-chip-fg) hover:bg-(--kafka-chip-bg-hover)',
        className,
      )}
      {...rest}
    >
      {Lead && <Lead aria-hidden="true" className="size-(--kafka-size-icon-sm) shrink-0" />}
      {children}
    </button>
  )
}
