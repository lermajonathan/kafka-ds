import { Tabs } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Program details',
    description: 'Arrow keys move between tabs and show their panel; Tab goes from the list into the panel.',
    render: () => (
      <Tabs
        label="Detalles del programa"
        items={[
          { value: 'resumen', label: 'Resumen', content: <p>Cuatro sábados de lectura y escritura, de 9 a 12 m.</p> },
          { value: 'programa', label: 'Programa', content: <p>Sesión 1: la arquitectura del texto. Sesión 2: el punto de vista.</p> },
          { value: 'precio', label: 'Precio', content: <p>$200.000 COP, con 10 % de descuento para antiguos participantes.</p> },
          { value: 'pronto', label: 'Próximamente', content: <p>No disponible.</p>, disabled: true },
        ]}
      />
    ),
  },
]
