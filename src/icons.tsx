/* Kafka · icons. A small, named selection of Phosphor (https://phosphoricons.com), which has 1,000+ icons
   (DDR-KF-002). Any Phosphor icon also works wherever a component takes `Icon`: pass the component itself.
   Aliases are added when a component needs them, never in advance. */
import type { ComponentType } from 'react'
import type { IconProps } from '@phosphor-icons/react'
import { Desktop, Moon, Sun, Confetti, Megaphone, MapPin, PenNib, Users, Bell, ArrowBendUpLeft, CalendarBlank, CaretDown, CaretLeft, CaretRight, DotsThree, CheckCircle, FileText, Info, UploadSimple, Warning, XCircle, ArrowLeft, ArrowRight, ArrowSquareOut, Check, CircleNotch, Clock, CrownSimple, Minus, Play, Plus, X } from '@phosphor-icons/react'

export type IconType = ComponentType<IconProps>
export type { IconProps }

export const IconArrowLeft: IconType = ArrowLeft
export const IconArrowRight: IconType = ArrowRight
export const IconCheck: IconType = Check
export const IconClose: IconType = X
export const IconCrown: IconType = CrownSimple
export const IconSpinner: IconType = CircleNotch
export const IconBackToText: IconType = ArrowBendUpLeft
export const IconClock: IconType = Clock
export const IconExternal: IconType = ArrowSquareOut
export const IconMinus: IconType = Minus
export const IconPlay: IconType = Play
export const IconPlus: IconType = Plus
export const IconChevronDown: IconType = CaretDown
export const IconSuccess: IconType = CheckCircle
export const IconInfo: IconType = Info
export const IconWarning: IconType = Warning
export const IconDanger: IconType = XCircle
export const IconUpload: IconType = UploadSimple
export const IconFile: IconType = FileText
export const IconChevronLeft: IconType = CaretLeft
export const IconChevronRight: IconType = CaretRight
export const IconCalendar: IconType = CalendarBlank
export const IconMore: IconType = DotsThree
export const IconBell: IconType = Bell
export const IconPen: IconType = PenNib
export const IconLocation: IconType = MapPin
export const IconPeople: IconType = Users
export const IconConfetti: IconType = Confetti
export const IconMegaphone: IconType = Megaphone
export const IconSun: IconType = Sun
export const IconMoon: IconType = Moon
export const IconDesktop: IconType = Desktop
