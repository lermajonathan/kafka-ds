/* Kafka · Radio */
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconDanger } from '../icons'
import { cx, peerFocus } from './shared'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode
  description?: ReactNode
}

/** One option of a group. Use inside `RadioGroup` so the options share a name and a legend. */
export function Radio({ label, description, className, ...rest }: RadioProps) {
  return (
    <label className={cx('flex min-h-(--kafka-radio-min-height) cursor-pointer items-center gap-(--kafka-radio-gap) has-disabled:cursor-not-allowed has-disabled:opacity-(--kafka-radio-disabled-opacity)', className)}>
      <span className="relative inline-grid size-(--kafka-radio-size) shrink-0 place-items-center">
        <input type="radio" className="peer absolute inset-0 m-0 size-full cursor-[inherit] appearance-none opacity-0" {...rest} />
        <span
          aria-hidden="true"
          className={cx(peerFocus, 'pointer-events-none absolute inset-0 rounded-(--kafka-radio-radius) border-(length:--kafka-radio-border-width) border-(--kafka-radio-border) bg-(--kafka-radio-bg) peer-hover:bg-(--kafka-radio-hover-bg) peer-checked:border-(--kafka-radio-checked-bg) peer-checked:bg-(--kafka-radio-checked-bg) peer-aria-invalid:border-(--kafka-radio-invalid-border)')}
        />
        <span aria-hidden="true" className="pointer-events-none relative hidden size-(--kafka-radio-dot) rounded-(--kafka-radio-radius) bg-(--kafka-radio-checked-fg) peer-checked:block" />
      </span>
      <span className="flex flex-col">
        <span className="kafka-type-radio-label-type text-(--kafka-radio-label)">{label}</span>
        {description && <span className="kafka-type-radio-description-type text-(--kafka-radio-description)">{description}</span>}
      </span>
    </label>
  )
}

export interface RadioOption<T extends string = string> {
  value: T
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps<T extends string = string> {
  /** The question the options answer. It is the group's accessible name (a `legend`). */
  label: ReactNode
  options: RadioOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** Shared `name` of the inputs. Generated when omitted. */
  name?: string
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
}

/** A set of options of which one is chosen: a `fieldset` with a `legend`, native radios (arrow keys move and select, Tab leaves the group). */
export function RadioGroup<T extends string = string>({ label, options, value, defaultValue, onChange, name, hint, error, required, className }: RadioGroupProps<T>) {
  const labels = useLabels()
  const uid = useId()
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  return (
    <fieldset className={cx('m-0 flex min-w-0 flex-col border-0 p-0', className)} aria-describedby={describedBy}>
      <legend className="kafka-type-field-label-type mb-(--kafka-radio-group-gap) text-(--kafka-field-label)">
        {label}
        {required && <span className="font-normal text-(--kafka-field-required)"> ({labels.required})</span>}
      </legend>
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name ?? `${uid}-group`}
          value={o.value}
          label={o.label}
          description={o.description}
          disabled={o.disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          {...(value !== undefined ? { checked: value === o.value } : { defaultChecked: defaultValue === o.value })}
          onChange={() => onChange?.(o.value)}
        />
      ))}
      {hint && <p id={hintId} className="kafka-type-field-hint-type mt-(--kafka-radio-group-gap) text-(--kafka-field-hint)">{hint}</p>}
      <div aria-live="polite">
        {error && (
          <p id={errorId} className="kafka-type-field-error-type mt-(--kafka-radio-group-gap) flex items-start gap-(--kafka-field-gap) text-(--kafka-field-error)">
            <IconDanger aria-hidden="true" className="mt-px size-(--kafka-size-icon-sm) shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </fieldset>
  )
}
