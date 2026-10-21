import { Combobox, Field } from '../src/components'
import type { Example } from './types'

const options = [
  { value: 'co', label: 'Colombia' }, { value: 'ar', label: 'Argentina' }, { value: 'mx', label: 'México' },
  { value: 'cl', label: 'Chile' }, { value: 'pe', label: 'Perú' }, { value: 'ec', label: 'Ecuador' },
  { value: 'uy', label: 'Uruguay' }, { value: 'es', label: 'España' }, { value: 'xx', label: 'No disponible', disabled: true },
]

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Searchable list',
    description: 'Type to narrow (accents are ignored). Up and Down move through options while focus stays in the field; Enter chooses, Esc closes.',
    render: () => (
      <div className="max-w-sm">
        <Field label="País de residencia">
          <Combobox options={options} placeholder="Escribe para buscar" />
        </Field>
      </div>
    ),
  },
]
