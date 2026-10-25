// Parses docs/components/*.md (generated from the TypeScript source) into the data for the Figma documentation pages.
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'docs/components'
// Components whose page lists no tokens of their own reuse another component's (or none).
const TOKENS_FROM = { 'news-box': 'news', 'toggle-button': 'button', 'range-calendar': 'calendar' }
const NO_PROPS_OK = new Set(['drop-cap'])
export { NO_PROPS_OK }
function flat(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !('$value' in v) ? flat(v, prefix + k + '.') : k.startsWith('$') ? [] : [[prefix + k, v.$value]]))
}
const COMPONENT_TOKENS = flat(JSON.parse(fs.readFileSync('tokens/components.json', 'utf8')))
const clean = (s) => s.replace(/`/g, '').trim()

function sections(md) {
  const out = {}
  let key = '_head'
  out[key] = []
  for (const line of md.split('\n')) {
    const m = /^## (.+)$/.exec(line)
    if (m) { key = m[1].trim(); out[key] = []; continue }
    out[key].push(line)
  }
  return out
}
const bullets = (lines = []) => lines.filter((l) => l.startsWith('- ')).map((l) => clean(l.slice(2).replace(/\*\*/g, '')))
function table(lines = []) {
  const rows = lines.filter((l) => l.startsWith('|')).slice(2)
  return rows.map((r) => r.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|')))
}
function examples(lines = []) {
  const out = []
  let cur = null, inCode = false
  for (const l of lines) {
    if (l.startsWith('### ')) { cur = { title: l.slice(4).trim(), text: '', code: '' }; out.push(cur); continue }
    if (!cur) continue
    if (l.startsWith('```')) { inCode = !inCode; continue }
    if (inCode) cur.code += (cur.code ? '\n' : '') + l
    else if (l.trim()) cur.text += (cur.text ? ' ' : '') + clean(l)
  }
  return out
}

function categories() {
  const map = new Map()
  let cat = ''
  for (const l of fs.readFileSync(path.join(DIR, 'README.md'), 'utf8').split('\n')) {
    const h = /^## (.+)$/.exec(l)
    if (h) { cat = h[1].trim(); continue }
    const r = /^\| \[`([^`]+)`\]\(([^)]+)\.md\) \| (.+) \|$/.exec(l)
    if (r) map.set(r[2], { category: cat, use: r[3] })
  }
  return map
}

export function buildDocs() {
  const cats = categories()
  const order = [...cats.keys()]
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && f !== 'README.md').map((f) => f.replace(/\.md$/, ''))
  files.sort((a, b) => (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 999 : order.indexOf(b)))
  return files.map((id) => {
    const md = fs.readFileSync(path.join(DIR, `${id}.md`), 'utf8')
    const s = sections(md)
    const head = s._head.filter((l) => !l.startsWith('<!--'))
    const name = (head.find((l) => l.startsWith('# ')) || '').slice(2).trim()
    const summary = clean(head.filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('import')).slice(0, 1).join(' '))
    const imp = (head.find((l) => l.startsWith('import {')) || '').trim()
    const meta = cats.get(id) || { category: 'Other', use: summary }
    return {
      id, name, category: meta.category, use: meta.use, summary, import: imp,
      whenTo: bullets(s['When to use it']),
      whenNot: bullets(s['When not to']),
      examples: examples(s['Examples']),
      props: table(s['Props']).map(([n, type, def, desc]) => ({ name: clean(n.replace('(required)', '')), required: /required/.test(n), type: clean(type), default: clean(def || ''), description: clean(desc || '') })),
      accessibility: bullets(s['Accessibility']),
      content: bullets(s['Content']),
      tokens: (() => {
        const own = table(s['Tokens']).map(([n, v]) => ({ name: clean(n), value: clean(v) }))
        if (own.length || !TOKENS_FROM[id]) return own
        return COMPONENT_TOKENS.filter(([k]) => k.split('.')[0] === TOKENS_FROM[id]).map(([k, v]) => ({ name: k, value: String(v) }))
      })(),
      tokensFrom: TOKENS_FROM[id] || null,
      related: bullets(s['Related']),
    }
  })
}
