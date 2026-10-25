/* Kafka · Calendar */
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { IconChevronLeft, IconChevronRight } from '../icons'
import { IconButton } from './icon-button'
import { useLabels } from './labels'
import { cx, focus } from './shared'

/** Dates are plain `YYYY-MM-DD` strings in the reader's calendar: no time zones, no off-by-one days. */
export const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const fromISO = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y!, m! - 1, d!) }
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => { const t = new Date(d.getFullYear(), d.getMonth() + n, 1); const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last)) }

export interface CalendarProps {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (iso: string) => void
  /** Earliest and latest selectable dates, as `YYYY-MM-DD`. */
  min?: string
  max?: string
  /** BCP 47 language for month and day names. */
  locale?: string
  /** First day of the week: 0 is Sunday, 1 is Monday. */
  weekStartsOn?: 0 | 1
  className?: string
}

/** How a day looks and is named: the ends of a selection are `edge`, days between are `inRange`; `note` is added to the day's accessible name. */
export interface DayState { edge?: boolean; inRange?: boolean; note?: string }

export interface CalendarBaseProps extends Pick<CalendarProps, 'min' | 'max' | 'locale' | 'weekStartsOn' | 'className'> {
  /** The date (`YYYY-MM-DD`) whose month is shown first. */
  initial: string
  state: (iso: string) => DayState
  onChoose: (iso: string) => void
  /** Rendered under the grid, inside the same border. */
  footer?: ReactNode
}

/** The month grid shared by `Calendar` and `RangeCalendar`: keyboard, labels and layout live here once. */
export function CalendarBase({ initial, state, onChoose, footer, min, max, locale = 'es-CO', weekStartsOn = 1, className }: CalendarBaseProps) {
  const labels = useLabels()
  const uid = useId()
  const today = toISO(new Date())
  const [cursor, setCursor] = useState<Date>(() => fromISO(initial))
  const grid = useRef<HTMLTableElement | null>(null)
  const moved = useRef(false)
  const month = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(cursor)
  const full = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }), [locale])
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 7 + ((i + weekStartsOn) % 7)) // 7 Jan 2024 is a Sunday
    return { short: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d), long: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d) }
  }), [locale, weekStartsOn])
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const lead = (first.getDay() - weekStartsOn + 7) % 7
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells: Array<Date | null> = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))]
  while (cells.length % 7) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
  const disabled = (d: Date) => { const s = toISO(d); return (!!min && s < min) || (!!max && s > max) }
  const choose = (d: Date) => { if (disabled(d)) return; onChoose(toISO(d)) }
  const go = (d: Date) => { moved.current = true; setCursor(d) }
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    grid.current?.querySelector<HTMLElement>(`[data-iso="${toISO(cursor)}"]`)?.focus()
  }, [cursor])
  const onKey = (e: KeyboardEvent) => {
    const k = e.key
    const week = (cursor.getDay() - weekStartsOn + 7) % 7
    const map: Record<string, Date> = {
      ArrowLeft: addDays(cursor, -1), ArrowRight: addDays(cursor, 1), ArrowUp: addDays(cursor, -7), ArrowDown: addDays(cursor, 7),
      Home: addDays(cursor, -week), End: addDays(cursor, 6 - week),
      PageUp: e.shiftKey ? addMonths(cursor, -12) : addMonths(cursor, -1), PageDown: e.shiftKey ? addMonths(cursor, 12) : addMonths(cursor, 1),
    }
    const next = map[k]
    if (next) { e.preventDefault(); go(next) }
  }
  return (
    <div className={cx('inline-flex flex-col gap-(--kafka-calendar-gap) rounded-(--kafka-calendar-radius) border-(length:--kafka-calendar-border-width) border-(--kafka-calendar-border) bg-(--kafka-calendar-bg) p-(--kafka-calendar-padding)', className)}>
      <div className="flex items-center justify-between gap-(--kafka-calendar-gap)">
        <IconButton Icon={IconChevronLeft} label={labels.previousMonth} variant="soft" onClick={() => go(addMonths(cursor, -1))} />
        <h2 id={`${uid}-title`} aria-live="polite" className="kafka-type-calendar-title-type m-0 text-center first-letter:uppercase">{month}</h2>
        <IconButton Icon={IconChevronRight} label={labels.nextMonth} variant="soft" onClick={() => go(addMonths(cursor, 1))} />
      </div>
      <table ref={grid} role="grid" aria-labelledby={`${uid}-title`} onKeyDown={onKey} className="border-collapse">
        <thead>
          <tr>{weekdays.map((w) => <th key={w.long} scope="col" abbr={w.long} className="kafka-type-calendar-weekday-type size-(--kafka-calendar-cell-size) font-normal text-(--kafka-calendar-weekday) capitalize">{w.short}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>
              {w.map((d, j) => {
                if (!d) return <td key={j} />
                const iso = toISO(d)
                const st = state(iso)
                const isToday = iso === today, isFocus = iso === toISO(cursor)
                return (
                  <td key={j} role="gridcell" aria-selected={!!(st.edge || st.inRange)} className="p-0 text-center">
                    <button
                      type="button"
                      data-iso={iso}
                      tabIndex={isFocus ? 0 : -1}
                      disabled={disabled(d)}
                      aria-label={st.note ? `${full.format(d)}, ${st.note}` : full.format(d)}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => { go(d); choose(d) }}
                      className={cx(
                        focus,
                        'kafka-type-calendar-weekday-type grid size-(--kafka-calendar-cell-size) cursor-pointer place-items-center rounded-(--kafka-calendar-cell-radius) text-base tabular-nums disabled:cursor-not-allowed disabled:opacity-(--kafka-calendar-disabled-opacity)',
                        st.edge
                          ? 'bg-(--kafka-calendar-selected-bg) font-bold text-(--kafka-calendar-selected-fg)'
                          : st.inRange
                            ? 'bg-(--kafka-calendar-range-bg) text-(--kafka-calendar-range-fg) hover:bg-(--kafka-calendar-hover-bg)'
                            : 'text-(--kafka-calendar-fg) hover:bg-(--kafka-calendar-hover-bg)',
                        isToday && !st.edge && !st.inRange && 'border-(length:--kafka-calendar-today-border-width) border-(--kafka-calendar-today-border)',
                      )}
                    >
                      <span aria-hidden="true">{d.getDate()}</span>
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {footer}
    </div>
  )
}

/** A month grid. Arrow keys move by day and week, Home and End to the start and end of the week, Page Up and Down by month (Shift for year), Enter or Space chooses. Every day is a button named with its full date. */
export function Calendar({ value, defaultValue = null, onValueChange, min, max, locale, weekStartsOn, className }: CalendarProps) {
  const [inner, setInner] = useState<string | null>(defaultValue)
  const selected = value !== undefined ? value : inner
  return (
    <CalendarBase
      initial={selected ?? toISO(new Date())}
      state={(iso) => ({ edge: iso === selected })}
      onChoose={(iso) => { if (value === undefined) setInner(iso); onValueChange?.(iso) }}
      min={min}
      max={max}
      locale={locale}
      weekStartsOn={weekStartsOn}
      className={className}
    />
  )
}
