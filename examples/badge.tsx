import { Badge, IconCrown } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'tones',
    title: 'Tones',
    description: 'Status tones carry an icon and a border, so they work without colour. Neutral and brand are for categories.',
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Taller</Badge>
        <Badge tone="brand" Icon={IconCrown}>Miembros</Badge>
        <Badge tone="info">Próximamente</Badge>
        <Badge tone="success">Inscripciones abiertas</Badge>
        <Badge tone="warning">Últimos cupos</Badge>
        <Badge tone="danger">Agotado</Badge>
      </div>
    ),
  },
]
