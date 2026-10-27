import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { KafkaProvider, ThemeProvider, labelsEs } from '../src/components'
import data from 'virtual:kafka-site'
import { useRoute } from './router'
import { Footer, Header } from './chrome'
import { Landing } from './home'
import { ComponentDetail } from './detail'
import { ComponentsIndex, DocPage, NextBand, NotFound } from './inner'
import { byId } from './parts'

const THEME_KEY = 'kafka-site-theme'
const SITE = 'Kafka'

interface Resolved { title: string; node: ReactNode }
function resolve(route: string): Resolved {
  if (route === '') return { title: `${SITE} · Sistema de diseño`, node: <Landing /> }
  if (route === 'components') return { title: `Componentes · ${SITE}`, node: <ComponentsIndex /> }
  let m: RegExpMatchArray | null
  if ((m = route.match(/^components\/([a-z0-9-]+)$/)) && byId.has(m[1]!)) return { title: `${byId.get(m[1]!)!.name} · ${SITE}`, node: <ComponentDetail key={route} id={m[1]!} /> }
  const page = data.pages.find((p) => p.path === route)
  if (page) return { title: `${page.title} · ${SITE}`, node: <DocPage key={route} route={route} eyebrow={route === 'getting-started' ? 'Guía' : 'Referencia'} title={page.title} crumbs={[{ label: 'Inicio', route: '' }, { label: page.title }]} next={route === 'getting-started' ? <NextBand label="Siguiente" title={`Explora los ${data.counts.components} componentes`} to="components" action="Ir al catálogo" /> : undefined} /> }
  return { title: `No encontrada · ${SITE}`, node: <NotFound /> }
}

export function App() {
  const route = useRoute()
  const page = useMemo(() => resolve(route), [route])
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)

  // "/" jumps to the search field from anywhere that is not already a text field, as on most documentation sites.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || t?.closest('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      document.querySelector<HTMLInputElement>('.search input, .catalog-search input')?.focus()
    }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  }, [])

  useEffect(() => {
    document.title = page.title
    document.body.dataset.route = route
    if (first.current) { first.current = false; return } // keep the browser's own focus on first load
    main.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [route, page.title])

  return (
    <KafkaProvider labels={labelsEs}>
      <ThemeProvider storageKey={THEME_KEY}>
        <a className="skip" href="#contenido" onClick={(e) => { e.preventDefault(); main.current?.focus() }}>Saltar al contenido</a>
        <Header route={route} />
        <main id="contenido" ref={main} tabIndex={-1} className="content-wide">{page.node}</main>
        <Footer onTop={() => { window.scrollTo({ top: 0 }); main.current?.focus({ preventScroll: true }) }} />
      </ThemeProvider>
    </KafkaProvider>
  )
}
