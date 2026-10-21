import { useState } from 'react'
import { ButtonGroup, Chip } from '../src/components'
import type { Example } from './types'

function Filters() {
  const [on, setOn] = useState<string[]>(['Talleres'])
  const toggle = (k: string) => setOn((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))
  return (
    <ButtonGroup label="Filtrar por tipo">
      {['Talleres', 'Seminarios', 'Masterclass', 'Poesía'].map((k) => (
        <Chip key={k} selected={on.includes(k)} onClick={() => toggle(k)}>{k}</Chip>
      ))}
    </ButtonGroup>
  )
}

export const examples: Example[] = [
  {
    id: 'filters',
    title: 'Filters',
    description: 'A chip is a toggle button. A selected chip shows a check as well as a darker fill.',
    render: () => <Filters />,
  },
]
