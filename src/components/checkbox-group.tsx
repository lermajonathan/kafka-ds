/* Kafka · CheckboxGroup */
import { useId, type ReactNode } from 'react'
import { IconDanger } from '../icons'
import { Checkbox } from './checkbox'
import { useLabels } from './labels'
import { cx } from './shared'

export interface CheckboxGroupOption {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface CheckboxGroupProps {
  /** The question or noun the options answer. It is the group's accessible name (a `legend`). */
  label: ReactNode
  options: CheckboxGroupOption[]
  /** The chosen values. The page owns them. */
  value: string[]
  onChange: (value: string[]) => void
  /** Adds a first "Seleccionar todos" checkbox that shows the mixed state. It skips disabled options. */
  selectAll?: boolean
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
}

/** Several checkboxes under one question: a `fieldset` with a `legend`, and an optional "select all" with the mixed state. */
export function CheckboxGroup({ label, options, value, onChange, selectAll = false, hint, error, required, className }: CheckboxGroupProps) {
  const labels = useLabels()
  const uid = useId()
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  const enabled = options.filter((o) => !o.disabled)
  const chosen = enabled.filter((o) => value.includes(o.value))
  const all = enabled.length > 0 && chosen.length === enabled.length
  const some = chosen.length > 0 && !all
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  const toggleAll = () => {
    const enabledValues = enabled.map((o) => o.value)
    onChange(all ? value.filter((x) => !enabledValues.includes(x)) : [...value, ...enabledValues.filter((x) => !value.includes(x))])
  }
  return (
    <fieldset className={cx('m-0 flex min-w-0 flex-col gap-(--kafka-checkbox-group-gap) border-0 p-0', className)} aria-describedby={describedBy}>
      <legend className="kafka-type-field-label-type mb-(--kafka-checkbox-group-gap) text-(--kafka-field-label)">
        {label}
        {required && <span className="font-normal text-(--kafka-field-required)"> ({labels.required})</span>}
      </legend>
      {selectAll && (
        <div className="border-b-(length:--kafka-checkbox-group-select-all-border-width) border-(--kafka-checkbox-group-select-all-border) pb-(--kafka-checkbox-group-select-all-padding-bottom)">
          <Checkbox label={labels.selectAll} checked={all} indeterminate={some} onChange={toggleAll} />
        </div>
      )}
      {options.map((o) => (
        <Checkbox key={o.value} label={o.label} description={o.description} disabled={o.disabled} checked={value.includes(o.value)} onChange={() => toggle(o.value)} invalid={!!error} />
      ))}
      {hint && <p id={hintId} className="kafka-type-field-hint-type text-(--kafka-field-hint)">{hint}</p>}
      <div aria-live="polite">
        {error && (
          <p id={errorId} className="kafka-type-field-error-type flex items-start gap-(--kafka-field-gap) text-(--kafka-field-error)">
            <IconDanger aria-hidden="true" className="mt-px size-(--kafka-size-icon-sm) shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </fieldset>
  )
}
