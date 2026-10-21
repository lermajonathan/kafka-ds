import { useState } from 'react'
import { Checkbox } from '../src/components'
import type { Example } from './types'

function Parent() {
  const [items, setItems] = useState([true, false, false])
  const all = items.every(Boolean)
  const some = items.some(Boolean)
  return (
    <div className="flex flex-col">
      <Checkbox label="Todos los talleres" checked={all} indeterminate={some && !all} onChange={(e) => setItems(items.map(() => e.target.checked))} />
      <div className="ml-8 flex flex-col">
        {['Taller 1', 'Taller 2', 'Taller 3'].map((l, i) => (
          <Checkbox key={l} label={l} checked={items[i]} onChange={(e) => setItems(items.map((v, j) => (j === i ? e.target.checked : v)))} />
        ))}
      </div>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'States',
    description: 'The whole row is the target. The mark is an icon, so checked does not rely on colour.',
    render: () => (
      <div className="flex flex-col">
        <Checkbox label="Acepto las bases" />
        <Checkbox label="Quiero recibir novedades" description="Un correo al mes, sin spam." defaultChecked />
        <Checkbox label="No disponible" disabled />
        <Checkbox label="Con error" invalid />
      </div>
    ),
  },
  {
    id: 'indeterminate',
    title: 'Parent of a list',
    description: 'The mixed state shows a dash. It is cleared by the first toggle.',
    render: () => <Parent />,
  },
]
