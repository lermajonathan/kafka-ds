/* Kafka · ReadingTime */
import { type HTMLAttributes } from 'react'
import { IconClock } from '../icons'
import { useLabels } from './labels'
import { cx } from './shared'

export interface ReadingTimeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The text to measure (plain string). Or pass `words`. */
  text?: string
  /** Word count, if you already have it. */
  words?: number
  /** Reading speed in words per minute. 200 is a careful pace for literary text in Spanish. */
  wordsPerMinute?: number
}

/** Counts words in a string. Exported so a build step can compute it once. */
export const countWords = (text: string) => (text.trim().match(/\S+/g) ?? []).length

/** "5 min read", rounded up, never less than 1. Also exposes the duration as machine-readable `<time>`. */
export function ReadingTime({ text, words, wordsPerMinute = 200, className, ...rest }: ReadingTimeProps) {
  const labels = useLabels()
  const minutes = Math.max(1, Math.ceil((words ?? countWords(text ?? '')) / wordsPerMinute))
  return (
    <span className={cx('kafka-type-reading-time-type inline-flex items-center gap-(--kafka-reading-time-gap) text-(--kafka-reading-time-fg)', className)} {...rest}>
      <IconClock aria-hidden="true" className="size-(--kafka-size-icon-sm)" />
      <time dateTime={`PT${minutes}M`}>{labels.readingTime(minutes)}</time>
    </span>
  )
}
