// Contract of figma/doc-dsl.js: masters may use the flat spec ({frame:true,...,fillWidth}) and it is normalised to the base DSL.
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const H = { figma: {}, V: new Map(), tx() {}, code() {} }
await new AsyncFunction('H', readFileSync(new URL('../figma/doc-dsl.js', import.meta.url), 'utf8'))(H)

const n = H.normalize
assert.equal(typeof n, 'function', 'H.normalize must exist')

// flat frame -> nested frame def, fillWidth -> fillW
assert.deepEqual(
  n({ name: 'Root', children: [{ frame: true, name: 'Rule', height: 1, fillWidth: true, children: [] }] }).children,
  [{ frame: { name: 'Rule', height: 1, children: [] }, fillW: true }]
)
// text: fillWidth -> fillW, width -> w
assert.deepEqual(n({ children: [{ text: 'a', style: 's', fillWidth: true, width: 120 }] }).children, [{ text: 'a', style: 's', fillW: true, w: 120 }])
// already-nested frames are left as they were (old masters)
const old = { frame: { name: 'X', children: [{ text: 'b' }] }, fillW: true }
assert.deepEqual(n({ children: [old] }).children, [old])
// nested recursion
const deep = n({ children: [{ frame: true, name: 'A', children: [{ frame: true, name: 'B', fillWidth: true, children: [] }] }] })
assert.deepEqual(deep.children[0].frame.children, [{ frame: { name: 'B', children: [] }, fillW: true }])
// root keys are untouched
assert.equal(n({ name: 'R', width: 360, fillWidth: true, children: [] }).width, 360)

// ---- H.variants: no clipping (shadows survive) and room around the variants for them ----
{
  const made = []
  const mockSet = { name: '', children: [], fills: [1], strokes: [1], appendChild() {}, resize(w, h) { this.w = w } , clipsContent: true }
  const H2 = { figma: { combineAsVariants: () => mockSet }, V: new Map(), tx() {}, code() {} }
  await new AsyncFunction('H', readFileSync(new URL('../figma/doc-dsl.js', import.meta.url), 'utf8'))(H2)
  H2.variants([], 'X', { appendChild() {} })
  assert.equal(mockSet.clipsContent, false, 'a component set must not clip its content: component shadows would be cut')
  assert.ok(mockSet.paddingLeft >= 24 && mockSet.paddingTop >= 24 && mockSet.paddingRight >= 24 && mockSet.paddingBottom >= 24, 'a component set needs at least 24 px of room for shadows')
  assert.ok(mockSet.itemSpacing >= 32, 'variants need 32 px between them so neighbouring shadows do not overlap')
}

// ---- the page kit: dark shows every variant, and every page gets the canvas colour ----
{
  const kit = readFileSync(new URL('../figma/doc-page-kit.js', import.meta.url), 'utf8')
  assert.doesNotMatch(kit, /defaultVariant\.createInstance/, 'dark mode must instantiate every variant, not only the default one')
  assert.match(kit, /#635841/i, 'the page kit sets the canvas colour #635841')
  assert.match(kit, /\.backgrounds\s*=/, 'the page kit assigns page.backgrounds')
  assert.match(kit, /pad: mode === 'Dark' \? 40 : 0/, 'the dark host keeps the same 40 px as the light component set')
}

// ---- masters: a divider is a one-sided border, never a box ----
{
  const { readdirSync } = await import('node:fs')
  const dir = new URL('../figma/masters/', import.meta.url)
  const offenders = []
  for (const f of readdirSync(dir)) {
    readFileSync(new URL(f, dir), 'utf8').split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/stroke:\s*[^,]*?(list-border|select-all-border|footer-border|[-/]rule|divider)[^,]*,\s*sw:\s*([^,]+)/g)) {
        if (!m[2].trim().startsWith('{') && !/radius:/.test(line)) offenders.push(`${f}:${i + 1} (${m[1]})`) // a rounded frame is a real box (a listbox, a card)
      }
    })
  }
  assert.deepEqual(offenders, [], 'these masters draw a divider as a full box; use sw: { b: … } or { t: … }')
}

