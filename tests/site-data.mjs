// Site data: the docs site is built from docs/*.md. These checks keep it complete and its links alive.
import fs from 'node:fs'
import path from 'node:path'
import { buildSiteData } from '../scripts/site/data.mjs'

const root = path.resolve(import.meta.dirname, '..')
const data = buildSiteData({ root })
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }

// Components: one page per docs/components/*.md (README is the index).
const ids = fs.readdirSync(path.join(root, 'docs/components')).filter((f) => f.endsWith('.md') && f !== 'README.md').map((f) => f.slice(0, -3)).sort()
check(data.components.length === ids.length && ids.length >= 70, `expected ${ids.length} component pages, got ${data.components.length}`)
check(JSON.stringify(data.components.map((c) => c.id).sort()) === JSON.stringify(ids), 'component ids differ from docs/components')
for (const c of data.components) {
  check(/^<h1[ >]/.test(c.html), `${c.id}: page must open with its <h1>`)
  check(c.name && c.summary, `${c.id}: needs a name and a one-line summary`)
  check(!c.html.includes('AUTO-GENERATED'), `${c.id}: the generator comment must not reach the page`)
  check(!/<script/i.test(c.html), `${c.id}: no scripts in documentation html`)
  // Each example in the "Examples" section gets one marker, so the site can run it live above its code.
  const examples = c.html.split('<h2>Examples</h2>')[1]?.split('<h2>')[0] ?? ''
  const headings = (examples.match(/<h3>/g) ?? []).length
  const markers = [...c.html.matchAll(/<!--live:(\d+)-->/g)].map((m) => Number(m[1]))
  check(headings > 0 && markers.length === headings && markers.every((n, i) => n === i), `${c.id}: ${headings} examples but markers ${JSON.stringify(markers)}`)
}

// Families come from the index and cover every component exactly once.
const inFamilies = data.families.flatMap((f) => f.ids)
check(data.families.length >= 8, `expected 8 families, got ${data.families.length}`)
check(inFamilies.length === ids.length && new Set(inFamilies).size === ids.length, 'every component must be in exactly one family')

// Decisions: DDR-KF-001…N in order, with a clean title and a status.
const ddrFiles = fs.readdirSync(path.join(root, 'docs/decisions')).filter((f) => /^DDR-KF-\d+/.test(f)).sort()
check(data.decisions.length === ddrFiles.length, `expected ${ddrFiles.length} decisions, got ${data.decisions.length}`)
data.decisions.forEach((d, i) => {
  check(d.id === `DDR-KF-${String(i + 1).padStart(3, '0')}`, `decision ${i + 1}: unexpected id ${d.id}`)
  check(d.title && !d.title.startsWith('DDR-KF'), `${d.id}: the title must not repeat the id`)
  check(/aceptada|propuesta|sustituida|rechazada/i.test(d.status), `${d.id}: needs a status`)
  check(/^<h1[ >]/.test(d.html), `${d.id}: page must open with its <h1>`)
})

// Fixed pages.
for (const p of ['getting-started', 'tokens']) check(data.pages.some((x) => x.path === p && /^<h1[ >]/.test(x.html)), `missing page ${p}`)

// Every internal link lands on a page that exists; no raw .md links survive.
const routes = new Set(['', ...data.pages.map((p) => p.path), 'components', 'decisions', ...data.components.map((c) => 'components/' + c.id), ...data.decisions.map((d) => 'decisions/' + d.id)])
const pages = [...data.pages, ...data.components, ...data.decisions]
for (const p of pages) for (const m of p.html.matchAll(/href="([^"]+)"/g)) {
  const href = m[1]
  if (/^https?:\/\//.test(href) || href.startsWith('mailto:')) continue
  check(!/\.md(#|$)/.test(href), `${p.path ?? p.id}: raw markdown link ${href}`)
  if (href.startsWith('#/')) check(routes.has(href.slice(2).split('#')[0]), `${p.path ?? p.id}: broken link ${href}`)
  else if (!href.startsWith('#')) check(false, `${p.path ?? p.id}: link that is neither external nor a site route: ${href}`)
}
// External links must be safe to open.
for (const p of pages) for (const m of p.html.matchAll(/<a [^>]*href="https?:[^>]*>/g)) check(/rel="noopener noreferrer"/.test(m[0]), `${p.path ?? p.id}: external link without rel="noopener noreferrer"`)
// Code blocks keep their text escaped.
for (const p of pages) check(!/<code[^>]*>[^<]*<[A-Z]/.test(p.html.replace(/<span[^>]*>|<\/span>/g, '')), `${p.path ?? p.id}: unescaped JSX inside <code>`)

check(/^\d+\.\d+\.\d+/.test(data.version), 'needs the version from package.json')
check(data.counts.components === ids.length && data.counts.tokens > 1000, 'counts for the home page are missing')

if (failures.length) { console.log(failures.slice(0, 30).map((f) => `  ✗ ${f}`).join('\n') + (failures.length > 30 ? `\n  … and ${failures.length - 30} more` : '')); process.exit(1) }
console.log(`✓ Site data: ${data.components.length} components, ${data.decisions.length} decisions, ${pages.length} pages, links resolve`)
