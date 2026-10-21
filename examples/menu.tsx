import { Button, IconCheck, IconChevronDown, IconClose, Menu } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Actions menu',
    description: 'Opens with Enter, Space or the arrow keys. Type a letter to jump to an item. Items that navigate are links.',
    render: () => (
      <Menu
        label="Acciones de la inscripción"
        trigger={(p) => <Button variant="outline" TrailingIcon={IconChevronDown} {...p}>Acciones</Button>}
        items={[
          { label: 'Ver detalle', href: '#detalle' },
          { label: 'Marcar como pagada', Icon: IconCheck, onSelect: () => undefined },
          { label: 'Reenviar correo', disabled: true },
          { separator: true },
          { label: 'Cancelar inscripción', Icon: IconClose, tone: 'danger', onSelect: () => undefined },
        ]}
      />
    ),
  },
]
