import { Button, EmptyState, IconFile } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With an action',
    description: 'Say what is missing, why, and the one next step.',
    render: () => (
      <EmptyState
        Icon={IconFile}
        title="Aún no tienes inscripciones"
        description="Cuando te inscribas en un taller, lo verás aquí con el estado de tu pago."
        action={<Button>Ver talleres</Button>}
      />
    ),
  },
  {
    id: 'heading-level',
    title: 'Heading level',
    description: 'Set `headingLevel` so the title fits the page outline.',
    render: () => <EmptyState headingLevel={3} title="Sin resultados" description="Prueba con otra palabra." />,
  },
]
