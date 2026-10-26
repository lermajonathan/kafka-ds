// Contract of the Phase B pages (Cover, Getting started, Icons, Decisions): data from the repo, never typed by hand
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { buildPageData, pageCall, PAGES } from '../scripts/figma/pages.mjs'

const src = (id) => readFileSync(new URL(`../figma/pages/${id}.js`, import.meta.url), 'utf8')
const d = buildPageData()

// the numbers are the repo's numbers
const leaves = (o) => Object.entries(o).reduce((n, [k, v]) => n + (k.startsWith('$') ? 0 : v && typeof v === 'object' ? ('$value' in v ? 1 : leaves(v)) : 0), 0)
const tokens = ['primitives', 'semantic', 'components'].reduce((n, f) => n + leaves(JSON.parse(readFileSync(new URL(`../tokens/${f}.json`, import.meta.url), 'utf8'))), 0)
assert.equal(d.tokens, tokens, 'cover tokens = tokens in the repo')
assert.equal(d.components, 70)
assert.equal(d.families.reduce((n, f) => n + f.count, 0), d.components, 'families add up to the components')
assert.ok(d.families.every((f) => f.note), 'every family has a note')

// DDR 013…019 are added to the Decisions page, with their own text
assert.deepEqual(d.newDdrs.map((x) => x.id), ['DDR-KF-013', 'DDR-KF-014', 'DDR-KF-015', 'DDR-KF-016', 'DDR-KF-017', 'DDR-KF-018', 'DDR-KF-019'])
for (const x of d.newDdrs) {
  for (const k of ['title', 'status', 'body', 'note']) assert.ok(x[k], x.id + ' needs ' + k)
  assert.ok(existsSync(new URL(`../docs/decisions/${x.id}-${x.slug}.md`, import.meta.url)), x.id + ' exists in docs/decisions')
}

for (const id of PAGES) assert.ok(existsSync(new URL(`../figma/pages/${id}.js`, import.meta.url)), 'missing figma/pages/' + id + '.js')

// pages are built from variables and styles, not from loose colours
for (const id of PAGES) assert.doesNotMatch(src(id).replace(/const paint = [^\n]*\n/, ''), /color:\s*\{\s*r:/, id + ': a colour is not bound to a variable')

// Cover: direction A (Pliego)
{ const c = src('cover')
  assert.match(c, /Pliego/, 'cover is the chosen direction A, Pliego')
  assert.match(c, /TOKENS/, 'cover shows tokens, not variables')
  assert.doesNotMatch(c, /VARIABLES/, 'cover no longer shows the stale variables count')
  assert.match(c, /Bécquer/, 'cover carries a public-domain verse')
  assert.doesNotMatch(c, /Altares/i, 'never sample text from Altares de sal')
  assert.match(c, /Kafka · Cover/, 'the cover keeps its root frame name')
}
// Getting started: same direction, numbers from the data, links
{ const g = src('getting-started')
  assert.match(g, /DATA\.families/, 'families come from the data')
  assert.match(g, /Kafka · Getting started/)
  assert.match(g, /setRangeHyperlink/, 'Getting started links to the repo')
}
// Icons: link to the Phosphor library
{ const i = src('icons')
  assert.equal(d.phosphor, 'https://phosphoricons.com', 'the Phosphor library address')
  assert.match(i, /DATA\.phosphor/, 'Icons links to Phosphor')
  assert.match(i, /setRangeHyperlink/)
}
// Decisions: every card is lifted (elevation), including the new ones
{ const x = src('decisions')
  assert.match(x, /Shadow\/md/, 'decision cards use the card elevation style')
  assert.match(x, /DATA\.newDdrs/, 'the new DDRs come from the data')
  assert.match(x, /setEffectStyleIdAsync/)
}
// the editorial frame (running head, gold rule under the title, colophon) goes on every documentation page except the cover
{ const f = readFileSync(new URL('../figma/page-frame.js', import.meta.url), 'utf8')
  for (const n of ['Running head', 'Gold rule', 'Colophon']) assert.match(f, new RegExp(n), 'page-frame builds ' + n)
  assert.match(f, /Cover/, 'page-frame skips the cover')
  assert.match(f, /Getting started/, 'page-frame skips Getting started (it already has the frame by construction)')
  assert.match(f, /remove\(\)/, 'page-frame is idempotent: it removes what it added before')
  assert.doesNotMatch(f.replace(/const paint = [^\n]*\n/, ''), /color:\s*\{\s*r:/, 'page-frame binds every colour to a variable')
  const { frameCall } = await import('../scripts/figma/pages.mjs')
  const call = frameCall(['Button', 'Tabs'])
  assert.match(call, /"Button","Tabs"|\["Button","Tabs"\]/); assert.ok(call.length < 20000)
}
// every call is self-contained
for (const id of PAGES) { const call = pageCall(id); assert.match(call, /return /); assert.ok(call.length < 45000, id + ' call too long: ' + call.length) }
console.log('figma-pages: ok')
