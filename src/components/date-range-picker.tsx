/* Kafka · DateRangePicker */
import { useEffect, useId, useMemo, useState } from 'react'
import { IconCalendar } from '../icons'
import { Button } from './button'
import { fromISO } from './calendar'
import { useFieldControl, useFieldLabelId } from './field'
import { inputClass } from './input'
import { useLabels } from './labels'
import { Popover } from './popover'
import { RangeCalendar, type DateRange, type RangeCalendarProps } from './range-calendar'
import { cx } from './shared'

export interface DateRangePreset {
  label: string
  range: { start: string; end: string }
}

export interface DateRangePickerProps extends Pick<RangeCalendarProps, 'min' | 'max' | 'locale' | 'weekStartsOn' | 'defaultMonth'> {
  /** The chosen range. Empty is `{ start: null, end: null }`. */
  value: DateRange
  /** Called with a complete range or an empty one, never half-picked. */
  onValueChange: (range: DateRange) => void
  /** Shortcuts to ranges people choose often. */
  presets?: DateRangePreset[]
  /** Shown when nothing is chosen. */
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

/** A field for a range of dates: a button showing the chosen range that opens a calendar in a popover. Put it inside a `Field`. */
export function DateRangePicker({ value, onValueChange, presets, placeholder, invalid, disabled, id, className, min, max, locale = 'es-CO', weekStartsOn, defaultMonth }: DateRangePickerProps) {
  const labels = useLabels()
  const valueId = useId()
  const a11y = useFieldControl({ id, invalid })
  const fieldLabelId = useFieldLabelId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange>(value)
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }), [locale])
  const show = (iso: string) => fmt.format(fromISO(iso))
  const complete = !!value.start && !!value.end
  const text = complete ? labels.rangeValue(show(value.start!), show(value.end!)) : ''
  useEffect(() => { if (open) setDraft(value) }, [open, value])
  const commit = (range: DateRange) => { onValueChange(range); setOpen(false) }
  const name = fieldLabelId ? { 'aria-labelledby': `${fieldLabelId} ${valueId}` } : { 'aria-label': text ? `${labels.chooseDateRange}: ${text}` : labels.chooseDateRange }
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={labels.chooseDateRange}
      placement="bottom-start"
      className={className}
      trigger={(p) => (
        <button
          {...p}
          {...a11y}
          {...name}
          type="button"
          disabled={disabled}
          className={cx(inputClass, 'flex cursor-pointer items-center gap-(--kafka-input-icon-gap) text-left')}
        >
          <IconCalendar aria-hidden="true" className="size-(--kafka-input-icon-size) shrink-0 text-(--kafka-input-icon)" />
          <span id={valueId} className={cx('truncate', !text && 'text-(--kafka-input-placeholder)')}>{text || placeholder || ''}</span>
        </button>
      )}
    >
      <div className="flex flex-col gap-(--kafka-date-range-picker-gap)">
        {presets && presets.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-(--kafka-date-range-picker-preset-gap) p-0">
            {presets.map((p) => (
              <li key={p.label}><Button variant="soft" onClick={() => commit(p.range)}>{p.label}</Button></li>
            ))}
          </ul>
        )}
        <RangeCalendar
          value={draft}
          onValueChange={(r) => { setDraft(r); if (r.start && r.end) commit(r) }}
          defaultMonth={defaultMonth}
          min={min}
          max={max}
          locale={locale}
          weekStartsOn={weekStartsOn}
          className="border-0 p-0"
        />
        <div className="flex justify-end border-t-(length:--kafka-date-range-picker-footer-border-width) border-(--kafka-date-range-picker-footer-border) pt-(--kafka-date-range-picker-footer-padding-top)">
          <Button variant="outline" disabled={!value.start && !draft.start} onClick={() => commit({ start: null, end: null })}>{labels.clearRange}</Button>
        </div>
      </div>
    </Popover>
  )
}
