import { Accordion } from '../src/components'
import type { Example } from './types'

const items = [
  { value: 'cert', title: '¿Entregan certificado?', content: <p>Sí, al terminar el taller con asistencia mínima del 80 %.</p> },
  { value: 'pago', title: '¿Cómo se paga?', content: <p>Con tarjeta o PSE desde la página de inscripción.</p> },
  { value: 'grabacion', title: '¿Hay grabación?', content: <p>Las sesiones quedan disponibles durante 30 días.</p> },
]

export const examples: Example[] = [
  {
    id: 'single',
    title: 'One open at a time',
    description: 'Each title is a button inside a heading. Up and Down move between titles.',
    render: () => <Accordion items={items} headingLevel={3} defaultValue={['cert']} />,
  },
  {
    id: 'multiple',
    title: 'Several open',
    description: 'With `multiple`, opening one does not close the others.',
    render: () => <Accordion items={items.map((it) => ({ ...it, title: `${it.title} (varias abiertas)` }))} multiple headingLevel={3} defaultValue={['cert', 'pago']} />,
  },
]
