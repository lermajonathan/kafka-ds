import { Button, Card } from '../src/components'
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
    description: 'A brand-coloured border for the one card that should stand out. It only adds emphasis; nothing depends on it.',
    render: () => (
      <Card highlight="featured" className="max-w-md">
        <h3 className="kafka-type-reading-heading-sm">Taller de narrativa</h3>
        <p>Inscripciones abiertas hasta el viernes.</p>
      </Card>
    ),
  },
  {
    id: 'vip',
    title: 'VIP',
    description: 'The membership card: gold background, dark text and a gold edge that shines. The shine is CSS only and stands still under reduced motion.',
    render: () => (
      <Card highlight="vip" className="max-w-md">
        <h3 className="kafka-type-reading-heading-sm">Membresía anual</h3>
        <p>Acceso a todos los talleres y laboratorios del año.</p>
        <Button variant="vip" block>Hacerme miembro</Button>
      </Card>
    ),
  },
]
