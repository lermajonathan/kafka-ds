import { Field, Select } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Native select',
    description: 'Uses the platform list, so mobile pickers and screen readers behave as people expect.',
    render: () => (
      <div className="max-w-sm">
        <Field label="Modalidad">
          <Select defaultValue="">
            <option value="" disabled>Elige una opción</option>
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
          </Select>
        </Field>
      </div>
    ),
  },
]
