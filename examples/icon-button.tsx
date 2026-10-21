import { IconArrowRight, IconButton, IconClose, IconCrown } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'variants',
    title: 'Variants',
    description: 'The same three variants as Button. The label is not shown, but it names the button for screen readers.',
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <IconButton Icon={IconArrowRight} label="Continuar" variant="primary" />
        <IconButton Icon={IconCrown} label="Hazte miembro" />
        <IconButton Icon={IconClose} label="Cerrar" variant="outline" />
        <IconButton Icon={IconClose} label="Cerrar" disabled />
      </div>
    ),
  },
]
