/* Kafka · Figure */
import { type ImgHTMLAttributes, type ReactNode } from 'react'
import { cx } from './shared'

export type FigureRatio = '16/10' | '4/3' | '1/1' | '3/4' | 'auto'

const RATIO: Record<FigureRatio, string> = { '16/10': 'aspect-[16/10]', '4/3': 'aspect-[4/3]', '1/1': 'aspect-square', '3/4': 'aspect-[3/4]', auto: '' }

export interface FigureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  src: string
  /** Describes the image for people who cannot see it. Required. Pass `""` only when the image is purely decorative. */
  alt: string
  /** Caption below the image: what it shows and why it is here. */
  caption?: ReactNode
  /** Photographer or source, shown after the caption. */
  credit?: ReactNode
  /** Crops the image to a ratio. `auto` keeps the image's own. */
  ratio?: FigureRatio
}

/** An image with a caption and a credit. The image is cropped with `object-cover` and given a sunken background while it loads. */
export function Figure({ src, alt, caption, credit, ratio = '16/10', className, ...img }: FigureProps) {
  return (
    <figure className={cx('flex flex-col gap-(--kafka-figure-gap)', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cx('w-full rounded-(--kafka-figure-radius) bg-(--kafka-figure-bg)', ratio !== 'auto' && 'object-cover', RATIO[ratio])}
        {...img}
      />
      {(caption || credit) && (
        <figcaption className="kafka-type-figure-caption-type text-(--kafka-figure-caption)">
          {caption}
          {credit && <span className="block text-(--kafka-figure-credit)">{credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}
