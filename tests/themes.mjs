// Themes: a theme is a JSON file of token overrides (tokens/themes/<name>.json) compiled to a CSS file scoped to
// [data-kafka-theme="<name>"]. This checks the rules a theme must follow and, in a real browser, that the scope reaches
// every component token that depends on what the theme changes, in light, dark and system-dark, and not outside the scope.
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const root = path.resolve(import.meta.dirname, '..')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))

const flat = new Map()
const walk = (node, p, into, tier) => {
  if (node && typeof node === 'object' && '$value' in node) { into.set(p.join('.'), { value: node.$value, dark: node.$extensions?.['kafka.modes']?.dark, type: node.$type, tier }); return }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...p, k], into, tier)
}
for (const tier of ['primitives', 'semantic', 'components']) walk(readJson(`tokens/${tier}.json`), [], flat, tier)

const themeDir = path.join(root, 'tokens/themes')
const themes = fs.existsSync(themeDir) ? fs.readdirSync(themeDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')) : []
check(themes.includes('altazor'), 'themes: tokens/themes/altazor.json must exist')

const cssName = (p) => `--kafka-${p.replace(/\./g, '-').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
const refsOf = (v) => (typeof v === 'string' ? [...v.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]) : [])

for (const name of themes) {
  const own = new Map()
  walk(readJson(`tokens/themes/${name}.json`), [], own, 'theme')
  check(own.size > 0, `${name}: the theme overrides nothing`)
  const overridden = [], created = []
  for (const [p, t] of own) {
    if (p.startsWith(`${name}.`)) { created.push(p); continue }
    const base = flat.get(p)
    check(!!base, `${name}: "${p}" does not exist in the base tokens (new tokens go under "${name}.")`)
    if (base) {
      overridden.push(p)
      check(base.tier !== 'primitives' || false, `${name}: "${p}" is a primitive; a theme overrides semantic or component tokens, never the palette`)
    }
  }
  // every alias the theme uses must resolve
  for (const [p, t] of own) for (const r of [...refsOf(t.value), ...refsOf(t.dark)]) check(flat.has(r) || own.has(r), `${name}: "${p}" points at unknown token {${r}}`)

  const cssPath = path.join(root, `src/styles/themes/${name}.css`)
  check(fs.existsSync(cssPath), `${name}: src/styles/themes/${name}.css must be generated (pnpm tokens)`)
  if (!fs.existsSync(cssPath)) continue
  const css = fs.readFileSync(cssPath, 'utf8')
  check(css.includes(`[data-kafka-theme='${name}']`), `${name}: the CSS must be scoped to [data-kafka-theme='${name}']`)
  check(!/(^|\n)\s*:root\s*\{/.test(css), `${name}: the theme must never write to :root`)
  // dependents: any base token whose value reaches an overridden token must be redeclared inside the scope
  const reaches = (p, seen = new Set()) => {
    if (overridden.includes(p)) return true
    if (seen.has(p)) return false
    seen.add(p)
    const t = flat.get(p)
    return !!t && [...refsOf(t.value), ...refsOf(t.dark)].some((r) => reaches(r, seen))
  }
  const dependents = [...flat.keys()].filter((p) => !overridden.includes(p) && reaches(p))
  check(dependents.length > 0, `${name}: expected the overridden tokens to have dependents`)
  for (const p of dependents) check(css.includes(`${cssName(p)}:`), `${name}: dependent ${p} is not redeclared in the scope, so it would keep the base value inside the theme`)
  for (const p of created) check(css.includes(`${cssName(p)}:`), `${name}: new token ${p} is missing from the CSS`)
  // nothing unrelated leaks into the scope
  const declared = [...css.matchAll(/(--kafka-[a-z0-9-]+):/g)].map((m) => m[1])
  const allowed = new Set([...overridden, ...dependents, ...created].map(cssName))
  const strays = [...new Set(declared)].filter((d) => !allowed.has(d))
  check(strays.length === 0, `${name}: the CSS declares tokens that are neither overridden nor dependent: ${strays.slice(0, 4).join(', ')}`)

  // Browser: scope, dependents, light, dark and system dark
  const tokensCss = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8')
  const depOnRadius = [...flat.entries()].find(([p, t]) => t.value === '{radius.control}' && t.tier === 'components')?.[0]
  const depOnSunken = [...flat.entries()].find(([p, t]) => t.value === '{color.bg.sunken}' && t.tier === 'components')?.[0]
  const browser = await chromium.launch()
  try {
    const html = `<style>${tokensCss}\n${fs.readFileSync(cssPath, 'utf8')}</style>
      <div id="out"><i class="r" style="display:block;width:10px;height:10px;border-radius:var(--kafka-radius-control)"></i><i class="s" style="display:block;width:10px;height:10px;background:var(--kafka-color-bg-sunken)"></i>
        ${depOnRadius ? `<i class="dr" style="display:block;width:10px;height:10px;border-radius:var(${cssName(depOnRadius)})"></i>` : ''}
        ${depOnSunken ? `<i class="ds" style="display:block;width:10px;height:10px;background:var(${cssName(depOnSunken)})"></i>` : ''}</div>
      <div id="in" data-kafka-theme="${name}"><i class="r" style="display:block;width:10px;height:10px;border-radius:var(--kafka-radius-control)"></i><i class="s" style="display:block;width:10px;height:10px;background:var(--kafka-color-bg-sunken)"></i>
        ${depOnRadius ? `<i class="dr" style="display:block;width:10px;height:10px;border-radius:var(${cssName(depOnRadius)})"></i>` : ''}
        ${depOnSunken ? `<i class="ds" style="display:block;width:10px;height:10px;background:var(${cssName(depOnSunken)})"></i>` : ''}</div>`
    const read = async (page, scope) => page.evaluate((s) => {
      const q = (c) => document.querySelector(`#${s} .${c}`)
      const st = (c, p) => q(c) ? getComputedStyle(q(c))[p] : null
      return { radius: st('r', 'borderTopLeftRadius'), sunken: st('s', 'backgroundColor'), depRadius: st('dr', 'borderTopLeftRadius'), depSunken: st('ds', 'backgroundColor') }
    }, scope)
    const ownTok = (p) => own.get(p)
    const page = await browser.newPage()
    await page.setContent(html)
    const out = await read(page, 'out'), inn = await read(page, 'in')
    if (ownTok('radius.control')) {
      check(out.radius !== inn.radius, `${name}: radius.control must differ inside the scope (outside ${out.radius}, inside ${inn.radius})`)
      if (depOnRadius) check(inn.depRadius === inn.radius, `${name}: ${depOnRadius} must follow the theme's radius.control inside the scope (got ${inn.depRadius}, expected ${inn.radius})`)
      if (depOnRadius) check(out.depRadius === out.radius, `${name}: ${depOnRadius} must keep the base radius outside the scope`)
    }
    if (ownTok('color.bg.sunken')) {
      check(out.sunken !== inn.sunken, `${name}: bg.sunken must differ inside the scope in light mode`)
      if (depOnSunken) check(inn.depSunken === inn.sunken, `${name}: ${depOnSunken} must follow bg.sunken inside the scope (got ${inn.depSunken}, expected ${inn.sunken})`)
    }
    // dark, forced: a token the theme only changes for light must be the base dark value inside the scope
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
    const dOut = await read(page, 'out'), dIn = await read(page, 'in')
    const darkSunkenInTheme = ownTok('color.bg.sunken')?.dark
    if (ownTok('color.bg.sunken') && darkSunkenInTheme === undefined) check(dOut.sunken === dIn.sunken, `${name}: in dark mode bg.sunken must be the base dark value inside the scope (outside ${dOut.sunken}, inside ${dIn.sunken})`)
    if (ownTok('color.bg.sunken') && depOnSunken) check(dIn.depSunken === dIn.sunken && dOut.depSunken === dOut.sunken, `${name}: ${depOnSunken} must follow bg.sunken in dark mode too (inside ${dIn.depSunken} vs ${dIn.sunken})`)
    // system dark (no data-theme): same rule
    await page.evaluate(() => document.documentElement.removeAttribute('data-theme'))
    await page.emulateMedia({ colorScheme: 'dark' })
    const sOut = await read(page, 'out'), sIn = await read(page, 'in')
    if (ownTok('color.bg.sunken') && darkSunkenInTheme === undefined) check(sOut.sunken === sIn.sunken, `${name}: in system dark mode bg.sunken must be the base dark value inside the scope (outside ${sOut.sunken}, inside ${sIn.sunken})`)
    // forcing light while the system is dark keeps the theme's light value
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'))
    const lIn = await read(page, 'in')
    if (ownTok('color.bg.sunken')) check(lIn.sunken === inn.sunken, `${name}: data-theme="light" must win over a dark system (${lIn.sunken} vs ${inn.sunken})`)
  } finally { await browser.close() }
}

if (failures.length) { console.log(failures.slice(0, 40).map((f) => `  ✗ ${f}`).join('\n') + (failures.length > 40 ? `\n  … and ${failures.length - 40} more` : '')); process.exit(1) }
console.log(`✓ Themes (${themes.join(', ') || 'none'}): overrides exist, scope reaches every dependent token, light, dark and system dark behave`)
