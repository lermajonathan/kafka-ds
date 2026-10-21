import { Field, Input } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'states',
    title: 'Label, hint and error',
    description: 'The Field connects the label, the hint and the error to the control: no ids to repeat.',
    render: () => (
      <div className="flex max-w-sm flex-col gap-6">
        <Field label="Correo electrónico" hint="Te escribiremos aquí para confirmar la inscripción." required>
          <Input type="email" autoComplete="email" placeholder="nombre@correo.com" />
        </Field>
        <Field label="Teléfono" optional>
          <Input type="tel" autoComplete="tel" />
        </Field>
        <Field label="Documento" error="Escribe solo números, sin puntos." required>
          <Input defaultValue="12.345" inputMode="numeric" />
        </Field>
      </div>
    ),
  },
]
