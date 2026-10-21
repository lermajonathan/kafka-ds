/* Kafka · TagInput */
import { useState, type KeyboardEvent } from 'react'
import { IconClose } from '../icons'
import { useFieldControl } from './field'
import { useLabels } from './labels'
import { cx, focus } from './shared'
import { inputClass } from './input'

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
    <div className={cx('flex flex-col gap-(--kafka-tag-input-gap)', className)}>
      {value.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-(--kafka-tag-input-gap) p-0">
          {value.map((tag) => (
            <li key={tag} className="kafka-type-tag-input-tag-type inline-flex min-h-(--kafka-tag-input-remove-size) items-center rounded-(--kafka-tag-input-tag-radius) bg-(--kafka-tag-input-tag-bg) pl-(--kafka-tag-input-tag-padding-left) text-(--kafka-tag-input-tag-fg)">
              <span>{tag}</span>
              <button
                type="button"
                disabled={disabled}
                aria-label={labels.removeTag(tag)}
                onClick={() => remove(tag)}
                className={cx(focus, 'inline-flex size-(--kafka-tag-input-remove-size) cursor-pointer items-center justify-center rounded-(--kafka-tag-input-tag-radius) hover:bg-(--kafka-tag-input-remove-hover-bg)')}
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
        className={inputClass}
        {...a11y}
      />
      <span className="sr-only" role="status" aria-live="polite">{message}</span>
    </div>
  )
}
