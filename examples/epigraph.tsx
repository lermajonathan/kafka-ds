import { Epigraph } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Opening a text',
    description: 'Short, set to the right, before the first heading.',
    render: () => <Epigraph attribution="Texto de ejemplo">Todo comienzo es una promesa que el final tendrá que cumplir.</Epigraph>,
  },
]
