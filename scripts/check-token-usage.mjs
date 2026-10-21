// Fails if a Kafka component (or example) uses a hex/rgb colour, a Tailwind palette colour or a magic dimension instead of a token.
//   node scripts/check-token-usage.mjs            → checks src/components and examples
//   node scripts/check-token-usage.mjs <dir> ...  → checks the given directories (used by the self-test)
import fs from 'node:fs'
import path from 'node:path'

const dirs = process.argv.length > 2 ? process.argv.slice(2) : ['src/components', 'examples']
const rules = [
  [/#[0-9a-fA-F]{3,8}\b/g, 'hex colour'],
  [/rgba?\(/g, 'rgb() colour'],
  [/\b(?:w|h|p[trblxy]?|m[trblxy]?|gap|text|rounded|leading|tracking|size|min-h|min-w|max-w)-\[[0-9.]+(?:px|rem|em)\]/g, 'magic dimension'],
  [/\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|decoration|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?\b/g, 'Tailwind palette colour'],
]
let problems = 0
let checked = 0
for (const dir of dirs.filter((d) => fs.existsSync(d))) {
  for (const file of fs.readdirSync(dir).filter((f) => /\.(tsx?|css|astro)$/.test(f))) {
    checked++
    fs.readFileSync(path.join(dir, file), 'utf8').split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
      for (const [re, what] of rules) for (const m of line.matchAll(re)) {
        problems++
        console.log(`${dir}/${file}:${i + 1}  ${what}: ${m[0]}`)
      }
    })
  }
}
if (problems) { console.log(`\n${problems} hard-coded value(s). Use a token instead.`); process.exit(1) }
console.log(`✓ Components only use tokens (${checked} file${checked === 1 ? '' : 's'} checked)`)
