/* Kafka · InlineEdit */
import { useEffect, useRef, useState } from 'react'
import { IconPen } from '../icons'
import { inputClass } from './input'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface InlineEditProps {
  /** What is edited ("Título del relato"). It names the field and is read, not shown. */
  label: string
  value: string
  /** Called with the new value when the reader saves. An empty value is not saved. */
  onChange: (value: string) => void
  /** Shown when the value is empty. Defaults to "Haz clic para editar". */
  placeholder?: string
  className?: string
}

/** A short text edited in place. A button that shows the value; Enter or leaving the field saves, Escape cancels, and focus goes back to the button. */
export function InlineEdit({ label, value, onChange, placeholder, className }: InlineEditProps) {
  const labels = useLabels()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const input = useRef<HTMLInputElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const done = useRef(false)
  const returnFocus = useRef(false)

  useEffect(() => {
    if (editing) { done.current = false; input.current?.select() }
    else if (returnFocus.current) { returnFocus.current = false; button.current?.focus() } // right after the button is back, not a frame later
  }, [editing])

  const finish = (save: boolean, focusButton: boolean) => {
    if (done.current) return
    done.current = true
    if (save && draft.trim() !== '') onChange(draft)
    returnFocus.current = focusButton
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={input}
        value={draft}
        aria-label={label}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => finish(true, false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); finish(true, true) }
          else if (e.key === 'Escape') { e.preventDefault(); setDraft(value); finish(false, true) }
        }}
        className={cx(inputClass, className)}
      />
    )
  }

  return (
    <button
      ref={button}
      type="button"
      onClick={() => { setDraft(value); setEditing(true) }}
      className={cx(
        focus,
        'kafka-type-inline-edit-type inline-flex min-h-(--kafka-inline-edit-min-height) cursor-pointer items-center gap-(--kafka-inline-edit-gap) rounded-(--kafka-inline-edit-radius) px-(--kafka-inline-edit-padding-x) text-left text-(--kafka-inline-edit-fg) hover:bg-(--kafka-inline-edit-hover-bg)',
        className,
      )}
    >
      <span>{value || placeholder || labels.clickToEdit}</span>
      <span className="sr-only">, {labels.editField(label)}</span>
      <IconPen aria-hidden="true" className="size-(--kafka-size-icon-md) shrink-0 text-(--kafka-inline-edit-icon)" />
    </button>
  )
}
