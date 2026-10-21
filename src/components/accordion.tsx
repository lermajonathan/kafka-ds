/* Kafka · Accordion */
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { IconChevronDown } from '../icons'
import { cx, focus } from './shared'

export interface AccordionItem {
  value: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  /** Several sections can be open at once. By default opening one closes the others. */
  multiple?: boolean
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Level of the headings that wrap each title (2 to 6). Pick the one that follows the heading above the accordion. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  className?: string
}

/** Sections that open and close. Each title is a button inside a real heading, so screen readers can list them; Up, Down, Home and End move between titles. */
export function Accordion({ items, multiple = false, value, defaultValue = [], onValueChange, headingLevel = 3, className }: AccordionProps) {
  const uid = useId()
  const [inner, setInner] = useState(defaultValue)
  const open = value ?? inner
  const triggers = useRef<Array<HTMLButtonElement | null>>([])
  const Heading = `h${headingLevel}` as 'h3'
  const toggle = (v: string) => {
    const next = open.includes(v) ? open.filter((x) => x !== v) : multiple ? [...open, v] : [v]
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }
  const onKey = (i: number, e: KeyboardEvent) => {
    const live = triggers.current.map((el, idx) => (el && !el.disabled ? idx : -1)).filter((x) => x >= 0)
    const pos = live.indexOf(i)
    let target: number | undefined
    if (e.key === 'ArrowDown') target = live[(pos + 1) % live.length]
    else if (e.key === 'ArrowUp') target = live[(pos - 1 + live.length) % live.length]
    else if (e.key === 'Home') target = live[0]
    else if (e.key === 'End') target = live[live.length - 1]
    if (target === undefined) return
    e.preventDefault(); triggers.current[target]?.focus()
  }
  return (
    <div className={cx('rounded-(--kafka-accordion-radius) border-(length:--kafka-accordion-border-width) border-(--kafka-accordion-border)', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(item.value)
        return (
          <div key={item.value} className={cx(i > 0 && 'border-t-(length:--kafka-accordion-border-width) border-(--kafka-accordion-border)')}>
            <Heading className="m-0">
              <button
                ref={(el) => { triggers.current[i] = el }}
                type="button"
                id={`${uid}-trigger-${item.value}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-panel-${item.value}`}
                disabled={item.disabled}
                onClick={() => toggle(item.value)}
                onKeyDown={(e) => onKey(i, e)}
                className={cx(focus, 'kafka-type-accordion-trigger-type flex min-h-(--kafka-accordion-trigger-min-height) w-full cursor-pointer items-center justify-between gap-(--kafka-accordion-trigger-padding-x) px-(--kafka-accordion-trigger-padding-x) py-(--kafka-accordion-trigger-padding-y) text-left font-bold text-(--kafka-accordion-trigger-fg) hover:bg-(--kafka-accordion-trigger-hover-bg) disabled:cursor-not-allowed disabled:opacity-(--kafka-button-disabled-opacity)', i === 0 && 'rounded-t-(--kafka-accordion-radius)', i === items.length - 1 && !isOpen && 'rounded-b-(--kafka-accordion-radius)')}
              >
                <span>{item.title}</span>
                <IconChevronDown aria-hidden="true" className={cx('size-(--kafka-accordion-icon-size) shrink-0 text-(--kafka-accordion-icon) transition-transform duration-(--kafka-accordion-duration)', isOpen && 'rotate-180')} />
              </button>
            </Heading>
            <div id={`${uid}-panel-${item.value}`} role="region" aria-labelledby={`${uid}-trigger-${item.value}`} hidden={!isOpen} className="p-(--kafka-accordion-panel-padding) pt-0 text-(--kafka-accordion-panel-fg)">
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
