import { Field, PinInput } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Six-digit code',
    description: 'Typing advances, Backspace goes back, and pasting a code fills all the cells.',
    render: () => (
      <Field label="Código de verificación" hint="Lo enviamos a tu correo.">
        <PinInput length={6} />
      </Field>
    ),
  },
]
