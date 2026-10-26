// Contract of the Figma documentation payload: one page per component, parsed from docs/components/*.md
// (which is itself generated from the TypeScript source), grouped by the categories of docs/components/README.md.
import fs from 'node:fs'
import { buildDocs, NO_PROPS_OK } from '../scripts/figma/docs.mjs'

const errors = []
const fail = (m) => errors.push(m)
const docs = buildDocs()
const files = fs.readdirSync('docs/components').filter((f) => f.endsWith('.md') && f !== 'README.md')

if (docs.length !== files.length) fail(`expected ${files.length} components, got ${docs.length}`)
const cats = new Set(docs.map((d) => d.category))
for (const c of ['Actions', 'Data display', 'Forms', 'Navigation', 'Overlays', 'Reading', 'Feedback', 'Layout'])
  if (!cats.has(c)) fail(`missing category ${c}`)
if (docs.filter((d) => d.category === 'Reading').length !== 14) fail('Reading must have 14 components')
for (const d of docs) {
  const at = d.id
  if (!d.name) fail(`${at}: name`)
  if (!d.summary) fail(`${at}: summary`)
  if (!d.import.startsWith('import {')) fail(`${at}: import`)
  if (!d.whenTo.length) fail(`${at}: whenTo`)
  if (!d.examples.length) fail(`${at}: examples`)
  for (const e of d.examples) if (!e.title || !e.code.includes('<')) fail(`${at}: example ${e.title}`)
  if (!d.props.length && !NO_PROPS_OK.has(d.id)) fail(`${at}: props`)
  if (!d.accessibility.length) fail(`${at}: accessibility`)
  if (!d.tokens.length && d.id !== 'theme-toggle') fail(`${at}: tokens`)
  for (const t of d.tokens) if (!t.name || !t.value) fail(`${at}: token row`)
}
const pq = docs.find((d) => d.id === 'pull-quote')
if (!pq || pq.tokens.length !== 8 || pq.props[0].name !== 'children' || !pq.props[0].required) fail('pull-quote parse')
const fn = docs.find((d) => d.id === 'footnote')
if (fn?.props[0]?.type !== 'number | string') fail('escaped pipes in types must survive: ' + fn?.props[0]?.type)
if (!pq?.related.includes('Prose')) fail('pull-quote related')

if (errors.length) { console.error('✗ figma docs:\n' + errors.map((e) => '  - ' + e).join('\n')); process.exit(1) }
console.log(`✓ figma docs: ${docs.length} components in ${cats.size} categories, all with import, examples, props, accessibility and tokens`)
