/* Kafka · DatePicker */
import { useState } from 'react'
import { IconCalendar } from '../icons'
import { Calendar, fromISO, toISO, type CalendarProps } from './calendar'
import { useFieldControl } from './field'
import { IconButton } from './icon-button'
import { inputClass } from './input'
import { useLabels } from './labels'
import { Popover } from './popover'
import { cx } from './shared'

export interface DatePickerProps extends Pick<CalendarProps, 'min' | 'max' | 'locale' | 'weekStartsOn'> {
  /** The date as `YYYY-MM-DD`, or `null` when empty. */
  value?: string | null
  onValueChange?: (iso: string | null) => void
  /** Order of day, month and year when typing: `dmy` (31/12/2026), `mdy` or `ymd`. */
  order?: 'dmy' | 'mdy' | 'ymd'
  invalid?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

const SEP = '/'
const format = (iso: string | null | undefined, order: 'dmy' | 'mdy' | 'ymd') => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return (order === 'dmy' ? [d, m, y] : order === 'mdy' ? [m, d, y] : [y, m, d]).join(SEP)
}
const parse = (text: string, order: 'dmy' | 'mdy' | 'ymd'): string | null => {
  const parts = text.trim().split(/[/.\-\s]+/).map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n))) return null
  const [a, b, c] = parts as [number, number, number]
  const [y, m, d] = order === 'dmy' ? [c, b, a] : order === 'mdy' ? [c, a, b] : [a, b, c]
  if (y < 1000 || y > 9999) return null
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? toISO(dt) : null
}

/** A date field you can type in (day/month/year) or fill from a calendar. Typing is never replaced by the calendar: both write the same value. Put it inside a `Field`. */
export function DatePicker({ value, onValueChange, order = 'dmy', min, max, locale, weekStartsOn, invalid, disabled, id, className }: DatePickerProps) {
  const labels = useLabels()
  const [bad, setBad] = useState(false)
  const a11y = useFieldControl({ id, invalid: invalid || bad })
  const [draft, setDraft] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const shown = draft ?? format(value, order)
  const placeholder = order === 'dmy' ? 'dd/mm/aaaa' : order === 'mdy' ? 'mm/dd/aaaa' : 'aaaa/mm/dd'
  const commit = (text: string) => {
    if (text.trim() === '') { setDraft(null); setBad(false); onValueChange?.(null); return }
    const iso = parse(text, order)
    if (iso && (!min || iso >= min) && (!max || iso <= max)) { setDraft(null); setBad(false); onValueChange?.(iso) }
    else setBad(true)
  }
  return (
    <div className={cx('flex items-center gap-(--kafka-date-picker-gap)', className)}>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={shown}
        onChange={(e) => { setDraft(e.target.value); setBad(false); const iso = parse(e.target.value, order); if (iso && (!min || iso >= min) && (!max || iso <= max)) onValueChange?.(iso) }}
        onBlur={(e) => commit(e.target.value)}
        className={inputClass}
        {...a11y}
      />
      <Popover
        open={open}
        onOpenChange={setOpen}
        label={labels.openCalendar}
        placement="bottom-end"
        trigger={(p) => <IconButton {...p} Icon={IconCalendar} label={labels.openCalendar} variant="soft" disabled={disabled} />}
      >
        <Calendar value={value ?? null} onValueChange={(iso) => { setDraft(null); setBad(false); onValueChange?.(iso); setOpen(false) }} min={min} max={max} locale={locale} weekStartsOn={weekStartsOn} className="border-0 p-0" />
      </Popover>
    </div>
  )
}
