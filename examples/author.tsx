import { Author } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'initials',
    title: 'Initials and role',
    description: 'Without a portrait, the initials stand in.',
    render: () => <Author name="Gabriel Rodríguez" role="Director de Altazor" />,
  },
  {
    id: 'portrait',
    title: 'Portrait, link and bio',
    description: 'The portrait is decorative: the name beside it carries the meaning.',
    render: () => (
      <div className="max-w-md">
        <Author name="Gabriel Rodríguez" role="Director de Altazor" image="/avatar.svg" href="#equipo" bio="Escritor y tallerista. Dirige Altazor, un espacio de escritura creativa." />
      </div>
    ),
  },
]
