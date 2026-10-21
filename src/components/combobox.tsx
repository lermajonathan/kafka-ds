/* Kafka · Combobox */
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { IconChevronDown } from '../icons'
import { useFieldControl } from './field'
import { inputClass } from './input'
import { useLabels } from './labels'
import { cx } from './shared'
import { useAnchoredPosition, usePopoverState } from './overlay'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  /** Text shown when nothing matches. Defaults to the localised "Sin resultados". */
  emptyText?: string
  invalid?: boolean
  disabled?: boolean
  id?: string
  name?: string
  className?: string
}

const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** A text field with a list of options that narrows as you type (ARIA combobox with a listbox popup). Up and Down move through options without leaving the field, Enter chooses, Esc closes. Use `Select` when the list is short. */
export function Combobox({ options, value, defaultValue = null, onValueChange, placeholder, emptyText, invalid, disabled, id, name, className }: ComboboxProps) {
  const labels = useLabels()
  const a11y = useFieldControl({ id, invalid })
  const uid = useId()
  const listId = `${uid}-list`
  const [inner, setInner] = useState<string | null>(defaultValue)
  const selected = value !== undefined ? value : inner
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? ''
  const [query, setQuery] = useState<string | null>(null) // null = show the selected label
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const field = useRef<HTMLDivElement | null>(null)
  const list = useRef<HTMLUListElement | null>(null)
  const text = query ?? selectedLabel
  const shown = useMemo(() => (query === null || query === '' ? options : options.filter((o) => fold(o.label).includes(fold(query)))), [options, query])
  usePopoverState(list as never, open)
  useAnchoredPosition(field, list as never, open, { placement: 'bottom-start', offset: 4, matchWidth: true })
  const choose = (o: ComboboxOption | undefined) => {
    if (!o || o.disabled) return
    if (value === undefined) setInner(o.value)
    onValueChange?.(o.value); setQuery(null); setOpen(false)
  }
  const reset = () => { setQuery(null); setOpen(false) }
  const move = (dir: 1 | -1) => {
    if (!shown.length) return
    let i = active
    for (let n = 0; n < shown.length; n++) { i = (i + dir + shown.length) % shown.length; if (!shown[i]!.disabled) break }
    setActive(i)
    list.current?.children[i]?.scrollIntoView({ block: 'nearest' })
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) { setOpen(true); setActive(Math.max(0, shown.findIndex((o) => o.value === selected))) } else move(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) setOpen(true); else move(-1) }
    else if (e.key === 'Enter' && open) { e.preventDefault(); choose(shown[active]) }
    else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); reset() }
    else if (e.key === 'Escape' && query) { setQuery(null) }
  }
  const optId = (i: number) => `${uid}-opt-${i}`
  return (
    <div ref={field} className={cx('relative', className)}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && shown[active] ? optId(active) : undefined}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={text}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0) }}
        onKeyDown={onKey}
        onClick={() => !disabled && setOpen(true)}
        onBlur={reset}
        className={cx(inputClass, 'pr-(--kafka-select-padding-right)')}
        {...a11y}
      />
      {name && <input type="hidden" name={name} value={selected ?? ''} />}
      <IconChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-(--kafka-input-padding-x) size-(--kafka-combobox-icon-size) -translate-y-1/2 text-(--kafka-combobox-icon)" />
      <ul
        ref={list}
        id={listId}
        role="listbox"
        popover="manual"
        aria-label={undefined}
        aria-labelledby={a11y.id ? undefined : undefined}
        className="kafka-overlay m-0 max-h-(--kafka-combobox-list-max-height) list-none overflow-y-auto rounded-(--kafka-combobox-list-radius) border-(length:--kafka-combobox-list-border-width) border-(--kafka-combobox-list-border) bg-(--kafka-combobox-list-bg) p-(--kafka-combobox-list-padding) shadow-(--kafka-combobox-list-shadow)"
      >
        {shown.length === 0 ? (
          <li role="presentation" className="kafka-type-combobox-option-type flex min-h-(--kafka-combobox-option-min-height) items-center px-(--kafka-combobox-option-padding-x) text-(--kafka-combobox-empty)">{emptyText ?? labels.noResults}</li>
        ) : shown.map((o, i) => (
          <li
            key={o.value}
            id={optId(i)}
            role="option"
            aria-selected={o.value === selected}
            aria-disabled={o.disabled || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choose(o)}
            onMouseMove={() => setActive(i)}
            className={cx('kafka-type-combobox-option-type flex min-h-(--kafka-combobox-option-min-height) cursor-pointer items-center rounded-(--kafka-combobox-option-radius) px-(--kafka-combobox-option-padding-x) text-(--kafka-combobox-option-fg) aria-disabled:cursor-not-allowed aria-disabled:opacity-(--kafka-button-disabled-opacity)', i === active && 'bg-(--kafka-combobox-option-active-bg)', o.value === selected && 'font-bold')}
          >
            {o.label}
          </li>
        ))}
      </ul>
      <span role="status" aria-live="polite" className="sr-only">{open ? (shown.length ? labels.resultsAvailable(shown.length) : labels.noResults) : ''}</span>
    </div>
  )
}
