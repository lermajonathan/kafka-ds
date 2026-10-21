/* Kafka · Menu */
import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { type IconType } from '../icons'
import { cx, focus } from './shared'
import { useAnchoredPosition, useDismiss, usePopoverState, type Placement } from './overlay'
import { useEffect } from 'react'

export type MenuItem =
  | { separator: true }
  | { label: string; onSelect?: () => void; href?: string; Icon?: IconType; disabled?: boolean; tone?: 'danger' }

export interface MenuTriggerProps {
  ref: Ref<HTMLButtonElement>
  'aria-expanded': boolean
  'aria-haspopup': 'menu'
  'aria-controls': string
  onClick: () => void
  onKeyDown: (e: KeyboardEvent) => void
}

export interface MenuProps {
  trigger: (props: MenuTriggerProps) => ReactNode
  items: MenuItem[]
  /** Names the menu for screen readers. */
  label: string
  placement?: Placement
  className?: string
}

/** A list of actions. Enter, Space or the Down arrow open it with focus on the first item; arrows, Home, End and typing a letter move; Enter activates; Esc closes and returns to the button. Items that only navigate are links. */
export function Menu({ trigger, items, label, placement = 'bottom-start', className }: MenuProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [focusAt, setFocusAt] = useState<'first' | 'last'>('first')
  const anchor = useRef<HTMLButtonElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const typed = useRef({ text: '', t: 0 })
  usePopoverState(panel, open)
  useAnchoredPosition(anchor, panel, open, { placement, offset: 4 })
  const close = useCallback((restore: boolean) => { setOpen(false); if (restore) anchor.current?.focus() }, [])
  useDismiss(open, [panel, anchor], (reason) => close(reason === 'escape'))
  const entries = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])
  useEffect(() => {
    if (!open) return
    const els = entries()
    ;(focusAt === 'last' ? els[els.length - 1] : els[0])?.focus()
  }, [open, focusAt])
  const onKey = (e: KeyboardEvent) => {
    const els = entries()
    const i = els.indexOf(document.activeElement as HTMLElement)
    let next: HTMLElement | undefined
    if (e.key === 'ArrowDown') next = els[(i + 1) % els.length]
    else if (e.key === 'ArrowUp') next = els[(i - 1 + els.length) % els.length]
    else if (e.key === 'Home') next = els[0]
    else if (e.key === 'End') next = els[els.length - 1]
    else if (e.key === 'Tab') { close(false); return }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now()
      typed.current.text = now - typed.current.t < 600 ? typed.current.text + e.key.toLowerCase() : e.key.toLowerCase()
      typed.current.t = now
      const from = typed.current.text.length === 1 ? i + 1 : i
      const order = [...els.slice(from), ...els.slice(0, from)]
      next = order.find((el) => el.textContent?.trim().toLowerCase().startsWith(typed.current.text))
    }
    if (next) { e.preventDefault(); next.focus() }
  }
  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusAt('first'); setOpen(true) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusAt('last'); setOpen(true) }
  }
  const itemClass = cx(focus, 'kafka-type-menu-item-type flex min-h-(--kafka-menu-item-min-height) w-full cursor-pointer items-center gap-(--kafka-menu-item-gap) rounded-(--kafka-menu-item-radius) px-(--kafka-menu-item-padding-x) text-left no-underline hover:bg-(--kafka-menu-item-hover-bg) focus-visible:bg-(--kafka-menu-item-hover-bg) active:bg-(--kafka-menu-item-active-bg) aria-disabled:cursor-not-allowed aria-disabled:opacity-(--kafka-menu-disabled-opacity)')
  return (
    <>
      {trigger({ ref: anchor, 'aria-expanded': open, 'aria-haspopup': 'menu', 'aria-controls': id, onClick: () => { setFocusAt('first'); setOpen(!open) }, onKeyDown: onTriggerKey })}
      <div
        ref={panel}
        id={id}
        popover="manual"
        role="menu"
        aria-label={label}
        onKeyDown={onKey}
        className={cx('kafka-overlay m-0 min-w-(--kafka-menu-min-width) rounded-(--kafka-menu-radius) border-(length:--kafka-menu-border-width) border-(--kafka-menu-border) bg-(--kafka-menu-bg) p-(--kafka-menu-padding) shadow-(--kafka-menu-shadow)', className)}
      >
        {items.map((item, i) => {
          if ('separator' in item) return <div key={`sep-${i}`} role="separator" className="my-(--kafka-menu-padding) h-px bg-(--kafka-menu-separator)" />
          const content = (
            <>
              {item.Icon && <item.Icon aria-hidden="true" className="size-(--kafka-menu-icon-size) shrink-0" />}
              <span>{item.label}</span>
            </>
          )
          const tone = item.tone === 'danger' ? 'text-(--kafka-menu-danger-fg)' : 'text-(--kafka-menu-item-fg)'
          const common = { role: 'menuitem', tabIndex: -1, 'aria-disabled': item.disabled || undefined, className: cx(itemClass, tone) }
          return item.href && !item.disabled
            ? <a key={item.label} href={item.href} {...common} onClick={() => close(false)}>{content}</a>
            : <button key={item.label} type="button" {...common} onClick={() => { if (item.disabled) return; item.onSelect?.(); close(true) }}>{content}</button>
        })}
      </div>
    </>
  )
}
