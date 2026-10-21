/* Kafka · Input */
import { type InputHTMLAttributes, type Ref } from 'react'
import { type IconType } from '../icons'
import { useFieldControl } from './field'
import { cx } from './shared'

/** Shared look of text-like controls (Input, Textarea, Select). Every value is an `input.*` token. */
export const inputClass =
  'kafka-focus kafka-type-input-type w-full min-h-(--kafka-input-min-height) rounded-(--kafka-input-radius) border-(length:--kafka-input-border-width) border-(--kafka-input-border) bg-(--kafka-input-bg) px-(--kafka-input-padding-x) py-(--kafka-input-padding-y) text-(--kafka-input-fg) placeholder:text-(--kafka-input-placeholder) hover:border-(--kafka-input-border-hover) aria-invalid:border-(--kafka-input-invalid-border) disabled:cursor-not-allowed disabled:opacity-(--kafka-input-disabled-opacity)'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  ref?: Ref<HTMLInputElement>
  /** Icon at the start of the field. Decorative: the label names the field. */
  Icon?: IconType
  /** Marks the field as invalid without a Field (inside a Field, its `error` does this). */
  invalid?: boolean
}

/** A one-line text field: 44 px tall, 16 px text, a 3:1 border, and a visible focus ring. Put it inside a `Field`. */
export function Input({ Icon, invalid, className, ref, ...rest }: InputProps) {
  const a11y = useFieldControl({ ...rest, invalid })
  return (
    <div className="relative">
      {Icon && <Icon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-(--kafka-input-padding-x) size-(--kafka-input-icon-size) -translate-y-1/2 text-(--kafka-input-icon)" />}
      <input ref={ref} className={cx(inputClass, Icon && 'pl-[calc(var(--kafka-input-padding-x)+var(--kafka-input-icon-size)+var(--kafka-input-icon-gap))]', className)} {...rest} {...a11y} />
    </div>
  )
}
