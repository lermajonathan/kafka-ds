import { Button, ButtonGroup, IconButton, IconClose } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Related actions',
    description: 'The group has a name. Put the primary action first or last, consistently across the product.',
    render: () => (
      <ButtonGroup label="Acciones de la inscripción">
        <Button>Inscribirme</Button>
        <Button variant="soft">Guardar para después</Button>
        <IconButton Icon={IconClose} label="Descartar" variant="outline" />
      </ButtonGroup>
    ),
  },
]
