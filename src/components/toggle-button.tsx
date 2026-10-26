/* Kafka · ToggleButton */
import { useState } from 'react'
import type { IconType } from '../icons'
import { Button, type ButtonProps } from './button'

export interface ToggleButtonProps extends Omit<ButtonProps, 'variant' | 'Icon' | 'TrailingIcon' | 'children' | 'aria-pressed' | 'onClick' | 'loading' | 'block'> {
  /** The button's name. It does not change with the state: `aria-pressed` announces that. */
  label: string
  /** Icon before the label. */
  Icon?: IconType
  /** Icon shown instead of `Icon` while pressed, so the state is not only a colour. */
  PressedIcon?: IconType
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

/** A button that stays pressed or not (follow, save, mute). A Button with `aria-pressed`: filled when pressed, outlined when not. */
export function ToggleButton({ label, Icon, PressedIcon, pressed, defaultPressed = false, onPressedChange, ...rest }: ToggleButtonProps) {
  const [inner, setInner] = useState(defaultPressed)
  const on = pressed ?? inner
  const toggle = () => {
    if (pressed === undefined) setInner(!on)
    onPressedChange?.(!on)
  }
  return (
    <Button variant={on ? 'primary' : 'outline'} Icon={on ? (PressedIcon ?? Icon) : Icon} aria-pressed={on} onClick={toggle} {...rest}>
      {label}
    </Button>
  )
}
