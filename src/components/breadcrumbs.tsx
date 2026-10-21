/* Kafka · Breadcrumbs */
import { Fragment, type HTMLAttributes } from 'react'
import { IconChevronRight } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface BreadcrumbItem {
  label: string
  /** Omit on the last item: it is the current page and is not a link. */
  href?: string
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  /** Accessible name of the navigation. Defaults to the localised "Ruta de navegación". */
  label?: string
}

/** Where the page sits in the site. The last item is the current page (`aria-current="page"`); separators are decorative. */
export function Breadcrumbs({ items, label, className, ...rest }: BreadcrumbsProps) {
  const labels = useLabels()
  return (
    <nav aria-label={label ?? labels.breadcrumb} className={className} {...rest}>
      <ol className="kafka-type-breadcrumbs-type m-0 flex list-none flex-wrap items-center gap-x-(--kafka-breadcrumbs-gap) p-0">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="inline-flex items-center">
                {item.href && !last ? (
                  <a href={item.href} className={cx(focus, 'inline-flex min-h-(--kafka-breadcrumbs-min-height) items-center rounded-(--kafka-input-radius) text-(--kafka-breadcrumbs-fg) underline underline-offset-4 hover:text-(--kafka-breadcrumbs-fg-hover)')}>{item.label}</a>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className="inline-flex min-h-(--kafka-breadcrumbs-min-height) items-center font-bold text-(--kafka-breadcrumbs-current)">{item.label}</span>
                )}
              </li>
              {!last && <li aria-hidden="true" className="inline-flex text-(--kafka-breadcrumbs-separator)"><IconChevronRight className="size-(--kafka-size-icon-sm)" /></li>}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
