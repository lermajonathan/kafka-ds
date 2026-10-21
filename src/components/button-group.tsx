/* Kafka · ButtonGroup */
import { type HTMLAttributes } from 'react'
import { cx } from './shared'

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'> {
  /** Names the group for screen readers ("Acciones del texto"). */
  label: string
}

/** Buttons that belong together, laid out with consistent spacing and named as a group. Wraps on narrow screens. */
export function ButtonGroup({ label, className, ...rest }: ButtonGroupProps) {
  return <div role="group" aria-label={label} className={cx('flex flex-wrap items-center gap-(--kafka-button-group-gap)', className)} {...rest} />
}
