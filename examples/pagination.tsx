import { useState } from 'react'
import { Pagination } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [page, setPage] = useState(5)
  return <Pagination page={page} pageCount={20} onPageChange={setPage} />
}

export const examples: Example[] = [
  {
    id: 'buttons',
    title: 'In-page paging',
    description: 'With `onPageChange` the items are buttons. The current page is `aria-current="page"`.',
    render: () => <Demo />,
  },
  {
    id: 'links',
    title: 'As links',
    description: 'With `hrefFor` the items are real links, so every page has its own address.',
    render: () => <Pagination page={2} pageCount={6} hrefFor={(p) => `#pagina-${p}`} label="Páginas del blog" />,
  },
]
