/* Kafka · DropCap */
import { type HTMLAttributes } from 'react'
import { cx } from './shared'

export type DropCapProps = HTMLAttributes<HTMLParagraphElement>

/** A paragraph whose first letter is a large initial. Done with `::first-letter`, so the text is read as one ordinary paragraph. Use it once, at the start of a text. */
export function DropCap({ className, ...rest }: DropCapProps) {
  return <p className={cx('kafka-drop-cap', className)} {...rest} />
}
