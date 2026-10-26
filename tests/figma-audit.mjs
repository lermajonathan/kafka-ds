// Contract of the Figma QA audit: judge() turns the numbers read from the file into a pass/fail list.
import assert from 'node:assert/strict'
import { judge, auditCall } from '../scripts/figma/audit.mjs'

const clean = { pages: 90, dupPages: [], empty: 0, unboundFills: 0, glyphs: 0, collapsed: 0, unstyled: 0, docPages: 70, pagesWithoutMaster: [], pagesWithoutSections: [], disabledOpacity: 45 }
assert.deepEqual(judge(clean), { ok: true, failures: [] })

const bad = judge({ ...clean, empty: 2, glyphs: 1, dupPages: ['Button'], pagesWithoutMaster: ['Toast'], disabledOpacity: 0.45, unboundFills: 3 })
assert.equal(bad.ok, false)
for (const word of ['empty', 'glyph', 'duplicate', 'Toast', 'opacity', 'unbound']) assert.ok(bad.failures.some((f) => f.includes(word)), 'missing failure about ' + word)

// the call is self-contained and read-only
const call = auditCall()
assert.match(call, /return out/)
assert.doesNotMatch(call, /\.remove\(\)|createPage|createFrame/)
console.log('figma-audit: ok')
