// The drill-down: a component opens inside the catalog panel, under the same search and beside the same families.
import { useMemo, useState } from 'react'
import data, { exampleLoaders, pageLoaders } from 'virtual:kafka-site'
import type { Example } from '../examples/types'
import { href } from './router'
import { LiveExample } from './live'
import { familyName } from './names'
import { splitDetail, tabName, withIds } from './doc'
import { CatalogSearch, Html, LoadFailed, Loading, byId, familyOf, useActive, useLoaded } from './parts'

const POPULAR = ['pull-quote', 'footnote', 'prose', 'combobox'].map((id) => byId.get(id)).filter((c) => c !== undefined)

function Rail({ current }: { current: string }) {
  const own = familyOf.get(current)
  const [open, setOpen] = useState<string | null>(own ?? null)
  return (
    <nav aria-label="Familias" className="l-families l-rail">
      <p className="l-mono l-muted">FAMILIA</p>
      <ul>
        <li><a href={href('components')}><span>Todos</span><span>{data.counts.components}</span></a></li>
        {data.families.map((f) => (
          <li key={f.name}>
            <button type="button" aria-expanded={open === f.name} aria-controls={'rail-' + f.name} aria-current={f.name === own ? 'true' : undefined} onClick={() => setOpen(open === f.name ? null : f.name)}>
              <span>{familyName(f.name)}</span><span>{f.ids.length}</span>
            </button>
            {open === f.name && (
              <ul id={'rail-' + f.name} className="l-rail-sub">
                {f.ids.map((id) => <li key={id}><a href={href('components/' + id)} aria-current={id === current ? 'page' : undefined}>{byId.get(id)!.name}</a></li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Tabs({ headings }: { headings: { id: string; text: string }[] }) {
  const { active, choose } = useActive(headings)
  return (
    <nav aria-label="Secciones" className="d-tabs">
      {headings.map((h) => <button key={h.id} type="button" aria-current={h.id === active ? 'true' : undefined} onClick={() => choose(h.id)}>{tabName(h.text)}</button>)}
    </nav>
  )
}

function Detail({ id }: { id: string }) {
  const c = byId.get(id)!
  const route = 'components/' + id
  const family = familyOf.get(id) ?? ''
  const ids = data.families.find((f) => f.name === family)?.ids ?? []
  const at = ids.indexOf(id)
  const prev = at > 0 ? byId.get(ids[at - 1]!) : undefined
  const next = at >= 0 && at < ids.length - 1 ? byId.get(ids[at + 1]!) : undefined
  const doc = useLoaded(route, pageLoaders[route])
  const ex = useLoaded<Example[]>(id, exampleLoaders[id])
  const parts = useMemo(() => {
    if (doc.value === null) return null
    const s = splitDetail(doc.value)
    return { importLine: s.importLine, ...withIds(s.body) }
  }, [doc.value])
  const examples = ex.value
  return (
    <div className="d-detail" data-detail>
      <nav aria-label="Ruta" className="p-crumbs d-crumbs">
        <ol>
          <li><a href={href('components')}>Catálogo</a><span aria-hidden="true"> /</span></li>
          <li>{familyName(family)}<span aria-hidden="true"> /</span></li>
          <li><span aria-current="page">{c.name}</span></li>
        </ol>
        <a className="d-back" href={href('components')}><span aria-hidden="true">←</span> Volver a los resultados</a>
      </nav>
      <div className="d-head">
        <div>
          <p className="l-mono l-accent">{familyName(family)} · {at + 1} de {ids.length}</p>
          <h1>{c.name}</h1>
          <p className="d-summary">{c.summary}</p>
        </div>
        <div className="d-facts">
          <p className="l-mono l-muted">Importar</p>
          <pre data-import tabIndex={0}><code>{parts?.importLine ?? `import { ${c.name} } from '@kafka/react'`}</code></pre>
          <dl>
            <div><dt>Familia</dt><dd>{familyName(family)}</dd></div>
            <div><dt>Ejemplos</dt><dd>{examples === null ? '…' : examples.length}</dd></div>
          </dl>
        </div>
      </div>
      {doc.failed || ex.failed ? <LoadFailed /> : parts === null || examples === null ? <Loading /> : (
        <>
          <Tabs headings={parts.headings} />
          <div className="p-doc d-doc">
            {parts.html.split(/<!--live:(\d+)-->/).map((part, i) => {
              if (i % 2 === 0) return <Html key={i} html={part} />
              const e = examples[Number(part)]
              return e ? <LiveExample key={i} title={e.title}>{e.render()}</LiveExample> : null
            })}
          </div>
        </>
      )}
      <nav aria-label="Anterior y siguiente" className="d-pager">
        {prev ? <a href={href(prev.path)}><span className="l-mono l-muted"><span aria-hidden="true">←</span> Anterior</span><span className="d-pager-name">{prev.name}</span></a> : <span />}
        {next && <a href={href(next.path)} className="d-next"><span className="l-mono l-muted">Siguiente <span aria-hidden="true">→</span></span><span className="d-pager-name">{next.name}</span></a>}
      </nav>
    </div>
  )
}

export function ComponentDetail({ id }: { id: string }) {
  return (
    <div className="landing detail-page">
      <div className="l-catalog">
        <section className="l-search" aria-label="Buscador">
          <p className="l-mono l-accent">Catálogo general</p>
          <CatalogSearch />
          <p className="l-popular"><span>Más buscados:</span>{POPULAR.map((c) => <a key={c.id} className="l-pill" href={href(c.path)}>{c.name}</a>)}</p>
        </section>
        <div className="l-results">
          <Rail current={id} />
          <Detail key={id} id={id} />
        </div>
      </div>
    </div>
  )
}
