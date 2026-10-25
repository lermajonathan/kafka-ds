/* Kafka · NavMenu */
import { useId, useState, type MouseEvent } from 'react'
import { IconChevronDown, type IconType } from '../icons'
import { Badge } from './badge'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface NavMenuLeaf {
  key: string
  label: string
  /** Where the item goes. Required for every item that is not a group. */
  href?: string
  Icon?: IconType
  badge?: string | number
  /** Shown as plain text with `aria-disabled`, outside the Tab order. */
  disabled?: boolean
}

export interface NavMenuItem extends NavMenuLeaf {
  /** Makes the item a group that opens. One level only. */
  children?: NavMenuLeaf[]
}

export interface NavMenuProps {
  items: NavMenuItem[]
  /** The `key` of the current page. */
  value: string
  /** Lets a single-page app handle the click. Ctrl, Cmd, Shift and middle clicks are left to the browser. */
  onNavigate?: (key: string) => void
  /** Names the landmark. Defaults to "Navegación principal"; give each one a different name when the page has more than one. */
  label?: string
  /** Icons only. The names stay in the page for screen readers and appear as a tooltip. A group without its own `href` is left out. */
  collapsed?: boolean
  className?: string
}

const ITEM =
  'kafka-type-nav-menu-item-type flex min-h-(--kafka-nav-menu-item-min-height) w-full items-center gap-(--kafka-nav-menu-item-gap) rounded-(--kafka-nav-menu-item-radius) border-s-(length:--kafka-nav-menu-indicator-width) border-transparent px-(--kafka-nav-menu-item-padding-x) text-left text-(--kafka-nav-menu-fg) no-underline hover:bg-(--kafka-nav-menu-hover-bg) hover:text-(--kafka-nav-menu-fg-hover) aria-[current=page]:border-(--kafka-nav-menu-indicator) aria-[current=page]:bg-(--kafka-nav-menu-active-bg) aria-[current=page]:font-bold aria-[current=page]:text-(--kafka-nav-menu-active-fg)'

/** The vertical navigation of an app: real links, groups that open, and the current page marked. A `nav` landmark; Tab visits every link in order. */
export function NavMenu({ items, value, onNavigate, label, collapsed = false, className }: NavMenuProps) {
  const labels = useLabels()
  const uid = useId()
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.filter((i) => i.children?.some((c) => c.key === value)).map((i) => i.key)))
  const toggle = (key: string) => setOpen((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next })
  const click = (key: string) => (e: MouseEvent) => {
    if (!onNavigate || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onNavigate(key)
  }
  const content = (item: NavMenuLeaf) => (
    <>
      {item.Icon && <item.Icon aria-hidden="true" weight={item.key === value ? 'fill' : 'regular'} className="size-(--kafka-size-icon-md) shrink-0" />}
      <span className={cx('flex-1 truncate', collapsed && 'sr-only')}>{item.label}</span>
      {!collapsed && item.badge !== undefined && <Badge tone="neutral" Icon={null}>{item.badge}</Badge>}
    </>
  )
  const leaf = (item: NavMenuLeaf) => {
    if (item.disabled || !item.href) {
      return <span aria-disabled="true" className={cx(ITEM, 'cursor-not-allowed opacity-(--kafka-nav-menu-disabled-opacity) hover:bg-transparent')}>{content(item)}</span>
    }
    return (
      <a href={item.href} aria-current={item.key === value ? 'page' : undefined} title={collapsed ? item.label : undefined} onClick={click(item.key)} className={cx(focus, ITEM)}>
        {content(item)}
      </a>
    )
  }
  const visible = collapsed ? items.filter((i) => !i.children?.length || i.href) : items
  return (
    <nav aria-label={label ?? labels.mainNavigation} className={className}>
      <ul className="m-0 flex list-none flex-col gap-(--kafka-nav-menu-list-gap) p-0">
        {visible.map((item) => {
          const group = !collapsed && (item.children?.length ?? 0) > 0
          if (!group) return <li key={item.key}>{leaf(item)}</li>
          const expanded = open.has(item.key)
          const listId = `${uid}-${item.key}`
          return (
            <li key={item.key}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={expanded ? listId : undefined}
                disabled={item.disabled}
                onClick={() => toggle(item.key)}
                className={cx(focus, ITEM, 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-(--kafka-nav-menu-disabled-opacity)')}
              >
                {content(item)}
                <IconChevronDown aria-hidden="true" className={cx('size-(--kafka-size-icon-md) shrink-0', expanded && 'rotate-180')} />
              </button>
              {expanded && (
                <ul id={listId} className="m-0 ms-(--kafka-nav-menu-child-indent) mt-(--kafka-nav-menu-list-gap) flex list-none flex-col gap-(--kafka-nav-menu-list-gap) border-s-(length:--kafka-nav-menu-child-border-width) border-(--kafka-nav-menu-child-border) p-0 ps-(--kafka-nav-menu-child-indent)">
                  {item.children!.map((c) => <li key={c.key}>{leaf(c)}</li>)}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
