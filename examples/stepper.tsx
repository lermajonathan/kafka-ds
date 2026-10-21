import { Stepper } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Enrolment steps',
    description: 'Completed steps show a check, the current one is dark, and screen readers hear "paso 2 de 4, paso actual".',
    render: () => (
      <Stepper
        current={1}
        steps={[
          { label: 'Datos', description: 'Quién eres' },
          { label: 'Programa', description: 'Qué quieres tomar' },
          { label: 'Pago', description: 'Tarjeta o PSE' },
          { label: 'Confirmación' },
        ]}
      />
    ),
  },
]
