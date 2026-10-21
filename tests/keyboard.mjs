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

  // ── Reading components (H2) ──────────────────────────────────────────────
  const go = async (id, viewport) => {
    if (viewport) await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto(url({ only: id, theme: 'light' }))
    await page.waitForSelector('main')
  }
  const exa = (id, e) => page.locator(`[data-example="${id}/${e}"]`)
  const press = async (key, n = 1) => { for (let i = 0; i < n; i++) await page.keyboard.press(key) }
  const reset = () => page.locator('body').click({ position: { x: 5, y: 5 } })

  // Prose
  await go('prose')
  const art = exa('prose', 'article').locator('article.kafka-prose')
  check((await art.evaluate((el) => getComputedStyle(el).maxWidth)) !== 'none', 'prose: the column stops at the reading measure')
  check((await exa('prose', 'full-width').locator('.kafka-prose').evaluate((el) => getComputedStyle(el).maxWidth)) === 'none', 'prose: fullWidth removes the measure')
  const linkDeco = await art.locator('a', { hasText: 'programa del taller' }).evaluate((el) => getComputedStyle(el).textDecorationLine)
  check(linkDeco === 'underline', 'prose: links are underlined (not colour alone)')
  check((await art.locator('h2').count()) === 1 && (await art.locator('h3').count()) === 1, 'prose: headings keep their native levels')
  const epiBorder = await art.locator('figure blockquote').first().evaluate((el) => parseFloat(getComputedStyle(el).borderLeftWidth))
  check(epiBorder === 0, 'prose: figures do not inherit the block quote rule')

  // PullQuote
  await go('pull-quote')
  const pq = exa('pull-quote', 'default').locator('figure')
  check((await pq.locator('blockquote').count()) === 1 && (await pq.locator('figcaption').count()) === 1, 'pull quote: figure with blockquote and figcaption')
  check(parseFloat(await pq.evaluate((el) => getComputedStyle(el).borderLeftWidth)) >= 2, 'pull quote: the gold rule is at least 2px')
  check((await exa('pull-quote', 'plain').locator('figcaption').count()) === 0, 'pull quote: no caption without attribution')

  // Footnote
  await go('footnote')
  const fnEx = exa('footnote', 'in-text')
  const ref1 = fnEx.locator('#fn-ref-1')
  check((await ref1.getAttribute('aria-label')) === 'Nota 1', 'footnote: the call has an accessible name')
  const refBox = await ref1.boundingBox()
  check(refBox && refBox.width >= 24 && refBox.height >= 24, `footnote: the call is at least 24px (got ${refBox?.width}×${refBox?.height})`)
  check((await fnEx.locator('[role="doc-endnotes"]').getAttribute('aria-label')) === 'Notas', 'footnote: notes are a named doc-endnotes section')
  await reset(); await ref1.focus(); await press('Enter')
  check(await page.evaluate(() => location.hash) === '#fn-1', 'footnote: Enter on the call jumps to the note')
  const targetBg = await fnEx.locator('#fn-1').evaluate((el) => getComputedStyle(el).backgroundColor)
  check(targetBg !== 'rgba(0, 0, 0, 0)', 'footnote: the targeted note is highlighted')
  const back = fnEx.locator('#fn-1 a')
  check((await back.boundingBox()).height >= 44, 'footnote: the back link is at least 44px')
  await back.focus(); await press('Enter')
  check(await page.evaluate(() => location.hash) === '#fn-ref-1', 'footnote: the back link returns to the call')

  // Verse
  await go('verse')
  const verse = exa('verse', 'poem')
  check((await verse.locator('p').count()) === 2, 'verse: one paragraph per stanza')
  check((await verse.locator('p > span').count()) === 6, 'verse: one block per verse')
  const hang = await verse.locator('p > span').first().evaluate((el) => { const s = getComputedStyle(el); return { pl: parseFloat(s.paddingLeft), ti: parseFloat(s.textIndent) } })
  check(hang.pl > 0 && hang.ti < 0, 'verse: long verses hang')

  // Epigraph
  await go('epigraph')
  const ep = exa('epigraph', 'default').locator('figure')
  check((await ep.locator('blockquote').count()) === 1 && (await ep.locator('figcaption').count()) === 1, 'epigraph: figure with blockquote and figcaption')
  check((await ep.evaluate((el) => getComputedStyle(el).textAlign)) === 'right', 'epigraph: set to the right')

  // DropCap
  await go('drop-cap')
  const dc = exa('drop-cap', 'default').locator('p')
  check((await dc.evaluate((el) => getComputedStyle(el, '::first-letter').float)) === 'left', 'drop cap: the first letter floats')
  check((await dc.evaluate((el) => el.children.length)) === 0, 'drop cap: no extra elements, the paragraph reads as one')

  // ReadingProgress
  await go('reading-progress', { width: 900, height: 300 })
  const bars = exa('reading-progress', 'values').getByRole('progressbar')
  check((await bars.count()) === 3, 'reading progress: three progress bars')
  const nows = await bars.evaluateAll((els) => els.map((e) => e.getAttribute('aria-valuenow')))
  check(nows.join() === '0,40,100', `reading progress: aria-valuenow follows value (got ${nows})`)
  check((await bars.first().getAttribute('aria-label')) === 'Progreso 0', 'reading progress: has an accessible name')
  const live = page.getByRole('progressbar', { name: 'Progreso de la página' })
  check((await live.getAttribute('aria-valuenow')) === '0', 'reading progress: starts at 0 at the top of the page')
  check((await live.evaluate((el) => getComputedStyle(el).position)) === 'fixed', 'reading progress: fixed to the top')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForFunction(() => document.querySelector('[aria-label="Progreso de la página"]').getAttribute('aria-valuenow') === '100', null, { timeout: 2000 }).catch(() => {})
  check((await live.getAttribute('aria-valuenow')) === '100', 'reading progress: reaches 100 at the bottom')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  check(parseFloat(await live.locator('> div').evaluate((el) => getComputedStyle(el).transitionDuration)) < 0.01, 'reading progress: no transition under prefers-reduced-motion')

  // TableOfContents
  await go('toc', { width: 900, height: 800 })
  const toc = page.getByRole('navigation', { name: 'En esta página' })
  const tocLinks = toc.getByRole('link')
  check((await tocLinks.count()) === 4, 'toc: one link per section')
  check((await toc.locator('[aria-current="location"]').allTextContents()).join() === 'El método', 'toc: only the current section is marked')
  for (let i = 0; i < 4; i++) check((await tocLinks.nth(i).boundingBox()).height >= 44, `toc: link ${i} is at least 44px tall`)
  await reset(); await press('Tab')
  check(await tocLinks.first().evaluate((el) => el === document.activeElement), 'toc: Tab reaches the first link')
  await press('Enter')
  check(await page.evaluate(() => location.hash) === '#toc-intro', 'toc: Enter follows the link')

  // ReadingSettings
  await go('reading-settings', { width: 1000, height: 800 })
  const rs = page.getByRole('region', { name: 'Ajustes de lectura' })
  const sample = page.getByTestId('sample')
  const fontOf = () => sample.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  const before = await fontOf()
  await rs.getByRole('button', { name: 'Texto más grande' }).click()
  const after = await fontOf()
  check(after > before, `reading settings: larger text grows the sample (${before} → ${after})`)
  check((await rs.locator('output').textContent()) === '125%', 'reading settings: shows the percentage')
  const smaller = rs.getByRole('button', { name: 'Texto más pequeño' })
  for (let i = 0; i < 4; i++) if (await smaller.isEnabled()) await smaller.click()
  check(await smaller.isDisabled(), 'reading settings: smaller is disabled at the limit')
  check((await fontOf()) < before, 'reading settings: the sample shrinks')
  const widthGroup = rs.getByRole('group', { name: 'Ancho de línea' })
  check((await widthGroup.getByRole('radio').count()) === 3, 'reading settings: width is a radio group')
  const widthOf = () => sample.evaluate((el) => getComputedStyle(el).maxWidth)
  const w0 = await widthOf()
  await widthGroup.getByRole('radio', { name: 'Medio' }).focus()
  await press('ArrowRight')
  check(await widthGroup.getByRole('radio', { name: 'Ancho' }).isChecked(), 'reading settings: arrow keys move through the radio group')
  check((await widthOf()) !== w0, 'reading settings: width changes the measure')
  await rs.getByRole('radio', { name: 'Sin serifa' }).check({ force: true })
  const fam = await sample.evaluate((el) => getComputedStyle(el).fontFamily)
  check(/system|sans|ui|Inter|Helvetica|Arial/i.test(fam), `reading settings: sans changes the typeface (got ${fam})`)
  for (const radio of await rs.getByRole('radio').all()) check((await radio.locator('xpath=following-sibling::span').boundingBox()).height >= 44, 'reading settings: each option is at least 44px tall')
  await press('Shift')
  await rs.getByRole('radio', { name: 'Estrecho' }).focus()
  const ringOutline = await rs.getByRole('radio', { name: 'Estrecho' }).locator('xpath=following-sibling::span').evaluate((el) => parseFloat(getComputedStyle(el).outlineWidth))
  check(ringOutline >= 2, `reading settings: the focused option shows a focus ring of at least 2px (got ${ringOutline})`)

  // PrevNext
  await go('prev-next')
  const pn = page.getByRole('navigation', { name: 'Para seguir leyendo' })
  const pnLinks = pn.getByRole('link')
  check((await pnLinks.count()) === 2, 'prev/next: two links')
  check((await pnLinks.nth(0).getAttribute('rel')) === 'prev' && (await pnLinks.nth(1).getAttribute('rel')) === 'next', 'prev/next: rel prev and next')
  for (let i = 0; i < 2; i++) check((await pnLinks.nth(i).boundingBox()).height >= 44, `prev/next: link ${i} is at least 44px tall`)
  await reset(); await press('Tab')
  check((await page.evaluate(() => document.activeElement?.getAttribute('rel'))) === 'prev', 'prev/next: Tab reaches previous first, then next')
  await press('Tab')
  check((await page.evaluate(() => document.activeElement?.getAttribute('rel'))) === 'next', 'prev/next: second Tab reaches next')
  check((await page.getByRole('navigation', { name: 'Primer texto de la serie' }).getByRole('link').count()) === 1, 'prev/next: a custom label names the landmark')

  // Figure
  await go('figure')
  const fig = exa('figure', 'default')
  check(((await fig.locator('img').getAttribute('alt')) ?? '').length > 0, 'figure: the image has alt text')
  check((await fig.locator('figcaption').count()) === 1, 'figure: has a caption')
  await fig.locator('img').scrollIntoViewIfNeeded()
  check(await fig.locator('img').evaluate((el) => el.complete && el.naturalWidth > 0), 'figure: the image loads')

  // Author
  await go('author')
  const au = exa('author', 'portrait')
  check((await au.getByRole('link', { name: 'Gabriel Rodríguez' }).getAttribute('rel')) === 'author', 'author: the name links with rel=author')
  check((await au.locator('img').getAttribute('alt')) === '', 'author: the portrait is decorative')
  check((await exa('author', 'initials').locator('[aria-hidden="true"]').textContent()) === 'GR', 'author: initials are hidden from assistive technology')

  // ReadingTime
  await go('reading-time')
  const times = await exa('reading-time', 'from-text').locator('time').evaluateAll((els) => els.map((e) => [e.getAttribute('datetime'), e.textContent]))
  check(times[0][0] === 'PT1M' && times[0][1] === '1 min de lectura', `reading time: never below one minute (got ${times[0]})`)
  check(times[1][0] === 'PT8M' && times[1][1] === '8 min de lectura', `reading time: rounds up (got ${times[1]})`)

  // Embed
  await go('embed')
  const loaded = exa('embed', 'default')
  check((await loaded.locator('iframe').getAttribute('title')) === 'Contenido de ejemplo', 'embed: the frame has a title')
  check(!/allow-top-navigation/.test((await loaded.locator('iframe').getAttribute('sandbox')) ?? ''), 'embed: the sandbox does not allow top navigation')
  const outLink = loaded.getByRole('link', { name: /Abrir en una pestaña nueva/ })
  check((await outLink.getAttribute('target')) === '_blank' && /noopener/.test((await outLink.getAttribute('rel')) ?? ''), 'embed: the exit link opens safely in a new tab')
  check((await outLink.boundingBox()).height >= 44, 'embed: the exit link is at least 44px tall')
  const def = exa('embed', 'deferred')
  check((await def.locator('iframe').count()) === 0, 'embed: deferred requests nothing before the click')
  await reset(); await def.getByRole('button', { name: 'Cargar contenido interactivo' }).focus(); await press('Enter')
  check((await def.locator('iframe').count()) === 1, 'embed: Enter on the button loads the frame')
  check((await def.locator('iframe').getAttribute('title')) === 'Presentación interactiva', 'embed: the loaded frame keeps its title')

  // ── Essential UI (H3) ────────────────────────────────────────────────────
  const tall = async (loc, what, min = 44) => { const b = await loc.boundingBox(); check(b && b.height >= min - 0.5, `${what} is at least ${min}px tall (got ${b?.height})`) }

  // IconButton
  await go('icon-button')
  const ibs = exa('icon-button', 'variants').getByRole('button')
  check((await ibs.count()) === 4, 'icon button: four buttons')
  check((await ibs.nth(0).getAttribute('aria-label')) === 'Continuar', 'icon button: the label is the accessible name')
  for (let i = 0; i < 4; i++) { const b = await ibs.nth(i).boundingBox(); check(b.width >= 44 && b.height >= 44, `icon button ${i}: 44×44 (got ${b.width}×${b.height})`) }
  check(await ibs.nth(0).locator('svg').getAttribute('aria-hidden') === 'true', 'icon button: the icon is hidden from assistive technology')
  check(await ibs.nth(3).isDisabled(), 'icon button: disabled is really disabled')

  // ButtonGroup
  await go('button-group')
  const grp = page.getByRole('group', { name: 'Acciones de la inscripción' })
  check((await grp.getByRole('button').count()) === 3, 'button group: a named group of three buttons')
  await reset(); await press('Tab'); await press('Tab')
  check((await page.evaluate(() => document.activeElement?.textContent?.trim())) === 'Guardar para después', 'button group: Tab moves through the buttons in order')

  // Link
  await go('link')
  const ext = exa('link', 'inline').getByRole('link', { name: /reglamento completo/ })
  check((await ext.getAttribute('target')) === '_blank' && /noopener/.test((await ext.getAttribute('rel')) ?? ''), 'link: external opens safely in a new tab')
  check(/se abre en una pestaña nueva/.test((await ext.textContent()) ?? ''), 'link: external tells screen readers it opens a new tab')
  check((await exa('link', 'inline').getByRole('link', { name: 'bases del concurso' }).evaluate((el) => getComputedStyle(el).textDecorationLine)) === 'underline', 'link: always underlined')
  await tall(exa('link', 'standalone').getByRole('link'), 'link: standalone')
  await reset(); await press('Tab'); await press('Enter')
  check(await page.evaluate(() => location.hash) === '#bases', 'link: Enter follows the link')

  // Badge
  await go('badge')
  const badges = exa('badge', 'tones').locator('span.kafka-type-badge-type')
  check((await badges.count()) === 6, 'badge: six tones')
  for (const name of ['Próximamente', 'Inscripciones abiertas', 'Últimos cupos', 'Agotado']) {
    check((await exa('badge', 'tones').locator('span', { hasText: name }).first().locator('svg[aria-hidden="true"]').count()) === 1, `badge: "${name}" has an icon besides its colour`)
  }

  // Chip
  await go('chip')
  const chips = exa('chip', 'filters').getByRole('button')
  check((await chips.nth(0).getAttribute('aria-pressed')) === 'true' && (await chips.nth(1).getAttribute('aria-pressed')) === 'false', 'chip: aria-pressed reflects the state')
  await tall(chips.nth(1), 'chip')
  await reset(); await chips.nth(1).focus(); await press('Space')
  check((await chips.nth(1).getAttribute('aria-pressed')) === 'true', 'chip: Space toggles it')
  check((await chips.nth(1).locator('svg').count()) === 1, 'chip: a selected chip shows a check, not just a colour')
  await press('Enter')
  check((await chips.nth(1).getAttribute('aria-pressed')) === 'false', 'chip: Enter toggles it back')

  // Field + Input
  await go('field')
  const emailInput = page.getByLabel(/Correo electrónico/)
  check(await emailInput.count() === 1, 'field: the label is connected to the control')
  const desc = await emailInput.getAttribute('aria-describedby')
  check(!!desc && (await page.locator(`#${desc.split(' ')[0].replace(/:/g, '\\:')}`).textContent())?.includes('confirmar'), 'field: the hint is the description of the control')
  check((await emailInput.getAttribute('aria-required')) === 'true', 'field: required sets aria-required')
  check(/obligatorio/.test((await page.locator('label', { hasText: 'Correo electrónico' }).textContent()) ?? ''), 'field: required is said in words, not only a mark')
  const docInput = page.getByLabel(/Documento/)
  check((await docInput.getAttribute('aria-invalid')) === 'true', 'field: an error marks the control invalid')
  check((await page.locator('[aria-live="polite"]', { hasText: 'solo números' }).count()) === 1, 'field: the error lives in a polite live region')
  const invBorder = await docInput.evaluate((el) => getComputedStyle(el).borderTopColor)
  const okBorder = await emailInput.evaluate((el) => getComputedStyle(el).borderTopColor)
  check(invBorder !== okBorder, 'field: the invalid border differs from the normal one')
  await tall(emailInput, 'input')
  check(parseFloat(await emailInput.evaluate((el) => getComputedStyle(el).fontSize)) >= 16, 'input: text is at least 16px')
  await reset(); await emailInput.focus()
  check(await emailInput.evaluate((el) => getComputedStyle(el).outlineStyle) === 'solid', 'input: focus shows an outline')
  await go('input')
  check((await page.getByLabel('Código').isDisabled()), 'input: disabled is really disabled')

  // Textarea / Select
  await go('textarea')
  const ta = page.getByLabel('Cuéntanos por qué quieres participar')
  await ta.fill('Hola'); check((await ta.inputValue()) === 'Hola', 'textarea: accepts text')
  check((await ta.getAttribute('aria-describedby')) !== null, 'textarea: the hint describes it')
  await go('select')
  const sel = page.getByLabel('Modalidad')
  await tall(sel, 'select')
  await sel.focus(); await press('ArrowDown')
  check((await sel.inputValue()) === 'virtual', 'select: arrow keys change the native value')
  check(await sel.locator('xpath=following-sibling::*[local-name()="svg"]').evaluate((el) => getComputedStyle(el).pointerEvents) === 'none', 'select: the chevron does not intercept clicks')

  // Checkbox
  await go('checkbox')
  const cb = exa('checkbox', 'default').getByRole('checkbox', { name: 'Acepto las bases' })
  await reset(); await cb.focus(); await press('Space')
  check(await cb.isChecked(), 'checkbox: Space toggles it')
  await tall(exa('checkbox', 'default').locator('label', { hasText: 'Acepto las bases' }), 'checkbox row')
  check((await exa('checkbox', 'default').getByRole('checkbox', { name: 'Con error' }).getAttribute('aria-invalid')) === 'true', 'checkbox: invalid is exposed')
  check(await exa('checkbox', 'default').getByRole('checkbox', { name: 'No disponible' }).isDisabled(), 'checkbox: disabled is really disabled')
  const parent = exa('checkbox', 'indeterminate').getByRole('checkbox', { name: 'Todos los talleres' })
  check(await parent.evaluate((el) => el.indeterminate), 'checkbox: the parent is indeterminate when some children are checked')
  await parent.click()
  check(await parent.isChecked() && !(await parent.evaluate((el) => el.indeterminate)), 'checkbox: toggling the parent checks everything and clears the mixed state')
  await reset(); await cb.focus()
  const cbRing = await cb.locator('xpath=following-sibling::span[1]').evaluate((el) => parseFloat(getComputedStyle(el).outlineWidth))
  await press('Shift'); await cb.focus()
  check((await cb.locator('xpath=following-sibling::span[1]').evaluate((el) => parseFloat(getComputedStyle(el).outlineWidth))) >= 2 || cbRing >= 2, 'checkbox: the box shows a focus ring')

  // Radio
  await go('radio')
  const rg = page.getByRole('group', { name: /¿Cómo quieres tomar el taller\?/ })
  check((await rg.getByRole('radio').count()) === 3, 'radio: three options in a named group')
  check((await rg.getAttribute('aria-describedby')) !== null, 'radio: the hint describes the group')
  const virtual = rg.getByRole('radio', { name: /Virtual/ })
  await reset(); await virtual.focus(); await press('ArrowDown')
  check(await rg.getByRole('radio', { name: 'Presencial' }).isChecked(), 'radio: arrow keys move and select')
  await press('ArrowDown')
  check(await virtual.isChecked() && !(await rg.getByRole('radio', { name: /Mixto/ }).isChecked()), 'radio: arrow keys skip a disabled option and wrap')
  await tall(rg.locator('label').first(), 'radio row')
  const errGroup = page.getByRole('group', { name: /Plan/ })
  check((await errGroup.getByRole('radio').first().getAttribute('aria-invalid')) === 'true', 'radio: an error marks the options invalid')
  check((await page.locator('[aria-live="polite"]', { hasText: 'Elige un plan' }).count()) === 1, 'radio: the error is announced politely')

  // Switch
  await go('switch')
  const sw = exa('switch', 'default').getByRole('switch', { name: /Boletín mensual/ })
  check(!(await sw.isChecked()), 'switch: starts off')
  await reset(); await sw.focus(); await press('Space')
  check(await sw.isChecked(), 'switch: Space turns it on')
  check(await exa('switch', 'default').getByRole('switch', { name: /Recordatorios/ }).isChecked(), 'switch: defaultChecked starts on')
  await tall(exa('switch', 'default').locator('label').first(), 'switch row')
  const thumbOn = await exa('switch', 'default').locator('label', { hasText: 'Boletín mensual' }).locator('.kafka-switch-thumb svg').evaluate((el) => getComputedStyle(el).display)
  check(thumbOn !== 'none', 'switch: the thumb shows a mark when on (not only colour)')
  check(await exa('switch', 'default').getByRole('switch', { name: 'No disponible' }).isDisabled(), 'switch: disabled is really disabled')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  check(parseFloat(await exa('switch', 'default').locator('.kafka-switch-thumb').first().evaluate((el) => getComputedStyle(el).transitionDuration)) < 0.01, 'switch: no thumb transition under prefers-reduced-motion')
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  // Slider
  await go('slider')
  const sl = page.getByRole('slider', { name: 'Sesiones por temporada' })
  check((await sl.getAttribute('aria-valuetext')) === '4 sesiones' || (await sl.evaluate((el) => el.getAttribute('aria-valuetext'))) === '4 sesiones', 'slider: aria-valuetext carries the formatted value')
  await reset(); await sl.focus(); await press('ArrowRight'); await press('PageUp')
  check((await sl.inputValue()) === '6', `slider: arrow and Page Up change the value (got ${await sl.inputValue()})`)
  await press('End'); check((await sl.inputValue()) === '10', 'slider: End goes to the maximum')
  await press('Home'); check((await sl.inputValue()) === '1', 'slider: Home goes to the minimum')
  check((await page.locator('output').textContent()) === '1 sesiones', 'slider: the value is shown as text')
  await tall(sl, 'slider')

  // PinInput
  await go('pin-input')
  const cells = page.getByRole('group', { name: /Código de verificación/ }).getByRole('textbox')
  check((await cells.count()) === 6, 'pin input: six cells in a named group')
  check((await cells.nth(0).getAttribute('aria-label')) === 'Dígito 1 de 6', 'pin input: each cell is named')
  check((await cells.nth(0).getAttribute('autocomplete')) === 'one-time-code', 'pin input: the first cell asks for one-time-code autofill')
  await reset(); await cells.nth(0).focus(); await page.keyboard.type('123')
  check((await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Dígito 4 de 6', 'pin input: typing advances to the next cell')
  await press('Backspace')
  check((await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Dígito 3 de 6' && (await cells.nth(2).inputValue()) === '', 'pin input: Backspace on an empty cell goes back and clears')
  await page.keyboard.type('x9')
  check((await cells.nth(2).inputValue()) === '9', 'pin input: numeric mode ignores letters')
  await press('ArrowLeft'); check((await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Dígito 3 de 6', 'pin input: arrow keys move between cells')
  await page.evaluate(() => navigator.clipboard?.writeText?.('987654').catch(() => {}))
  await cells.nth(0).focus()
  await cells.nth(0).evaluate((el) => { const dt = new DataTransfer(); dt.setData('text', '987654'); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })) })
  const pasted = (await cells.evaluateAll((els) => els.map((e) => e.value))).join('')
  check(pasted === '987654', `pin input: pasting fills every cell (got ${pasted})`)
  const cellBox = await cells.nth(0).boundingBox()
  check(cellBox.width >= 44 && cellBox.height >= 44, 'pin input: cells are at least 44px')

  // TagInput
  await go('tag-input')
  const ti = page.getByLabel('Géneros que escribes')
  const tagList = exa('tag-input', 'default').locator('ul li')
  check((await tagList.count()) === 2, 'tag input: starts with two tags')
  await reset(); await ti.focus(); await page.keyboard.type('ensayo'); await press('Enter')
  check((await tagList.count()) === 3, 'tag input: Enter adds a tag')
  await page.keyboard.type('micro,')
  check((await tagList.count()) === 4, 'tag input: a comma adds a tag')
  check(/micro añadida/.test((await page.getByRole('status').textContent()) ?? ''), 'tag input: additions are announced')
  await page.keyboard.type('poesía'); await press('Enter')
  check((await tagList.count()) === 4, 'tag input: duplicates are ignored')
  await press('Backspace')
  check((await tagList.count()) === 3, 'tag input: Backspace on an empty field removes the last tag')
  check(/quitada/.test((await page.getByRole('status').textContent()) ?? ''), 'tag input: removals are announced')
  await exa('tag-input', 'default').getByRole('button', { name: 'Quitar poesía' }).click()
  check((await tagList.count()) === 2, 'tag input: each tag has a named remove button')
  await tall(exa('tag-input', 'default').getByRole('button', { name: 'Quitar cuento' }), 'tag remove button')

  // FileUpload
  await go('file-upload')
  const fu = exa('file-upload', 'default')
  const fileInput = fu.locator('input[type=file]')
  check((await fileInput.getAttribute('accept')) === '.pdf,.docx', 'file upload: passes accept to the native input')
  await fileInput.setInputFiles({ name: 'relato.pdf', mimeType: 'application/pdf', buffer: Buffer.from('hola') })
  check((await fu.locator('ul[aria-label] li').count()) === 1 && /relato\.pdf/.test((await fu.locator('ul[aria-label] li').textContent()) ?? ''), 'file upload: a valid file is listed')
  await fileInput.setInputFiles({ name: 'foto.png', mimeType: 'image/png', buffer: Buffer.from('x') })
  check(/no es un tipo de archivo admitido/.test((await fu.locator('[aria-live="polite"]').first().textContent()) ?? ''), 'file upload: a wrong type is refused with the reason')
  await fileInput.setInputFiles({ name: 'grande.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(5 * 1024 * 1024 + 1) })
  check(/pesa más de 5\.0 MB/.test((await fu.locator('[aria-live="polite"]').first().textContent()) ?? ''), 'file upload: an oversized file is refused with the reason')
  const rm = fu.getByRole('button', { name: 'Quitar relato.pdf' })
  await tall(rm, 'file remove button')
  await reset(); await press('Tab')
  check(await fileInput.evaluate((el) => el === document.activeElement), 'file upload: the native input is reached with Tab')
  check(await fu.locator('label.kafka-dropzone').evaluate((el) => parseFloat(getComputedStyle(el).outlineWidth)) >= 2, 'file upload: the zone shows the focus ring')
  await rm.click()
  check((await fu.locator('ul[aria-label] li').count()) === 0, 'file upload: a file can be removed')
})

console.log(`\n  ${passed} keyboard / ARIA checks passed`)
if (failures.length) { console.log(failures.map((f) => `  ✗ ${f}`).join('\n')); process.exit(1) }
console.log('✓ Keyboard behaviour is correct')
