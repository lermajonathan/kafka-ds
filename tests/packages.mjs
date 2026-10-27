// Installs the three packages, as tarballs, into a fresh project and checks they work the way a consumer would use them:
// the files exist, the stylesheet has the tokens, a component renders on the server, the types compile.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const sh = (cmd, cwd) => execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const failures = []
let passed = 0
const check = (cond, what) => { if (cond) passed++; else failures.push(what) }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafka-pkg-'))
const packDir = path.join(tmp, 'packs'); fs.mkdirSync(packDir)
for (const pkg of ['tokens', 'react', 'theme-altazor']) sh(`pnpm pack --pack-destination ${packDir}`, path.join(root, 'packages', pkg))
const tarballs = fs.readdirSync(packDir).map((f) => path.join(packDir, f))
check(tarballs.length === 3, 'the three packages pack')

const app = path.join(tmp, 'app'); fs.mkdirSync(app)
fs.writeFileSync(path.join(app, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }))
sh(`npm install --no-audit --no-fund --silent ${tarballs.join(' ')} react@19 react-dom@19 @types/react@19 typescript@5.9`, app)

const kr = path.join(app, 'node_modules/@kafka/react'), kt = path.join(app, 'node_modules/@kafka/tokens')
// 1 · files
for (const f of ['dist/index.js', 'dist/styles.css', 'dist/tailwind.css', 'dist/types/lib.d.ts', 'README.md', 'LICENSE']) check(fs.existsSync(path.join(kr, f)), `@kafka/react ships ${f}`)
for (const f of ['dist/tokens.css', 'dist/theme.css', 'dist/typography.css', 'dist/print.css', 'dist/tokens.json', 'dist/tokens.js', 'dist/tokens.d.ts', 'dist/json/semantic.json', 'LICENSE']) check(fs.existsSync(path.join(kt, f)), `@kafka/tokens ships ${f}`)
const ka = path.join(app, 'node_modules/@kafka/theme-altazor')
for (const f of ['dist/altazor.css', 'README.md', 'LICENSE']) check(fs.existsSync(path.join(ka, f)), `@kafka/theme-altazor ships ${f}`)
const themeCss = fs.readFileSync(path.join(ka, 'dist/altazor.css'), 'utf8')
check(themeCss.includes("[data-kafka-theme='altazor']") && !/(^|\n):root\s*\{/.test(themeCss), 'theme CSS is scoped and never writes :root')
check(!fs.readFileSync(path.join(kr, 'dist/types/lib.d.ts'), 'utf8').includes('.css'), 'type entry does not import CSS')
// 2 · stylesheets
const css = fs.readFileSync(path.join(kr, 'dist/styles.css'), 'utf8')
for (const needle of ['--kafka-color-bg-brand', '.kafka-focus', '--kafka-button-primary-bg', 'data-theme']) check(css.includes(needle), `styles.css contains ${needle}`)
check(!/\.bg-slate-|\.bg-blue-|\.bg-red-/.test(css), 'styles.css contains no default Tailwind palette')
const tw = fs.readFileSync(path.join(kr, 'dist/tailwind.css'), 'utf8')
check(tw.includes('@source "./index.js"') && tw.includes('@theme'), 'tailwind.css scans the package and defines the theme')
// 3 · the library renders on the server, with Spanish labels from the provider
const { registry } = await (await import('tsx/esm/api')).tsImport('../examples/index.ts', import.meta.url)
const names = Object.values(registry).map((e) => e.name)
fs.writeFileSync(path.join(app, 'render.mjs'), `
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import tokens from '@kafka/tokens'
import * as K from '@kafka/react'
import { Button, KafkaProvider, labelsEs, IconCrown } from '@kafka/react'
const html = renderToStaticMarkup(h(KafkaProvider, { labels: labelsEs }, h(Button, { loading: true, Icon: IconCrown }, 'Enviar')))
const names = ${JSON.stringify(names)}
const missing = names.filter((n) => typeof K[n] !== 'function')
const reading = renderToStaticMarkup(h(KafkaProvider, { labels: labelsEs }, h(K.ReadingTime, { words: 1450 }), h(K.PrevNext, { next: { href: '#n', title: 'T' } })))
console.log(JSON.stringify({ missing, reading, html, brand: tokens.color.bg.brand, print: tokens.print.book.width }))
`)
const out = JSON.parse(sh('node render.mjs', app))
check(out.html.includes('aria-busy="true"') && out.html.includes('disabled') && out.html.includes('Cargando'), 'Button renders busy, disabled and localised')
check(out.html.includes('kafka-focus') && out.html.includes('--kafka-button-primary-bg'), 'Button renders token-based classes')
check(out.missing.length === 0, `every documented component is exported (${out.missing.join(', ') || 'all ' + names.length}))`)
check(out.reading.includes('8 min de lectura') && out.reading.includes('rel="next"'), 'reading components render on the server, localised')
check(out.brand === '#d4af37', 'tokens export resolves colours')
check(out.print === '148mm', 'tokens export includes the print module')
// 4 · types compile for a consumer (and reject a wrong variant)
fs.writeFileSync(path.join(app, 'ok.tsx'), `import { Button, type ButtonProps } from '@kafka/react'\nexport const a = <Button variant="soft" Icon={undefined}>Hola</Button>\nexport type P = ButtonProps\n`)
fs.writeFileSync(path.join(app, 'bad.tsx'), `import { Button } from '@kafka/react'\nexport const a = <Button variant="danger">Hola</Button>\n`)
fs.writeFileSync(path.join(app, 'tsconfig.json'), JSON.stringify({ compilerOptions: { jsx: 'react-jsx', module: 'esnext', moduleResolution: 'bundler', strict: true, noEmit: true, skipLibCheck: true, types: [] } }))
let ok = true, bad = false
try { sh('npx tsc -p . --noEmit', app) } catch (e) { const msg = String(e.stdout ?? ''); ok = !/ok\.tsx/.test(msg); bad = /bad\.tsx\(\d+,\d+\): error TS2322/.test(msg) }
check(ok, 'consumer types compile'); check(bad, 'consumer types reject an unknown variant')

fs.rmSync(tmp, { recursive: true, force: true })
console.log(`\n  ${passed} package checks passed`)
if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
console.log('✓ Packages install and work in a fresh project')
