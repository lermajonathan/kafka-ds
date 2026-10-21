/* Kafka · icons. A small, named selection of Phosphor (https://phosphoricons.com), which has 1,000+ icons
   (DDR-KF-002). Any Phosphor icon also works wherever a component takes `Icon`: pass the component itself.
   Aliases are added when a component needs them, never in advance. */
import type { ComponentType } from 'react'
import type { IconProps } from '@phosphor-icons/react'
import { ArrowLeft, ArrowRight, Check, CircleNotch, CrownSimple, X } from '@phosphor-icons/react'

export type IconType = ComponentType<IconProps>
export type { IconProps }

export const IconArrowLeft: IconType = ArrowLeft
export const IconArrowRight: IconType = ArrowRight
export const IconCheck: IconType = Check
export const IconClose: IconType = X
export const IconCrown: IconType = CrownSimple
export const IconSpinner: IconType = CircleNotch
