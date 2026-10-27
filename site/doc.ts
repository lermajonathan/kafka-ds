// Pure helpers over the generated documentation html: headings with ids, the page title, the import line.
export interface Heading { id: string; text: string }

const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
export const slug = (s: string) => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'seccion'
const text = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim()

/** Gives every h2 an id (from its text, made unique) and lists them. The html is our own markdown, rendered at build time. */
export function withIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = []
  const seen = new Map<string, number>()
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const t = text(inner)
    const base = slug(t)
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    const id = n === 1 ? base : `${base}-${n}`
    headings.push({ id, text: t })
    return `<h2 id="${id}">${inner}</h2>`
  })
  return { html: out, headings }
}

/** The h1 text, and the html without it. */
export function takeTitle(html: string): { title: string | null; rest: string } {
  const m = html.match(/<h1>([\s\S]*?)<\/h1>/)
  return m ? { title: text(m[1]!), rest: html.replace(m[0], '') } : { title: null, rest: html }
}

/** A component page opens with its title, one line, and the import. The rest starts at the first h2. */
export function splitDetail(html: string): { importLine: string | null; body: string } {
  const at = html.search(/<h2[\s>]/)
  const head = at < 0 ? html : html.slice(0, at)
  const pre = head.match(/<pre[\s\S]*?<\/pre>/)
  return { importLine: pre ? text(pre[0]) : null, body: at < 0 ? '' : html.slice(at) }
}

/** The tab names of a component page, in Spanish; the documentation itself stays in English. */
const TAB_ES: Record<string, string> = { examples: 'Ejemplos', 'when to use it': 'Cuándo usarlo', 'when not to': 'Cuándo no', props: 'Propiedades', accessibility: 'Accesibilidad', content: 'Contenido', tokens: 'Tokens', related: 'Relacionados' }
export const tabName = (h: string) => TAB_ES[h.toLowerCase()] ?? h
