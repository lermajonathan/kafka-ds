// Fails if a Kafka component uses a hex/rgb colour or a magic dimension instead of a token.
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] ?? 'src/components'
const rules = [
  [/#[0-9a-fA-F]{3,8}\b/g, 'hex colour'],
  [/rgba?\(/g, 'rgb() colour'],
  [/\b(?:w|h|p[trblxy]?|gap|text|rounded|leading|tracking)-\[[0-9.]+(?:px|rem)\]/g, 'magic dimension'],
]
let problems = 0
let checked = 0
if (fs.existsSync(dir)) {
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
