/* Kafka · InputGroup */
import type { ReactNode } from 'react'
import type { IconType } from '../icons'
import { cx } from './shared'

export interface InputGroupProps {
  /** Fixed text before the input: "https://", "COP". */
  prefix?: string
  /** Fixed text after the input: ".com", "por persona". */
  suffix?: string
  /** Decorative icon before the input. */
  prefixIcon?: IconType
  /** Decorative icon after the input. */
  suffixIcon?: IconType
  /** One button at the end, for an action that belongs to the field: Buscar, Copiar. */
  action?: ReactNode
  /** The `Input`. */
  children: ReactNode
  className?: string
}

function Addon({ Icon, text }: { Icon?: IconType; text?: string }) {
  return (
    <span className="kafka-type-input-group-addon-type flex shrink-0 items-center gap-(--kafka-input-group-addon-gap) border-(length:--kafka-input-border-width) border-(--kafka-input-border) bg-(--kafka-input-group-addon-bg) px-(--kafka-input-group-addon-padding-x) text-(--kafka-input-group-addon-fg)">
      {Icon && <Icon aria-hidden="true" className="size-(--kafka-size-icon-md) shrink-0" />}
      {text}
    </span>
  )
}

/** An input with fixed text, an icon or one button attached to its sides. Put it inside a `Field`: the label names the input, the addons are only decoration. */
export function InputGroup({ prefix, suffix, prefixIcon, suffixIcon, action, children, className }: InputGroupProps) {
  return (
    <div className={cx('kafka-input-group flex items-stretch', className)}>
      {(prefix || prefixIcon) && <Addon Icon={prefixIcon} text={prefix} />}
      <div className="kafka-input-group-field min-w-0 flex-1">{children}</div>
      {(suffix || suffixIcon) && <Addon Icon={suffixIcon} text={suffix} />}
      {action && <div className="kafka-input-group-action flex shrink-0 items-stretch">{action}</div>}
    </div>
  )
}
