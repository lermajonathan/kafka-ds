// Contract of the Figma payload (figma/variables.json), generated from tokens/*.json by scripts/build-figma.mjs.
// A professional Figma library needs: every variable scoped (never ALL_SCOPES), WEB code syntax = the real CSS variable,
// aliases that resolve, Light/Dark values for every token that has a dark value, and nothing that is not a variable.
import fs from 'node:fs'
import { buildPayload } from '../scripts/figma/payload.mjs'

const errors = []
const fail = (m) => errors.push(m)
const p = buildPayload()
const names = new Map()
for (const c of p.collections) for (const v of c.variables) names.set(`${c.key}/${v.name}`, { c, v })

const cols = Object.fromEntries(p.collections.map((c) => [c.name, c]))
if (!cols.Primitives || !cols.Semantic || !cols.Components) fail('collections must be Primitives, Semantic, Components')
if (cols.Semantic && cols.Semantic.modes.join() !== 'Light,Dark') fail('Semantic modes must be Light, Dark')
if (cols.Primitives && cols.Primitives.modes.join() !== 'Value') fail('Primitives has one mode: Value')

for (const [key, { c, v }] of names) {
  if (!v.scopes || v.scopes.includes('ALL_SCOPES')) fail(`${key}: scopes must be explicit`)
  if (c.name === 'Primitives' && v.scopes.length) fail(`${key}: primitives are hidden (scopes [])`)
  if (!/^var\(--kafka-[a-z0-9-]+\)$/.test(v.syntax)) fail(`${key}: bad WEB code syntax ${v.syntax}`)
  if (!['COLOR', 'FLOAT', 'STRING'].includes(v.type)) fail(`${key}: bad type ${v.type}`)
  for (const mode of c.modes) {
    const val = v.values[mode]
    if (val === undefined) { fail(`${key}: no value for mode ${mode}`); continue }
    if (val.alias) {
      const t = names.get(val.alias)
      if (!t) fail(`${key}: alias ${val.alias} does not exist`)
      else if (t.v.type !== v.type) fail(`${key}: alias ${val.alias} has type ${t.v.type}, expected ${v.type}`)
    } else if (v.type === 'COLOR' && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(val.value)) fail(`${key}: bad colour ${val.value}`)
    else if (v.type === 'FLOAT' && typeof val.value !== 'number') fail(`${key}: FLOAT needs a number`)
  }
}

// Dark values of the source must survive
const sem = fs.readFileSync(new URL('../tokens/semantic.json', import.meta.url), 'utf8')
const darkCount = (sem.match(/"kafka\.modes"/g) || []).length
const darkInPayload = cols.Semantic ? cols.Semantic.variables.filter((v) => JSON.stringify(v.values.Light) !== JSON.stringify(v.values.Dark)).length : 0
if (darkInPayload < darkCount - 6) fail(`dark values lost: source ${darkCount}, payload differs in ${darkInPayload}`)

// Scale of the library: every colour, dimension, number, duration and opacity token is a variable
if (names.size < 800) fail(`too few variables (${names.size}); typography, shadow and gradient are styles, everything else is a variable`)
for (const must of ['Primitives/color/ink/900', 'Semantic/color/bg/page', 'Components/button/primary/bg', 'Components/program-card/body-gap'])
  if (!names.has(must)) fail(`missing ${must}`)

if (errors.length) { console.error(errors.slice(0, 40).join('\n')); console.error(`\n✗ ${errors.length} figma payload problems`); process.exit(1) }
console.log(`✓ figma payload: ${names.size} variables in ${p.collections.length} collections, scoped, aliased, code-syntaxed`)
