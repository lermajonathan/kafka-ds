/* Kafka · Field */
import { createContext, useContext, useId, type AriaAttributes, type ReactNode } from 'react'
import { IconDanger } from '../icons'
import { useLabels } from './labels'
import { cx } from './shared'

interface FieldCtx { id: string; labelId: string; describedBy?: string; invalid?: boolean; required?: boolean }
const FieldContext = createContext<FieldCtx | null>(null)

/** Id of the enclosing Field's label, for composite controls (pin input, tag input) that name themselves with `aria-labelledby`. */
export const useFieldLabelId = () => useContext(FieldContext)?.labelId

/** What a control needs from its Field: id, `aria-describedby`, `aria-invalid` and `aria-required`. Props set on the control itself win. */
export function useFieldControl(own: { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: AriaAttributes['aria-invalid']; required?: boolean; invalid?: boolean }) {
  const ctx = useContext(FieldContext)
  const describedBy = [own['aria-describedby'], ctx?.describedBy].filter(Boolean).join(' ') || undefined
  return {
    id: own.id ?? ctx?.id,
    'aria-describedby': describedBy,
    'aria-invalid': own['aria-invalid'] ?? (own.invalid || ctx?.invalid ? true : undefined),
    'aria-required': own.required || ctx?.required || undefined,
  }
}

export interface FieldProps {
  /** The visible label. Every control needs one. */
  label: ReactNode
  /** Help text shown below the control and read with it. */
  hint?: ReactNode
  /** Error message. Its presence marks the control as invalid and it is announced politely. */
  error?: ReactNode
  /** Marks the field as required: adds "(obligatorio)" to the label text and `aria-required` to the control. */
  required?: boolean
  /** Adds "(opcional)" to the label. Use it in forms where most fields are required. */
  optional?: boolean
  /** The control. Any Kafka control inside picks up its id, description and state. */
  children: ReactNode
  className?: string
}

/** Wires a label, a hint and an error to the control inside it, so none of that needs to be repeated on the control. */
export function Field({ label, hint, error, required, optional, children, className }: FieldProps) {
  const labels = useLabels()
  const uid = useId()
  const id = `${uid}-control`
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  return (
    <FieldContext.Provider value={{ id, labelId: `${uid}-label`, describedBy, invalid: !!error, required }}>
      <div className={cx('flex flex-col gap-(--kafka-field-gap)', className)}>
        <label id={`${uid}-label`} htmlFor={id} className="kafka-type-field-label-type text-(--kafka-field-label)">
          {label}
          {required && <span className="font-normal text-(--kafka-field-required)"> ({labels.required})</span>}
          {optional && !required && <span className="font-normal text-(--kafka-field-required)"> ({labels.optional})</span>}
        </label>
        {children}
        {hint && <p id={hintId} className="kafka-type-field-hint-type text-(--kafka-field-hint)">{hint}</p>}
        <div aria-live="polite">
          {error && (
            <p id={errorId} className="kafka-type-field-error-type flex items-start gap-(--kafka-field-gap) text-(--kafka-field-error)">
              <IconDanger aria-hidden="true" className="mt-px size-(--kafka-size-icon-sm) shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    </FieldContext.Provider>
  )
}
