/* Kafka · Embed */
import { useState, type ReactNode } from 'react'
import { IconExternal, IconPlay } from '../icons'
import { Button } from './button'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface EmbedProps {
  /** URL of the content to embed. */
  src: string
  /** Names the content for screen readers. Required: an iframe without a title is a silent box. */
  title: string
  /** Shape of the frame. Interactive pieces are usually 16/9 or 4/3. */
  ratio?: '16/9' | '4/3' | '1/1'
  /** Caption below the frame. */
  caption?: ReactNode
  /** Waits for a click before loading the third-party page: faster reading, and nothing is sent to the provider until the reader asks. */
  deferred?: boolean
  /** Sandbox rules. The default allows scripts, forms, presentation and pop-ups, but not top navigation. */
  sandbox?: string
  className?: string
}

const RATIO = { '16/9': 'aspect-video', '4/3': 'aspect-[4/3]', '1/1': 'aspect-square' }

/** A framed third-party page (Genially, a video, a map). Always titled, always sandboxed, with a link to open it on its own. */
export function Embed({ src, title, ratio = '16/9', caption, deferred = false, sandbox = 'allow-scripts allow-same-origin allow-forms allow-presentation allow-popups', className }: EmbedProps) {
  const labels = useLabels()
  const [loaded, setLoaded] = useState(!deferred)
  return (
    <figure className={cx('flex flex-col gap-(--kafka-embed-gap)', className)}>
      <div className={cx('w-full overflow-hidden rounded-(--kafka-embed-radius) border-(length:--kafka-embed-border-width) border-(--kafka-embed-border) bg-(--kafka-embed-bg)', RATIO[ratio])}>
        {loaded ? (
          <iframe src={src} title={title} loading="lazy" sandbox={sandbox} referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="size-full border-0" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-(--kafka-embed-facade-gap) p-(--kafka-embed-facade-gap) text-center text-(--kafka-embed-facade-fg)">
            <span className="kafka-type-reading-heading-sm">{title}</span>
            <Button Icon={IconPlay} onClick={() => setLoaded(true)}>{labels.loadEmbed}</Button>
          </div>
        )}
      </div>
      <figcaption className="kafka-type-embed-caption-type flex flex-wrap items-center justify-between gap-(--kafka-embed-gap) text-(--kafka-embed-caption)">
        <span>{caption}</span>
        <a href={src} target="_blank" rel="noopener noreferrer" className={cx(focus, 'inline-flex min-h-(--kafka-size-touch) items-center gap-(--kafka-embed-gap) underline underline-offset-4')}>
          {labels.openEmbed}
          <IconExternal aria-hidden="true" className="size-(--kafka-size-icon-sm)" />
        </a>
      </figcaption>
    </figure>
  )
}
