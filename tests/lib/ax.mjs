// Shared helpers for the screen reader tests (tests/screenreader*.mjs): read the accessibility tree Chromium builds
// from a playground example, the same tree NVDA, JAWS and VoiceOver consume.
import { url } from './server.mjs'

/** Counts passed checks and collects failures; `finish` prints the verdict and sets the exit code. */
export function checker(title, okLine) {
  let passed = 0
  const failures = []
  return {
    check: (cond, what) => { if (cond) passed++; else failures.push(what) },
    finish: () => {
      console.log(`\n  ${passed} ${title} checks passed`)
      if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
      console.log(`✓ ${okLine}`)
    },
  }
}

// ── Reading the tree ────────────────────────────────────────────────────────────────────────────────────────
/** The accessibility tree of the page without the nodes a reader skips, as plain objects. */
export async function axTree(page) {
  const session = await page.context().newCDPSession(page)
  const { nodes } = await session.send('Accessibility.getFullAXTree')
  await session.detach()
  return nodes.filter((n) => !n.ignored).map((n) => ({
    role: n.role?.value, name: n.name?.value ?? '', description: n.description?.value ?? '', value: n.value?.value ?? '',
    props: Object.fromEntries((n.properties ?? []).map((p) => [p.name, p.value?.value])),
  }))
}
export const named = (tree, role, name) => tree.find((n) => n.role === role && (name instanceof RegExp ? name.test(n.name) : n.name === name))
export const ofRole = (tree, role) => tree.filter((n) => n.role === role)
export const text = (page, selector) => page.locator(selector).first().evaluate((el) => el.textContent.trim())

/** Opens one example of the playground, runs the actions that bring it to the state under test and returns the page. */
export async function example(browser, id, act) {
  const page = await browser.newPage({ viewport: { width: 900, height: 800 }, reducedMotion: 'reduce' })
  await page.goto(url({ only: id, theme: 'light' }))
  await page.waitForSelector('main')
  if (act) await act(page)
  await page.waitForTimeout(350) // overlays and live regions settle
  return page
}
export const focusedText = (page) => page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label') || '')
export const liveText = (page) => page.evaluate(() => [...document.querySelectorAll('[role=status],[role=alert],[aria-live]:not([aria-live=off])')].map((e) => ({ role: e.getAttribute('role'), live: e.getAttribute('aria-live'), text: e.textContent.trim() })))

