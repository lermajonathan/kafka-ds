// Builds the three publishable packages from the repo sources:
//   packages/tokens → @kafka/tokens  (CSS variables, Tailwind theme, typography classes, typed JS object, JSON)
//   packages/react  → @kafka/react   (components + icons, precompiled CSS, Tailwind entry, types)
//   packages/theme-altazor → @kafka/theme-altazor (CSS only: the Altazor theme)
// Run with `pnpm build:packages` (tokens are rebuilt first).
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' })
const rel = (p) => path.join(root, p)
const copy = (from, to) => { fs.mkdirSync(path.dirname(rel(to)), { recursive: true }); fs.copyFileSync(rel(from), rel(to)) }
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const write = (p, s) => { fs.mkdirSync(path.dirname(rel(p)), { recursive: true }); fs.writeFileSync(rel(p), s) }

/* ── @kafka/tokens ── */
fs.rmSync(rel('packages/tokens/dist'), { recursive: true, force: true })
for (const f of ['tokens.css', 'theme.css', 'typography.css', 'print.css']) copy(`src/styles/${f}`, `packages/tokens/dist/${f}`)
copy('tokens/dist/tokens.json', 'packages/tokens/dist/tokens.json')
for (const f of ['primitives', 'semantic', 'components']) copy(`tokens/${f}.json`, `packages/tokens/dist/json/${f}.json`)
run('pnpm exec tsc src/tokens.ts --declaration --module esnext --target es2020 --skipLibCheck --outDir packages/tokens/dist')

/* ── @kafka/react ── */
run('pnpm exec vite build -c vite.lib.config.ts --logLevel warn')
run('pnpm exec tsc -p tsconfig.lib.json')
// The stylesheet ships as a separate file, so drop the CSS import from the type entry.
write('packages/react/dist/types/lib.d.ts', read('packages/react/dist/types/lib.d.ts').replace(/^import '\.\/styles\/kafka\.css';\n/m, ''))
// Tailwind entry: tokens + theme + typography + component rules, and tell Tailwind to scan the package.
write('packages/react/dist/tailwind.css', [
  '/* @kafka/react/tailwind.css — for apps that already use Tailwind v4.',
  '   Use after `@import "tailwindcss";` in your stylesheet. */',
  '@source "./index.js";',
  read('src/styles/tokens.css'),
  read('src/styles/theme.css'),
  read('src/styles/typography.css'),
  read('src/styles/components.css'),
].join('\n'))

/* ── @kafka/theme-altazor ── */
fs.rmSync(rel('packages/theme-altazor/dist'), { recursive: true, force: true })
copy('src/styles/themes/altazor.css', 'packages/theme-altazor/dist/altazor.css')
copy('src/styles/themes/altazor-patterns.css', 'packages/theme-altazor/dist/patterns.css')

for (const pkg of ['tokens', 'react', 'theme-altazor']) copy('LICENSE', `packages/${pkg}/LICENSE`)
const count = (dir) => fs.readdirSync(rel(dir), { recursive: true }).filter((f) => fs.statSync(rel(path.join(dir, f))).isFile()).length
console.log(`\n✓ @kafka/tokens (${count('packages/tokens/dist')} files) · @kafka/react (${count('packages/react/dist')} files) · @kafka/theme-altazor (${count('packages/theme-altazor/dist')} files)`)
