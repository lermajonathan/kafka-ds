/* Kafka · Author */
import { type HTMLAttributes, type ReactNode } from 'react'
import { cx } from './shared'

export interface AuthorProps extends HTMLAttributes<HTMLElement> {
  name: string
  /** Role or tagline, for example "Coordinador de Altazor". */
  role?: string
  /** Portrait. If missing, the initials are shown. */
  image?: string
  /** Link to the author's page. */
  href?: string
  /** A short biography, shown below the byline. */
  bio?: ReactNode
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')

/** A byline: portrait or initials, name, role and an optional bio. The portrait is decorative because the name is right next to it. */
export function Author({ name, role, image, href, bio, className, ...rest }: AuthorProps) {
  const nameEl = href ? <a href={href} rel="author" className="text-(--kafka-author-name) underline underline-offset-4">{name}</a> : <span className="text-(--kafka-author-name)">{name}</span>
  return (
    <div className={cx('flex flex-col gap-(--kafka-author-gap)', className)} {...rest}>
      <div className="flex items-center gap-(--kafka-author-gap)">
        {image ? (
          <img src={image} alt="" className="size-(--kafka-author-avatar-size) shrink-0 rounded-(--kafka-author-avatar-radius) object-cover" />
        ) : (
          <span aria-hidden="true" className="kafka-type-author-name-type inline-flex size-(--kafka-author-avatar-size) shrink-0 items-center justify-center rounded-(--kafka-author-avatar-radius) bg-(--kafka-author-avatar-bg) text-(--kafka-author-avatar-fg)">{initials(name)}</span>
        )}
        <p className="flex flex-col">
          <span className="kafka-type-author-name-type">{nameEl}</span>
          {role && <span className="kafka-type-author-role-type text-(--kafka-author-role)">{role}</span>}
        </p>
      </div>
      {bio && <div className="kafka-type-author-role-type text-(--kafka-author-bio)">{bio}</div>}
    </div>
  )
}
