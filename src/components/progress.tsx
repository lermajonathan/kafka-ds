/* Kafka · Progress */
import { type HTMLAttributes } from 'react'
import { cx } from './shared'

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger'

const FILL: Record<ProgressTone, string> = {
  brand: 'bg-(--kafka-progress-fill-brand)',
  success: 'bg-(--kafka-progress-fill-success)',
  warning: 'bg-(--kafka-progress-fill-warning)',
  danger: 'bg-(--kafka-progress-fill-danger)',
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** From 0 to 100. Values outside the range are clamped. */
  value: number
  /** Accessible name, and what the bar measures ("Subiendo inscripciones.csv"). Required: a bar without a name is just a number. */
  label: string
  /** What screen readers hear instead of the percentage, e.g. "Paso 2 de 5". */
  valueText?: string
  /** Repeats the percentage as text beside the bar. */
  showValue?: boolean
  tone?: ProgressTone
}

/** A bar that shows how far a task has got, when you know the percentage. For an unknown duration use `Spinner`. */
export function Progress({ value, label, valueText, showValue = false, tone = 'brand', className, ...rest }: ProgressProps) {
  const pct = Math.round(Math.min(100, Math.max(0, value)))
  return (
    <div className={cx('flex items-center gap-(--kafka-progress-gap)', className)} {...rest}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={valueText}
        className="h-(--kafka-progress-height) flex-1 overflow-hidden rounded-(--kafka-progress-radius) bg-(--kafka-progress-track)"
      >
        <div className={cx('kafka-progress-bar h-full rounded-(--kafka-progress-radius) transition-[width] duration-(--kafka-progress-transition)', FILL[tone])} style={{ width: `${pct}%` }} />
      </div>
      {showValue && <span aria-hidden="true" className="kafka-type-progress-value-type w-12 shrink-0 text-right text-(--kafka-progress-value-fg)">{pct}%</span>}
    </div>
  )
}
