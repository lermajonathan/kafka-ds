/* Kafka · Alert */
import { type HTMLAttributes, type ReactNode } from 'react'
import { IconCheck, IconClose, IconDanger, IconInfo, IconWarning, type IconType } from '../icons'
import { IconButton } from './icon-button'
import { useLabels } from './labels'
import { cx } from './shared'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

const TONE: Record<AlertTone, string> = {
  info: 'bg-(--kafka-alert-info-bg) border-(--kafka-alert-info-border) text-(--kafka-alert-info-fg)',
  success: 'bg-(--kafka-alert-success-bg) border-(--kafka-alert-success-border) text-(--kafka-alert-success-fg)',
  warning: 'bg-(--kafka-alert-warning-bg) border-(--kafka-alert-warning-border) text-(--kafka-alert-warning-fg)',
  danger: 'bg-(--kafka-alert-danger-bg) border-(--kafka-alert-danger-border) text-(--kafka-alert-danger-fg)',
}
const TONE_ICON: Record<AlertTone, IconType> = { info: IconInfo, success: IconCheck, warning: IconWarning, danger: IconDanger }

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  /** The meaning. Every tone carries an icon and a border, so colour is never the only signal. */
  tone?: AlertTone
  /** A short heading in the tone's colour. */
  title?: ReactNode
  /** Replaces the tone's icon. */
  Icon?: IconType
  /** Use `role="alert"` so screen readers interrupt and read it now. Only for what the reader must hear immediately. */
  urgent?: boolean
  /** Shows a 44 px close button and calls this when it is pressed. The component does not manage focus afterwards. */
  onDismiss?: () => void
  /** A button or link at the end, for the one thing the reader can do about it. */
  action?: ReactNode
}

/** A message inside the page that informs, confirms, warns or reports a problem. It never interrupts: use `ConfirmDialog` when the reader must answer. */
export function Alert({ tone = 'info', title, Icon, urgent = false, onDismiss, action, className, children, ...rest }: AlertProps) {
  const labels = useLabels()
  const Glyph = Icon ?? TONE_ICON[tone]
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      data-tone={tone}
      className={cx('flex items-start gap-(--kafka-alert-gap) rounded-(--kafka-alert-radius) border-(length:--kafka-alert-border-width) p-(--kafka-alert-padding)', TONE[tone], className)}
      {...rest}
    >
      <Glyph aria-hidden="true" className="mt-0.5 size-(--kafka-size-icon-md) shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="kafka-alert-title kafka-type-alert-title-type font-semibold">{title}</p>}
        {children && <div className="kafka-type-alert-body-type text-(--kafka-alert-fg)">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && <IconButton Icon={IconClose} label={labels.close} variant="soft" onClick={onDismiss} className="-my-2 -mr-2" />}
    </div>
  )
}
