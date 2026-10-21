import type { ReactNode } from 'react'

/** One runnable example. The playground shows it, the documentation prints it and `test:docs` renders it. */
export interface Example {
  id: string
  title: string
  /** One sentence of context shown above the example in the documentation. */
  description?: string
  render: () => ReactNode
}
