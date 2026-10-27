// Patterns of the Altazor theme (hero with scrim, quick-access cards, floating decoration, quotes band), in a real browser.
// The contrast is MEASURED on rendered pixels, against the worst photo there is (pure white), not assumed from the tokens.
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const root = path.resolve(import.meta.dirname, '..')
const failures = []
const check = (cond, what) => { if (!cond) failures.push(what) }
const cssFile = path.join(root, 'src/styles/themes/altazor-patterns.css')
check(fs.existsSync(cssFile), 'src/styles/themes/altazor-patterns.css exists')
if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }

const patterns = fs.readFileSync(cssFile, 'utf8')
const bare = patterns.replace(/\/\*[\s\S]*?\*\//g, '')
check(!/#[0-9a-f]{3,8}\b/i.test(bare) && !/rgba?\(/i.test(bare), 'patterns use tokens only: no hex or rgb colours in the pattern CSS')
const noFrames = bare.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
const selectors = [...noFrames.matchAll(/(^|[{}])\s*([^{}@;][^{}]*)\{/g)].flatMap((m) => m[2].replace(/:is\([^)]*\)/g, (x) => x.replace(/,/g, '\u0000')).split(',').map((s) => s.trim())).filter((s) => s && !s.startsWith('@'))
check(selectors.every((s) => s.startsWith("[data-kafka-theme='altazor']")), `every selector is scoped to the theme (${selectors.filter((s) => !s.startsWith("[data-kafka-theme='altazor']")).slice(0, 3).join(' | ')})`)

const tokensCss = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8')
const themeCss = fs.readFileSync(path.join(root, 'src/styles/themes/altazor.css'), 'utf8')
const white = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#fff"/></svg>')
const html = `<style>${tokensCss}\n${themeCss}\n${patterns}\nbody{margin:0;background:var(--kafka-color-bg-page);font-family:system-ui}</style>
<div data-kafka-theme="altazor">
  <section class="kafka-altazor-hero" style="--kafka-altazor-hero-image:url('${white}')">
    <div class="kafka-altazor-deco" aria-hidden="true">
      <span class="kafka-altazor-deco__item" data-shape="dot" data-tone="purple" style="--x:8%;--y:20%;--size:14px"></span>
      <span class="kafka-altazor-deco__item" data-shape="bar" data-tone="red" style="--x:70%;--y:12%;--size:48px"></span>
      <span class="kafka-altazor-deco__item" data-shape="diamond" data-tone="gold" style="--x:90%;--y:60%;--size:20px"></span>
    </div>
    <div class="kafka-altazor-hero__inner">
      <div class="kafka-altazor-hero__text"><h1>Escribir es una forma de habitar el mundo</h1><p class="kafka-altazor-hero__lede">Talleres de escritura creativa para leer despacio y escribir con ganas.</p></div>
    </div>
  </section>
  <div class="kafka-altazor-quick"><ul>
    <li><a href="#a"><h3>Inscripciones</h3><p>Abiertas todo el año</p></a></li><li><a href="#b"><h3>Educación</h3><p>Cursos</p></a></li><li><a href="#c"><h3>Biblioteca</h3><p>Lecturas</p></a></li>
  </ul></div>
  <section class="kafka-altazor-quotes"><ul><li><blockquote>Poco me importa que se acabe el mundo.</blockquote><cite>Anónimo</cite></li><li><blockquote>Otra cita.</blockquote><cite>Otra voz</cite></li></ul></section>
</div>`

const luminance = ([r, g, b]) => { const c = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b) }
const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number)

