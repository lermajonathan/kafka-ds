/* Kafka · Verse */
import { type HTMLAttributes, type ReactNode } from 'react'
import { cx } from './shared'

export interface VerseProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The poem as plain text: one verse per line, a blank line between stanzas. */
  text: string
  /** Author, title or source, shown below the poem. */
  attribution?: ReactNode
}

/** A poem. Verse breaks and stanzas are kept; a long verse that wraps gets a hanging indent so it reads as one line. */
export function Verse({ text, attribution, className, ...rest }: VerseProps) {
  const stanzas = text.replace(/\r\n/g, '\n').trim().split(/\n\s*\n/)
  return (
    <figure className={cx('kafka-verse flex flex-col gap-(--kafka-verse-attribution-gap)', className)} {...rest}>
      <div className="kafka-type-verse-type flex flex-col gap-(--kafka-verse-stanza-gap) text-(--kafka-verse-text)">
        {stanzas.map((stanza, i) => (
          <p key={i}>
            {stanza.split('\n').map((line, j) => (
              <span key={j} className="block pl-(--kafka-verse-hanging-indent) -indent-(--kafka-verse-hanging-indent)">
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>
      {attribution && <figcaption className="kafka-type-verse-attribution-type text-(--kafka-verse-attribution)">{attribution}</figcaption>}
    </figure>
  )
}
