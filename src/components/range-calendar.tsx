/* Kafka · RangeCalendar */
import { useMemo } from 'react'
import { CalendarBase, fromISO, toISO, type CalendarProps } from './calendar'
import { useLabels } from './labels'

/** A range as `YYYY-MM-DD` strings. `end` is `null` while only the first day is chosen. */
export interface DateRange {
  start: string | null
  end: string | null
}

export interface RangeCalendarProps extends Pick<CalendarProps, 'min' | 'max' | 'locale' | 'weekStartsOn' | 'className'> {
  value: DateRange
  onValueChange: (range: DateRange) => void
  /** The month shown first when nothing is chosen, as `YYYY-MM-DD`. Defaults to today. */
  defaultMonth?: string
}

/** A month grid for choosing a first and a last day. A third choice starts a new range; an earlier second day swaps the ends. A status line says what to do next. */
export function RangeCalendar({ value, onValueChange, defaultMonth, min, max, locale = 'es-CO', weekStartsOn, className }: RangeCalendarProps) {
  const labels = useLabels()
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }), [locale])
  const show = (iso: string) => fmt.format(fromISO(iso))
  const { start, end } = value
  const choose = (iso: string) => {
    if (start && !end) onValueChange(iso < start ? { start: iso, end: start } : { start, end: iso })
    else onValueChange({ start: iso, end: null })
  }
  const state = (iso: string) => {
    if (start && iso === start) return { edge: true, note: labels.rangeStartDay }
    if (end && iso === end) return { edge: true, note: labels.rangeEndDay }
    if (start && end && iso > start && iso < end) return { inRange: true }
    return {}
  }
  const status = start && end ? labels.rangeValue(show(start), show(end)) : start ? labels.rangePickEnd(show(start)) : labels.rangePickStart
  return (
    <CalendarBase
      initial={start ?? defaultMonth ?? toISO(new Date())}
      state={state}
      onChoose={choose}
      min={min}
      max={max}
      locale={locale}
      weekStartsOn={weekStartsOn}
      className={className}
      footer={<p role="status" className="kafka-type-calendar-weekday-type m-0 text-center text-(--kafka-calendar-weekday)">{status}</p>}
    />
  )
}
