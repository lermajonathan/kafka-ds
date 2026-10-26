import { useState } from 'react'
import { IconCalendar, IconClock, IconPeople, NewsBox, type NewsItem } from '../src/components'
import type { Example } from './types'

const ITEMS: NewsItem[] = [
  { id: 'n1', kind: 'evento', title: 'Lectura abierta de fin de año', href: '#lectura', meta: [{ Icon: IconCalendar, text: 'Viernes 20 de noviembre' }, { Icon: IconClock, text: '6:00 p. m.' }] },
  { id: 'n2', kind: 'felicitacion', title: 'Camila publicó su primer libro de cuentos', meta: [{ Icon: IconPeople, text: 'Taller de narrativa 2025' }] },
  { id: 'n3', kind: 'convocatoria', title: 'Abierta la convocatoria de la antología', href: '#antologia', meta: [{ Icon: IconCalendar, text: 'Hasta el 30 de noviembre' }] },
  { id: 'n4', kind: 'aviso', title: 'La sede cierra el 24 de diciembre' },
]

function Demo({ items = ITEMS, floating = false, label }: { items?: NewsItem[]; floating?: boolean; label?: string }) {
  const [list, setList] = useState(items)
  return <NewsBox items={list} onDismiss={(id) => setList((all) => all.filter((n) => n.id !== id))} viewAllHref="#novedades" floating={floating} label={label} />
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Several news',
    description: 'Shows up to three items, one at a time. The dots change the item; nothing rotates by itself. Closing an item removes it and the next one takes its place. Give it four items and only three are shown.',
    render: () => <div className="max-w-md"><Demo /></div>,
  },
  {
    id: 'single',
    title: 'One news',
    description: 'With a single item the dots are not shown.',
    render: () => <div className="max-w-md"><Demo items={ITEMS.slice(3)} label="Un aviso" /></div>,
  },
  {
    id: 'floating',
    title: 'Floating',
    description: '`floating` pins the box to the bottom right of the screen (full width minus a margin on phones). The frame below stands in for the screen. Put it once per page, at the end of the page.',
    render: () => (
      <div className="relative h-96 overflow-hidden rounded-lg bg-(--kafka-color-bg-sunken) [transform:translateZ(0)]">
        <Demo items={ITEMS.slice(0, 2)} floating label="Novedades en pantalla" />
      </div>
    ),
  },
]
