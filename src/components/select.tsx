/* Kafka · Select */
import { type Ref, type SelectHTMLAttributes } from 'react'
import { IconChevronDown } from '../icons'
import { useFieldControl } from './field'
import { inputClass } from './input'
import { cx } from './shared'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>
  invalid?: boolean
}

/** A native `<select>` with the Kafka field look. Pass `<option>` children. Native keeps the platform's own list, keyboard and screen reader behaviour; for search or multiple values use a combobox (H4). */
export function Select({ invalid, className, children, ref, ...rest }: SelectProps) {
  const a11y = useFieldControl({ ...rest, invalid })
  return (
    <div className="relative">
      <select ref={ref} className={cx(inputClass, 'cursor-pointer appearance-none pr-(--kafka-select-padding-right)', className)} {...rest} {...a11y}>
        {children}
      </select>
      <IconChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-(--kafka-input-padding-x) size-(--kafka-select-icon-size) -translate-y-1/2 text-(--kafka-select-icon)" />
    </div>
  )
}
