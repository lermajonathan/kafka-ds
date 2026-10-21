import { Footnote, FootnoteItem, Footnotes, Prose } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'in-text',
    title: 'Notes in a text',
    description: 'The call links to the note and the note links back. Use the same `n` and `idPrefix` on both sides.',
    render: () => (
      <Prose>
        <p>
          El taller usa una selección de cuentos breves<Footnote n={1} /> y algunos fragmentos de novelas<Footnote n={2} />.
        </p>
        <Footnotes>
          <FootnoteItem n={1}>Los cuentos se envían por correo una semana antes de cada sesión.</FootnoteItem>
          <FootnoteItem n={2}>Los fragmentos se leen en voz alta durante la clase.</FootnoteItem>
        </Footnotes>
      </Prose>
    ),
  },
]
