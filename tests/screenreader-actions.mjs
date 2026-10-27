// Screen reader tree, actions and small overlays: buttons, links, chips, popover, tooltip (H8, DDR-KF-004 criterion 3).
// Menu and the dialogs are in tests/screenreader.mjs; see tests/lib/ax.mjs for how the tree is read.
//   node tests/screenreader-actions.mjs
import { withBrowser } from './lib/server.mjs'
import { axTree, checker, example, focusedText, named, ofRole } from './lib/ax.mjs'

const { check, finish } = checker('screen reader (actions)', 'Screen reader tree, actions: names, states and popups are as expected')
const flag = (node, key) => String(node?.props[key]) === 'true'

await withBrowser(async (browser) => {
  // ── Button: a name always, loading and disabled are announced ──────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'button'))
    const buttons = ofRole(tree, 'button')
    check(buttons.length >= 10 && buttons.every((b) => b.name), 'button: every button has a name')
    check(buttons.filter((b) => b.props.disabled === true).length === 4, 'button: the disabled and loading buttons are announced as unavailable')
    check(named(tree, 'button', /^Enviando/)?.name.includes('Cargando'), 'button: a loading button says it is loading, in the language of the labels')
  }

  // ── IconButton: the label is the name, since there is no text ──────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'icon-button'))
    const names = ofRole(tree, 'button').map((b) => b.name)
    check(names.length === 4 && names.every(Boolean), 'icon button: every icon-only button has a name')
    check(ofRole(tree, 'button').every((b) => !/^(svg|icon)/i.test(b.name)), 'icon button: the name is the action, not the icon')
    check(ofRole(tree, 'image').length === 0, 'icon button: the icon itself is hidden from the reader')
  }

  // ── ButtonGroup, SplitButton ───────────────────────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'button-group'))
    check(['Inscribirme', 'Guardar para después', 'Descartar', 'Negrita', 'Cursiva', 'Subrayado'].every((n) => named(tree, 'button', n)), 'button group: each button keeps its own name')
  }
  {
    const page = await example(browser, 'split-button')
    let tree = await axTree(page)
    const more = ofRole(tree, 'button').find((b) => b.name === 'Más acciones')
    check(ofRole(tree, 'button').filter((b) => b.name === 'Inscribirme').length === 2 && more?.props.hasPopup === 'menu' && more.props.expanded === false, 'split button: the main action and a separate "Más acciones" that announces a menu, collapsed')
    await page.getByRole('button', { name: 'Más acciones' }).first().click()
    await page.waitForTimeout(300)
    tree = await axTree(page)
    check(ofRole(tree, 'button').some((b) => b.name === 'Más acciones' && b.props.expanded === true) && ofRole(tree, 'menuitem').length > 0, 'split button: opening the menu is announced and its items are menu items')
  }

  // ── Link: name says where it goes; a new tab is said in the name ───────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'link'))
    const links = ofRole(tree, 'link')
    check(links.length === 3 && links.every((l) => l.props.url), 'link: links are real links with a destination')
    check(named(tree, 'link', /\(se abre en una pestaña nueva\)$/), 'link: a link that opens a new tab says so in its name')
  }

  // ── Chip: a filter is a toggle button ──────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'chip')
    let tree = await axTree(page)
    check(flag(named(tree, 'button', 'Talleres'), 'pressed') && !flag(named(tree, 'button', 'Seminarios'), 'pressed'), 'chip: a chosen filter is announced as pressed, the others not')
    await page.getByRole('button', { name: 'Seminarios' }).click()
    tree = await axTree(page)
    check(flag(named(tree, 'button', 'Seminarios'), 'pressed'), 'chip: choosing a filter is announced as pressed')
  }

  // ── Badge: plain text, nothing to announce beyond it ───────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'badge'))
    check(ofRole(tree, 'button').length === 0 && ofRole(tree, 'link').length === 0, 'badge: it is text, not a control')
  }

  // ── Popover: a dialog popup that returns focus ─────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'popover')
    let node = named(await axTree(page), 'button', 'Filtrar')
    check(node?.props.hasPopup === 'dialog' && node.props.expanded === false, 'popover: the trigger announces a dialog popup, collapsed')
    await page.getByRole('button', { name: 'Filtrar' }).click()
    await page.waitForTimeout(300)
    const tree = await axTree(page)
    check(named(tree, 'button', 'Filtrar')?.props.expanded === true, 'popover: the trigger announces that it is expanded')
    check(ofRole(tree, 'dialog').length === 1 && ofRole(tree, 'dialog')[0].name, 'popover: the open panel is a dialog with a name')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    check((await focusedText(page)) === 'Filtrar' && named(await axTree(page), 'button', 'Filtrar')?.props.expanded === false, 'popover: Escape closes it and returns focus to the trigger')
  }

  // ── Tooltip: the text is the description, and it appears with the keyboard too ─────────────────────────────
  {
    const page = await example(browser, 'tooltip')
    const tree = await axTree(page)
    check(named(tree, 'button', 'Cerrar')?.description === 'Cierra el panel y descarta los cambios', 'tooltip: its text is the description of the control, not its name')
    await page.keyboard.press('Tab')
    await page.waitForTimeout(300)
    check((await page.locator('[role=tooltip]').count()) >= 1 && (await page.locator('[role=tooltip]').first().isVisible()), 'tooltip: focusing with the keyboard shows it')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(250)
    check((await page.locator('[role=tooltip]:visible').count()) === 0, 'tooltip: Escape hides it without moving focus')
  }
})

finish()
