/* Kafka · Panel */
import { createElement, useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { IconChevronDown, type IconType } from '../icons'
import { cx, focus } from './shared'

export type PanelIconTone = 'brand' | 'info' | 'success' | 'warning' | 'danger'

const ICON_TONE: Record<PanelIconTone, string> = {
  brand: 'bg-(--kafka-panel-icon-brand-bg) text-(--kafka-panel-icon-brand-fg)',
  info: 'bg-(--kafka-panel-icon-info-bg) text-(--kafka-panel-icon-info-fg)',
  success: 'bg-(--kafka-panel-icon-success-bg) text-(--kafka-panel-icon-success-fg)',
  warning: 'bg-(--kafka-panel-icon-warning-bg) text-(--kafka-panel-icon-warning-fg)',
  danger: 'bg-(--kafka-panel-icon-danger-bg) text-(--kafka-panel-icon-danger-fg)',
}

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The panel's name, shown as its heading. */
  title: string
  /** A line under the title that says what the section controls. */
  description?: string
  /** A decorative icon in a tinted box. */
  Icon?: IconType
  iconTone?: PanelIconTone
  /** Buttons or links at the end of the header. */
  actions?: ReactNode
  /** Row at the bottom, aligned to the end: put the main action last. */
  footer?: ReactNode
  /** Adds a 44 px button that collapses the body. */
  collapsible?: boolean
  /** Starts collapsed. Only with `collapsible`. */
  defaultCollapsed?: boolean
  /** Heading level of the title, so it fits the page outline. */
  headingLevel?: 2 | 3 | 4 | 5
}

/** A card with a header (title, description, icon, actions), a body, a footer and optional collapse. For a plain wrapper use `Card`; for several collapsible sections in a stack use `Accordion`. */
export function Panel({ title, description, Icon, iconTone = 'brand', actions, footer, collapsible = false, defaultCollapsed = false, headingLevel = 3, className, children, ...rest }: PanelProps) {
  const [collapsed, setCollapsed] = useState(collapsible && defaultCollapsed)
  const bodyId = useId()
  return (
    <div className={cx('kafka-panel rounded-(--kafka-panel-radius) border-(length:--kafka-panel-border-width) border-(--kafka-panel-border) bg-(--kafka-panel-bg) shadow-(--kafka-panel-shadow)', className)} {...rest}>
      <div className={cx('flex items-center gap-(--kafka-panel-header-gap) px-(--kafka-panel-header-padding-x) py-(--kafka-panel-header-padding-y)', !collapsed && !!(children || footer) && 'border-b border-(--kafka-panel-rule)')}>
        {Icon && (
          <span aria-hidden="true" className={cx('grid size-(--kafka-panel-icon-box) shrink-0 place-items-center rounded-(--kafka-panel-icon-radius)', ICON_TONE[iconTone])}>
            <Icon className="size-(--kafka-size-icon-md)" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          {createElement(`h${headingLevel}`, { className: 'kafka-type-panel-title-type text-(--kafka-panel-title-fg)' }, title)}
          {description && <p className="kafka-type-panel-description-type text-(--kafka-panel-description-fg)">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {collapsible && (
            <button
              type="button"
              aria-expanded={!collapsed}
              aria-controls={bodyId}
              aria-label={title}
              onClick={() => setCollapsed((c) => !c)}
              className={cx(focus, 'inline-flex size-(--kafka-size-touch) cursor-pointer items-center justify-center rounded-(--kafka-panel-icon-radius) text-(--kafka-panel-toggle-fg) hover:bg-(--kafka-panel-toggle-hover-bg)')}
            >
              <IconChevronDown aria-hidden="true" className={cx('size-(--kafka-size-icon-md) transition-transform', collapsed && '-rotate-90')} />
            </button>
          )}
        </div>
      </div>
      <div id={bodyId} hidden={collapsed}>
        {children && <div className="p-(--kafka-panel-body-padding)">{children}</div>}
        {footer && <div className="flex items-center justify-end gap-(--kafka-panel-footer-gap) border-t border-(--kafka-panel-rule) px-(--kafka-panel-footer-padding-x) py-(--kafka-panel-footer-padding-y)">{footer}</div>}
      </div>
    </div>
  )
}
