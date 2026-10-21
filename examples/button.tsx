import { Button, IconArrowRight, IconCrown } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'variants',
    title: 'Variants',
    description: 'Use one primary button per view; soft and outline are for secondary actions.',
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <Button>Inscribirme</Button>
        <Button variant="soft">Ver programa</Button>
        <Button variant="outline">Más información</Button>
      </div>
    ),
  },
  {
    id: 'icons',
    title: 'With icons',
    description: 'A leading icon names the action; a trailing arrow suggests moving forward.',
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <Button Icon={IconCrown}>Hazte miembro</Button>
        <Button variant="outline" TrailingIcon={IconArrowRight}>Continuar</Button>
      </div>
    ),
  },
  {
    id: 'states',
    title: 'Disabled and loading',
    description: 'Loading keeps the label, shows a spinner and announces the busy state. Disabled buttons stay out of the tab order.',
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <Button disabled>No disponible</Button>
        <Button variant="soft" disabled>No disponible</Button>
        <Button variant="outline" disabled>No disponible</Button>
        <Button loading>Enviando</Button>
      </div>
    ),
  },
  {
    id: 'block',
    title: 'Full width',
    description: 'On small screens a primary action can span the width of its container.',
    render: () => (
      <div className="w-full max-w-sm">
        <Button block>Pagar ahora</Button>
      </div>
    ),
  },
]
