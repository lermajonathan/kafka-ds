// Visual regression without committed screenshots: build the playground for a base ref and for this checkout on the
// same machine, screenshot every example in light and dark at two widths, and compare with pixelmatch.
//   node tests/visual.mjs [--base <ref>]     default base: $KAFKA_VISUAL_BASE, else origin/main, else HEAD~1
// Set KAFKA_VISUAL_ALLOW=1 for a change that is meant to alter pixels (the report is still printed).
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { chromium } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const root = path.resolve(import.meta.dirname, '..')
const sh = (cmd, cwd = root) => execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : undefined }
const THRESHOLD = 0.1 // per-pixel colour distance (0–1) pixelmatch tolerates for anti-aliasing
const ALLOWED_DIFF_PIXELS = 0

const candidates = [arg('--base'), process.env.KAFKA_VISUAL_BASE, 'origin/main', 'HEAD~1'].filter(Boolean)
const exists = (ref) => { try { sh(`git rev-parse --verify --quiet ${ref}`); return true } catch { return false } }
const baseRef = candidates.find(exists)
if (!baseRef) { console.log('✓ No base commit to compare with; visual test skipped'); process.exit(0) }
const baseSha = sh(`git rev-parse ${baseRef}`)
if (baseSha === sh('git rev-parse HEAD') && !sh('git status --porcelain')) { console.log(`✓ Base ${baseRef} is this commit; nothing to compare`); process.exit(0) }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafka-visual-'))
const baseDir = path.join(tmp, 'base')
sh(`git worktree add --detach ${baseDir} ${baseSha}`)
const cleanup = () => { try { sh(`git worktree remove --force ${baseDir}`) } catch {} fs.rmSync(tmp, { recursive: true, force: true }) }
process.on('exit', cleanup)

if (!fs.existsSync(path.join(baseDir, 'playground/index.html'))) { console.log(`✓ ${baseRef} has no playground yet; visual test skipped`); process.exit(0) }
// Same lockfile → reuse node_modules; otherwise install.
const sameLock = fs.readFileSync(path.join(root, 'pnpm-lock.yaml'), 'utf8') === fs.readFileSync(path.join(baseDir, 'pnpm-lock.yaml'), 'utf8')
if (sameLock) fs.symlinkSync(path.join(root, 'node_modules'), path.join(baseDir, 'node_modules')); else sh('pnpm install --frozen-lockfile', baseDir)
console.log(`  building base (${baseRef} @ ${baseSha.slice(0, 7)}) and head…`)
sh('pnpm run build', baseDir)
sh('pnpm run build')

const serve = (dir) => new Promise((resolve) => {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
  const srv = http.createServer((req, res) => {
    const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    const file = fs.existsSync(p) && fs.statSync(p).isFile() ? p : path.join(dir, 'index.html')
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' }); fs.createReadStream(file).pipe(res)
  }).listen(0, () => resolve(srv))
})
const [a, b] = await Promise.all([serve(path.join(baseDir, 'dist/playground')), serve(path.join(root, 'dist/playground'))])
const urlOf = (srv) => `http://localhost:${srv.address().port}`

const browser = await chromium.launch()
const shot = async (base, params, width) => {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  await page.goto(`${base}/?${new URLSearchParams(params)}`)
  await page.waitForSelector('main'); await page.evaluate(() => document.fonts.ready)
  const buf = await page.screenshot({ fullPage: true, animations: 'disabled' })
  await page.close(); return PNG.sync.read(buf)
}
const ids = (await (await browser.newPage()).goto(urlOf(b)) && null, JSON.parse(sh('node -e "import(\'tsx/esm/api\').then(m=>m.tsImport(\'./examples/index.ts\',\'file://\'+process.cwd()+\'/\')).then(m=>console.log(JSON.stringify(Object.keys(m.registry))))"')))
const rows = []
let bad = 0
for (const id of ids) for (const theme of ['light', 'dark']) for (const width of [1280, 390]) {
  const [x, y] = await Promise.all([shot(urlOf(a), { only: id, theme }, width), shot(urlOf(b), { only: id, theme }, width)])
  let diff = -1
  if (x.width === y.width && x.height === y.height) diff = pixelmatch(x.data, y.data, null, x.width, x.height, { threshold: THRESHOLD })
  const label = `${id} · ${theme} · ${width}px`
  if (diff < 0) { rows.push(`  ✗ ${label}: page size changed (${x.width}×${x.height} → ${y.width}×${y.height})`); bad++ }
  else if (diff > ALLOWED_DIFF_PIXELS) { rows.push(`  ✗ ${label}: ${diff} px changed`); bad++ }
  else rows.push(`  ✓ ${label}: 0 px changed`)
}
await browser.close(); a.close(); b.close()
console.log(rows.join('\n'))
if (bad && !process.env.KAFKA_VISUAL_ALLOW) { console.log(`\n✗ ${bad} page(s) changed against ${baseRef}. If that is intended, rerun with KAFKA_VISUAL_ALLOW=1 (CI: label the PR "visual-change").`); process.exit(1) }
console.log(bad ? `\n! ${bad} page(s) changed (allowed)` : `\n✓ No visual change against ${baseRef}`)
