import { Verse } from '../src/components'
import type { Example } from './types'

const poem = `Dejé la lámpara encendida
para que la noche supiera
dónde queda la casa

y no preguntó por mi nombre,
solo se sentó a la mesa
a esperar que alguien dijera algo que valiera la pena de ser dicho antes de que amaneciera.`

export const examples: Example[] = [
  {
    id: 'poem',
    title: 'A poem',
    description: 'One verse per line, a blank line between stanzas. The last verse is long on purpose: it shows the hanging indent.',
    render: () => (
      <div className="max-w-sm">
        <Verse text={poem} attribution="Poema de ejemplo" />
      </div>
    ),
  },
]
