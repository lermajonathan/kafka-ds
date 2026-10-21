/* Kafka · Tabs */
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx, focus } from './shared'

export interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Names the set of tabs for screen readers ("Detalles del programa"). */
  label: string
  className?: string
}

/** Tabs with automatic activation: moving focus with the arrow keys also shows that panel. One tab stop for the list, then Tab goes into the panel. */
export function Tabs({ items, value, defaultValue, onValueChange, label, className }: TabsProps) {
  const uid = useId()
  const enabled = items.filter((i) => !i.disabled)
  const [inner, setInner] = useState(defaultValue ?? enabled[0]?.value)
  const current = value ?? inner
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const select = (v: string) => { if (value === undefined) setInner(v); onValueChange?.(v) }
  const onKey = (e: KeyboardEvent) => {
    const i = enabled.findIndex((t) => t.value === current)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % enabled.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1
    if (next === null) return
    e.preventDefault()
    const t = enabled[next]!
    select(t.value); refs.current[t.value]?.focus()
  }
  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex gap-(--kafka-tabs-gap) overflow-x-auto border-b-(length:--kafka-tabs-list-border-width) border-(--kafka-tabs-list-border)">
        {items.map((t) => {
          const selected = t.value === current
          return (
            <button
              key={t.value}
              ref={(el) => { refs.current[t.value] = el }}
              role="tab"
              type="button"
              id={`${uid}-tab-${t.value}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${t.value}`}
              tabIndex={selected ? 0 : -1}
              disabled={t.disabled}
              onClick={() => select(t.value)}
              className={cx(
                focus,
                'kafka-type-tabs-tab-type -mb-px min-h-(--kafka-tabs-tab-min-height) shrink-0 cursor-pointer rounded-t-(--kafka-tabs-radius) border-b-(length:--kafka-tabs-indicator-width) px-(--kafka-tabs-tab-padding-x) whitespace-nowrap hover:bg-(--kafka-tabs-tab-hover-bg) hover:text-(--kafka-tabs-tab-fg-hover) disabled:cursor-not-allowed disabled:opacity-(--kafka-tabs-disabled-opacity)',
                selected ? 'border-(--kafka-tabs-indicator) font-bold text-(--kafka-tabs-tab-fg-selected)' : 'border-transparent text-(--kafka-tabs-tab-fg)',
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      {items.map((t) => (
        <div
          key={t.value}
          role="tabpanel"
          id={`${uid}-panel-${t.value}`}
          aria-labelledby={`${uid}-tab-${t.value}`}
          hidden={t.value !== current}
          tabIndex={0}
          className={cx(focus, 'pt-(--kafka-tabs-panel-padding-top)')}
        >
          {t.value === current && t.content}
        </div>
      ))}
    </div>
  )
}
