// Size budget for the docs site: the first load carries the shell only; every page's content and examples arrive on demand.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const dist = path.resolve(import.meta.dirname, '../dist/site')
const failures = []
const kb = (n) => (n / 1024).toFixed(0) + ' kB'
const gz = (file) => zlib.gzipSync(fs.readFileSync(file)).length

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const entry = html.match(/<script[^>]+src="[^"]*\/(assets\/[^"]+\.js)"/)?.[1]
if (!entry) { console.log('  ✗ index.html has no entry script'); process.exit(1) }
const entrySize = fs.statSync(path.join(dist, entry)).size
const entryGz = gz(path.join(dist, entry))
if (entryGz > 130 * 1024) failures.push(`entry script is ${kb(entryGz)} gzipped (budget 130 kB)`)

// What the first load fetches: the entry plus its static imports (modulepreload links).
const preloaded = [...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="[^"]*\/(assets\/[^"]+\.js)"/g)].map((m) => m[1])
const firstLoad = [entry, ...preloaded].reduce((n, f) => n + gz(path.join(dist, f)), 0)
if (firstLoad > 150 * 1024) failures.push(`first load is ${kb(firstLoad)} gzipped (budget 150 kB)`)

const chunks = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'))
if (chunks.length < 90) failures.push(`expected one chunk per page (90+), found ${chunks.length}`)
for (const f of chunks) {
  const size = gz(path.join(dist, 'assets', f))
  if (size > 130 * 1024) failures.push(`${f} is ${kb(size)} gzipped (budget 130 kB per chunk)`)
}
console.log(`  entry ${kb(entryGz)} gzipped · first load ${kb(firstLoad)} · ${chunks.length} chunks`)
if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
console.log('✓ Site size: shell first, pages on demand')
