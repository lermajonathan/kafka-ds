import { useState } from 'react'
import { Button, Chip, ButtonGroup, Drawer } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Filtros</Button>
      <Drawer open={open} onOpenChange={setOpen} title="Filtros" description="Elige los tipos de programa." actions={<Button onClick={() => setOpen(false)}>Ver resultados</Button>}>
        <ButtonGroup label="Tipo de programa">
          <Chip>Talleres</Chip><Chip>Seminarios</Chip><Chip>Masterclass</Chip>
        </ButtonGroup>
      </Drawer>
    </>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Side panel',
    description: 'Same behaviour as a modal, anchored to an edge.',
    render: () => <Demo />,
  },
]
