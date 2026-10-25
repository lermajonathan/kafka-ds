import { Card } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Default',
    description: 'A plain surface with a border and a resting shadow. Put a heading inside so the section has a name.',
    render: () => (
      <Card className="max-w-md">
        <h3 className="kafka-type-reading-heading-sm">Taller de poesía</h3>
        <p>Diez sesiones para escribir y revisar tus propios poemas.</p>
      </Card>
    ),
  },
  {
    id: 'featured',
    title: 'Featured',
    description: 'A brand-coloured border for the one card that should stand out. The border is the cue, not just a colour change.',
    render: () => (
      <Card featured className="max-w-md">
        <h3 className="kafka-type-reading-heading-sm">Membresía anual</h3>
        <p>Acceso a todos los talleres y laboratorios del año.</p>
      </Card>
    ),
  },
]
