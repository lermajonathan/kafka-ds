// Inner pages in the home's language: breadcrumb and search, a large title, an index of the page on the side, wide reading column.
import { useMemo, type ReactNode } from 'react'
import data, { pageLoaders } from 'virtual:kafka-site'
import { href } from './router'
import { familyName } from './names'
import { takeTitle, withIds, type Heading } from './doc'
import { Html, Loading, LoadFailed, PageSearch, byId, useActive, useLoaded } from './parts'

export interface Crumb { label: string; route?: string }

function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta" className="p-crumbs">
      <ol>
        {items.map((c, i) => (
          <li key={c.label}>{i === items.length - 1 || c.route === undefined ? <span aria-current="page">{c.label}</span> : <a href={href(c.route)}>{c.label}</a>}{i < items.length - 1 && <span aria-hidden="true"> /</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

function Toc({ headings }: { headings: Heading[] }) {
  const { active, choose } = useActive(headings)
  if (headings.length < 2) return null
  return (
    <nav aria-label="En esta página" className="p-toc">
      <p className="l-mono l-muted">En esta página</p>
      <ul>
        {headings.map((h) => (
          <li key={h.id}><button type="button" aria-current={h.id === active ? 'true' : undefined} onClick={() => choose(h.id)}>{h.text}</button></li>
        ))}
      </ul>
    </nav>
  )
}

interface PageProps { crumbs: Crumb[]; eyebrow: string; title: string; lead?: ReactNode; headings?: Heading[]; next?: ReactNode; children: ReactNode }

export function InnerPage({ crumbs, eyebrow, title, lead, headings = [], next, children }: PageProps) {
  return (
    <div className="landing inner">
      <header className="p-head" data-page-head>
        <div className="p-top"><Crumbs items={crumbs} /><PageSearch /></div>
        <p className="l-mono l-accent">{eyebrow}</p>
        <div className="p-title-row">
          <h1 data-long={title.length > 28 ? '' : undefined}>{title}</h1>
          {lead && <p className="p-lead">{lead}</p>}
        </div>
      </header>
      <div className="p-body">
        <Toc headings={headings} />
        <div className="p-main">
          {children}
          {next}
        </div>
      </div>
    </div>
  )
}

/** A page whose html is fetched on demand and read as a column of numbered sections. */
export function DocPage({ route, crumbs, eyebrow, title, next }: { route: string; crumbs: Crumb[]; eyebrow: string; title: string; next?: ReactNode }) {
  const { value, failed } = useLoaded(route, pageLoaders[route])
  const parsed = useMemo(() => {
    if (value === null) return null
    const t = takeTitle(value)
    return { title: t.title, ...withIds(t.rest) }
  }, [value])
  return (
    <InnerPage crumbs={crumbs} eyebrow={eyebrow} title={parsed?.title ?? title} headings={parsed?.headings} next={parsed ? next : undefined}>
      {failed ? <LoadFailed /> : parsed === null ? <Loading /> : <div className="p-doc"><Html html={parsed.html} /></div>}
    </InnerPage>
  )
}

export function NextBand({ label, title, to, action }: { label: string; title: string; to: string; action: string }) {
  return (
    <section data-next aria-label={label} className="p-next">
      <div><p className="l-mono">{label}</p><p className="p-next-title">{title}</p></div>
      <a className="l-btn l-btn-gold" href={href(to)}>{action}</a>
    </section>
  )
}

export function ComponentsIndex() {
  const headings = data.families.map((f) => ({ id: 'fam-' + f.name, text: familyName(f.name) }))
  return (
    <InnerPage crumbs={[{ label: 'Inicio', route: '' }, { label: 'Componentes' }]} eyebrow="Catálogo" title="Componentes" headings={headings} lead={`${data.counts.components} componentes, una página cada uno. La documentación de cada componente está en inglés.`}>
      {data.families.map((f) => (
        <section key={f.name} aria-labelledby={'fam-' + f.name} className="p-family">
          <h2 id={'fam-' + f.name}>{familyName(f.name)} <span className="l-mono l-muted">{f.ids.length}</span></h2>
          <ul className="cards">
            {f.ids.map((id) => {
              const c = byId.get(id)!
              return <li key={id}><a href={href(c.path)}>{c.name}</a><span>{c.summary}</span></li>
            })}
          </ul>
        </section>
      ))}
    </InnerPage>
  )
}

export function DecisionsIndex() {
  return (
    <InnerPage crumbs={[{ label: 'Inicio', route: '' }, { label: 'Decisiones' }]} eyebrow="Registro" title="Decisiones de diseño" lead="Cada decisión importante queda escrita: contexto, decisión y alternativas descartadas.">
      <ol className="decisions">
        {data.decisions.map((d) => (
          <li key={d.id}>
            <span className="decision-id">{d.id}</span>
            <a href={href(d.path)}>{d.title}</a>
            <span className="decision-status">{d.status}</span>
          </li>
        ))}
      </ol>
    </InnerPage>
  )
}

export function NotFound() {
  return (
    <InnerPage crumbs={[{ label: 'Inicio', route: '' }, { label: 'No encontrada' }]} eyebrow="Error 404" title="No se encontró la página" lead="Esta dirección no existe en la documentación.">
      <p><a href={href('')}>Volver al inicio</a></p>
    </InnerPage>
  )
}
