/* Kafka · TagInput */
import { useState, type KeyboardEvent } from 'react'
import { IconClose } from '../icons'
import { useFieldControl } from './field'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  /** Most tags allowed. Further ones are ignored. */
  max?: number
  /** Return a message to reject a tag, or nothing to accept it. The message is shown by the Field's `error`; here it is announced. */
  validate?: (tag: string, current: string[]) => string | void
  invalid?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

/** Free-form tags. Enter or a comma adds one, Backspace on an empty field removes the last, and each tag has its own remove button. Additions and removals are announced. */
export function TagInput({ value, onChange, placeholder, max, validate, invalid, disabled, id, className }: TagInputProps) {
  const labels = useLabels()
  const a11y = useFieldControl({ id, invalid })
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const add = (raw: string) => {
    const tag = raw.trim().replace(/,$/, '').trim()
    if (!tag) return
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase()) || (max !== undefined && value.length >= max)) { setDraft(''); return }
    const problem = validate?.(tag, value)
    if (problem) { setMessage(problem); return }
    onChange([...value, tag]); setDraft(''); setMessage(labels.tagAdded(tag))
  }
  const remove = (tag: string) => { onChange(value.filter((t) => t !== tag)); setMessage(labels.tagRemoved(tag)) }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(draft) }
    else if (e.key === 'Backspace' && !draft && value.length) { remove(value[value.length - 1]!) }
  }
  return (
    <div className={className}>
      <div
        data-tag-field
        data-invalid={a11y['aria-invalid'] ? true : undefined}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.querySelector('input')?.focus() }}
        className="kafka-type-input-type flex min-h-(--kafka-input-min-height) w-full cursor-text flex-wrap items-center gap-(--kafka-tag-input-gap) rounded-(--kafka-input-radius) border-(length:--kafka-input-border-width) border-(--kafka-input-border) bg-(--kafka-input-bg) px-(--kafka-input-padding-x) py-(--kafka-tag-input-field-padding-y) text-(--kafka-input-fg) hover:border-(--kafka-input-border-hover) has-focus-visible:outline-(length:--kafka-focus-width) has-focus-visible:outline-offset-(--kafka-focus-offset) has-focus-visible:outline-(--kafka-color-border-focus) data-invalid:border-(--kafka-input-invalid-border) has-disabled:cursor-not-allowed has-disabled:opacity-(--kafka-input-disabled-opacity)"
      >
        {value.length > 0 && (
          <ul className="m-0 contents list-none p-0">
            {value.map((tag) => (
              <li key={tag} className="kafka-type-tag-input-tag-type inline-flex h-(--kafka-tag-input-tag-height) max-w-full items-center rounded-(--kafka-tag-input-tag-radius) bg-(--kafka-tag-input-tag-bg) pl-(--kafka-tag-input-tag-padding-left) text-(--kafka-tag-input-tag-fg)">
                <span className="min-w-0 truncate">{tag}</span>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={labels.removeTag(tag)}
                  onClick={() => remove(tag)}
                  className={cx(focus, 'inline-flex size-(--kafka-tag-input-remove-size) shrink-0 cursor-pointer items-center justify-center rounded-(--kafka-tag-input-tag-radius) hover:bg-(--kafka-tag-input-remove-hover-bg)')}
                >
                  <IconClose aria-hidden="true" className="size-(--kafka-tag-input-remove-icon)" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          value={draft}
          disabled={disabled}
          placeholder={placeholder}
          enterKeyHint="enter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => add(draft)}
          className="kafka-type-input-type min-w-(--kafka-tag-input-input-min-width) grow basis-0 bg-transparent py-1 text-(--kafka-input-fg) outline-none placeholder:text-(--kafka-input-placeholder) disabled:cursor-not-allowed"
          {...a11y}
        />
      </div>
      <span className="sr-only" role="status" aria-live="polite">{message}</span>
    </div>
  )
}