// ---- print-batch: several pages in one call, each guarded so one failure does not stop the rest ----
{
  const { batchCall } = await import('../scripts/figma/print-batch.mjs')
  const call = batchCall(['footnote', 'tabs'])
  assert.match(call, /"name":"Footnote"/); assert.match(call, /"name":"Tabs"/)
  assert.match(call, /try \{/); assert.match(call, /catch \(e\)/)
  assert.match(call, /"mastersOnly":true/)
  assert.throws(() => batchCall(['nope']), /unknown component id/)
}
console.log('figma-dsl: ok')

// print-call --masters emits a minimal call (no DATA body) that only rebuilds the specimens
import { execFileSync } from 'node:child_process'
const call = execFileSync('node', ['scripts/figma/print-call.mjs', 'divider', '--masters'], { encoding: 'utf8' })
assert.match(call, /"mastersOnly":true/)
assert.ok(call.length < 2500, 'masters-only call must stay small, got ' + call.length)
const kit = readFileSync(new URL('../figma/doc-page-kit.js', import.meta.url), 'utf8')
assert.match(kit, /DATA\.mastersOnly/)
console.log('figma-call: ok')

// every documented component has its master source, so any page can be rebuilt from the repo
import { existsSync } from 'node:fs'
import { buildDocs } from '../scripts/figma/docs.mjs'
const missing = buildDocs().map((d) => d.id).filter((id) => !existsSync(new URL(`../figma/masters/${id}.js`, import.meta.url)))
assert.deepEqual(missing, [], 'components without a Figma master: ' + missing.join(', '))
console.log('figma-masters: ok')

// Button family (H5 Figma review, C1): the masters show what the code does
const master = (id) => readFileSync(new URL(`../figma/masters/${id}.js`, import.meta.url), 'utf8')
assert.match(readFileSync(new URL('../figma/doc-dsl.js', import.meta.url), 'utf8'), /c\.underline/, 'the DSL must support underlined text')
assert.match(master('link'), /underline: true/, 'Link is always underlined')
assert.match(master('button'), /'link'/, 'Button has the link variant')
assert.match(master('button'), /Content=/, 'Button shows content variants (label, icon left, icon right, both)')
assert.match(master('button'), /Both icons/, 'Button shows icons on both sides')
assert.match(master('button-group'), /Joined/, 'ButtonGroup shows the joined layout')
assert.doesNotMatch(master('split-button'), /gap: S \+ 'gap'/, 'SplitButton is one element: no gap between the parts')
assert.ok(/const G = 'Components\/button-group\/'/.test(master('split-button')) && /G \+ 'divider'/.test(master('split-button')), 'SplitButton draws the divider of the button group inside')
assert.doesNotMatch(master('split-button'), /name: 'Main'[\s\S]*stroke: outline/, 'the SplitButton parts do not carry their own outer borders')
console.log('figma-button-family: ok')

// Avatar shows photos (generated once; hashes are kept in the file so rebuilding keeps them) and a group
assert.match(master('avatar'), /avatarPhotos/, 'Avatar reads the stored photo hashes')
assert.match(master('avatar'), /Photo=Medium/, 'Avatar shows photo variants')
assert.match(master('avatar'), /Group=Photos/, 'Avatar shows a group of photos')
console.log('figma-avatar: ok')

// CountBadge shows the red tone for notifications
{
  const cb = readFileSync(new URL('../figma/masters/count-badge.js', import.meta.url), 'utf8')
  assert.match(cb, /danger/, 'CountBadge shows the danger tone')
}
console.log('figma-count-badge: ok')

// Select shows its open state (the list itself is drawn by the system, so the variant is illustrative and says so)
{
  const sel = master('select')
  assert.match(sel, /State=Open/, 'Select shows the open state')
  assert.match(sel, /Components\/combobox\//, 'the open list borrows the combobox list tokens')
}
console.log('figma-select: ok')
