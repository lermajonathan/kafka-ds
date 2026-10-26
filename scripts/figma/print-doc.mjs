// Prints the DATA argument for the Figma page kit: node scripts/figma/print-doc.mjs <id> [<id>...]
import { buildDocs } from './docs.mjs'
const ids = process.argv.slice(2)
for (const d of buildDocs().filter((x) => ids.includes(x.id))) { const { use, ...rest } = d; rest.examples = rest.examples.map((e) => { const l = e.code.split('\n'); return { ...e, code: l.length > 14 ? l.slice(0, 14).join('\n') + '\n…' : e.code } }); console.log(`// ${d.id}\nconst DATA = ${JSON.stringify(rest)}`) }
