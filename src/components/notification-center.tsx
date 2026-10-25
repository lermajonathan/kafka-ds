/* Kafka · NotificationCenter */
import { createElement, useId, type ReactNode } from 'react'
import { IconBell, IconCheck, IconClose, IconDanger, IconInfo, IconSuccess, IconWarning, type IconType } from '../icons'
import { CountBadge } from './count-badge'
import { IconButton } from './icon-button'
import { useLabels } from './labels'
import { Popover } from './popover'
import { cx, focus } from './shared'

export type NotificationTone = 'brand' | 'success' | 'warning' | 'danger'

export interface NotificationItem {
  id: string
  title: string
  body?: string
  /** Already formatted for the reader, e.g. "Hace 5 min". */
  time?: string
  read: boolean
  tone?: NotificationTone
}

const ICON: Record<NotificationTone, IconType> = { brand: IconInfo, success: IconSuccess, warning: IconWarning, danger: IconDanger }
const TONE: Record<NotificationTone, string> = {
  brand: 'bg-(--kafka-notification-center-icon-brand-bg) text-(--kafka-notification-center-icon-brand-fg)',
  success: 'bg-(--kafka-notification-center-icon-success-bg) text-(--kafka-notification-center-icon-success-fg)',
  warning: 'bg-(--kafka-notification-center-icon-warning-bg) text-(--kafka-notification-center-icon-warning-fg)',
  danger: 'bg-(--kafka-notification-center-icon-danger-bg) text-(--kafka-notification-center-icon-danger-fg)',
}

export interface NotificationCenterProps {
  items: NotificationItem[]
  /** Called when the reader marks one as read. The page owns the list and the read state. */
  onRead: (id: string) => void
  onReadAll?: () => void
  /** Adds a Dismiss button to every item. */
  onDismiss?: (id: string) => void
  /** Content under the list, such as a "Ver todas" link. */
  footer?: ReactNode
  placement?: 'bottom-start' | 'bottom-end'
  className?: string
}

/** A bell with an unread count that opens a list the reader can review later. For feedback that must appear right now use `Toast`. Controlled: the page owns the items. */
export function NotificationCenter({ items, onRead, onReadAll, onDismiss, footer, placement = 'bottom-end', className }: NotificationCenterProps) {
  const labels = useLabels()
  const unread = items.filter((n) => !n.read).length
  const listId = useId()
  // The item the reader acts on may disappear; hand focus to something that stays so it is never lost to the page.
  const keepFocus = (el: HTMLElement) => el.closest<HTMLElement>('[role="dialog"]')?.focus()
  return (
    <Popover
      label={labels.notifications}
      placement={placement}
      className={className}
      trigger={(p) => (
        <button
          type="button"
          {...p}
          aria-label={unread > 0 ? labels.notificationsUnread(unread) : labels.notifications}
          className={cx(focus, 'relative inline-flex size-(--kafka-size-touch) cursor-pointer items-center justify-center rounded-(--kafka-icon-button-radius) border-(length:--kafka-panel-border-width) border-(--kafka-panel-border) bg-(--kafka-panel-bg) text-(--kafka-panel-toggle-fg) hover:bg-(--kafka-panel-toggle-hover-bg)')}
        >
          <IconBell aria-hidden="true" className="size-(--kafka-size-icon-lg)" />
          {unread > 0 && <span aria-hidden="true" className="absolute -top-1 -right-1"><CountBadge count={unread} /></span>}
        </button>
      )}
    >
      <div className="flex w-[min(var(--kafka-notification-center-width),calc(100vw-2rem))] flex-col">
        {unread > 0 && onReadAll && (
          <div className="flex justify-end pb-1">
            <button
              type="button"
              onClick={(e) => { keepFocus(e.currentTarget); onReadAll() }}
              className={cx(focus, 'kafka-type-notification-center-body-type inline-flex min-h-(--kafka-size-touch) cursor-pointer items-center px-2 font-semibold text-(--kafka-notification-center-action) underline underline-offset-2 hover:no-underline')}
            >
              {labels.markAllRead}
            </button>
          </div>
        )}
        {items.length === 0 ? (
          <p className="kafka-type-notification-center-body-type px-2 py-6 text-center text-(--kafka-notification-center-empty-fg)">{labels.noNotifications}</p>
        ) : (
          <ul id={listId} className="m-0 max-h-(--kafka-notification-center-max-height) list-none overflow-y-auto p-0">
            {items.map((n) => {
              const tone = n.tone ?? 'brand'
              return (
                <li
                  key={n.id}
                  tabIndex={-1}
                  className={cx('flex items-start gap-(--kafka-notification-center-gap) border-t border-(--kafka-notification-center-rule) px-(--kafka-notification-center-padding-x) py-(--kafka-notification-center-padding-y) first:border-t-0 outline-none', !n.read && 'bg-(--kafka-notification-center-unread-bg)')}
                >
                  {createElement(ICON[tone], { 'aria-hidden': true, className: cx('size-(--kafka-notification-center-icon-box) shrink-0 rounded-full p-1.5', TONE[tone]) })}
                  <div className="min-w-0 flex-1">
                    <p className={cx('kafka-type-notification-center-title-type text-(--kafka-notification-center-title-fg)', !n.read && 'font-semibold')}>
                      {!n.read && <span className="sr-only">{labels.unread}: </span>}{n.title}
                    </p>
                    {n.body && <p className="kafka-type-notification-center-body-type text-(--kafka-notification-center-body-fg)">{n.body}</p>}
                    {n.time && <p className="kafka-type-notification-center-body-type text-(--kafka-notification-center-time-fg)">{n.time}</p>}
                  </div>
                  <div className="flex shrink-0 items-center">
                    {!n.read && (
                      <IconButton Icon={IconCheck} label={labels.markRead(n.title)} variant="soft" onClick={(e) => { (e.currentTarget.closest('li') as HTMLElement | null)?.focus(); onRead(n.id) }} />
                    )}
                    {onDismiss && (
                      <IconButton Icon={IconClose} label={labels.dismissNotification(n.title)} variant="soft" onClick={(e) => { keepFocus(e.currentTarget); onDismiss(n.id) }} />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        {footer && <div className="border-t border-(--kafka-notification-center-rule) pt-2">{footer}</div>}
      </div>
    </Popover>
  )
}
