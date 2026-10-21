// Every documented example must render. Renders each one on the server inside KafkaProvider and checks the output is real markup.
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { tsImport } from 'tsx/esm/api'

const { registry } = await tsImport('../examples/index.ts', import.meta.url)
const { KafkaProvider, labelsEs } = await tsImport('../src/components/index.ts', import.meta.url)
let n = 0
const failures = []
for (const [id, entry] of Object.entries(registry)) {
  if (!entry.examples.length) failures.push(`${id}: has no examples`)
  for (const ex of entry.examples) {
    n++
    try {
      const html = renderToStaticMarkup(h(KafkaProvider, { labels: labelsEs }, ex.render()))
      if (html.length < 20) failures.push(`${id}/${ex.id}: rendered almost nothing`)
      if (/undefined|\[object Object\]|NaN/.test(html)) failures.push(`${id}/${ex.id}: output contains undefined, NaN or [object Object]`)
      if (!ex.title || !ex.description) failures.push(`${id}/${ex.id}: needs a title and a description`)
    } catch (e) { failures.push(`${id}/${ex.id}: throws — ${e.message}`) }
  }
}
console.log(`  ${n} examples rendered`)
if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
console.log('✓ All documentation examples render')
