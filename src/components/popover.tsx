/* Kafka · Popover */
import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type Ref } from 'react'
import { cx } from './shared'
import { focusableIn, useAnchoredPosition, useDismiss, usePopoverState, type Placement } from './overlay'

/** What the trigger must receive. Spread it on a Button (or any button): `trigger={(p) => <Button {...p}>Más</Button>}`. */
export interface PopoverTriggerProps {
  ref: Ref<HTMLButtonElement>
  'aria-expanded': boolean
  'aria-haspopup': 'dialog'
  'aria-controls': string
  onClick: () => void
}

export interface PopoverProps {
  /** Renders the button that opens the panel. */
  trigger: (props: PopoverTriggerProps) => ReactNode
  /** Names the panel for screen readers. */
  label: string
  children: ReactNode
  placement?: Placement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

/** A panel next to a button, for content that is more than a list of actions (a filter form, a date range, details). Not modal: Esc, a click outside, or moving focus away closes it, and focus returns to the button. */
export function Popover({ trigger, label, children, placement = 'bottom-start', open, defaultOpen = false, onOpenChange, className }: PopoverProps) {
  const id = useId()
  const [inner, setInner] = useState(defaultOpen)
  const isOpen = open ?? inner
  const anchor = useRef<HTMLButtonElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const restore = useRef(true)
  const wasOpen = useRef(false)
  const set = useCallback((v: boolean) => { if (open === undefined) setInner(v); onOpenChange?.(v) }, [open, onOpenChange])
  usePopoverState(panel, isOpen)
  useAnchoredPosition(anchor, panel, isOpen, { placement, offset: 8 })
  useDismiss(isOpen, [panel, anchor], (reason) => { restore.current = reason === 'escape'; set(false) })
  useEffect(() => {
    if (!isOpen && wasOpen.current) {
      const active = document.activeElement
      if (restore.current && (active === document.body || panel.current?.contains(active))) anchor.current?.focus()
      restore.current = true
    }
    wasOpen.current = isOpen
  }, [isOpen])
  useEffect(() => {
    if (!isOpen) return
    const first = focusableIn(panel.current)[0]
    ;(first ?? panel.current)?.focus()
  }, [isOpen])
  return (
    <>
      {trigger({ ref: anchor, 'aria-expanded': isOpen, 'aria-haspopup': 'dialog', 'aria-controls': id, onClick: () => set(!isOpen) })}
      <div
        ref={panel}
        id={id}
        popover="manual"
        role="dialog"
        aria-label={label}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key !== 'Tab') return
          const list = focusableIn(panel.current)
          const edge = e.shiftKey ? list[0] ?? panel.current : list[list.length - 1] ?? panel.current
          if (document.activeElement !== edge) return
          // Leaving the panel by keyboard: hand focus back to the button so Tab continues from it.
          restore.current = false
          anchor.current?.focus()
          set(false)
          if (e.shiftKey) e.preventDefault()
        }}
        onBlur={(e) => { const next = e.relatedTarget as Node | null; if (next && !panel.current?.contains(next) && !anchor.current?.contains(next)) { restore.current = false; set(false) } }}
        className={cx('kafka-overlay m-0 max-w-(--kafka-popover-max-width) rounded-(--kafka-popover-radius) border-(length:--kafka-popover-border-width) border-(--kafka-popover-border) bg-(--kafka-popover-bg) p-(--kafka-popover-padding) text-(--kafka-popover-fg) shadow-(--kafka-popover-shadow)', className)}
      >
        {children}
      </div>
    </>
  )
}
