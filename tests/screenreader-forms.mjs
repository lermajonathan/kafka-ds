// Screen reader tree, forms: what a reader is told when a person fills in a form (H8, DDR-KF-004 criterion 3).
// Field, Combobox and the date pickers' calendar are in tests/screenreader.mjs; see tests/lib/ax.mjs for how the tree is read.
//   node tests/screenreader-forms.mjs
import { withBrowser } from './lib/server.mjs'
import { axTree, checker, example, liveText, named, ofRole } from './lib/ax.mjs'

const { check, finish } = checker('screen reader (forms)', 'Screen reader tree, forms: names, groups, states and announcements are as expected')
const flag = (node, key) => String(node?.props[key]) === 'true'

await withBrowser(async (browser) => {
  // ── Input, Textarea, Select: a name each, the hint as description ──────────────────────────────────────────
  {
    const tree = await axTree(await example(browser, 'input'))
    check(named(tree, 'textbox', 'Nombre completo') && named(tree, 'textbox', 'Ciudad'), 'input: every input has a name')
    check(named(tree, 'textbox', 'Código')?.props.disabled === true, 'input: a disabled input is announced as unavailable')
  }
  {
    const tree = await axTree(await example(browser, 'textarea'))
    const area = named(tree, 'textbox', 'Cuéntanos por qué quieres participar')
    check(area?.description === 'Una o dos frases bastan.' && area.props.multiline === true, 'textarea: multi-line, with the hint as its description')
  }
  {
    const tree = await axTree(await example(browser, 'select'))
    const select = named(tree, 'combobox', 'Modalidad')
    check(select, 'select: the native select has a name')
    check(ofRole(tree, 'option').map((o) => o.name).join('|') === 'Elige una opción|Virtual|Presencial', 'select: options are announced in order')
    check(named(tree, 'option', 'Elige una opción')?.props.disabled === true, 'select: the placeholder option cannot be chosen')
  }

  // ── Checkbox, CheckboxGroup, Radio, RadioCard: group name, state, error ────────────────────────────────────
  {
    const page = await example(browser, 'checkbox')
    let tree = await axTree(page)
    const parent = named(tree, 'checkbox', 'Todos los talleres')
    check(parent?.props.checked === 'mixed', 'checkbox: a parent with some children checked is announced as mixed')
    check(named(tree, 'checkbox', /^Quiero recibir novedades.*Un correo al mes/), 'checkbox: the hint is read with the label')
    check(flag(named(tree, 'checkbox', 'Con error'), 'invalid'), 'checkbox: an error is announced as invalid')
    check(named(tree, 'checkbox', 'No disponible')?.props.disabled === true, 'checkbox: disabled is announced')
    await page.getByRole('checkbox', { name: 'Acepto las bases' }).focus()
    await page.keyboard.press('Space')
    tree = await axTree(page)
    check(flag(named(tree, 'checkbox', 'Acepto las bases'), 'checked'), 'checkbox: Space checks it and the tree says so')
  }
  {
    const tree = await axTree(await example(browser, 'checkbox-group'))
    check(named(tree, 'group', 'Talleres de interés'), 'checkbox group: the group has a name')
    const required = named(tree, 'group', /^Días disponibles/)
    check(required?.name === 'Días disponibles (obligatorio)' && required.description.includes('Elige al menos'), 'checkbox group: required, with the error as description of the group')
    check(['Lunes', 'Miércoles', 'Viernes'].every((d) => flag(named(tree, 'checkbox', d), 'invalid')), 'checkbox group: every box of a group with an error is invalid')
    check(named(tree, 'checkbox', 'Seleccionar todos')?.props.checked === 'mixed', 'checkbox group: "select all" is mixed when some are checked')
  }
  {
    const tree = await axTree(await example(browser, 'radio'))
    const group = named(tree, 'group', '¿Cómo quieres tomar el taller?')
    check(group?.description === 'Puedes cambiarlo hasta una semana antes.', 'radio: the group is named and its hint is its description')
    check(ofRole(tree, 'radio').filter((r) => flag(r, 'checked')).length === 1, 'radio: exactly one option is announced as checked')
    check(named(tree, 'radio', 'Mixto')?.props.disabled === true, 'radio: a disabled option is announced as unavailable')
    check(flag(named(tree, 'radio', 'Taller'), 'invalid') && named(tree, 'group', /^Plan/)?.description.includes('Elige un plan'), 'radio: with an error, every option is invalid and the group carries the message')
  }
  {
    const page = await example(browser, 'radio-card')
    const tree = await axTree(page)
    check(named(tree, 'group', 'Elige tu plan')?.description === 'Puedes cambiarlo antes de pagar.', 'radio card: the group is named, with its hint')
    check(flag(named(tree, 'radio', 'Temporada'), 'checked') && named(tree, 'radio', 'Temporada')?.description.includes('Tres talleres'), 'radio card: the checked card says so and its text is the description')
    check(named(tree, 'radio', 'Club de lectura')?.props.disabled === true, 'radio card: a disabled card is announced as unavailable')
    await page.getByRole('radio', { name: 'Taller suelto' }).focus()
    await page.keyboard.press('Space')
    check(flag(named(await axTree(page), 'radio', 'Taller suelto'), 'checked'), 'radio card: choosing a card moves the checked state to it')
  }

  // ── Switch, Slider, PinInput, ToggleButton ─────────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'switch')
    let tree = await axTree(page)
    check(flag(named(tree, 'switch', /^Recordatorios por correo/), 'checked'), 'switch: on is announced as checked, with the hint in the name')
    await page.getByRole('switch', { name: 'Boletín mensual' }).focus()
    await page.keyboard.press('Space')
    tree = await axTree(page)
    check(flag(named(tree, 'switch', 'Boletín mensual'), 'checked'), 'switch: Space turns it on and the tree says so')
    check(named(tree, 'switch', 'No disponible')?.props.disabled === true, 'switch: disabled is announced')
  }
  {
    const page = await example(browser, 'slider')
    const slider = page.getByRole('slider')
    let node = named(await axTree(page), 'slider', 'Sesiones por temporada')
    check(node?.props.valuemin === 1 && node.props.valuemax === 10 && node.props.orientation === 'horizontal', 'slider: min, max and orientation are exposed')
    await slider.focus()
    await page.keyboard.press('ArrowRight')
    const after = await slider.getAttribute('aria-valuenow') ?? await slider.inputValue()
    check(Number(after) === 5, `slider: ArrowRight raises the value by one (got ${after})`)
  }
  {
    const page = await example(browser, 'pin-input')
    const tree = await axTree(page)
    check(ofRole(tree, 'textbox').map((t) => t.name).join('|') === [1, 2, 3, 4, 5, 6].map((n) => `Dígito ${n} de 6`).join('|'), 'pin input: each digit says which one it is and how many there are')
    await page.getByRole('textbox', { name: 'Dígito 1 de 6' }).focus()
    await page.keyboard.type('7')
    check((await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Dígito 2 de 6', 'pin input: typing a digit moves focus to the next one')
  }
  {
    const page = await example(browser, 'toggle-button')
    const button = page.getByRole('button', { name: 'Seguir taller' }).first()
    check(String(named(await axTree(page), 'button', 'Seguir taller')?.props.pressed) !== 'true', 'toggle button: starts not pressed')
    await button.click()
    check(String(named(await axTree(page), 'button', 'Seguir taller')?.props.pressed) === 'true', 'toggle button: a press is announced as pressed')
  }

  // ── TagInput, FileUpload, InputGroup, InlineEdit ───────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'tag-input')
    let tree = await axTree(page)
    check(named(tree, 'textbox', 'Géneros que escribes')?.description === 'Escribe y pulsa Intro o coma.', 'tag input: the way to add a tag is the description')
    check(ofRole(tree, 'button').some((b) => /^Quitar poesía$/.test(b.name)), 'tag input: each tag has a "Quitar …" button that names the tag')
    await page.getByRole('textbox', { name: 'Géneros que escribes' }).fill('ensayo')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(250)
    check((await liveText(page)).some((l) => /ensayo/i.test(l.text)), 'tag input: adding a tag is announced in a live region')
  }
  {
    const tree = await axTree(await example(browser, 'file-upload'))
    const upload = named(tree, 'button', /^Tu relato/)
    check(upload && upload.description === 'PDF o Word, hasta 5 MB.', 'file upload: the control is a named button and the limits are its description')
  }
  {
    const tree = await axTree(await example(browser, 'input-group'))
    check(['Sitio web', 'Precio del taller', 'Buscar en la biblioteca', 'Ciudad'].every((n) => named(tree, 'textbox', n)), 'input group: every input keeps its own name next to the prefix, suffix or icon')
    check(named(tree, 'button', 'Buscar'), 'input group: the attached action has a name')
  }
  {
    const page = await example(browser, 'inline-edit')
    check(ofRole(await axTree(page), 'button').every((b) => b.name), 'inline edit: the value is a button that names what it edits')
    await page.getByRole('button', { name: /Título del relato/ }).click()
    await page.waitForTimeout(250)
    const tree = await axTree(page)
    const box = named(tree, 'textbox', /Título del relato/)
    check(box && (await page.evaluate(() => document.activeElement?.tagName)) === 'INPUT', 'inline edit: choosing it opens a named text box and moves focus there')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(250)
    check(ofRole(await axTree(page), 'textbox').length === 0, 'inline edit: Escape leaves the text box')
  }

  // ── SegmentedControl, ThemeToggle: a radio group ───────────────────────────────────────────────────────────
  for (const [id, group, first, second] of [['segmented-control', 'Vista del calendario', 'Día', 'Semana'], ['theme-toggle', 'Tema', 'Claro', 'Oscuro']]) {
    const page = await example(browser, id)
    let tree = await axTree(page)
    check(named(tree, 'radiogroup', group), `${id}: it is a radio group named "${group}"`)
    check(ofRole(tree, 'radio').filter((r) => flag(r, 'checked')).length >= 1, `${id}: the current option is announced as checked`)
    await page.getByRole('radio', { name: first }).first().focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(150)
    tree = await axTree(page)
    check(flag(named(tree, 'radio', second), 'checked'), `${id}: ArrowRight moves the choice to the next option`)
  }

  // ── DatePicker, DateRangePicker, RangeCalendar ─────────────────────────────────────────────────────────────
  {
    const page = await example(browser, 'date-picker')
    let tree = await axTree(page)
    check(named(tree, 'textbox', 'Fecha de inicio')?.description.includes('Escribe día/mes/año'), 'date picker: the way to type a date is the description of the field')
    const trigger = named(tree, 'button', 'Abrir calendario')
    check(trigger?.props.hasPopup === 'dialog' && trigger.props.expanded === false, 'date picker: the button announces a dialog popup, collapsed')
    await page.getByRole('button', { name: 'Abrir calendario' }).click()
    await page.waitForTimeout(300)
    tree = await axTree(page)
    check(ofRole(tree, 'grid').length === 1, 'date picker: opening it shows one calendar grid')
    check(named(tree, 'button', 'Abrir calendario')?.props.expanded === true, 'date picker: the button announces that it is expanded')
  }
  {
    const tree = await axTree(await example(browser, 'date-range-picker'))
    const filled = named(tree, 'button', /^Fechas del taller Del 10 de nov/)
    check(filled && /Del 10 de nov de 2026 al 20 de nov de 2026/.test(filled.name), 'date range picker: a chosen range is read in the name of the button')
    check(ofRole(tree, 'button').filter((b) => b.props.hasPopup === 'dialog').length === 3, 'date range picker: every trigger announces a dialog popup')
  }
  {
    const page = await example(browser, 'range-calendar')
    const tree = await axTree(page)
    check(ofRole(tree, 'grid').length === 2 && ofRole(tree, 'grid').every((g) => g.name === 'Noviembre de 2026'), 'range calendar: each grid is named by its month')
    check(ofRole(tree, 'button').filter((b) => b.props.disabled === true && /de noviembre de 2026$/.test(b.name)).length >= 5, 'range calendar: days outside the limits are announced as unavailable')
    const first = page.locator('[data-example="range-calendar/default"] button[data-iso]').nth(9)
    await first.click()
    await page.waitForTimeout(250)
    const live = await liveText(page)
    check(live.some((l) => l.text && /inicio|desde|primer|seleccion|elige/i.test(l.text)), `range calendar: choosing the first day is announced so the person knows to pick the last one (live regions: ${JSON.stringify(live.map((l) => l.text))})`)
  }
})

finish()
