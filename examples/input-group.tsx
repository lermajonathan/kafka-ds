import { Button, Field, IconSearch, Input, InputGroup } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Text and icon addons',
    description: 'The addon is part of the look, not of the name: the `Field` label still names the input. Use it for units, prefixes and fixed text ("https://", "COP"), not for instructions.',
    render: () => (
      <div className="flex max-w-md flex-col gap-4">
        <Field label="Sitio web">
          <InputGroup prefix="https://" suffix=".com">
            <Input placeholder="mi-sitio" />
          </InputGroup>
        </Field>
        <Field label="Precio del taller">
          <InputGroup prefix="COP" suffix="por persona">
            <Input inputMode="numeric" placeholder="200000" />
          </InputGroup>
        </Field>
      </div>
    ),
  },
  {
    id: 'action',
    title: 'With an action',
    description: 'A button at the end for one action that belongs to the field: search, copy, apply. The button is named by its own text.',
    render: () => (
      <div className="max-w-md">
        <Field label="Buscar en la biblioteca">
          <InputGroup action={<Button variant="soft">Buscar</Button>}>
            <Input placeholder="Título o autor" />
          </InputGroup>
        </Field>
      </div>
    ),
  },
  {
    id: 'icon',
    title: 'With an icon addon',
    description: 'Icon addons are decorative and hidden from assistive technology.',
    render: () => (
      <div className="max-w-md">
        <Field label="Ciudad">
          <InputGroup prefixIcon={IconSearch}>
            <Input placeholder="Cali" />
          </InputGroup>
        </Field>
      </div>
    ),
  },
]
