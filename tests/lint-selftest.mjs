// The linter must actually catch what it promises. Runs it against a deliberately bad fixture and a clean one.
import { spawnSync } from 'node:child_process'
const run = (dir) => spawnSync('node', ['scripts/check-token-usage.mjs', dir], { encoding: 'utf8' })
const bad = run('tests/fixtures/bad-components')
const kinds = ['hex colour', 'rgb() colour', 'magic dimension', 'Tailwind palette colour']
const missing = kinds.filter((k) => !bad.stdout.includes(k))
if (bad.status === 0 || missing.length) { console.error(`✗ lint:tokens missed: ${missing.join(', ') || 'exit code was 0'}`); process.exit(1) }
const good = run('tests/fixtures/good-components')
if (good.status !== 0) { console.error('✗ lint:tokens rejected a clean file\n' + good.stdout); process.exit(1) }
console.log('✓ lint:tokens flags hex, rgb(), palette colours and magic dimensions, and accepts token-only code')
