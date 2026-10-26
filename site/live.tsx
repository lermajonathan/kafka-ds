import type { ReactNode } from 'react'

/** A runnable example above the code that prints it. */
export function LiveExample({ title, children }: { title: string; children: ReactNode }) {
  return <div data-live-example role="group" aria-label={`Ejemplo: ${title}`} className="live-example">{children}</div>
}
