/* Kafka · ButtonGroup */
import { type HTMLAttributes } from 'react'
import { cx } from './shared'

/**
 * Joined layout, shared with SplitButton: the parts touch and read as one shape (rounded only at the outer corners),
 * a line inside separates them, and the focus ring is drawn inside each part so neighbours never cover it.
 * Outline buttons already carry a border, so only the first one's right border is the line.
 */
export const JOINED = cx(
  'inline-flex items-stretch',
  '[&>button:not(:first-of-type)]:rounded-l-none [&>button:not(:last-of-type)]:rounded-r-none',
  '[&>button:not([data-variant=outline]):not(:first-of-type)]:border-l-(length:--kafka-button-group-divider-width) [&>button:not([data-variant=outline]):not(:first-of-type)]:border-l-(color:--kafka-button-group-divider)',
  '[&>button[data-variant=outline]:not(:first-of-type)]:border-l-0',
  '[&>button:focus-visible]:relative [&>button:focus-visible]:z-10 [&>button:focus-visible]:outline-offset-[calc(var(--kafka-focus-width)*-1)]!',
)

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'> {
  /** Names the group for screen readers ("Acciones del texto"). */
  label: string
  /** Joins the buttons into one shape with a line between them, for options that act on the same thing (alignment, format). */
  joined?: boolean
}

/** Buttons that belong together, named as a group. Separate by default (wraps on narrow screens); `joined` makes one connected shape. */
export function ButtonGroup({ label, joined = false, className, ...rest }: ButtonGroupProps) {
  return <div role="group" aria-label={label} className={cx(joined ? JOINED : 'flex flex-wrap items-center gap-(--kafka-button-group-gap)', className)} {...rest} />
}
