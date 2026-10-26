// Contract of the pattern pages: data in scripts/figma/patterns.mjs, one composition per pattern in figma/patterns/<id>.js
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { buildPatterns } from '../scripts/figma/patterns.mjs'
import { buildDocs } from '../scripts/figma/docs.mjs'

const names = new Set(buildDocs().map((d) => d.name))
const patterns = buildPatterns()
assert.deepEqual(patterns.map((p) => p.id), ['reading', 'enrollment', 'catalog', 'forms-navigation'])
for (const p of patterns) {
  const at = `pattern ${p.id}: `
  for (const k of ['name', 'summary']) assert.ok(p[k], at + 'needs ' + k)
  for (const k of ['whenTo', 'dos', 'donts', 'accessibility']) assert.ok(p[k]?.length >= 2, at + `needs at least 2 in ${k}`)
  assert.ok(p.uses.length >= 4, at + 'uses at least 4 components')
  for (const u of p.uses) assert.ok(names.has(u.name), at + `unknown component ${u.name}`)
  for (const u of p.uses) assert.ok(u.role, at + `${u.name} needs a role`)
  const file = new URL(`../figma/patterns/${p.id}.js`, import.meta.url)
  assert.ok(existsSync(file), at + 'missing figma/patterns/' + p.id + '.js')
  // every component the composition instantiates is declared in `uses`
  const src = readFileSync(file, 'utf8')
  const used = [...src.matchAll(/inst: '([^']+)'/g)].map((m) => m[1])
  for (const n of used) assert.ok(p.uses.some((u) => u.name === n), at + `composition instantiates ${n} but "uses" does not list it`)
  assert.ok(used.length >= 4, at + 'composition should instantiate real components')
}
// the DSL can instantiate components and the kit has a pattern mode
assert.match(readFileSync(new URL('../figma/doc-dsl.js', import.meta.url), 'utf8'), /c\.inst/)
assert.match(readFileSync(new URL('../figma/doc-page-kit.js', import.meta.url), 'utf8'), /DATA\.pattern/)
const call = execFileSync('node', ['scripts/figma/print-pattern.mjs', 'reading'], { encoding: 'utf8' })
assert.match(call, /"pattern":true/)
console.log('figma-patterns: ok')
