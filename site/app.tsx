import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Combobox, Field, KafkaProvider, NavMenu, Prose, ThemeProvider, labelsEs, type NavMenuItem } from '../src/components'
import data, { exampleLoaders, pageLoaders } from 'virtual:kafka-site'
import type { Example } from '../examples/types'
import { href, navigate, useRoute } from './router'
import { LiveExample } from './live'
import { familyName } from './names'
import { Footer, Header } from './chrome'
import { Landing } from './home'

const THEME_KEY = 'kafka-site-theme'
const SITE = 'Kafka'

const byId = new Map(data.components.map((c) => [c.id, c]))
const decisionById = new Map(data.decisions.map((d) => [d.id, d]))

const nav: NavMenuItem[] = [
  { key: '', label: 'Inicio', href: href('') },
  { key: 'getting-started', label: 'Primeros pasos', href: href('getting-started') },
  { key: 'components', label: 'Todos los componentes', href: href('components') },
  ...data.families.map((f) => ({
    key: 'family-' + f.name,
    label: familyName(f.name),
    children: f.ids.map((id) => ({ key: 'components/' + id, label: byId.get(id)!.name, href: href('components/' + id) })),
  })),
  {
    key: 'decisions',
    label: 'Decisiones',
    href: href('decisions'),
    children: data.decisions.map((d) => ({ key: d.path, label: `${d.id.replace('DDR-KF-', '')} · ${d.title}`, href: href(d.path) })),
  },
  { key: 'tokens', label: 'Tokens', href: href('tokens') },
]

/** Generated documentation as a reading column. The html comes from our own markdown at build time. */
/** Everything a reader can look for: components (with their family), decisions and the fixed pages. */
const searchOptions = [
  ...data.pages.map((p) => ({ value: p.path, label: p.title })),
  ...data.families.flatMap((f) => f.ids.map((id) => ({ value: 'components/' + id, label: `${byId.get(id)!.name} · ${familyName(f.name)}` }))),
  ...data.decisions.map((d) => ({ value: d.path, label: `${d.id} · ${d.title}` })),
]

function Search() {
  return (
    <div className="search">
      <Field label="Buscar en la documentación">
        <Combobox options={searchOptions} value={null} placeholder="Buscar…" onValueChange={(route) => route !== null && navigate(route)} />
      </Field>
    </div>
  )
}

function Html({ html }: { html: string }) {
  return <Prose as="div" fullWidth className="doc" dangerouslySetInnerHTML={{ __html: html }} />
}

/** Runs `load` when `key` changes and keeps the latest result; a stale answer never replaces a newer one. */
function useLoaded<T>(key: string, load: (() => Promise<T>) | undefined): { value: T | null; failed: boolean } {
  const [state, setState] = useState<{ key: string; value: T | null; failed: boolean }>({ key, value: null, failed: false })
  useEffect(() => {
    let live = true
    if (!load) return
    load().then((value) => live && setState({ key, value, failed: false }), () => live && setState({ key, value: null, failed: true }))
    return () => { live = false }
  }, [key, load])
  return state.key === key ? state : { value: null, failed: false }
}

function Loading() {
  return <p role="status" className="loading">Cargando…</p>
}
function LoadFailed() {
  return <p role="alert" className="loading">No se pudo cargar esta página. Revisa tu conexión y vuelve a intentarlo.</p>
}

/** A page whose html is fetched on demand. */
function DocPage({ route }: { route: string }) {
  const { value, failed } = useLoaded(route, pageLoaders[route])
  if (failed) return <LoadFailed />
  return value === null ? <Loading /> : <Html html={value} />
}

/** A component page: the generated documentation with each example running above its code. Both arrive on demand. */
function ComponentPage({ id }: { id: string }) {
  const route = 'components/' + id
  const doc = useLoaded(route, pageLoaders[route])
  const ex = useLoaded<Example[]>(id, exampleLoaders[id])
  if (doc.failed || ex.failed) return <LoadFailed />
  if (doc.value === null || ex.value === null) return <Loading />
  const examples = ex.value
  return (
    <>
      {doc.value.split(/<!--live:(\d+)-->/).map((part, i) => {
        if (i % 2 === 0) return <Html key={i} html={part} />
        const e = examples[Number(part)]
        return e ? <LiveExample key={i} title={e.title}>{e.render()}</LiveExample> : null
      })}
    </>
  )
}

