import { useState } from 'react'
import { IconBell, IconCalendar, IconFile, IconPeople, NavMenu, type NavMenuItem } from '../src/components'
import type { Example } from './types'

const ITEMS: NavMenuItem[] = [
  { key: 'inicio', label: 'Inicio', href: '#inicio', Icon: IconFile },
  {
    key: 'talleres',
    label: 'Talleres',
    Icon: IconCalendar,
    children: [
      { key: 'poesia', label: 'Poesía', href: '#poesia' },
      { key: 'narrativa', label: 'Narrativa', href: '#narrativa', badge: 3 },
    ],
  },
  { key: 'personas', label: 'Personas', href: '#personas', Icon: IconPeople },
  { key: 'avisos', label: 'Avisos', href: '#avisos', Icon: IconBell, badge: 12 },
  { key: 'archivo', label: 'Archivo', Icon: IconFile, disabled: true },
]

function Demo({ collapsed = false, start = 'inicio' }: { collapsed?: boolean; start?: string }) {
  const [page, setPage] = useState(start)
  return (
    <div className="flex flex-col gap-3">
      <div className={collapsed ? 'w-fit' : 'max-w-xs'}>
        <NavMenu label={collapsed ? 'Menú compacto' : 'Menú de la app'} items={ITEMS} value={page} onNavigate={setPage} collapsed={collapsed} />
      </div>
      <p className="kafka-type-ui-caption">Página: {page}</p>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Side navigation',
    description: 'Real links: `href` is required on every item that goes somewhere, and `value` marks the current one with `aria-current="page"`. `onNavigate` lets a single-page app handle the click itself; Ctrl, Cmd and middle clicks still open the link normally. A parent with `children` is a button that opens its group; it opens by itself when the current page is inside it.',
    render: () => <Demo start="narrativa" />,
  },
  {
    id: 'collapsed',
    title: 'Collapsed',
    description: '`collapsed` shows only the icons. Names stay in the page for screen readers, and a native tooltip shows the name on hover. Use it for flat menus: a parent without its own `href` has nowhere to go when collapsed, so it is left out.',
    render: () => <Demo collapsed />,
  },
]
