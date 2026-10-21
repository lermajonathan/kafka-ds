import { DropCap, Epigraph, Figure, Footnote, FootnoteItem, Footnotes, Prose, proseLead, PullQuote } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'article',
    title: 'A full text',
    description: 'The reading column styles headings, lead, paragraphs, lists, links and rules. It composes with the other reading components.',
    render: () => (
      <Prose as="article" aria-label="Ejemplo de texto">
        <Epigraph attribution="Texto de ejemplo">Escribir es aprender a quedarse un rato más en la frase.</Epigraph>
        <h2>La arquitectura del texto</h2>
        <p className={proseLead}>Un buen comienzo no explica: coloca al lector en una habitación y le deja ver qué hay en ella.</p>
        <DropCap>
          Todo texto empieza con una decisión sobre dónde poner la cámara. Quien escribe elige qué se ve primero, qué queda fuera de campo y cuánto tarda la luz en llegar al fondo<Footnote n={1} />.
        </DropCap>
        <p>
          La medida de la línea importa tanto como la frase: entre 45 y 75 caracteres, el ojo vuelve al margen izquierdo sin perderse. Más información en el{' '}
          <a href="#programa">programa del taller</a>.
        </p>
        <PullQuote attribution="Cuaderno de clase">La puntuación es la respiración del texto.</PullQuote>
        <h3>Tres ejercicios</h3>
        <ul>
          <li>Describe una cocina sin nombrar ningún objeto que se use para cocinar.</li>
          <li>Reescribe el primer párrafo quitando todos los adjetivos.</li>
          <li>Cuenta la misma escena desde el objeto más pequeño de la habitación<Footnote n={2} />.</li>
        </ul>
        <hr />
        <Figure src="/portada.svg" alt="Una luna dorada sobre dos colinas oscuras" caption="La luz llega siempre tarde al fondo del cuadro." credit="Ilustración de ejemplo" />
        <Footnotes>
          <FootnoteItem n={1}>La imagen es una licencia de trabajo: sirve para pensar la escena, no para citarla.</FootnoteItem>
          <FootnoteItem n={2}>Es un ejercicio clásico de los talleres de narrativa breve.</FootnoteItem>
        </Footnotes>
      </Prose>
    ),
  },
  {
    id: 'full-width',
    title: 'Full width',
    description: 'By default a column stops at 66 characters. `fullWidth` lets short texts, such as a card description, fill their container.',
    render: () => (
      <Prose fullWidth>
        <p>Un párrafo corto dentro de un contenedor que ya fija su ancho.</p>
      </Prose>
    ),
  },
]
