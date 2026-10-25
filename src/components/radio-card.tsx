/* Kafka · RadioCard and RadioCardGroup */
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { IconDanger, type IconType } from '../icons'
import { Badge } from './badge'
import { useLabels } from './labels'
import { cx, peerFocus } from './shared'

export interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** The option's name. It is the radio's accessible name. */
  label: ReactNode
  /** One sentence. Read after the name. */
  description?: ReactNode
  /** Decorative. */
  Icon?: IconType
  /** One or two words: "Más elegido". */
  badge?: string
}

/** One option of a `RadioCardGroup`: a native radio shown as a card. The whole card is the target. */
export function RadioCard({ label, description, Icon, badge, className, ...rest }: RadioCardProps) {
  const uid = useId()
  return (
    <label
      className={cx(
        'relative flex min-h-(--kafka-radio-card-min-height) cursor-pointer items-start gap-(--kafka-radio-card-gap) rounded-(--kafka-radio-card-radius) border-(length:--kafka-radio-card-border-width) border-(--kafka-radio-card-border) bg-(--kafka-radio-card-bg) p-(--kafka-radio-card-padding) hover:bg-(--kafka-radio-card-hover-bg) has-checked:border-(--kafka-radio-card-checked-border) has-disabled:cursor-not-allowed has-disabled:opacity-(--kafka-radio-card-disabled-opacity)',
        className,
      )}
    >
      <input type="radio" aria-labelledby={`${uid}-l`} aria-describedby={description ? `${uid}-d` : undefined} className="peer absolute inset-0 m-0 size-full cursor-[inherit] appearance-none opacity-0" {...rest} />
      {Icon && (
        <span aria-hidden="true" className="grid size-(--kafka-radio-card-icon-size) shrink-0 place-items-center rounded-(--kafka-radio-card-radius) bg-(--kafka-radio-card-icon-bg) text-(--kafka-radio-card-icon-fg)">
          <Icon aria-hidden="true" className="size-(--kafka-size-icon-md)" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span id={`${uid}-l`} className="kafka-type-radio-card-label-type text-(--kafka-radio-card-label-fg)">{label}</span>
        {description && <span id={`${uid}-d`} className="kafka-type-radio-card-description-type text-(--kafka-radio-card-description-fg)">{description}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-(--kafka-radio-card-gap)">
        {badge && <Badge tone="brand" Icon={null}>{badge}</Badge>}
        <span className="relative inline-grid size-(--kafka-radio-size) place-items-center">
          <span aria-hidden="true" className={cx(peerFocus, 'pointer-events-none absolute -inset-px rounded-(--kafka-radio-radius) border-(length:--kafka-radio-border-width) border-(--kafka-radio-border) bg-(--kafka-radio-bg) peer-checked:border-(--kafka-radio-checked-bg) peer-checked:bg-(--kafka-radio-checked-bg)')} />
          <span aria-hidden="true" className="pointer-events-none relative hidden size-(--kafka-radio-dot) rounded-(--kafka-radio-radius) bg-(--kafka-radio-checked-fg) peer-checked:block" />
        </span>
      </span>
    </label>
  )
}

export interface RadioCardOption<T extends string = string> {
  value: T
  label: ReactNode
  description?: ReactNode
  Icon?: IconType
  badge?: string
  disabled?: boolean
}

export interface RadioCardGroupProps<T extends string = string> {
  /** The question the options answer. It is the group's accessible name (a `legend`). */
  label: ReactNode
  options: RadioCardOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  name?: string
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
}

/** A set of cards of which one is chosen: a `fieldset` with a `legend` and native radios (arrow keys move and select, Tab leaves the group). */
export function RadioCardGroup<T extends string = string>({ label, options, value, defaultValue, onChange, name, hint, error, required, className }: RadioCardGroupProps<T>) {
  const labels = useLabels()
  const uid = useId()
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  return (
    <fieldset className={cx('m-0 flex min-w-0 flex-col gap-(--kafka-radio-card-group-gap) border-0 p-0', className)} aria-describedby={describedBy}>
      <legend className="kafka-type-field-label-type mb-(--kafka-radio-card-group-gap) text-(--kafka-field-label)">
        {label}
        {required && <span className="font-normal text-(--kafka-field-required)"> ({labels.required})</span>}
      </legend>
      {options.map((o) => (
        <RadioCard
          key={o.value}
          name={name ?? `${uid}-group`}
          value={o.value}
          label={o.label}
          description={o.description}
          Icon={o.Icon}
          badge={o.badge}
          disabled={o.disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          {...(value !== undefined ? { checked: value === o.value } : { defaultChecked: defaultValue === o.value })}
          onChange={() => onChange?.(o.value)}
        />
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
