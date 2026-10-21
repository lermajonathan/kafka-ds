/* Kafka · Drawer */
import { Modal, type ModalProps } from './modal'

export interface DrawerProps extends Omit<ModalProps, 'side' | 'size'> {
  /** Edge it slides from. `end` is the right edge in left-to-right languages. */
  side?: 'start' | 'end' | 'bottom'
}

/** A modal panel that slides from an edge: filters, a cart, a long form. Same behaviour as `Modal` (inert page, focus kept inside, Esc closes), with more room. */
export function Drawer({ side = 'end', ...rest }: DrawerProps) {
  return <Modal side={side} {...rest} />
}
