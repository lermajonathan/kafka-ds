/* Kafka · EmptyState */
import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { type IconType } from '../icons'
import { cx } from './shared'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What is missing, in a few words. */
  title: ReactNode
  /** Why it is empty and what happens next. */
  description?: ReactNode
  /** A decorative icon. It never carries the message on its own. */
  Icon?: IconType
  /** The one next step: usually a `Button`. */
  action?: ReactNode
  /** Heading level of the title, so it fits the page outline. */
  headingLevel?: 2 | 3 | 4
}

/** What to show when there is nothing to show yet: say what is missing and offer the one next step. */
export function EmptyState({ title, description, Icon, action, headingLevel = 2, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cx('mx-auto flex flex-col items-center gap-(--kafka-empty-state-gap) p-(--kafka-empty-state-padding) text-center', className)} {...rest}>
      {Icon && <Icon aria-hidden="true" className="size-(--kafka-empty-state-icon-size) text-(--kafka-empty-state-icon-fg)" />}
      {createElement(`h${headingLevel}`, { className: 'kafka-type-empty-state-title-type text-(--kafka-empty-state-title-fg)' }, title)}
      {description && <p className="kafka-type-empty-state-description-type max-w-(--kafka-empty-state-max-width) text-(--kafka-empty-state-description-fg)">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
