import { Badge, Button, IconCalendar, IconClock, IconPen, IconPeople, ProgramCard } from '../src/components'
import type { Example } from './types'

const meta = [
  { Icon: IconCalendar, text: 'Jueves, del 5 de noviembre al 7 de enero' },
  { Icon: IconClock, text: '6:30 p. m. a 8:30 p. m. (hora de Colombia)' },
  { Icon: IconPeople, text: 'Cupo limitado a 12 personas' },
]

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With a generated cover',
    description: 'No image yet? The card draws a cover from an icon and a tone. The title always sits on the darkest part, so it stays readable.',
    render: () => (
      <div className="max-w-md">
        <ProgramCard
          title="Taller de poesía"
          subtitle="Con Gabriel Rodríguez"
          cover={{ Icon: IconPen, tone: 'gold' }}
          badges={<Badge tone="success">Inscripciones abiertas</Badge>}
          price="$200.000"
          description="Diez sesiones para escribir, leer en voz alta y revisar tus propios poemas."
          meta={meta}
          action={<Button block>Inscribirme</Button>}
        />
      </div>
    ),
  },
  {
    id: 'image',
    title: 'With an image',
    description: '`image.alt` is required: a program cover is content, so it needs a description.',
    render: () => (
      <div className="max-w-md">
        <ProgramCard
          title="Masterclass de cuento"
          image={{ src: '/portada.svg', alt: 'Cuaderno abierto con un manuscrito' }}
          cover={{ Icon: IconPen, tone: 'blue' }}
          price="$80.000"
          description="Una sesión para pensar el cuento desde el final."
          meta={meta.slice(0, 2)}
          action={<Button block>Inscribirme</Button>}
        />
      </div>
    ),
  },
  {
    id: 'fallback',
    title: 'Image that fails to load',
    description: 'A broken `image.src` falls back to the generated cover, so the card never shows a broken picture.',
    render: () => (
      <div className="max-w-md">
        <ProgramCard
          title="Laboratorio de lectura"
          image={{ src: '/no-existe.jpg', alt: 'Lámpara sobre un libro' }}
          cover={{ Icon: IconPen, tone: 'green' }}
          description="Leemos juntos un libro durante la temporada."
          action={<Button block variant="outline">Ver detalles</Button>}
        />
      </div>
    ),
  },
  {
    id: 'featured',
    title: 'Featured',
    description: '`highlight="featured"` adds the brand-coloured border to the one program that should stand out.',
    render: () => (
      <div className="max-w-md">
        <ProgramCard
          highlight="featured"
          title="Taller de narrativa"
          cover={{ Icon: IconPen, tone: 'amber' }}
          badges={<Badge tone="warning">Últimos cupos</Badge>}
          price="$200.000"
          description="Construimos una historia desde el primer párrafo hasta la revisión final."
          meta={meta}
          action={<Button block>Inscribirme</Button>}
        />
      </div>
    ),
  },
  {
    id: 'vip',
    title: 'VIP',
    description: '`highlight="vip"` is the membership: a gold card with a crown badge and a shining edge. Use the `vip` button inside it.',
    render: () => (
      <div className="max-w-md">
        <ProgramCard
          highlight="vip"
          title="Membresía anual"
          subtitle="Todo Altazor, todo el año"
          cover={{ Icon: IconPen, tone: 'gold' }}
          price="$1.800.000"
          description="Acceso a todos los talleres, masterclasses y laboratorios, y a la biblioteca de grabaciones."
          action={<Button variant="vip" block>Hacerme miembro</Button>}
        />
      </div>
    ),
  },
]
