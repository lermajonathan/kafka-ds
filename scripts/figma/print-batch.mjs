// Prints one use_figma body that rebuilds the specimens (masters only) of several component pages, one after the other.
// A failure on one page is reported and does not stop the others; re-run that page alone with print-call.mjs.
//   node scripts/figma/print-batch.mjs <id> <id> …      or      node scripts/figma/print-batch.mjs --from 0 --count 5
import { readFileSync, existsSync } from 'node:fs'
import { buildDocs } from './docs.mjs'

export function batchCall(ids) {
  const docs = buildDocs()
  const items = ids.map((id) => {
    const doc = docs.find((d) => d.id === id)
    if (!doc) throw new Error('unknown component id: ' + id)
    const file = new URL(`../../figma/masters/${id}.js`, import.meta.url)
    return { DATA: { name: doc.name, ...(doc.pageName ? { pageName: doc.pageName } : {}), mastersOnly: true }, MASTER: existsSync(file) ? { code: readFileSync(file, 'utf8') } : {} }
  })
  return `const BATCH = ${JSON.stringify(items)}
const AF = Object.getPrototypeOf(async function () {}).constructor
const kit = figma.root.getSharedPluginData('kafka.ds', 'kit')
const results = []
for (const { DATA, MASTER } of BATCH) {
  try {
    const r = await new AF('figma', 'DATA', 'MASTER', kit)(figma, DATA, MASTER)
    const page = figma.root.children.find((p) => p.name === (DATA.pageName || DATA.name))
    const empty = page.findAll((n) => n.type === 'FRAME' && n.name === 'Frame' && n.children.length === 0 && Math.round(n.width) === 100 && Math.round(n.height) === 100).length
    results.push({ page: DATA.name, ok: !r.collapsed && !empty, collapsed: r.collapsed, empty })
  } catch (e) { results.push({ page: DATA.name, ok: false, error: String(e && e.message || e).slice(0, 200) }) }
}
return results`
}

if (import.meta.url === new URL(process.argv[1], 'file://').href || process.argv[1]?.endsWith('print-batch.mjs')) {
  const args = process.argv.slice(2)
  const i = args.indexOf('--from')
  let ids = args
  if (i > -1) { const from = +args[i + 1], count = +args[args.indexOf('--count') + 1]; ids = buildDocs().map((d) => d.id).slice(from, from + count) }
  console.log(batchCall(ids))
}
