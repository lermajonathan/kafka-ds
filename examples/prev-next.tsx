import { PrevNext } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'both',
    title: 'Previous and next',
    description: 'Use real titles, not "Previous article".',
    render: () => <PrevNext prev={{ href: '#anterior', title: 'La arquitectura del texto' }} next={{ href: '#siguiente', title: 'Umbrales de lo cotidiano' }} />,
  },
  {
    id: 'only-next',
    title: 'First text of a series',
    description: 'With no previous text, the next one keeps its place on the right.',
    render: () => <PrevNext label="Primer texto de la serie" next={{ href: '#siguiente', title: 'Umbrales de lo cotidiano' }} />,
  },
]
