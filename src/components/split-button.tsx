/* Kafka · SplitButton */
import { IconChevronDown, type IconType } from '../icons'
import { Button, type ButtonVariant } from './button'
import { useLabels } from './labels'
import { Menu, type MenuItem } from './menu'
import { cx } from './shared'

export interface SplitButtonProps {
  /** The main action's label: a verb. */
  label: string
  Icon?: IconType
  variant?: Exclude<ButtonVariant, 'vip'>
  /** The main action. */
  onClick?: () => void
  /** The related actions in the menu. */
  items: MenuItem[]
  /** Names the arrow button. Defaults to "Más acciones". */
  menuLabel?: string
  disabled?: boolean
  className?: string
}

/** A main action plus an arrow that opens a menu of related ones. Two buttons, 44 px each, with a small gap so both keep a full focus ring. */
export function SplitButton({ label, Icon, variant = 'primary', onClick, items, menuLabel, disabled, className }: SplitButtonProps) {
  const labels = useLabels()
  const name = menuLabel ?? labels.moreActions
  return (
    <div className={cx('kafka-split-button inline-flex items-stretch gap-(--kafka-split-button-gap)', className)}>
      <Button variant={variant} Icon={Icon} onClick={onClick} disabled={disabled}>{label}</Button>
      <Menu
        label={name}
        placement="bottom-end"
        items={items}
        trigger={({ ref, ...triggerProps }) => (
          <Button ref={ref} variant={variant} aria-label={name} disabled={disabled} className="w-(--kafka-split-button-toggle-width) shrink-0 px-0" {...triggerProps}>
            <IconChevronDown aria-hidden="true" className="size-(--kafka-size-icon-md)" />
          </Button>
        )}
      />
    </div>
  )
}
