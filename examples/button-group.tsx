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
  {
    id: 'joined',
    title: 'Joined',
    description: 'For options that act on the same thing, such as text format. One shape with a line between the buttons; the focus ring stays inside each one.',
    render: () => (
      <ButtonGroup label="Formato del texto" joined>
        <Button variant="outline">Negrita</Button>
        <Button variant="outline">Cursiva</Button>
        <Button variant="outline">Subrayado</Button>
      </ButtonGroup>
    ),
  },
]
