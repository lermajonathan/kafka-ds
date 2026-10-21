/* Kafka · Checkbox */
import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { IconCheck, IconMinus } from '../icons'
import { cx, peerFocus } from './shared'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** The visible label. Required: a checkbox without text is unnamed. */
  label: ReactNode
  /** Secondary text under the label, read with it. */
  description?: ReactNode
  /** Shows the mixed state, for a parent that controls a list. It is cleared as soon as the person toggles it. */
  indeterminate?: boolean
  invalid?: boolean
}

/** A native checkbox with a Kafka box and mark. The whole row (at least 44 px tall) is the target. */
export function Checkbox({ label, description, indeterminate = false, invalid, className, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate }, [indeterminate, rest.checked])
  return (
    <label className={cx('flex min-h-(--kafka-checkbox-min-height) cursor-pointer items-center gap-(--kafka-checkbox-gap) has-disabled:cursor-not-allowed has-disabled:opacity-(--kafka-checkbox-disabled-opacity)', className)}>
      <span className="relative inline-grid size-(--kafka-checkbox-size) shrink-0 place-items-center">
        <input ref={ref} type="checkbox" aria-invalid={invalid || undefined} className="peer absolute inset-0 m-0 size-full cursor-[inherit] appearance-none opacity-0" {...rest} />
        <span
          aria-hidden="true"
          className={cx(peerFocus, "kafka-check-box pointer-events-none absolute inset-0 rounded-(--kafka-checkbox-radius) border-(length:--kafka-checkbox-border-width) border-(--kafka-checkbox-border) bg-(--kafka-checkbox-bg) peer-hover:bg-(--kafka-checkbox-hover-bg) peer-checked:border-(--kafka-checkbox-checked-bg) peer-checked:bg-(--kafka-checkbox-checked-bg) peer-indeterminate:border-(--kafka-checkbox-checked-bg) peer-indeterminate:bg-(--kafka-checkbox-checked-bg) peer-aria-invalid:border-(--kafka-checkbox-invalid-border)")}
        />
        <IconCheck aria-hidden="true" className="pointer-events-none relative hidden size-(--kafka-size-icon-sm) text-(--kafka-checkbox-checked-fg) peer-checked:block peer-indeterminate:hidden" />
        <IconMinus aria-hidden="true" className="pointer-events-none relative hidden size-(--kafka-size-icon-sm) text-(--kafka-checkbox-checked-fg) peer-indeterminate:block" />
      </span>
      <span className="flex flex-col">
        <span className="kafka-type-checkbox-label-type text-(--kafka-checkbox-label)">{label}</span>
        {description && <span className="kafka-type-checkbox-description-type text-(--kafka-checkbox-description)">{description}</span>}
      </span>
    </label>
  )
}
