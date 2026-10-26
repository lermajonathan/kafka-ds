// Contract of the Figma QA audit: judge() turns the numbers read from the file into a pass/fail list.
import assert from 'node:assert/strict'
import { judge, auditCall } from '../scripts/figma/audit.mjs'

const clean = { pages: 90, dupPages: [], empty: 0, unboundFills: 0, glyphs: 0, collapsed: 0, unstyled: 0, docPages: 70, pagesWithoutMaster: [], pagesWithoutSections: [], wrongCanvas: [], darkParity: [], clippedSets: [], disabledOpacity: 45 }
assert.deepEqual(judge(clean), { ok: true, failures: [] })

const bad = judge({ ...clean, empty: 2, glyphs: 1, dupPages: ['Button'], pagesWithoutMaster: ['Toast'], disabledOpacity: 0.45, unboundFills: 3, wrongCanvas: ['Cover'], darkParity: ['PrevNext (light 4 / dark 1)'], clippedSets: ['Combobox'] })
assert.equal(bad.ok, false)
for (const word of ['empty', 'glyph', 'duplicate', 'Toast', 'opacity', 'unbound', 'canvas', 'PrevNext', 'Combobox']) assert.ok(bad.failures.some((f) => f.includes(word)), 'missing failure about ' + word)

// the call is self-contained and read-only
const call = auditCall()
assert.match(call, /return out/)
assert.match(call, /backgrounds/, 'the audit reads the canvas colour of every page')
assert.match(call, /Stage · /, 'the audit reads the light and dark stages')
assert.match(call, /stage\('Dark'\)/, 'the audit compares the dark stage with the light one')
assert.doesNotMatch(call, /\.remove\(\)|createPage|createFrame/)
console.log('figma-audit: ok')
