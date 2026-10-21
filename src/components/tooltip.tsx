/* Kafka · Tooltip */
import { cloneElement, useCallback, useEffect, useId, useRef, useState, type ReactElement } from 'react'
import { cx } from './shared'
import { useAnchoredPosition, usePopoverState, type Placement } from './overlay'

export interface TooltipProps {
  /** The text. Short, and never the only place a fact appears: touch and some screen readers will not show it. */
  content: string
  /** The one control it describes. It receives `aria-describedby`. */
  children: ReactElement<Record<string, unknown>>
  placement?: Placement
  /** Milliseconds before it shows on hover. Focus shows it at once. */
  delay?: number
  className?: string
}

/** A short description for a control, shown on keyboard focus or after hovering. It stays while the pointer is over it, and Esc hides it (WCAG 1.4.13). The tip is always in the page, so screen readers read it as the control's description. */
export function Tooltip({ content, children, placement = 'top', delay = 400, className }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLSpanElement | null>(null)
  const panel = useRef<HTMLSpanElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const overTip = useRef(false)
  usePopoverState(panel, open)
  useAnchoredPosition(anchor, panel, open, { placement, offset: 8 })
  const show = useCallback((wait: number) => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), wait) }, [])
  const hide = useCallback(() => { clearTimeout(timer.current); timer.current = setTimeout(() => { if (!overTip.current) setOpen(false) }, 100) }, [])
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { clearTimeout(timer.current); overTip.current = false; setOpen(false) } }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [open])
  useEffect(() => () => clearTimeout(timer.current), [])
  const own = children.props as Record<string, (e: never) => void>
  const child = cloneElement(children, {
    'aria-describedby': [children.props['aria-describedby'], id].filter(Boolean).join(' '),
    onFocus: (e: React.FocusEvent<HTMLElement>) => { own.onFocus?.(e as never); if (e.target.matches(':focus-visible')) show(0) },
    onBlur: (e: React.FocusEvent<HTMLElement>) => { own.onBlur?.(e as never); clearTimeout(timer.current); setOpen(false) },
  })
  return (
    <>
      <span
        ref={anchor}
        className="inline-flex"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') show(delay) }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') hide() }}
      >
        {child}
      </span>
      <span
        ref={panel}
        id={id}
        role="tooltip"
        popover="manual"
        onPointerEnter={() => { overTip.current = true }}
        onPointerLeave={() => { overTip.current = false; hide() }}
        className={cx('kafka-overlay kafka-type-tooltip-type m-0 max-w-(--kafka-tooltip-max-width) rounded-(--kafka-tooltip-radius) border-0 bg-(--kafka-tooltip-bg) px-(--kafka-tooltip-padding-x) py-(--kafka-tooltip-padding-y) text-(--kafka-tooltip-fg) shadow-(--kafka-tooltip-shadow)', className)}
      >
        {content}
      </span>
    </>
  )
}
