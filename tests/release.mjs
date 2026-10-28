// Release readiness for 1.0.0 (DDR-KF-008): scope, lockstep versions and the publish workflow.
//   node tests/release.mjs
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const failures = []
let passed = 0
const check = (cond, what) => { if (cond) passed++; else failures.push(what) }
const json = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))
const SCOPE = '@kafka-ds'
const VERSION = '1.0.0'

// 1 · names and versions: the three packages share one scope and one version
for (const pkg of ['tokens', 'react', 'theme-altazor']) {
  const p = json(`packages/${pkg}/package.json`)
  check(p.name === `${SCOPE}/${pkg}`, `packages/${pkg} is named ${SCOPE}/${pkg} (found ${p.name})`)
  check(p.version === VERSION, `packages/${pkg} is at ${VERSION} (found ${p.version})`)
  check(p.publishConfig?.access === 'public' && p.publishConfig?.provenance === true, `packages/${pkg} publishes public with provenance`)
  for (const [dep, range] of Object.entries({ ...p.dependencies, ...p.peerDependencies })) {
    if (dep.startsWith('@kafka')) check(dep.startsWith(`${SCOPE}/`), `packages/${pkg} depends on ${dep}, outside ${SCOPE}`)
    if (dep.startsWith(`${SCOPE}/`)) check(range === `^${VERSION}` || range === VERSION, `packages/${pkg} pins ${dep} at ${range}`)
  }
}

// 2 · no tracked file still names the old scope (the bare @kafka scope; @kafka-ds is fine)
const tracked = execSync('git ls-files -z', { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
const skip = /(^|\/)(tests\/release\.mjs|pnpm-lock\.yaml|.*\.(woff2|png|jpg|pdf|ico|svg))$/
const stale = tracked.filter((f) => !skip.test(f) && fs.existsSync(path.join(root, f)) && /@kafka\\?\//.test(fs.readFileSync(path.join(root, f), 'utf8')))
check(stale.length === 0, `no file mentions the old @kafka/ scope (still in: ${stale.slice(0, 8).join(', ')}${stale.length > 8 ? `, +${stale.length - 8}` : ''})`)

// 3 · the release workflow publishes with OIDC, only if tag and versions agree
const wfPath = path.join(root, '.github/workflows/release.yml')
check(fs.existsSync(wfPath), '.github/workflows/release.yml exists')
if (fs.existsSync(wfPath)) {
  const wf = fs.readFileSync(wfPath, 'utf8')
  check(/types:\s*\[\s*published\s*\]|types:\s*\n\s*-\s*published/.test(wf), 'release.yml runs when a GitHub release is published')
  check(/workflow_dispatch/.test(wf), 'release.yml has a manual dry run (workflow_dispatch)')
  check(/id-token:\s*write/.test(wf), 'release.yml asks for id-token: write (trusted publishing)')
  check(/npm(@| install -g npm@)11/.test(wf) || /npm@latest/.test(wf), 'release.yml uses npm 11 or later')
  check(!/NPM_TOKEN|NODE_AUTH_TOKEN/.test(wf), 'release.yml holds no npm token')
  for (const pkg of ['tokens', 'react', 'theme-altazor']) check(wf.includes(`packages/${pkg}`), `release.yml publishes packages/${pkg}`)
  check(/github\.ref_name|GITHUB_REF_NAME|release\.tag_name/.test(wf), 'release.yml compares the tag with the package versions')
  check(/pnpm (run )?verify|pnpm (run )?test:packages/.test(wf), 'release.yml tests before it publishes')
  check(/poppler-utils/.test(wf), 'release.yml installs poppler-utils (the print tests in verify need pdfinfo)')
  check(/--dry-run/.test(wf), 'release.yml can dry-run the publish')
}

// 4 · the docs stop saying "not published"
for (const f of ['README.md', 'GOVERNANCE.md', 'packages/tokens/README.md', 'packages/react/README.md', 'packages/theme-altazor/README.md', 'docs/getting-started.md']) {
  check(!/pre-1\.0|no publicado todav|todavía no están en npm|No hay versión en npm|Hasta la 1\.0\.0 no se publica/i.test(fs.readFileSync(path.join(root, f), 'utf8')), `${f} no longer says Kafka is unpublished`)
}
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8')
check(/^## \[1\.0\.0\]/m.test(changelog), 'CHANGELOG has a 1.0.0 entry')
// Readers see what changes from 1.0.0 on; the work before it (milestones H0–H8) is not part of the public record.
const versions = [...changelog.matchAll(/^## \[([^\]]+)\]/gm)].map((m) => m[1])
check(versions.every((v) => v === 'Sin publicar' || /^[1-9]\d*\./.test(v)), `CHANGELOG only lists 1.0.0 and later (found: ${versions.join(', ')})`)
check(!/^###\s+(H\d|Antes de H0|Arreglo ·)/m.test(changelog), 'CHANGELOG carries no pre-1.0 milestone history (H0–H8)')
check(changelog.split('\n').length < 40, `CHANGELOG stays short at 1.0.0 (${changelog.split('\n').length} lines)`)

// 5 · the repo's own pages describe 1.0.0, not the road to it
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8')
check(/npm install[^\n]*@kafka-ds\/react/.test(read('docs/getting-started.md')), 'getting-started shows how to install @kafka-ds/react from npm')
check(/npm install[^\n]*@kafka-ds\/react/.test(read('README.md')), 'README shows how to install @kafka-ds/react from npm')
check(!/\(sin publicar\)|faltan su publicación|1113 en tres/i.test(read('README.md')), 'README no longer lists packages as unpublished or an old token count')
check(/\| H8 ✅/.test(read('docs/roadmap.md')), 'roadmap marks H8 (release) as done')

if (failures.length) {
  console.error(`✗ release: ${failures.length} failed, ${passed} passed`)
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`✓ Release readiness: ${passed} checks`)
