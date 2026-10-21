import { Button, Field, Input, Popover } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Filter panel',
    description: 'Not modal: Esc, a click outside or moving focus away closes it, and focus returns to the button.',
    render: () => (
      <Popover label="Filtrar programas" trigger={(p) => <Button variant="outline" {...p}>Filtrar</Button>}>
        <div className="flex w-64 flex-col gap-4">
          <Field label="Buscar"><Input placeholder="Título del programa" /></Field>
          <Button>Aplicar</Button>
        </div>
      </Popover>
    ),
  },
]
