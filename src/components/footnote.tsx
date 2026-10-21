/* Kafka · Footnote */
import { type HTMLAttributes, type ReactNode } from 'react'
import { IconBackToText } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface FootnoteProps {
  /** The note number, as shown in the text and in the list. */
  n: number | string
  /** Id prefix shared with `Footnotes` and `FootnoteItem`. Defaults to `fn`. */
  idPrefix?: string
  className?: string
}

/** The numbered call inside the text. Links to the note and is the target of the note's back link. */
export function Footnote({ n, idPrefix = 'fn', className }: FootnoteProps) {
  const labels = useLabels()
  return (
    <sup className="leading-none">
      <a
        id={`${idPrefix}-ref-${n}`}
        href={`#${idPrefix}-${n}`}
        aria-label={labels.noteRef(n)}
        className={cx(
          focus,
          '-mx-(--kafka-space-6) inline-flex min-h-(--kafka-footnote-ref-size) min-w-(--kafka-footnote-ref-size) items-center justify-center rounded-(--kafka-footnote-ref-radius) text-(--kafka-footnote-ref-fg) no-underline hover:bg-(--kafka-footnote-ref-hover-bg)',
          className,
        )}
      >
        {n}
      </a>
    </sup>
  )
}

export interface FootnotesProps extends HTMLAttributes<HTMLElement> {
  /** The `FootnoteItem`s, in order. */
  children: ReactNode
}

/** The list of notes, at the end of the text. A labelled `doc-endnotes` section (not an `aside`, which would be a landmark nested inside the article). */
export function Footnotes({ children, className, ...rest }: FootnotesProps) {
  const labels = useLabels()
  return (
    <section
      role="doc-endnotes"
      aria-label={labels.notes}
      className={cx('mt-(--kafka-prose-section-gap) border-t-(length:--kafka-footnote-rule-width) border-(--kafka-footnote-rule) pt-(--kafka-footnote-padding-top)', className)}
      {...rest}
    >
      <ol className="kafka-type-footnote-type flex list-none flex-col gap-(--kafka-footnote-gap) text-(--kafka-footnote-text)">{children}</ol>
    </section>
  )
}

export interface FootnoteItemProps extends HTMLAttributes<HTMLLIElement> {
  n: number | string
  idPrefix?: string
  children: ReactNode
}

/** One note, with a link back to the place in the text where it was called. */
export function FootnoteItem({ n, idPrefix = 'fn', children, className, ...rest }: FootnoteItemProps) {
  const labels = useLabels()
  return (
    <li id={`${idPrefix}-${n}`} className={cx('kafka-footnote-item flex items-center gap-(--kafka-footnote-gap) rounded-(--kafka-footnote-ref-radius)', className)} {...rest}>
      <span aria-hidden="true" className="w-(--kafka-footnote-indent) shrink-0 tabular-nums">{n}.</span>
      <span className="grow">{children}</span>
      <a
        href={`#${idPrefix}-ref-${n}`}
        aria-label={labels.backToText}
        className={cx(focus, 'inline-flex size-(--kafka-footnote-back-size) shrink-0 items-center justify-center rounded-(--kafka-footnote-ref-radius) text-(--kafka-footnote-ref-fg) hover:bg-(--kafka-footnote-ref-hover-bg)')}
      >
        <IconBackToText aria-hidden="true" className="size-(--kafka-size-icon-md)" />
      </a>
    </li>
  )
}