function ComponentsIndex() {
  return (
    <div>
      <h1 className="page-title">Componentes</h1>
      <p className="page-lead">{data.counts.components} componentes, una página cada uno. La documentación de cada componente está en inglés.</p>
      {data.families.map((f) => (
        <section key={f.name} aria-labelledby={'fam-' + f.name} className="family">
          <h2 id={'fam-' + f.name}>{familyName(f.name)}</h2>
          <ul className="cards">
            {f.ids.map((id) => {
              const c = byId.get(id)!
              return <li key={id}><a href={href(c.path)}>{c.name}</a><span>{c.summary}</span></li>
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function DecisionsIndex() {
  return (
    <div>
      <h1 className="page-title">Decisiones de diseño</h1>
      <p className="page-lead">Cada decisión importante queda escrita: contexto, decisión y alternativas descartadas.</p>
      <ol className="decisions">
        {data.decisions.map((d) => (
          <li key={d.id}>
            <span className="decision-id">{d.id}</span>
            <a href={href(d.path)}>{d.title}</a>
            <span className="decision-status">{d.status}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function NotFound() {
  return (
    <div>
      <h1 className="page-title">No se encontró la página</h1>
      <p className="page-lead">Esta dirección no existe en la documentación.</p>
      <p><a href={href('')}>Volver al inicio</a></p>
    </div>
  )
}

interface Resolved { title: string; node: ReactNode }
function resolve(route: string): Resolved {
  if (route === '') return { title: `${SITE} · Sistema de diseño`, node: <Landing /> }
  if (route === 'components') return { title: `Componentes · ${SITE}`, node: <ComponentsIndex /> }
  if (route === 'decisions') return { title: `Decisiones · ${SITE}`, node: <DecisionsIndex /> }
  let m: RegExpMatchArray | null
  if ((m = route.match(/^components\/([a-z0-9-]+)$/)) && byId.has(m[1]!)) return { title: `${byId.get(m[1]!)!.name} · ${SITE}`, node: <ComponentPage key={route} id={m[1]!} /> }
  if ((m = route.match(/^decisions\/(DDR-KF-\d+)$/)) && decisionById.has(m[1]!)) return { title: `${m[1]} · ${SITE}`, node: <DocPage key={route} route={route} /> }
  const page = data.pages.find((p) => p.path === route)
  if (page) return { title: `${page.title} · ${SITE}`, node: <DocPage key={route} route={route} /> }
  return { title: `No encontrada · ${SITE}`, node: <NotFound /> }
}

export function App() {
  const route = useRoute()
  const page = useMemo(() => resolve(route), [route])
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const [menu, setMenu] = useState(false)

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
    setMenu(false)
    if (first.current) { first.current = false; return } // keep the browser's own focus on first load
    main.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [route, page.title])

  return (
    <KafkaProvider labels={labelsEs}>
      <ThemeProvider storageKey={THEME_KEY}>
        <a className="skip" href="#contenido" onClick={(e) => { e.preventDefault(); main.current?.focus() }}>Saltar al contenido</a>
        <Header route={route} menuOpen={menu} onMenu={() => setMenu((v) => !v)} />
        {route === '' ? (
          <main id="contenido" ref={main} tabIndex={-1} className="content-wide">{page.node}</main>
        ) : (
          <div className="shell">
            <aside id="documentacion" className="side" data-open={menu}>
              <Search />
              <NavMenu items={nav} value={route} label="Documentación" onNavigate={(key) => navigate(key)} />
            </aside>
            <main id="contenido" ref={main} tabIndex={-1} className="content">{page.node}</main>
          </div>
        )}
        <Footer onTop={() => { window.scrollTo({ top: 0 }); main.current?.focus({ preventScroll: true }) }} />
      </ThemeProvider>
    </KafkaProvider>
  )
}
