import { Breadcrumbs } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Site path',
    description: 'The last item is the current page: it is text, not a link.',
    render: () => <Breadcrumbs items={[{ label: 'Inicio', href: '#inicio' }, { label: 'Educación', href: '#educacion' }, { label: 'La arquitectura del texto' }]} />,
  },
]
