/* Kafka · Toast and ToastStack */
import { useEffect, useRef, type FocusEvent } from 'react'
import { IconCheck, IconClose, IconDanger, IconInfo, IconWarning, type IconType } from '../icons'
import { IconButton } from './icon-button'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export interface ToastItem {
  id: string
  tone?: ToastTone
  title: string
  description?: string
  /** One follow-up action, for example Undo. Pressing it also closes the toast. */
  action?: { label: string; onClick: () => void }
  /** Closes the toast by itself after this many milliseconds. Off by default. Ignored for `danger`. The timer pauses while the pointer is over the toast or focus is inside it. */
  duration?: number
}

const TONE: Record<ToastTone, string> = {
  info: 'bg-(--kafka-toast-info-bg) border-(--kafka-toast-info-border)',
  success: 'bg-(--kafka-toast-success-bg) border-(--kafka-toast-success-border)',
  warning: 'bg-(--kafka-toast-warning-bg) border-(--kafka-toast-warning-border)',
  danger: 'bg-(--kafka-toast-danger-bg) border-(--kafka-toast-danger-border)',
}
const TITLE: Record<ToastTone, string> = {
  info: 'text-(--kafka-toast-info-fg)',
  success: 'text-(--kafka-toast-success-fg)',
  warning: 'text-(--kafka-toast-warning-fg)',
  danger: 'text-(--kafka-toast-danger-fg)',
}
const ICON: Record<ToastTone, IconType> = { info: IconInfo, success: IconCheck, warning: IconWarning, danger: IconDanger }

export interface ToastProps {
  item: ToastItem
  onDismiss: (id: string) => void
}

/** One notice, announced on its own: a `status` politely, a `danger` toast as an `alert`. It is controlled: the page keeps the list and removes the toast in `onDismiss`. */
export function Toast({ item, onDismiss }: ToastProps) {
  const labels = useLabels()
  const tone = item.tone ?? 'info'
  const Glyph = ICON[tone]
  const auto = tone !== 'danger' && item.duration && item.duration > 0 ? item.duration : 0
  const dismiss = useRef(onDismiss)
  dismiss.current = onDismiss
  const remaining = useRef(auto)
  const startedAt = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const hovered = useRef(false)
  const focused = useRef(false)

  const start = () => {
    if (!auto || timer.current !== undefined) return
    startedAt.current = Date.now()
    timer.current = window.setTimeout(() => dismiss.current(item.id), remaining.current)
  }
  const stop = () => {
    if (timer.current === undefined) return
    window.clearTimeout(timer.current)
    timer.current = undefined
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current))
  }
  useEffect(() => {
    start()
    return () => { window.clearTimeout(timer.current); timer.current = undefined }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the timer starts once, when the toast appears
  }, [])

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-atomic="true"
      data-tone={tone}
      onMouseEnter={() => { hovered.current = true; stop() }}
      onMouseLeave={() => { hovered.current = false; if (!focused.current) start() }}
      onFocus={() => { focused.current = true; stop() }}
      onBlur={(e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) { focused.current = false; if (!hovered.current) start() } }}
      className={cx('kafka-toast pointer-events-auto flex w-full items-start gap-(--kafka-toast-gap) rounded-(--kafka-toast-radius) border-(length:--kafka-toast-border-width) p-(--kafka-toast-padding) shadow-(--kafka-toast-shadow) sm:w-(--kafka-toast-width)', TONE[tone])}
    >
      <Glyph aria-hidden="true" className={cx('mt-0.5 size-(--kafka-size-icon-md) shrink-0', TITLE[tone])} />
      <div className="min-w-0 flex-1">
        <p className={cx('kafka-type-toast-title-type font-semibold', TITLE[tone])}>{item.title}</p>
        {item.description && <p className="kafka-type-toast-body-type text-(--kafka-toast-fg)">{item.description}</p>}
        {item.action && (
          <button
            type="button"
            onClick={() => { item.action!.onClick(); onDismiss(item.id) }}
            className={cx(focus, 'kafka-type-toast-body-type -ml-1 inline-flex min-h-(--kafka-size-touch) cursor-pointer items-center px-1 font-semibold text-(--kafka-toast-action) underline underline-offset-2 hover:no-underline')}
          >
            {item.action.label}
          </button>
        )}
      </div>
      <IconButton Icon={IconClose} label={labels.close} variant="soft" onClick={() => onDismiss(item.id)} className="-my-2 -mr-2" />
    </div>
  )
}

export interface ToastStackProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  /** Name of the region. Defaults to the localised "Notifications". */
  label?: string
}

/** The fixed container that stacks toasts at the bottom of the screen. Render it once near the root. Each toast announces itself, so the stack is just a labelled region. */
export function ToastStack({ toasts, onDismiss, label }: ToastStackProps) {
  const labels = useLabels()
  return (
    <section
      aria-label={label ?? labels.notifications}
      className="pointer-events-none fixed inset-x-(--kafka-toast-offset) bottom-(--kafka-toast-offset) z-(--kafka-layer-toast) flex flex-col items-stretch gap-(--kafka-toast-stack-gap) sm:inset-x-auto sm:right-(--kafka-toast-offset) sm:items-end"
    >
      {toasts.map((t) => <Toast key={t.id} item={t} onDismiss={onDismiss} />)}
    </section>
  )
}
