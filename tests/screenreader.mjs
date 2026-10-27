// What a screen reader is told, component by component (H8, DDR-KF-004 criterion 3).
//
// This does not run a real screen reader. It reads the accessibility tree Chromium builds from the page, which is
// the same tree NVDA, JAWS and VoiceOver consume: role, name, description, state and live regions. If the tree
// is right, the announcement is right; the exact phrasing of each reader is not ours to test.
// This file holds the components where readers fail most: Field, Alert, Tabs, the dialogs, Menu, Combobox, Toast,
// Footnote, Calendar and NotificationCenter. The rest is in tests/screenreader-{forms,actions,navigation,content}.mjs and
// tests/screenreader-sweep.mjs, which also fails when a component has no expectations at all.
//   node tests/screenreader.mjs
import { withBrowser } from './lib/server.mjs'
import { axTree, checker, example, focusedText, liveText, named, ofRole } from './lib/ax.mjs'

const { check, finish } = checker('screen reader', 'Screen reader tree: names, roles, states and live regions are as expected')

await withBrowser(async (browser) => {
  // ── Field: name, hint, error ───────────────────────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'field'))
    const email = named(tree, 'textbox', /^Correo electrónico/)
    check(email?.name === 'Correo electrónico (obligatorio)' && email.props.required === true, 'field: a required field says so in its name and is marked required')
    check(email?.description === 'Te escribiremos aquí para confirmar la inscripción.', 'field: the hint is the description of the input')
    const phone = named(tree, 'textbox', /^Teléfono/)
    check(phone?.name === 'Teléfono (opcional)' && !phone.props.required, 'field: an optional field says so in its name')
    const doc = named(tree, 'textbox', /^Documento/)
    check(String(doc?.props.invalid) === 'true', 'field: a field with an error is announced as invalid')
    check(doc?.description === 'Escribe solo números, sin puntos.', 'field: the error text is the description of the invalid input')
    check(doc && !doc.name.includes('Escribe solo números'), 'field: the error text stays out of the name')
  }

  // ── Alert: urgency decides the role ────────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'alert')
    const tree = await axTree(page)
    const live = await liveText(page)
    check(live.filter((l) => l.role === 'status').length === 4 && live.filter((l) => l.role === 'alert').length === 1, 'alert: information, success and warning are polite statuses (4 with the dismissible one); only the error interrupts')
    check(live.find((l) => l.role === 'alert')?.text.includes('No pudimos enviar tu inscripción'), 'alert: the error is the one that interrupts')
    check(named(tree, 'button', 'Cerrar') && named(tree, 'button', 'Ver horario'), 'alert: the dismiss button and the action have names')
  }

  // ── Tabs: selection, panel name, arrow keys ────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'tabs')
    let tree = await axTree(page)
    check(named(tree, 'tablist', 'Detalles del programa'), 'tabs: the tab list has a name')
    check(named(tree, 'tab', 'Resumen')?.props.selected === true && ofRole(tree, 'tab').filter((t) => t.props.selected).length === 1, 'tabs: exactly one tab is selected')
    check(named(tree, 'tab', 'Próximamente')?.props.disabled === true, 'tabs: a disabled tab is announced as unavailable')
    check(named(tree, 'tabpanel', 'Resumen'), 'tabs: the panel is named by its tab')
    await page.getByRole('tab', { name: 'Resumen' }).focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(150)
    tree = await axTree(page)
    check(named(tree, 'tab', 'Programa')?.props.selected === true && named(tree, 'tab', 'Programa')?.props.focused === true, 'tabs: ArrowRight moves selection and focus to the next tab')
    check(named(tree, 'tabpanel', 'Programa'), 'tabs: the panel follows the selected tab')
  }

  // ── Modal: dialog, modal, focus, background, return ────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'modal', (p) => p.getByRole('button', { name: 'Abrir inscripción' }).click())
    const tree = await axTree(page)
    const dialog = named(tree, 'dialog', 'Inscripción al taller')
    check(dialog?.props.modal === true, 'modal: announced as a modal dialog with the title as its name')
    check(dialog?.description === 'Déjanos tus datos y te escribimos con los pasos de pago.', 'modal: the description is announced with the dialog')
    check(await page.evaluate(() => document.activeElement?.closest('dialog,[role=dialog],[role=alertdialog]') != null), 'modal: focus moves inside the dialog when it opens')
    check(ofRole(tree, 'heading').every((h) => h.name === 'Inscripción al taller'), `modal: the page behind is hidden from the reader (headings seen: ${ofRole(tree, 'heading').map((h) => h.name).join(' | ')})`)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    check(ofRole(await axTree(page), 'dialog').length === 0, 'modal: Escape closes it')
    check((await focusedText(page)) === 'Abrir inscripción', `modal: focus returns to the button that opened it (got "${await focusedText(page)}")`)
  }

  // ── ConfirmDialog: a destructive question interrupts, and starts on the safe answer ────────────────────────
  {
    const page = await example(browser, 'confirm-dialog', (p) => p.getByRole('button', { name: 'Eliminar relato' }).click())
    const tree = await axTree(page)
    const dialog = named(tree, 'alertdialog', '¿Eliminar el relato?')
    check(dialog, `confirm dialog: a destructive confirmation is an alertdialog (roles found: ${ofRole(tree, 'dialog').map((d) => d.name).join(', ') || 'none'} as plain dialog)`)
    check((dialog ?? named(tree, 'dialog', '¿Eliminar el relato?'))?.description.includes('No se puede deshacer'), 'confirm dialog: the consequence is announced with the dialog')
    check((await focusedText(page)) === 'Cancelar', `confirm dialog: focus starts on the safe answer, Cancelar (got "${await focusedText(page)}")`)
    check(named(tree, 'button', 'Eliminar relato'), 'confirm dialog: the confirming button is named for the action, not "Sí"')
  }

  // ── Drawer ─────────────────────────────────────────────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'drawer', (p) => p.getByRole('button', { name: 'Filtros' }).click()))
    const drawer = named(tree, 'dialog', 'Filtros')
    check(drawer?.props.modal === true && drawer.description === 'Elige los tipos de programa.', 'drawer: a modal dialog with name and description')
  }

  // ── Menu: popup button, expanded state, items ──────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'menu')
    const closed = named(await axTree(page), 'button', 'Acciones')
    check(closed?.props.hasPopup === 'menu' && closed.props.expanded === false, 'menu: the trigger announces a menu and that it is collapsed')
    await page.getByRole('button', { name: 'Acciones' }).click()
    await page.waitForTimeout(300)
    const tree = await axTree(page)
    check(named(tree, 'button', 'Acciones')?.props.expanded === true, 'menu: the trigger announces that it is expanded')
    check(named(tree, 'menu', 'Acciones de la inscripción'), 'menu: the menu has a name')
    check(ofRole(tree, 'menuitem').length >= 4 && named(tree, 'menuitem', 'Reenviar correo')?.props.disabled === true, 'menu: items are announced, and the disabled one as unavailable')
    check((await focusedText(page)) === 'Ver detalle', 'menu: focus lands on the first item')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    check((await focusedText(page)) === 'Acciones' && named(await axTree(page), 'button', 'Acciones')?.props.expanded === false, 'menu: Escape closes it and returns focus to the trigger')
  }

  // ── Combobox: popup, active option ─────────────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'combobox')
    const combo = page.getByRole('combobox')
    let node = named(await axTree(page), 'combobox', 'País de residencia')
    check(node?.props.hasPopup === 'listbox' && node.props.autocomplete === 'list' && node.props.expanded === false, 'combobox: announces a list popup with autocomplete, collapsed')
    await combo.focus()
    await page.keyboard.type('a')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(250)
    const tree = await axTree(page)
    node = named(tree, 'combobox', 'País de residencia')
    check(node?.props.expanded === true, 'combobox: announces that the list opened')
    const options = ofRole(tree, 'option')
    check(options.length > 1 && options.every((o) => o.name), 'combobox: every option has a name')
    const active = await combo.getAttribute('aria-activedescendant')
    check(active && (await page.locator(`[id="${active}"][role=option]`).count()) === 1, 'combobox: the highlighted option is exposed through aria-activedescendant')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(250)
    check(named(await axTree(page), 'combobox', 'País de residencia')?.props.expanded === false, 'combobox: Escape collapses the list')
  }

  // ── Toast: polite for news, assertive for errors ───────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'toast', async (p) => {
      await p.getByRole('button', { name: 'Guardar cambios' }).click()
      await p.getByRole('button', { name: 'Simular error' }).click()
    })
    const live = await liveText(page)
    const ok = live.find((l) => l.text.includes('Cambios guardados'))
    const err = live.find((l) => l.text.includes('No pudimos guardar'))
    check(ok && (ok.role === 'status' || ok.live === 'polite'), 'toast: a success message is announced politely (status)')
    check(err && (err.role === 'alert' || err.live === 'assertive'), 'toast: an error is announced at once (alert)')
    check(ok && /Deshacer/.test(ok.text), 'toast: the undo action sits inside the announced message')
  }

  // ── Footnote: calls and notes in Spanish ───────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'footnote')
    const tree = await axTree(page)
    const call = named(tree, 'link', 'Nota 1')
    check(call && call.props.url?.endsWith('#fn-1'), 'footnote: a call is a link named "Nota 1" that goes to its note')
    check(tree.some((n) => n.name === 'Notas' && ['region', 'doc-endnotes'].includes(n.role)), 'footnote: the notes form a landmark named "Notas"')
    check(ofRole(tree, 'link').filter((l) => l.name === 'Volver al texto').length === 2, 'footnote: every note has a "Volver al texto" link')
  }

  // ── Calendar: grid, dates, and the month change ────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'calendar')
    let tree = await axTree(page)
    check(named(tree, 'grid', 'Octubre de 2026'), 'calendar: the grid is named by its month')
    check(ofRole(tree, 'gridcell').filter((c) => /^\p{L}+, \d+ de octubre de 2026$/u.test(c.name)).length >= 28, 'calendar: every day is announced with weekday, day, month and year')
    check(named(tree, 'button', 'Mes anterior') && named(tree, 'button', 'Mes siguiente'), 'calendar: the month buttons have names')
    await page.getByRole('button', { name: 'Mes siguiente' }).click()
    await page.waitForTimeout(250)
    tree = await axTree(page)
    check(named(tree, 'grid', 'Noviembre de 2026'), 'calendar: the grid name follows the month')
    const announced = (await liveText(page)).some((l) => /noviembre de 2026/i.test(l.text)) // the text is lower case; CSS capitalises the first letter
    check(announced, 'calendar: changing month is announced (focus stays on the button, so the new month must reach a live region)')
  }

  // ── NotificationCenter: the count is in the name ───────────────────────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'notification-center'))
    const unread = named(tree, 'button', /^Notificaciones, \d+ sin leer$/)
    check(unread?.props.hasPopup === 'dialog' && unread.props.expanded === false, 'notification centre: the trigger names the unread count and announces a collapsed popup')
  }
})

finish()
