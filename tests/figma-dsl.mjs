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
console.log('figma-dsl: ok')

// print-call --masters emits a minimal call (no DATA body) that only rebuilds the specimens
import { execFileSync } from 'node:child_process'
const call = execFileSync('node', ['scripts/figma/print-call.mjs', 'divider', '--masters'], { encoding: 'utf8' })
assert.match(call, /"mastersOnly":true/)
assert.ok(call.length < 2500, 'masters-only call must stay small, got ' + call.length)
const kit = readFileSync(new URL('../figma/doc-page-kit.js', import.meta.url), 'utf8')
assert.match(kit, /DATA\.mastersOnly/)
console.log('figma-call: ok')
