/* Kafka · Slider */
import { useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react'
import { useFieldControl } from './field'
import { cx } from './shared'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Formats the number shown next to the slider and read as the value text, for example `(v) => \`${v} sesiones\``. */
  formatValue?: (value: number) => ReactNode
  /** Hides the visible value. Keep it unless the page shows the value elsewhere. */
  hideValue?: boolean
}

/** A value inside a range, on the native range input: arrow keys, Home, End and Page Up/Down already work. The value is always shown as text. */
export function Slider({ value, defaultValue, onValueChange, min = 0, max = 100, step = 1, formatValue, hideValue, className, style, ...rest }: SliderProps) {
  const a11y = useFieldControl(rest)
  const [inner, setInner] = useState(defaultValue ?? min)
  const current = value ?? inner
  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100
  const text = formatValue ? formatValue(current) : current
  return (
    <div className={cx('flex items-center gap-(--kafka-field-gap)', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => { const v = Number(e.target.value); if (value === undefined) setInner(v); onValueChange?.(v) }}
        aria-valuetext={typeof text === 'string' || typeof text === 'number' ? String(text) : undefined}
        className="kafka-slider"
        style={{ '--kafka-slider-pct': `${pct}%`, ...style } as CSSProperties}
        {...rest}
        {...a11y}
      />
      {!hideValue && <output aria-hidden="true" className="kafka-type-slider-value-type min-w-(--kafka-size-touch) whitespace-nowrap text-right text-(--kafka-slider-value) tabular-nums">{text}</output>}
    </div>
  )
}
