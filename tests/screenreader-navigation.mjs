// Screen reader tree, navigation and reading controls: accordion, breadcrumbs, pagination, stepper, menus of a page,
// table of contents, previous/next and reading settings (H8, DDR-KF-004 criterion 3).
// See tests/lib/ax.mjs for how the tree is read.
//   node tests/screenreader-navigation.mjs
import { withBrowser } from './lib/server.mjs'
import { axTree, checker, example, liveText, named, ofRole } from './lib/ax.mjs'

const { check, finish } = checker('screen reader (navigation)', 'Screen reader tree, navigation: landmarks, current place and states are as expected')
const flag = (node, key) => String(node?.props[key]) === 'true'
/** Elements marked as the current place, read from the DOM because the tree does not list `aria-current` on every role. */
const current = (page, scope = 'main') => page.evaluate((s) => [...document.querySelectorAll(`${s} [aria-current]`)].map((e) => ({ value: e.getAttribute('aria-current'), tag: e.tagName, text: (e.getAttribute('aria-label') || e.textContent).trim() })), scope)

await withBrowser(async (browser) => {
  // ── Accordion ──────────────────────────────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'accordion')
    let tree = await axTree(page)
    const headers = ofRole(tree, 'heading').filter((h) => h.props.level === 3 && /\?/.test(h.name))
    check(headers.length >= 6, 'accordion: every question is a heading, so it is found by heading navigation')
    check(flag(named(tree, 'button', '¿Entregan certificado?'), 'expanded') && !flag(named(tree, 'button', '¿Cómo se paga?'), 'expanded'), 'accordion: an open section is announced as expanded, a closed one as collapsed')
    check(named(tree, 'region', '¿Entregan certificado?'), 'accordion: an open panel is a region named by its question')
    await page.getByRole('button', { name: '¿Cómo se paga?', exact: true }).click()
    await page.waitForTimeout(250)
    tree = await axTree(page)
    check(flag(named(tree, 'button', '¿Cómo se paga?'), 'expanded'), 'accordion: opening a section is announced as expanded')
  }

  // ── Breadcrumbs, Pagination, Stepper: where am I ───────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'breadcrumbs')
    const tree = await axTree(page)
    check(named(tree, 'navigation', 'Ruta de navegación'), 'breadcrumbs: a navigation landmark named "Ruta de navegación"')
    check(ofRole(tree, 'list').length === 1 && ofRole(tree, 'listitem').length >= 3, 'breadcrumbs: the trail is a list, so the reader says how many steps')
    const here = await current(page)
    check(here.length === 1 && here[0].value === 'page' && here[0].tag !== 'A', `breadcrumbs: the last step is the current page and not a link (found ${JSON.stringify(here)})`)
  }
  {
    const page = await example(browser, 'pagination')
    const tree = await axTree(page)
    check(named(tree, 'navigation', 'Paginación') && named(tree, 'navigation', 'Páginas del blog'), 'pagination: each pager is a navigation landmark with its own name')
    const here = await current(page)
    check(here.length === 2 && here.every((c) => c.value === 'page'), `pagination: each pager marks exactly its current page (found ${JSON.stringify(here)})`)
    check(ofRole(tree, 'button').concat(ofRole(tree, 'link')).every((n) => n.name), 'pagination: every page, previous and next control has a name')
    check(ofRole(tree, 'button').some((b) => b.name === 'Página 1') && !ofRole(tree, 'StaticText').some((t) => t.name === '…'), 'pagination: the ellipsis is not read')
  }
  {
    const page = await example(browser, 'stepper')
    const tree = await axTree(page)
    check(ofRole(tree, 'list').length === 1 && ofRole(tree, 'listitem').length === 4, 'stepper: the steps are a list of four')
    const here = await page.evaluate(() => [...document.querySelectorAll('[aria-current=step]')].map((e) => e.textContent))
    check(here.length === 1 && /Paso 2 de 4, paso actual/.test(here[0]), 'stepper: exactly one step is current, and it says "paso actual"')
    const text = await page.locator('ol').first().evaluate((e) => e.textContent)
    check(/Paso 1 de 4, completado/.test(text) && /Paso 4 de 4/.test(text), 'stepper: a finished step says "completado" and every step says its number out of the total')
  }

  // ── NavMenu ────────────────────────────────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'nav-menu')
    const tree = await axTree(page)
    check(named(tree, 'navigation', 'Menú de la app') && named(tree, 'navigation', 'Menú compacto'), 'nav menu: each menu is a navigation landmark with a name')
    check(flag(named(tree, 'button', 'Talleres'), 'expanded'), 'nav menu: a group is a button announced as expanded')
    check(named(tree, 'link', 'Avisos 12'), 'nav menu: a count is read with its item')
    const here = await current(page)
    check(here.length >= 1 && here.every((c) => c.value === 'page'), `nav menu: the current page is marked (found ${JSON.stringify(here)})`)
    const compact = ofRole(tree, 'link').filter((l) => ['Inicio', 'Personas', 'Avisos'].includes(l.name))
    check(compact.length >= 3, 'nav menu: in the compact version the icons still carry the names')
  }

  // ── TableOfContents, PrevNext ──────────────────────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'toc'))
    check(named(tree, 'navigation', 'En esta página') && ofRole(tree, 'link').length === 4, 'table of contents: a navigation landmark with one link per section')
  }
  {
    const tree = await axTree(await example(browser, 'prev-next'))
    check(named(tree, 'navigation', 'Para seguir leyendo') && named(tree, 'navigation', 'Primer texto de la serie'), 'prev/next: each pair is a navigation landmark with a name')
    check(named(tree, 'link', /^Anterior La arquitectura del texto/) && named(tree, 'link', /^Siguiente Umbrales de lo cotidiano/), 'prev/next: each link says its direction and the title it leads to')
  }

  // ── ReadingSettings: groups, state and the announcement of a change ────────────────────────────────────────
  {
    const page = await example(browser, 'reading-settings')
    let tree = await axTree(page)
    check(['Tamaño del texto', 'Ancho de línea', 'Tipografía'].every((g) => named(tree, 'group', g)), 'reading settings: each setting is a named group')
    check(ofRole(tree, 'radio').filter((r) => flag(r, 'checked')).length === 2, 'reading settings: the current width and typeface are announced as checked')
    await page.getByRole('button', { name: 'Texto más grande' }).click()
    await page.waitForTimeout(250)
    const live = await liveText(page)
    check(live.some((l) => l.text && /\d/.test(l.text)), `reading settings: the new size is announced in a live region (${JSON.stringify(live.map((l) => l.text))})`)
    await page.locator('label', { hasText: 'Ancho' }).first().click() // the radio is visually hidden: a person clicks its label
    tree = await axTree(page)
    check(flag(named(tree, 'radio', 'Ancho'), 'checked') && !flag(named(tree, 'radio', 'Medio'), 'checked'), 'reading settings: choosing a width moves the checked state')
  }
})

finish()
