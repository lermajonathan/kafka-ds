// Prints the full use_figma body that (re)builds one pattern page:  node scripts/figma/print-pattern.mjs <id>
import { readFileSync } from 'node:fs'
import { buildPatterns } from './patterns.mjs'

const p = buildPatterns().find((x) => x.id === process.argv[2])
if (!p) { console.error('unknown pattern id: ' + process.argv[2]); process.exit(1) }
const data = { ...p, pageName: 'Pattern · ' + p.page, pattern: true }
const master = { code: readFileSync(new URL(`../../figma/patterns/${p.id}.js`, import.meta.url), 'utf8') }
console.log(`const DATA = ${JSON.stringify(data)}
const MASTER = ${JSON.stringify(master)}
const AF = Object.getPrototypeOf(async function () {}).constructor
const kit = figma.root.getSharedPluginData('kafka.ds', 'kit')
const r = await new AF('figma', 'DATA', 'MASTER', kit)(figma, DATA, MASTER)
const page = figma.root.children.find((p) => p.name === DATA.pageName)
r.empty = page.findAll((n) => n.type === 'FRAME' && n.name === 'Frame' && n.children.length === 0 && Math.round(n.width) === 100 && Math.round(n.height) === 100).length
return r`)
