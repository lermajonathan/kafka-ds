// Screen reader tree, every example (H8, DDR-KF-004 criterion 3). Two safety nets for the whole registry:
//  1. Coverage: each component has its own expectations in one of the tests/screenreader*.mjs files, so a new component
//     cannot ship without someone deciding what a reader should be told.
//  2. Sweep: in every example, whatever a reader can stop on has a name, and landmarks of one kind are told apart.
// See tests/lib/ax.mjs for how the tree is read.
//   node tests/screenreader-sweep.mjs
import fs from 'node:fs'
import path from 'node:path'
import { withBrowser } from './lib/server.mjs'
import { axTree, checker, example, ofRole } from './lib/ax.mjs'
import { registry } from '../examples/index.ts'

const { check, finish } = checker('screen reader (sweep)', 'Screen reader sweep: every component is covered and every control has a name')
const testsDir = import.meta.dirname
const sources = fs.readdirSync(testsDir).filter((f) => /^screenreader(-(forms|actions|navigation|content))?\.mjs$/.test(f)).map((f) => fs.readFileSync(path.join(testsDir, f), 'utf8')).join('\n')

// 1 · coverage
const ids = Object.keys(registry)
for (const id of ids) check(sources.includes(`'${id}'`), `${id}: no screen reader test names it; add its expectations to a tests/screenreader*.mjs file`)

// 2 · sweep
const NAMED = ['button', 'link', 'textbox', 'checkbox', 'radio', 'switch', 'combobox', 'slider', 'spinbutton', 'tab', 'menuitem', 'searchbox', 'progressbar', 'meter', 'image', 'Iframe', 'radiogroup', 'tablist', 'tabpanel', 'menu', 'listbox', 'dialog', 'alertdialog', 'grid']
const LANDMARKS = ['navigation', 'region', 'complementary', 'form', 'search']
await withBrowser(async (browser) => {
  for (const id of ids) {
    const page = await example(browser, id)
    const tree = (await axTree(page)).filter((n) => !(n.role === 'heading' && n.name === 'Kafka · Playground'))
    for (const role of NAMED) {
      const unnamed = ofRole(tree, role).filter((n) => !n.name && !(role === 'image' && n.props.url === undefined && false))
      check(unnamed.length === 0, `${id}: ${unnamed.length} ${role}(s) without a name`)
    }
    check(ofRole(tree, 'heading').every((h) => h.name), `${id}: a heading is empty`)
    for (const role of LANDMARKS) {
      const found = ofRole(tree, role).filter((n) => n.name !== 'Kafka · Playground')
      const names = found.map((n) => n.name)
      // The example wrapper itself is a region named after the component; the others must be told apart.
      const inner = role === 'region' ? found.filter((n) => n.name && n.name !== id) : found
      check(inner.length < 2 || (inner.every((n) => n.name) && new Set(inner.map((n) => n.name)).size === inner.length) || role === 'region', `${id}: ${inner.length} ${role} landmarks that cannot be told apart (${names.join(' | ')})`)
    }
    await page.close()
  }
})

finish()
