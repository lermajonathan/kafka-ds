// Keyboard and ARIA behaviour of every component, in a real browser.
// Each component adds its own block here when it ships (DDR-KF-004, criterion 3).
import { withBrowser, url } from './lib/server.mjs'

let passed = 0
const failures = []
const check = (cond, what) => { if (cond) passed++; else failures.push(what) }

await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 900, height: 800 } })
  await page.goto(url({ only: 'button', theme: 'light' }))
  await page.waitForSelector('button')

  // ── Button ────────────────────────────────────────────────────────────────
  const ex = (id) => page.locator(`[data-example="button/${id}"]`)
  const variants = ex('variants').getByRole('button')
  check((await variants.count()) === 3, 'button: three variants render')

  // Tab order follows the DOM and reaches every enabled button
  await page.locator('body').click({ position: { x: 5, y: 5 } })
  await page.keyboard.press('Tab')
  check(await variants.nth(0).evaluate((el) => el === document.activeElement), 'button: first Tab lands on the first button')
  // The focus ring is visible on keyboard focus: outline width comes from focus.width (3px)
  const ring = await variants.nth(0).evaluate((el) => { const s = getComputedStyle(el); return { w: parseFloat(s.outlineWidth), st: s.outlineStyle, off: parseFloat(s.outlineOffset) } })
  check(ring.st === 'solid' && ring.w >= 2, `button: focus ring is a solid outline of at least 2px (got ${ring.w}px ${ring.st})`)
  check(ring.off >= 2, `button: focus ring is offset from the edge (got ${ring.off}px)`)

  // Enter and Space activate
  await variants.nth(0).evaluate((el) => { window.__clicks = 0; el.addEventListener('click', () => { window.__clicks++ }) })
  await variants.nth(0).focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  const clicks = await page.evaluate(() => window.__clicks)
  check(clicks === 2, `button: Enter and Space both activate (clicks: ${clicks})`)

  // Minimum target size: 44px tall (DDR-KF-004, criterion 4)
  for (let i = 0; i < 3; i++) {
    const box = await variants.nth(i).boundingBox()
    check(box && box.height >= 44, `button: variant ${i} is at least 44px tall (got ${box?.height})`)
  }

  // Disabled and loading
  const states = ex('states').getByRole('button')
  const disabled = states.nth(0)
  check(await disabled.isDisabled(), 'button: disabled is really disabled')
  await page.locator('body').click({ position: { x: 5, y: 5 } })
  const order = []
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')) }
  check(!order.includes('No disponible'), 'button: disabled buttons are skipped by Tab')
  const loading = ex('states').getByRole('button', { name: /Enviando/ })
  check((await loading.getAttribute('aria-busy')) === 'true', 'button: loading sets aria-busy')
  check(await loading.isDisabled(), 'button: loading disables the button')
  check(/Cargando/.test(await loading.innerText()) || /Cargando/.test((await loading.textContent()) ?? ''), 'button: loading announces its state in text (localised label)')
  const iconsHidden = await ex('icons').locator('svg').evaluateAll((els) => els.every((e) => e.getAttribute('aria-hidden') === 'true'))
  check(iconsHidden, 'button: decorative icons are hidden from assistive technology')
  check((await ex('block').getByRole('button').evaluate((el) => getComputedStyle(el).width)) !== '0px', 'button: block spans its container')

  // Reduced motion: the spinner slows down
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const dur = await loading.locator('svg').evaluate((el) => getComputedStyle(el).animationDuration)
  check(parseFloat(dur) >= 1.5, `button: spinner slows down under prefers-reduced-motion (got ${dur})`)
})

console.log(`\n  ${passed} keyboard / ARIA checks passed`)
if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
console.log('✓ Keyboard behaviour is correct')
