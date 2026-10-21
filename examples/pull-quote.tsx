import { PullQuote } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With attribution',
    description: 'Use it for a line you want the reader to remember, taken from the text itself or from a source.',
    render: () => <PullQuote attribution="Cuaderno de clase, 2026">Escribir es decidir qué no se dice.</PullQuote>,
  },
  {
    id: 'plain',
    title: 'Without attribution',
    description: 'A line taken from the same text needs no attribution.',
    render: () => <PullQuote>La puntuación es la respiración del texto.</PullQuote>,
  },
]
