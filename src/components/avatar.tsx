/* Kafka · Avatar and AvatarGroup */
import { useState, type HTMLAttributes } from 'react'
import { useLabels, type Labels } from './labels'
import { cx } from './shared'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

const SIZE: Record<AvatarSize, string> = {
  sm: 'size-(--kafka-avatar-size-sm) kafka-type-avatar-type-sm',
  md: 'size-(--kafka-avatar-size-md) kafka-type-avatar-type-md',
  lg: 'size-(--kafka-avatar-size-lg) kafka-type-avatar-type-lg',
}
const STATUS: Record<AvatarStatus, string> = {
  online: 'bg-(--kafka-avatar-status-online)',
  away: 'bg-(--kafka-avatar-status-away)',
  busy: 'bg-(--kafka-avatar-status-busy)',
  offline: 'bg-(--kafka-avatar-status-offline)',
}
const STATUS_LABEL: Record<AvatarStatus, keyof Labels> = { online: 'statusOnline', away: 'statusAway', busy: 'statusBusy', offline: 'statusOffline' }

const initialsOf = (name: string) => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Required: it is the accessible name and where the initials come from. */
  name: string
  /** Photo. If it fails to load, the initials show instead. */
  src?: string
  size?: AvatarSize
  /** Rounded square instead of a circle, for organisations. */
  square?: boolean
  /** A presence dot. It is spoken in words, so colour is never the only cue. */
  status?: AvatarStatus
  /** Spoken status text. Defaults to the localised label of `status`. */
  statusLabel?: string
  /** A border in the page colour, so overlapping avatars stay apart. Used by `AvatarGroup`. */
  ring?: boolean
  /** Set when the name is already visible as text next to the avatar, so screen readers don't hear it twice. */
  decorative?: boolean
}

/** A person or entity as a photo or initials, with an optional presence status. */
export function Avatar({ name, src, size = 'md', square = false, status, statusLabel, ring = false, decorative = false, className, ...rest }: AvatarProps) {
  const labels = useLabels()
  // Remember which src failed, so a broken photo shows the initials and a new src gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = !!src && failedSrc !== src
  const shape = cx('shrink-0', square ? 'rounded-(--kafka-avatar-radius-square)' : 'rounded-full', ring && 'border-(length:--kafka-avatar-ring-width) border-(--kafka-avatar-ring)')
  const inner = showImage ? (
    <img src={src} alt={decorative ? '' : name} onError={() => setFailedSrc(src)} className={cx(shape, SIZE[size], 'object-cover')} />
  ) : (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cx(shape, SIZE[size], 'grid place-items-center bg-(--kafka-avatar-bg) text-(--kafka-avatar-fg)')}
    >
      {initialsOf(name)}
    </span>
  )
  if (!status) return <span className={cx('inline-flex', className)} {...rest}>{inner}</span>
  return (
    <span className={cx('relative inline-flex shrink-0', className)} {...rest}>
      {inner}
      <span
        role="img"
        aria-label={statusLabel ?? (labels[STATUS_LABEL[status]] as string)}
        className={cx('absolute right-0 bottom-0 size-(--kafka-avatar-status-size) rounded-full border-(length:--kafka-avatar-ring-width) border-(--kafka-avatar-ring)', STATUS[status])}
      />
    </span>
  )
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  people: Array<{ name: string; src?: string }>
  /** How many avatars to show before the +N chip. */
  max?: number
  size?: AvatarSize
}

/** Overlapping avatars with a +N chip for the rest. Add a visible or hidden sentence when the total matters. */
export function AvatarGroup({ people, max = 4, size = 'sm', className, ...rest }: AvatarGroupProps) {
  const labels = useLabels()
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <div className={cx('flex items-center', className)} {...rest}>
      {shown.map((p, i) => (
        <Avatar key={p.name} name={p.name} src={p.src} size={size} ring className={i > 0 ? '-ml-(--kafka-avatar-group-overlap)' : undefined} />
      ))}
      {extra > 0 && (
        <span
          role="img"
          aria-label={labels.moreCount(extra)}
          className={cx('-ml-(--kafka-avatar-group-overlap) grid shrink-0 place-items-center rounded-full border-(length:--kafka-avatar-ring-width) border-(--kafka-avatar-ring) bg-(--kafka-avatar-overflow-bg) text-(--kafka-avatar-overflow-fg)', SIZE[size])}
        >
          <span aria-hidden="true">+{extra}</span>
        </span>
      )}
    </div>
  )
}