const browser = await chromium.launch()
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
  const page = await ctx.newPage()
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    await page.setViewportSize({ width: w, height: h })
    await page.setContent(html)
    await page.waitForTimeout(100)
    const info = await page.evaluate(() => {
      const box = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height } }
      const cs = (s, p) => getComputedStyle(document.querySelector(s))[p]
      return { h1: box('h1'), lede: box('.kafka-altazor-hero__lede'), hero: box('.kafka-altazor-hero'), quick: box('.kafka-altazor-quick'), fg: cs('h1', 'color'), soft: cs('.kafka-altazor-hero__lede', 'color') }
    })
    // measured contrast: screenshot with animations stopped, decoration hidden (it never carries text), text hidden so we read the scrim only
    await page.addStyleTag({ content: '.kafka-altazor-deco{display:none!important} h1,.kafka-altazor-hero__lede{color:transparent!important}' })
    const shot = await page.screenshot({ fullPage: true })
    const px = await page.evaluate(async ({ b64, boxes }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
      const g = c.getContext('2d'); g.drawImage(img, 0, 0)
      const out = {}
      for (const [k, r] of Object.entries(boxes)) {
        out[k] = []
        for (let i = 0; i <= 6; i++) for (let j = 0; j <= 4; j++) {
          const x = Math.min(img.width - 1, Math.round(r.x + (r.w * i) / 6)), y = Math.min(img.height - 1, Math.round(r.y + (r.h * j) / 4))
          out[k].push([...g.getImageData(x, y, 1, 1).data].slice(0, 3))
        }
      }
      return out
    }, { b64: shot.toString('base64'), boxes: { h1: info.h1, lede: info.lede } })
    const worst = (samples, fg) => Math.min(...samples.map((bg) => { const [a, b] = [luminance(rgb(fg)), luminance(bg)].sort((x, y) => y - x); return (a + 0.05) / (b + 0.05) }))
    const h1 = worst(px.h1, info.fg), lede = worst(px.lede, info.soft)
    check(h1 >= 7, `${w}px: hero title over a white photo measures ${h1.toFixed(2)}:1, needs 7:1`)
    check(lede >= 4.5, `${w}px: hero text over a white photo measures ${lede.toFixed(2)}:1, needs 4.5:1`)
    // quick-access cards overlap the hero and sit above it
    check(info.quick.y < info.hero.y + info.hero.h, `${w}px: quick-access cards overlap the hero (cards start ${info.quick.y}, hero ends ${info.hero.y + info.hero.h})`)
  }

  // Interaction and motion (desktop)
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.setContent(html)
  const anim = () => page.evaluate(() => [...document.querySelectorAll('.kafka-altazor-deco__item')].map((e) => getComputedStyle(e).animationName))
  check((await anim()).every((n) => n !== 'none'), 'decoration floats when motion is allowed')
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.kafka-altazor-deco')).pointerEvents === 'none'), 'decoration never takes pointer events')
  const link = page.locator('.kafka-altazor-quick a').first()
  const before = await link.boundingBox()
  await link.hover(); await page.waitForTimeout(450)
  const after = await link.boundingBox()
  check(after.y < before.y - 1, 'a quick-access card lifts on hover when motion is allowed')
  await ctx.close()

  const still = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  const p2 = await still.newPage()
  await p2.setContent(html)
  const names = await p2.evaluate(() => [...document.querySelectorAll('.kafka-altazor-deco__item')].map((e) => getComputedStyle(e).animationName))
  check(names.every((n) => n === 'none'), `decoration is still with prefers-reduced-motion (got ${names.join(', ')})`)
  const l2 = p2.locator('.kafka-altazor-quick a').first()
  const b2 = await l2.boundingBox(); await l2.hover(); await p2.waitForTimeout(450)
  check(Math.abs((await l2.boundingBox()).y - b2.y) < 0.5, 'quick-access cards do not move with prefers-reduced-motion')
  // keyboard focus is visible
  await p2.keyboard.press('Tab')
  const ring = await p2.evaluate(() => { const e = document.activeElement; return e && e.matches('.kafka-altazor-quick a') ? getComputedStyle(e).outlineStyle : 'none' })
  check(ring !== 'none', 'quick-access cards show a focus ring')
  // quotes band: always dark, 7:1
  const q = await p2.evaluate(() => { const b = document.querySelector('.kafka-altazor-quotes'); const t = document.querySelector('.kafka-altazor-quotes blockquote'); const c = document.querySelector('.kafka-altazor-quotes cite'); const g = getComputedStyle; return { bg: g(b).backgroundColor, fg: g(t).color, cite: g(c).color } })
  const L = (s) => luminance(rgb(s)), rt = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
  check(rt(q.fg, q.bg) >= 7, `quotes text on the band measures ${rt(q.fg, q.bg).toFixed(2)}:1, needs 7:1`)
  check(rt(q.cite, q.bg) >= 4.5, `quotes attribution on the band measures ${rt(q.cite, q.bg).toFixed(2)}:1, needs 4.5:1`)
  await still.close()
  // dark mode: the hero and the band are dark in both modes; text keeps its colour
  const dk = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1280, height: 900 } })
  const p3 = await dk.newPage(); await p3.setContent(html)
  const dq = await p3.evaluate(() => getComputedStyle(document.querySelector('.kafka-altazor-quotes')).backgroundColor)
  check(dq === q.bg, 'quotes band keeps its dark background in dark mode')
  await dk.close()
} finally { await browser.close() }

if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
console.log('✓ Altazor patterns: scoped, tokens only, contrast measured on pixels over a white photo, motion off with prefers-reduced-motion')
