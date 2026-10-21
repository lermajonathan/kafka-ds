import { Prose, TableOfContents } from '../src/components'
import type { Example } from './types'

const items = [
  { id: 'toc-intro', label: 'Introducción' },
  { id: 'toc-metodo', label: 'El método' },
  { id: 'toc-ejercicios', label: 'Ejercicios', level: 3 as const },
  { id: 'toc-cierre', label: 'Cierre' },
]

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With a current section',
    description: 'Pass `activeId` to mark a section yourself. Without it, the component watches the headings while the reader scrolls.',
    render: () => (
      <div className="max-w-xs">
        <TableOfContents items={items} activeId="toc-metodo" />
        <Prose className="sr-only">
          <h2 id="toc-intro">Introducción</h2>
          <h2 id="toc-metodo">El método</h2>
          <h3 id="toc-ejercicios">Ejercicios</h3>
          <h2 id="toc-cierre">Cierre</h2>
        </Prose>
      </div>
    ),
  },
]
