// Pieces shared by the inner pages and the component detail.
import { useEffect, useRef, useState } from 'react'
import { Combobox, Field, Prose } from '../src/components'
import data from 'virtual:kafka-site'
import { navigate } from './router'
import { familyName } from './names'
import type { Heading } from './doc'

export const byId = new Map(data.components.map((c) => [c.id, c]))
export const familyOf = new Map(data.families.flatMap((f) => f.ids.map((id) => [id, f.name] as const)))

/** Everything a reader can look for: components (with their family), decisions and the fixed pages. */
const searchOptions = [
  ...data.pages.map((p) => ({ value: p.path, label: p.title })),
  ...data.families.flatMap((f) => f.ids.map((id) => ({ value: 'components/' + id, label: `${byId.get(id)!.name} · ${familyName(f.name)}` }))),
  ...data.decisions.map((d) => ({ value: d.path, label: `${d.id} · ${d.title}` })),
]
const componentOptions = data.families.flatMap((f) => f.ids.map((id) => ({ value: 'components/' + id, label: `${byId.get(id)!.name} · ${familyName(f.name)}` })))

export function PageSearch() {
  return (
    <div className="search p-search">
      <Field label="Buscar en la documentación">
        <Combobox options={searchOptions} value={null} placeholder="Buscar…" onValueChange={(route) => route !== null && navigate(route)} />
      </Field>
    </div>
  )
}

/** The catalog's own search, shown above a component's detail: it opens another component. */
export function CatalogSearch() {
  return (
    <div className="catalog-search">
      <Field label="Buscar componente">
        <Combobox options={componentOptions} value={null} placeholder="Prueba con «quote» o «tabs»" onValueChange={(route) => route !== null && navigate(route)} />
      </Field>
    </div>
  )
}

export function Html({ html }: { html: string }) {
  return <Prose as="div" fullWidth className="doc" dangerouslySetInnerHTML={{ __html: html }} />
}

/** Runs `load` when `key` changes and keeps the latest result; a stale answer never replaces a newer one. */
export function useLoaded<T>(key: string, load: (() => Promise<T>) | undefined): { value: T | null; failed: boolean } {
  const [state, setState] = useState<{ key: string; value: T | null; failed: boolean }>({ key, value: null, failed: false })
  useEffect(() => {
    let live = true
    if (!load) return
    load().then((value) => live && setState({ key, value, failed: false }), () => live && setState({ key, value: null, failed: true }))
    return () => { live = false }
  }, [key, load])
  return state.key === key ? state : { value: null, failed: false }
}

export function Loading() {
  return <p role="status" className="loading">Cargando…</p>
}
export function LoadFailed() {
  return <p role="alert" className="loading">No se pudo cargar esta página. Revisa tu conexión y vuelve a intentarlo.</p>
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })

/** The section being read: the last heading that has crossed the top of the viewport, or the one just chosen. */
export function useActive(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null)
  const chosen = useRef(0)
  useEffect(() => {
    setActive(headings[0]?.id ?? null)
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => e !== null)
    if (els.length === 0 || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (Date.now() - chosen.current < 1200) return
      const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (top) setActive(top.target.id)
    }, { rootMargin: '-10% 0px -75% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [headings])
  return { active, choose: (id: string) => { chosen.current = Date.now(); setActive(id); scrollToId(id) } }
}
