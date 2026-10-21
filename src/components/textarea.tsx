/* Kafka · Textarea */
import { type Ref, type TextareaHTMLAttributes } from 'react'
import { useFieldControl } from './field'
import { inputClass } from './input'
import { cx } from './shared'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>
  invalid?: boolean
}

/** A multi-line text field. Same look as `Input`; the reader can resize it vertically. */
export function Textarea({ invalid, className, rows = 4, ref, ...rest }: TextareaProps) {
  const a11y = useFieldControl({ ...rest, invalid })
  return <textarea ref={ref} rows={rows} className={cx(inputClass, 'min-h-(--kafka-textarea-min-height) resize-y', className)} {...rest} {...a11y} />
}
