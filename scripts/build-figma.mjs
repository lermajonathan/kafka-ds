#!/usr/bin/env node
/**
 * Figma build — zero dependencies.
 *   node scripts/build-figma.mjs          writes figma/variables.json and figma/chunks/*.json
 *   node scripts/build-figma.mjs --check  fails if they are out of date (part of `pnpm verify`)
 *
 * figma/variables.json  the full payload (collections → variables → per-mode values, scopes, WEB code syntax)
 * figma/chunks/*.json   the same data in compact rows, sized to be applied with figma/apply-variables.js
 *                       in one `use_figma` call each (see docs/figma.md).
 * Row: [name, "C"|"F"|"S", "SCOPE,SCOPE", light-or-only value, dark value | null, description?]; an alias is "@Collection/name".
 */
import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildPayload } from './figma/payload.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')
const CHUNK = 145
const payload = buildPayload()

const val = (v) => (v.alias ? `@${v.alias}` : v.value)
const row = (c, v) => {
  const first = val(v.values[c.modes[0]])
  const dark = c.modes.length > 1 && JSON.stringify(v.values.Dark) !== JSON.stringify(v.values.Light) ? val(v.values.Dark) : null
  const r = [v.name, { COLOR: 'C', FLOAT: 'F', STRING: 'S' }[v.type], v.scopes.join(','), first, dark]
  if (v.description) r.push(v.description)
  return r
}
const files = new Map([['figma/variables.json', JSON.stringify(payload, null, 2) + '\n']])
payload.collections.forEach((c, ci) => {
  const rows = c.variables.map((v) => row(c, v))
  const n = Math.max(1, Math.ceil(rows.length / CHUNK))
  for (let i = 0; i < n; i++) {
    const name = `figma/chunks/${ci + 1}-${c.name.toLowerCase()}${n > 1 ? `-${i + 1}` : ''}.json`
    files.set(name, JSON.stringify({ collection: c.name, modes: c.modes, rows: rows.slice(i * CHUNK, (i + 1) * CHUNK) }) + '\n')
  }
})

let stale = 0
for (const [f, content] of files) {
  const p = resolve(root, f)
  if (check) {
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== content) { console.error(`  ✗ ${f} is out of date — run pnpm run figma`); stale++ }
  } else {
    fs.mkdirSync(dirname(p), { recursive: true })
    fs.writeFileSync(p, content)
    console.log('  ✓', f)
  }
}
if (check) {
  const known = new Set([...files.keys()].map((f) => resolve(root, f)))
  const dir = resolve(root, 'figma/chunks')
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (!known.has(resolve(dir, f))) { console.error(`  ✗ figma/chunks/${f} is not generated any more`); stale++ }
  if (stale) process.exit(1)
  console.log(`✓ figma payload up to date (${files.size} files)`)
}
