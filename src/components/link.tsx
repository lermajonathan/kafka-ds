/* Kafka · Link */
import { type AnchorHTMLAttributes } from 'react'
import { IconExternal } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Opens in a new tab with `rel="noopener noreferrer"`, shows an icon and tells screen readers. Use it only when leaving would lose the reader's work. */
  external?: boolean
  /** `inline` sits in a sentence; `standalone` is a link on its own line, at least 44 px tall. */
  variant?: 'inline' | 'standalone'
}

/** An `<a>` that is always underlined, with a visible focus ring and distinct hover and visited colours. For navigation: if it triggers an action, use a button. */
export function Link({ external = false, variant = 'inline', className, children, ...rest }: LinkProps) {
  const labels = useLabels()
  return (
    <a
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cx(
        focus,
        'text-(--kafka-link-fg) underline underline-offset-4 hover:text-(--kafka-link-fg-hover) visited:text-(--kafka-link-fg-visited)',
        variant === 'standalone' ? 'inline-flex min-h-(--kafka-link-min-height) items-center gap-(--kafka-link-icon-gap)' : 'rounded-(--kafka-icon-button-radius)',
        external && variant === 'inline' && 'inline-flex items-baseline gap-(--kafka-link-icon-gap)',
        className,
      )}
      {...rest}
    >
      {children}
      {external && (
        <>
          <IconExternal aria-hidden="true" className="size-(--kafka-size-icon-sm) shrink-0 self-center" />
          <span className="sr-only">{labels.opensInNewTab}</span>
        </>
      )}
    </a>
  )
}
