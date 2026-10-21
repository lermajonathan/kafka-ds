import { Link } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'inline',
    title: 'In a sentence',
    description: 'Links are underlined, so colour is never the only signal.',
    render: () => (
      <p className="kafka-type-reading-body max-w-prose">
        Lee las <Link href="#bases">bases del concurso</Link> antes de enviar tu relato, y consulta el <Link href="https://example.com" external>reglamento completo</Link>.
      </p>
    ),
  },
  {
    id: 'standalone',
    title: 'On its own line',
    description: 'A standalone link is at least 44 px tall.',
    render: () => <Link href="#programa" variant="standalone">Ver el programa 2026</Link>,
  },
]
