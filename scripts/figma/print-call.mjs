// Prints the full use_figma body that (re)builds the documentation page of one component:
//   node scripts/figma/print-call.mjs <id>
import { readFileSync, existsSync } from 'node:fs'
import { buildDocs } from './docs.mjs'

const id = process.argv[2]
const mastersOnly = process.argv.includes('--masters')
const doc = buildDocs().find((d) => d.id === id)
if (!doc) { console.error('unknown component id: ' + id); process.exit(1) }
const { use, ...data } = doc
data.examples = data.examples.map((e) => { const l = e.code.split('\n'); return { ...e, code: l.length > 14 ? l.slice(0, 14).join('\n') + '\n…' : e.code } })
const file = new URL(`../../figma/masters/${id}.js`, import.meta.url)
const master = existsSync(file) ? { code: readFileSync(file, 'utf8') } : {}
if (mastersOnly) {
  console.log(`const DATA = ${JSON.stringify({ name: data.name, ...(data.pageName ? { pageName: data.pageName } : {}), mastersOnly: true })}
const MASTER = ${JSON.stringify(master)}
const AF = Object.getPrototypeOf(async function () {}).constructor
const kit = figma.root.getSharedPluginData('kafka.ds', 'kit')
const r = await new AF('figma', 'DATA', 'MASTER', kit)(figma, DATA, MASTER)
const page = figma.root.children.find((p) => p.name === (DATA.pageName || DATA.name))
r.empty = page.findAll((n) => n.type === 'FRAME' && n.name === 'Frame' && n.children.length === 0 && Math.round(n.width) === 100 && Math.round(n.height) === 100).length
return r`)
  process.exit(0)
}
console.log(`const DATA = ${JSON.stringify(data)}
const MASTER = ${JSON.stringify(master)}
const AF = Object.getPrototypeOf(async function () {}).constructor
const kit = figma.root.getSharedPluginData('kafka.ds', 'kit')
const r = await new AF('figma', 'DATA', 'MASTER', kit)(figma, DATA, MASTER)
const page = figma.root.children.find((p) => p.name === (DATA.pageName || DATA.name))
r.empty = page.findAll((n) => n.type === 'FRAME' && n.name === 'Frame' && n.children.length === 0 && Math.round(n.width) === 100 && Math.round(n.height) === 100).length
return r`)
