/* Kafka · Prose */
import { type ElementType, type HTMLAttributes } from 'react'
import { cx } from './shared'

export interface ProseProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Use `article` for a full text, `div` inside a layout that already has one. */
  as?: ElementType
  /** Lets the text fill its container instead of stopping at the reading measure (66ch). Prefer the default for anything longer than a paragraph. */
  fullWidth?: boolean
}

/** A reading column: styles the paragraphs, headings, lists, links, block quotes and rules inside it. */
export function Prose({ as: Tag = 'div', fullWidth = false, className, ...rest }: ProseProps) {
  return <Tag className={cx('kafka-prose', fullWidth && 'kafka-prose-wide', className)} {...rest} />
}

/** Add to the first paragraph to make it a lead (larger, softer). */
export const proseLead = 'kafka-prose-lead'
