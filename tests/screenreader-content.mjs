// Screen reader tree, reading content and surfaces: prose, quotes, verse, figures, embeds, progress, loading and empty
// states, avatars, cards and notices (H8, DDR-KF-004 criterion 3). Footnotes are in tests/screenreader.mjs.
// See tests/lib/ax.mjs for how the tree is read.
//   node tests/screenreader-content.mjs
import { withBrowser } from './lib/server.mjs'
import { axTree, checker, example, liveText, named, ofRole } from './lib/ax.mjs'

const { check, finish } = checker('screen reader (content)', 'Screen reader tree, content: structure, alternatives, progress and live states are as expected')
const flag = (node, key) => String(node?.props[key]) === 'true'
const inDom = (page, fn, arg) => page.evaluate(fn, arg)
const tryAttr = (page, selector, name) => page.locator(selector).first().getAttribute(name)

await withBrowser(async (browser) => {
  // ── Prose, quotes, verse, epigraph, drop cap ───────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'prose'))
    check(named(tree, 'article', 'Ejemplo de texto'), 'prose: the text is an article with a name')
    check(ofRole(tree, 'heading').some((h) => h.name === 'La arquitectura del texto' && h.props.level === 2), 'prose: headings keep their levels')
    check(ofRole(tree, 'image').every((i) => i.name), 'prose: every image has an alternative text')
    check(tree.some((n) => n.role === 'doc-endnotes' && n.name === 'Notas'), 'prose: the notes at the end are a landmark named "Notas"')
    check(ofRole(tree, 'blockquote').length >= 2, 'prose: quotations are marked as quotations')
  }
  {
    const page = await example(browser, 'pull-quote')
    const quotes = await inDom(page, () => [...document.querySelectorAll('figure')].map((f) => ({ quote: !!f.querySelector('blockquote'), caption: f.querySelector('figcaption')?.textContent.trim() ?? '' })))
    check(quotes.length >= 2 && quotes.every((q) => q.quote), 'pull quote: the quotation is a blockquote inside a figure')
    check(quotes[0].caption.length > 0, 'pull quote: the attribution is a caption of the figure, read with the quote')
    check((await inDom(page, () => document.querySelectorAll('[aria-hidden=true]').length)) === 0 || (await inDom(page, () => [...document.querySelectorAll('figure [aria-hidden=true]')].every((e) => e.textContent.trim().length <= 1))), 'pull quote: only decoration (quotation marks) is hidden from the reader')
  }
  {
    const page = await example(browser, 'verse')
    const verse = await inDom(page, () => { const f = document.querySelector('figure'); return { lines: f.innerText.split('\n').filter(Boolean).length, caption: f.querySelector('figcaption')?.textContent.trim() ?? '' } })
    check(verse.lines >= 4 && verse.caption, 'verse: the lines of the poem keep their breaks and the author is the caption')
  }
  {
    const tree = await axTree(await example(browser, 'epigraph'))
    check(ofRole(tree, 'blockquote').length === 1, 'epigraph: the epigraph is a quotation')
  }
  {
    const page = await example(browser, 'drop-cap')
    const dup = await inDom(page, () => [...document.querySelectorAll('main p')].filter((p) => p.querySelector('[aria-hidden=true]') && p.textContent.trim().length > 40).length)
    check(dup === 0, 'drop cap: the big letter is not repeated for the reader (the paragraph reads once)')
  }

  // ── Figure, Author, ReadingTime, Embed ─────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'figure')
    const tree = await axTree(page)
    check(ofRole(tree, 'image').length >= 3 && ofRole(tree, 'image').every((i) => i.name), 'figure: every image has an alternative text')
    check((await inDom(page, () => [...document.querySelectorAll('figure')].every((f) => f.querySelector('img,svg,picture')))), 'figure: every figure holds a picture')
  }
  {
    const tree = await axTree(await example(browser, 'author'))
    check(ofRole(tree, 'link').length >= 1 && ofRole(tree, 'link').every((l) => l.name && !/Gabriel Rodríguez Gabriel/.test(l.name)), 'author: the link is named with the author once, not twice (image and text)')
  }
  {
    const page = await example(browser, 'reading-time')
    const times = await inDom(page, () => [...document.querySelectorAll('time')].map((t) => ({ text: t.textContent.trim(), dt: t.getAttribute('datetime') })))
    check(times.length === 2 && times.every((t) => /min de lectura/.test(t.text) && /^PT/.test(t.dt ?? '')), 'reading time: a <time> with a machine duration and the text "min de lectura"')
  }
  {
    const page = await example(browser, 'embed')
    let tree = await axTree(page)
    check(ofRole(tree, 'Iframe').every((f) => f.name), 'embed: the embedded frame has a title')
    check(named(tree, 'button', 'Cargar contenido interactivo') && ofRole(tree, 'link').every((l) => /nueva/.test(l.name)), 'embed: the deferred one is a named button; links that leave say they open a new tab')
    const before = ofRole(tree, 'Iframe').length
    await page.getByRole('button', { name: 'Cargar contenido interactivo' }).click()
    await page.waitForTimeout(400)
    tree = await axTree(page)
    check(ofRole(tree, 'Iframe').length === before + 1 && ofRole(tree, 'Iframe').every((f) => f.name), 'embed: loading the content adds a frame that also has a title')
  }

  // ── Divider ────────────────────────────────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'divider')
    const seps = ofRole(await axTree(page), 'separator')
    check(seps.some((s) => s.props.orientation === 'horizontal') && seps.some((s) => s.props.orientation === 'vertical'), 'divider: a separator announces its orientation')
    const label = await inDom(page, () => [...document.querySelectorAll('[data-example="divider/labelled"] *')].map((e) => e.textContent.trim()).find((t) => t.length > 0) ?? '')
    check(label.length > 0, 'divider: the label of a labelled divider is real text, so it is read')
  }

  // ── Progress, ReadingProgress, Spinner, Skeleton, EmptyState ───────────────────────────────────────────────
  {
    const page = await example(browser, 'progress')
    const tree = await axTree(page)
    const bars = ofRole(tree, 'progressbar')
    check(bars.length === 6 && bars.every((b) => b.name && b.props.valuemin === 0 && b.props.valuemax === 100), 'progress: every bar has a name and a 0–100 range')
    // Chromium's tree leaves valuetext empty even for a plain slider, so the attribute itself is what is checked here.
    check((await tryAttr(page, '[aria-label="Inscripción"]', 'aria-valuetext')) === 'Paso 2 de 5', 'progress: a bar that counts steps reads them ("Paso 2 de 5"), not a percentage')
  }
  {
    const page = await example(browser, 'reading-progress')
    const bars = ofRole(await axTree(page), 'progressbar')
    const nows = await inDom(page, () => [...document.querySelectorAll('[role=progressbar]')].map((e) => e.getAttribute('aria-valuenow')))
    check(bars.length === 4 && bars.every((b) => b.name) && nows.every((n) => n !== null), 'reading progress: every bar has a name and a current value')
  }
  {
    const page = await example(browser, 'spinner')
    const live = await liveText(page)
    check(live.filter((l) => l.role === 'status').length === 4 && live.every((l) => l.text.length > 0), 'spinner: each one is a status with words, not only a moving circle')
  }
  {
    const page = await example(browser, 'skeleton')
    const live = await liveText(page)
    check(live.length === 3 && live.every((l) => l.role === 'status' && l.text.length > 0), 'skeleton: each placeholder says it is loading, once, as a status')
    check(await inDom(page, () => [...document.querySelectorAll('[role=status]')].every((s) => [...s.querySelectorAll('*')].every((c) => c.getAttribute('aria-hidden') === 'true' || c.textContent.trim() === '' || c.closest('[class*=sr-only]')))), 'skeleton: the grey blocks are hidden; only the status text is read')
  }
  {
    const page = await example(browser, 'empty-state')
    const tree = await axTree(page)
    const headings = ofRole(tree, 'heading').filter((h) => h.name === 'Aún no tienes inscripciones')
    check(headings.length >= 1 && named(tree, 'button', 'Ver talleres'), 'empty state: a heading says what is empty and a button offers the way out')
    check(new Set(headings.map((h) => h.props.level)).size === headings.length, 'empty state: the heading level can be set to fit the page')
  }

  // ── Avatar, CountBadge ─────────────────────────────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'avatar'))
    const images = ofRole(tree, 'image')
    check(images.length >= 15 && images.every((i) => i.name), 'avatar: every avatar is an image with the person\'s name')
    check(['En línea', 'Ausente', 'Ocupado', 'Desconectado'].every((n) => named(tree, 'image', n)), 'avatar: a presence status is said in words, not only by colour')
    check(named(tree, 'image', '2 más'), 'avatar: the "+2" of a group is read as "2 más"')
    check(!images.some((i) => /^(foto|imagen|photo|image)\b/i.test(i.name)), 'avatar: the name is the person, not "foto de"')
  }
  {
    const page = await example(browser, 'count-badge')
    const tree = await axTree(page)
    check(named(tree, 'image', '4 notificaciones sin leer') && named(tree, 'image', '5 mensajes sin leer'), 'count badge: the number is read with what it counts')
    check(await inDom(page, () => [...document.querySelectorAll('[role=img] > [aria-hidden=true]')].length >= 2), 'count badge: the bare digit is hidden so it is not read twice')
  }

  // ── Card, Panel, ProgramCard, NewsBox ──────────────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'card'))
    check(ofRole(tree, 'heading').filter((h) => h.props.level === 3).length >= 2, 'card: each card has a heading')
  }
  {
    const page = await example(browser, 'panel')
    let tree = await axTree(page)
    const toggle = named(tree, 'button', 'Política de inscripción')
    check(flag(toggle, 'expanded') && ofRole(tree, 'heading').some((h) => h.name === 'Política de inscripción'), 'panel: a collapsible panel is a button inside a heading, announced as expanded')
    await page.getByRole('button', { name: 'Política de inscripción' }).click()
    await page.waitForTimeout(250)
    check(!flag(named(await axTree(page), 'button', 'Política de inscripción'), 'expanded'), 'panel: collapsing it is announced')
  }
  {
    const page = await example(browser, 'program-card')
    const tree = await axTree(page)
    check(ofRole(tree, 'heading').filter((h) => h.props.level === 3).length >= 2, 'program card: each card has a heading')
    // Five cards each offer "Inscribirme": out of context, a reader listing buttons hears the same name five times.
    const actions = ofRole(tree, 'button').filter((b) => b.name === 'Inscribirme')
    check(actions.length >= 3 && actions.every((a) => a.description.length > 0), `program card: each "Inscribirme" says which program it is for (descriptions: ${JSON.stringify(actions.map((a) => a.description))})`)
  }
  {
    const page = await example(browser, 'news-box')
    const tree = await axTree(page)
    check(named(tree, 'region', 'Novedades') && named(tree, 'region', 'Un aviso'), 'news box: each box is a region with a name')
    check(ofRole(tree, 'button').filter((b) => /^Cerrar noticia: .+/.test(b.name)).length >= 2, 'news box: the close button names the news it closes')
    check(['Ver noticia 1 de 3', 'Ver noticia 2 de 3', 'Ver noticia 3 de 3'].every((n) => named(tree, 'button', n)), 'news box: each dot says its position out of the total')
    const marked = await inDom(page, () => [...document.querySelectorAll('[aria-label^="Ver noticia"]')].filter((b) => b.getAttribute('aria-current') || b.getAttribute('aria-pressed') === 'true' || b.getAttribute('aria-selected') === 'true').length)
    check(marked >= 1, 'news box: the dot of the news being shown is marked as current')
  }
})

finish()
