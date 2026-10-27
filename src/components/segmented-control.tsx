/* Kafka · SegmentedControl */
import { useRef, type KeyboardEvent } from 'react'
import type { IconType } from '../icons'
import { cx, focus } from './shared'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  /** Decorative. The text label stays unless the control is `iconOnly`. */
  Icon?: IconType
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Names the group for screen readers ("Vista del calendario"). */
  label: string
  /** `md` is 44 px; `sm` is 32 px, for dense toolbars. */
  size?: 'sm' | 'md'
  /** Shows only the icons, for a phone header or a tight toolbar. The labels stay as the accessible names (and as the tooltip). Every option needs an `Icon`. */
  iconOnly?: boolean
  className?: string
}

/** A strip of mutually exclusive options, one always selected. A radio group: one Tab stop, arrows move and select, Home and End jump to the ends. */
export function SegmentedControl<T extends string>({ options, value, onChange, label, size = 'md', iconOnly = false, className }: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = options.length
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    const target = next === null ? undefined : options[next]
    if (next === null || !target) return
    e.preventDefault()
    onChange(target.value)
    refs.current[next]?.focus()
  }
  const current = options.some((o) => o.value === value) ? value : options[0]?.value
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('inline-flex gap-(--kafka-segmented-control-track-padding) rounded-(--kafka-segmented-control-track-radius) border-(length:--kafka-segmented-control-track-border-width) border-(--kafka-segmented-control-track-border) bg-(--kafka-segmented-control-track-bg) p-(--kafka-segmented-control-track-padding)', className)}
    >
      {options.map((opt, i) => {
        const active = opt.value === current
        return (
          <button
            key={opt.value}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onChange(opt.value)}
            title={iconOnly ? opt.label : undefined}
            className={cx(
              focus,
              'kafka-type-segmented-control-item-type inline-flex cursor-pointer items-center justify-center gap-(--kafka-segmented-control-item-gap) rounded-(--kafka-segmented-control-item-radius) border-(length:--kafka-segmented-control-active-border-width)',
              iconOnly ? 'px-0' : 'px-(--kafka-segmented-control-item-padding-x)',
              size === 'sm'
                ? cx('min-h-(--kafka-segmented-control-item-min-height-sm)', iconOnly && 'min-w-(--kafka-segmented-control-item-min-height-sm)')
                : cx('min-h-(--kafka-segmented-control-item-min-height)', iconOnly && 'min-w-(--kafka-segmented-control-item-min-height)'),
              active
                ? 'border-(--kafka-segmented-control-active-border) bg-(--kafka-segmented-control-active-bg) text-(--kafka-segmented-control-active-fg)'
                : 'border-transparent text-(--kafka-segmented-control-fg) hover:text-(--kafka-segmented-control-fg-hover)',
            )}
          >
            {opt.Icon && <opt.Icon aria-hidden="true" weight={active ? 'fill' : 'regular'} className="size-(--kafka-size-icon-md) shrink-0" />}
            {iconOnly ? <span className="sr-only">{opt.label}</span> : opt.label}
          </button>
        )
      })}
    </div>
  )
}
