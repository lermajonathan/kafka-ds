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

// C3: TagInput keeps its height (32 px tags inside the field, wrapping), FileUpload shows its icon, RadioCard icon is square
{
  const tag = master('tag-input')
  assert.match(tag, /tag-height/, 'TagInput tags use the 32 px tag-height token')
  assert.match(tag, /wrap/, 'TagInput wraps onto more rows instead of overflowing')
  assert.match(tag, /State=Many/, 'TagInput shows the many-tags state')
  assert.doesNotMatch(tag, /minHeight: 44, minHeightVar: T/, 'a tag is no longer 44 px tall')
  assert.match(master('file-upload'), /icon: 'Upload'/, 'FileUpload shows the upload icon')
  const rc = master('radio-card')
  assert.match(rc, /icon-radius/, 'RadioCard icon uses its own radius')
  assert.doesNotMatch(rc, /radius: 'Semantic\/radius\/control', fill: C \+ 'icon-bg'/, 'RadioCard icon no longer uses the control radius')
}
console.log('figma-c3: ok')

// C4: Tooltip has an arrow and shows every side
{
  const tt = master('tooltip')
  assert.match(tt, /arrow/, 'Tooltip shows its arrow')
  for (const side of ['Top', 'Bottom', 'Left', 'Right']) assert.match(tt, new RegExp("\\['" + side + "'"), 'Tooltip shows the ' + side + ' side')
}
console.log('figma-tooltip: ok')

// C4: Calendar and RangeCalendar head is the real one (previous / month / next, 44 px high), so the weekdays are never pressed against the title
for (const id of ['calendar', 'range-calendar']) {
  const m = master(id)
  assert.match(m, /nav\('ChevronLeft'\)/, id + ' header has the previous-month button')
  assert.match(m, /nav\('ChevronRight'\)/, id + ' header has the next-month button')
  assert.match(m, /name: 'Header'[^\n]*height: 44/, id + ' header row is 44 px high')
}
console.log('figma-calendar-header: ok')

// C4: DateRangePicker keeps one line: the value is cut with an ellipsis and a tooltip carries the full text
{
  const d = master('date-range-picker')
  assert.match(d, /textTruncation = 'ENDING'|truncate: true/, 'DateRangePicker value is truncated')
  assert.match(d, /State=Truncated/, 'DateRangePicker shows the truncated state with its tooltip')
  assert.match(d, /Components\/tooltip\//, 'the truncated state uses the tooltip tokens')
}
console.log('figma-drp: ok')

// C5: Drawer is tall and rounded on the corners that face the page; ConfirmDialog reads like the component (title, then icon + message)
{
  const dr = master('drawer')
  assert.match(dr, /topLeftRadius/, 'Drawer rounds its corners')
  assert.match(dr, /388, 800/, 'Drawer is as tall as a desktop screen, not a small box')
  assert.match(dr, /D \+ 'radius'/, 'Drawer radius comes from its token')
  const cd = master('confirm-dialog')
  assert.match(cd, /name: 'Message'/, 'ConfirmDialog has a message row (icon + text)')
  assert.doesNotMatch(cd, /name: 'Header'/, 'ConfirmDialog no longer puts the icon beside the title')
}
console.log('figma-c5: ok')

// C6: patterns — the ProgramCard master is the whole card (cover with badge + price, full-width body, details, action),
// and an unread notification is its own piece, so two backgrounds never read as one
{
  const pc = master('program-card')
  assert.match(pc, /name: 'Body'[^\n]*fillWidth: true/, 'ProgramCard body fills the card (it was 191 px inside 360)')
  assert.match(pc, /inst: 'Badge'/, 'the status badge sits on the cover, inside the card')
  assert.match(pc, /P \+ 'price-bg'/, 'ProgramCard shows its price pill')
  assert.match(pc, /icon: 'Calendar'/, 'ProgramCard meta row has its icon')
  assert.match(pc, /primary\/bg/, 'ProgramCard has its single action')
  assert.match(pc, /height: 225/, 'the cover keeps the 16:10 ratio of the code (225 px at 360 wide)')
  assert.match(pc, /Status=' \+ status[\s\S]*'Last spots'|'Last spots'[\s\S]*Status=' \+ status/, 'ProgramCard shows its statuses')
  for (const id of ['enrollment', 'catalog']) {
    const src = readFileSync(new URL(`../figma/patterns/${id}.js`, import.meta.url), 'utf8')
    assert.doesNotMatch(src, /inst: 'Badge'/, id + ': a badge belongs on the card cover, not above the card')
    for (const m of src.matchAll(/variant: '(Highlight=[^']*)'/g)) assert.match(m[1], /Status=/, id + ': ProgramCard variant names a status')
  }
  const nc = master('notification-center')
  assert.match(nc, /N \+ 'inset'/, 'NotificationCenter items are inset')
  assert.match(nc, /N \+ 'item-radius'/, 'NotificationCenter items are rounded pieces')
  assert.doesNotMatch(nc, /rule, item/, 'no rule between items: spacing and the rounded background separate them')
  const comp = JSON.parse(readFileSync(new URL('../tokens/components.json', import.meta.url), 'utf8'))['notification-center']
  assert.equal(comp.inset?.$value, '{space.4}', 'token notification-center.inset')
  assert.equal(comp['item-radius']?.$value, '{radius.tile}', 'token notification-center.item-radius')
  const code = readFileSync(new URL('../src/components/notification-center.tsx', import.meta.url), 'utf8')
  assert.match(code, /kafka-notification-center-inset/, 'the component uses the inset token')
  assert.match(code, /kafka-notification-center-item-radius/, 'the component uses the item radius token')
}
console.log('figma-c6: ok')
