/* Kafka · PinInput */
import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useFieldControl, useFieldLabelId } from './field'
import { useLabels } from './labels'
import { cx } from './shared'

export interface PinInputProps {
  /** Number of cells. */
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Called once, when every cell is filled. */
  onComplete?: (value: string) => void
  /** `numeric` opens the number pad on phones and keeps digits only. */
  mode?: 'numeric' | 'text'
  /** Names the group when it is not inside a Field. */
  label?: string
  invalid?: boolean
  disabled?: boolean
  name?: string
  className?: string
}

/** A short code, one cell per character. Typing moves forward, Backspace moves back, arrow keys move, and pasting fills every cell. The first cell asks for one-time-code autofill. */
export function PinInput({ length = 6, value, defaultValue = '', onChange, onComplete, mode = 'numeric', label, invalid, disabled, name, className }: PinInputProps) {
  const labels = useLabels()
  const labelledBy = useFieldLabelId()
  const a11y = useFieldControl({ invalid })
  const [inner, setInner] = useState(defaultValue.slice(0, length))
  const current = (value ?? inner).slice(0, length)
  const cells = useRef<Array<HTMLInputElement | null>>([])
  const clean = (s: string) => (mode === 'numeric' ? s.replace(/\D/g, '') : s)
  const commit = (next: string) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
    if (next.length === length) onComplete?.(next)
  }
  const focusCell = (i: number) => { const el = cells.current[Math.max(0, Math.min(length - 1, i))]; el?.focus(); el?.select() }
  const setAt = (i: number, ch: string) => {
    const chars = current.padEnd(length, ' ').split('')
    chars[i] = ch || ' '
    commit(chars.join('').replace(/\s+$/, ''))
  }
  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !current[i]) { e.preventDefault(); if (i > 0) { setAt(i - 1, ''); focusCell(i - 1) } }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusCell(i - 1) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focusCell(i + 1) }
  }
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = clean(e.clipboardData.getData('text')).slice(0, length)
    if (!text) return
    commit(text)
    focusCell(text.length >= length ? length - 1 : text.length)
  }
  return (
    <div role="group" aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy} aria-describedby={a11y['aria-describedby']} className={cx('flex gap-(--kafka-pin-input-gap)', className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { cells.current[i] = el }}
          value={current[i] ?? ''}
          inputMode={mode === 'numeric' ? 'numeric' : 'text'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          name={name ? `${name}-${i}` : undefined}
          aria-label={labels.pinDigit(i + 1, length)}
          aria-invalid={a11y['aria-invalid']}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={onPaste}
          onChange={(e) => {
            const ch = clean(e.target.value).slice(-1)
            if (!ch) { setAt(i, ''); return }
            setAt(i, ch)
            if (i < length - 1) focusCell(i + 1)
          }}
          className={cx(
            'kafka-focus kafka-type-pin-input-type w-(--kafka-pin-input-cell-width) h-(--kafka-pin-input-cell-height) rounded-(--kafka-pin-input-radius) border-(length:--kafka-input-border-width) border-(--kafka-input-border) bg-(--kafka-input-bg) text-center text-(--kafka-input-fg) hover:border-(--kafka-input-border-hover) aria-invalid:border-(--kafka-input-invalid-border) disabled:cursor-not-allowed disabled:opacity-(--kafka-input-disabled-opacity)',
          )}
        />
      ))}
    </div>
  )
}
