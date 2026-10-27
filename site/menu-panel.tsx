// The phone menu: a side panel with the main links. Loaded only when the header is compact, so the home's first load stays under budget.
import type { ReactNode } from 'react'
import { Drawer } from '../src/components'

export default function MenuPanel({ open, onOpenChange, children, version }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode; version: string }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} side="end" title="Menú" className="menu-panel">
      <nav className="menu-nav" aria-label="Principal">{children}</nav>
      <p className="menu-version">Kafka v{version} · pre-1.0</p>
    </Drawer>
  )
}
