/* Kafka · ProgramCard */
import { cloneElement, createElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react'
import { IconCrown, type IconType } from '../icons'
import { Card, type CardHighlight } from './card'
import { useLabels } from './labels'
import { cx } from './shared'

export type CoverTone = 'gold' | 'amber' | 'blue' | 'green'

export interface ProgramCardProps {
  /** The program's name. Rendered as a heading. */
  title: string
  /** Who leads it, or a short tagline. */
  subtitle?: string
  /** A cover photo. `alt` is required. A broken `src` falls back to `cover`. */
  image?: { src: string; alt: string }
  /** A generated cover: an icon over a tone. Used when there is no image, or when it fails to load. */
  cover?: { Icon: IconType; tone?: CoverTone }
  /** Badges placed on the cover, top left (status, modality). */
  badges?: ReactNode
  /** The price, as text: "$200.000". */
  price?: string
  description?: string
  /** One line each, starting with the date. */
  meta?: Array<{ Icon: IconType; text: string }>
  /** The single way forward: a `Button` or a link. It is described by the program's title, so a list of buttons does not read "Inscribirme" five times with no context. */
  action?: ReactNode
  /** `featured` pushes this program; `vip` is the membership. */
  highlight?: CardHighlight
  headingLevel?: 2 | 3 | 4
  className?: string
}

const TONE: Record<CoverTone, string> = {
  gold: 'kafka-cover-gold',
  amber: 'kafka-cover-amber',
  blue: 'kafka-cover-blue',
  green: 'kafka-cover-green',
}

/** A program (workshop, masterclass, membership): cover, badges, price, details and one action. */
export function ProgramCard({ title, subtitle, image, cover, badges, price, description, meta, action, highlight = 'none', headingLevel = 3, className }: ProgramCardProps) {
  const labels = useLabels()
  const titleId = useId()
  const [broken, setBroken] = useState(false)
  const showImage = image && !broken
  const Cover = cover?.Icon
  return (
    <Card as="article" padded={false} highlight={highlight} className={cx('kafka-program-card overflow-hidden', className)}>
      <div className="kafka-program-media relative aspect-[16/10] overflow-hidden rounded-t-(--kafka-card-radius) bg-(--kafka-program-card-media-bg)">
        {showImage ? (
          <img src={image.src} alt={image.alt} onError={() => setBroken(true)} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div aria-hidden="true" className={cx('kafka-cover absolute inset-0 grid place-items-center', TONE[cover?.tone ?? 'gold'])}>
            {Cover && <Cover className="size-24 opacity-70" />}
          </div>
        )}
        <div className="kafka-program-scrim absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-(--kafka-program-card-badge-offset) top-(--kafka-program-card-badge-offset) flex items-start justify-between gap-(--kafka-program-card-badge-gap)">
          <div className="flex flex-wrap gap-(--kafka-program-card-badge-gap)">
            {highlight === 'vip' && (
              <span className="kafka-type-badge-type inline-flex items-center gap-(--kafka-badge-gap) rounded-(--kafka-badge-radius) bg-(--kafka-vip-badge-bg) px-(--kafka-badge-padding-x) py-(--kafka-badge-padding-y) text-(--kafka-vip-badge-fg)">
                <IconCrown aria-hidden="true" className="size-(--kafka-size-icon-sm) shrink-0" />
                {labels.vipBadge}
              </span>
            )}
            {badges}
          </div>
          {price && (
            <span className="kafka-type-program-card-price-type shrink-0 rounded-full bg-(--kafka-program-card-price-bg) px-(--kafka-program-card-price-padding-x) py-(--kafka-program-card-price-padding-y) text-(--kafka-program-card-price-fg)">
              {price}
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-(--kafka-program-card-media-padding)">
          {createElement(`h${headingLevel}`, { id: titleId, className: 'kafka-type-program-card-title-type text-(--kafka-program-card-title-fg)' }, title)}
          {subtitle && <p className="kafka-type-program-card-subtitle-type text-(--kafka-program-card-subtitle-fg)">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-(--kafka-program-card-body-gap) p-(--kafka-program-card-body-padding)">
        {description && <p className="kafka-type-program-card-description-type">{description}</p>}
        {meta && meta.length > 0 && (
          <ul className="kafka-type-program-card-meta-type flex flex-col gap-(--kafka-program-card-meta-gap)">
            {meta.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-(--kafka-program-card-meta-gap)">
                <Icon aria-hidden="true" className="mt-0.5 size-(--kafka-size-icon-sm) shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        )}
        {action && <div className="mt-auto pt-(--kafka-program-card-badge-gap)">{isValidElement<{ 'aria-describedby'?: string }>(action) && !action.props['aria-describedby'] ? cloneElement(action as ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': titleId }) : action}</div>}
      </div>
    </Card>
  )
}
