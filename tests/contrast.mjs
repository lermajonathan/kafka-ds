// WCAG 2.2 contrast check for every token pair Kafka promises, light and dark.
//   READING (7:1, AAA) for long-form text · TEXT (4.5:1) for UI text · UI (3:1) for non-text (1.4.11)
// Both modes are blocking. Pure Node: reads tokens/*.json, resolves aliases per mode.
import fs from 'node:fs'

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../tokens/${f}.json`, import.meta.url), 'utf8'))
const tokens = new Map()
const walk = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    tokens.set(path.join('.'), { value: node.$value, dark: node.$extensions?.['kafka.modes']?.dark })
    return
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...path, k])
}
for (const tier of ['primitives', 'semantic', 'components']) walk(read(tier), [])

const resolve = (path, mode, depth = 0) => {
  const t = tokens.get(path)
  if (!t) throw new Error(`Unknown token ${path}`)
  if (depth > 20) throw new Error(`Alias loop at ${path}`)
  const raw = mode === 'dark' && t.dark !== undefined ? t.dark : t.value
  const m = typeof raw === 'string' && raw.match(/^\{([^}]+)\}$/)
  return m ? resolve(m[1], mode, depth + 1) : raw
}
const parse = (c) => {
  const h = String(c).trim().replace('#', '')
  const f = h.length === 3 ? [...h].map((x) => x + x).join('') : h
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16))
}
const lum = ([r, g, b]) => {
  const ch = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
}
export const ratio = (fgPath, bgPath, mode) => {
  const [a, b] = [lum(parse(resolve(fgPath, mode))), lum(parse(resolve(bgPath, mode)))].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

const READING = 7, TEXT = 4.5, UI = 3
const pairs = []
for (const bg of ['page', 'surface']) {
  pairs.push(['color.reading.text', `color.bg.${bg}`, READING, `reading text on bg.${bg}`])
  pairs.push(['color.reading.text-secondary', `color.bg.${bg}`, READING, `secondary reading text on bg.${bg}`])
}
pairs.push(['color.reading.text', 'color.reading.bg', READING, 'reading text on reading bg'])
for (const bg of ['page', 'surface', 'sunken']) {
  for (const fg of ['default', 'soft', 'muted']) pairs.push([`color.fg.${fg}`, `color.bg.${bg}`, TEXT, `fg.${fg} on bg.${bg}`])
  pairs.push([`color.fg.brand`, `color.bg.${bg}`, TEXT, `brand text on bg.${bg}`], [`color.fg.link`, `color.bg.${bg}`, TEXT, `link on bg.${bg}`])
}
pairs.push(
  ['color.fg.inverse', 'color.bg.inverse', TEXT, 'inverse text on inverse bg'],
  ['color.border.focus', 'color.bg.page', UI, 'focus ring on page'],
  ['color.border.focus', 'color.bg.surface', UI, 'focus ring on surface'],
  ['article.text', 'article.bg', READING, 'article text on article bg'],
  // Oro como superficie y bordes de marca
  ['color.fg.on-brand', 'color.bg.brand', TEXT, 'text on gold surface'],
  ['color.border.brand', 'color.bg.page', UI, 'brand border on page'],
  ['color.border.brand', 'color.bg.surface', UI, 'brand border on surface'],
  ['color.border.strong', 'color.bg.page', UI, 'strong border on page'],
  ['color.border.strong', 'color.bg.surface', UI, 'strong border on surface'],
  // Componentes
  ['button.primary.fg', 'button.primary.bg', TEXT, 'primary button label'],
  ['button.primary.fg', 'button.primary.bg-hover', TEXT, 'primary button label (hover)'],
  ['button.soft.fg', 'button.soft.bg', TEXT, 'soft button label'],
  ['button.outline.border', 'color.bg.surface', UI, 'outline button border'],
  ['badge.neutral.fg', 'badge.neutral.bg', TEXT, 'neutral badge'],
  ['badge.brand.fg', 'badge.brand.bg', TEXT, 'brand badge'],
  ['chip.fg', 'chip.bg', TEXT, 'chip label'],
  ['chip.selected-fg', 'chip.selected-bg', TEXT, 'selected chip label'],
  ['news.kind-fg', 'news.kind-bg', TEXT, 'news kind tile'],
  ['news.border', 'news.bg', UI, 'news border'],
  ['segmented-control.fg', 'segmented-control.track-bg', TEXT, 'segmented option'],
  ['segmented-control.fg-hover', 'segmented-control.track-bg', TEXT, 'segmented option on hover'],
  ['segmented-control.active-fg', 'segmented-control.active-bg', TEXT, 'segmented active option'],
  ['segmented-control.active-border', 'segmented-control.track-bg', UI, 'segmented active edge'],
  ['radio-card.label-fg', 'radio-card.bg', TEXT, 'radio card label'],
  ['radio-card.description-fg', 'radio-card.bg', TEXT, 'radio card description'],
  ['radio-card.label-fg', 'radio-card.hover-bg', TEXT, 'radio card label on hover'],
  ['radio-card.description-fg', 'radio-card.hover-bg', TEXT, 'radio card description on hover'],
  ['radio-card.border', 'color.bg.page', UI, 'radio card border on page'],
  ['radio-card.checked-border', 'color.bg.page', UI, 'radio card selected border on page'],
  ['radio-card.icon-fg', 'radio-card.icon-bg', UI, 'radio card icon'],
  ['input-group.addon-fg', 'input-group.addon-bg', TEXT, 'input group addon'],
  ['input.border', 'input-group.addon-bg', UI, 'input group addon edge'],
  ['inline-edit.fg', 'color.bg.page', TEXT, 'inline edit value'],
  ['inline-edit.fg', 'inline-edit.hover-bg', TEXT, 'inline edit value on hover'],
  ['inline-edit.icon', 'color.bg.page', UI, 'inline edit pencil'],
  ['nav-menu.fg', 'color.bg.page', TEXT, 'nav item'],
  ['nav-menu.fg-hover', 'nav-menu.hover-bg', TEXT, 'nav item on hover'],
  ['nav-menu.fg', 'nav-menu.hover-bg', TEXT, 'nav item text while hovered'],
  ['nav-menu.active-fg', 'nav-menu.active-bg', TEXT, 'current nav item'],
  ['nav-menu.indicator', 'nav-menu.active-bg', UI, 'current nav item marker'],
  ['news.fg', 'news.bg', TEXT, 'news title'],
  ['news.soft-fg', 'news.bg', TEXT, 'news kind label and details'],
  ['news.dot-bg', 'news.bg', UI, 'news inactive dot'],
  ['news.dot-active', 'news.bg', UI, 'news active dot'],
  // VIP: texto fijo sobre los tres puntos del degradado y la insignia
  ['vip.fg', 'color.gold.100', TEXT, 'VIP text on gradient start'],
  ['vip.fg', 'color.gold.300', TEXT, 'VIP text on gradient middle'],
  ['vip.fg', 'color.gold.500', TEXT, 'VIP text on gradient end'],
  ['vip.badge-fg', 'vip.badge-bg', TEXT, 'VIP badge'],
  // Estados: hover y pulsado nunca bajan el contraste del texto
  ['color.fg.default', 'color.bg.hover', TEXT, 'text on bg.hover'],
  ['color.fg.default', 'color.bg.active', TEXT, 'text on bg.active'],
  ['color.fg.default', 'color.bg.sunken-hover', TEXT, 'text on bg.sunken-hover'],
  ['color.fg.default', 'color.bg.sunken-active', TEXT, 'text on bg.sunken-active'],
  ['color.fg.on-brand', 'color.bg.brand-hover', TEXT, 'on-brand text on gold (hover)'],
  ['color.fg.on-brand', 'color.bg.brand-active', TEXT, 'on-brand text on gold (active)'],
  ['button.soft.fg', 'button.soft.bg-hover', TEXT, 'soft button label (hover)'],
  ['button.soft.fg', 'button.soft.bg-active', TEXT, 'soft button label (active)'],
  ['button.outline.fg', 'button.outline.bg-hover', TEXT, 'outline button label (hover)'],
  ['button.primary.fg', 'button.primary.bg-active', TEXT, 'primary button label (active)'],
  ['chip.fg', 'chip.bg-hover', TEXT, 'chip label (hover)'],
  // Enlaces en todos sus estados
  ...['page', 'surface'].flatMap((bg) => [
    [`color.fg.link-hover`, `color.bg.${bg}`, TEXT, `link hover on bg.${bg}`],
    [`color.fg.link-visited`, `color.bg.${bg}`, TEXT, `visited link on bg.${bg}`],
  ]),
  // Selección y marca de texto
  ['color.selection.fg', 'color.selection.bg', READING, 'selected text'],
  ['color.highlight.fg', 'color.highlight.bg', READING, 'highlighted text (mark)'],
  // Lectura: progreso, cita y capitular
  ['color.reading.progress-fill', 'color.bg.page', UI, 'progress fill on page'],
  ['color.reading.progress-fill', 'color.bg.surface', UI, 'progress fill on surface'],
  ['color.reading.quote-rule', 'color.bg.page', UI, 'pull-quote rule on page'],
  ['color.reading.dropcap', 'color.bg.page', TEXT, 'drop cap on page'],
  // H2 · componentes de lectura
  ['prose.link', 'prose.rule', TEXT, 'prose link on prose rule (decorative neighbour)'],
  ['prose.text', 'color.bg.page', READING, 'prose text on page'],
  ['prose.link-hover', 'color.bg.page', READING, 'prose link hover on page'],
  ['pull-quote.text', 'color.bg.page', READING, 'pull quote on page'],
  ['pull-quote.attribution', 'color.bg.page', READING, 'pull quote attribution on page'],
  ['pull-quote.rule', 'color.bg.page', UI, 'pull quote rule on page'],
  ['footnote.ref-fg', 'footnote.ref-hover-bg', TEXT, 'footnote call (hover)'],
  ['footnote.text', 'color.bg.page', READING, 'footnote text on page'],
  ['footnote.target-fg', 'footnote.target-bg', READING, 'targeted footnote'],
  ['verse.text', 'color.bg.page', READING, 'verse on page'],
  ['epigraph.text', 'color.bg.page', TEXT, 'epigraph on page'],
  ['epigraph.attribution', 'color.bg.page', TEXT, 'epigraph attribution on page'],
  ['drop-cap.fg', 'color.bg.page', TEXT, 'drop cap on page'],
  ['reading-progress.fill', 'color.bg.page', UI, 'progress fill on page'],
  ['toc.link', 'color.bg.page', TEXT, 'toc link on page'],
  ['toc.link', 'toc.hover-bg', TEXT, 'toc link (hover)'],
  ['toc.link-hover', 'toc.hover-bg', TEXT, 'toc link hover text'],
  ['toc.current-rule', 'color.bg.page', UI, 'toc current marker on page'],
  ['toc.title', 'color.bg.page', TEXT, 'toc title on page'],
  ['reading-settings.option-fg', 'reading-settings.option-bg', TEXT, 'setting option'],
  ['reading-settings.option-fg', 'reading-settings.option-hover-bg', TEXT, 'setting option (hover)'],
  ['reading-settings.option-selected-fg', 'reading-settings.option-selected-bg', TEXT, 'selected setting option'],
  ['reading-settings.option-border', 'reading-settings.bg', UI, 'setting option border'],
  ['reading-settings.legend', 'reading-settings.bg', TEXT, 'settings group legend'],
  ['prev-next.title', 'prev-next.bg', TEXT, 'pager title'],
  ['prev-next.title', 'prev-next.bg-hover', TEXT, 'pager title (hover)'],
  ['prev-next.direction', 'prev-next.bg', TEXT, 'pager caption'],
  ['prev-next.direction', 'prev-next.bg-hover', TEXT, 'pager caption (hover)'],
  ['figure.caption', 'color.bg.page', TEXT, 'figure caption'],
  ['figure.credit', 'color.bg.page', TEXT, 'figure credit'],
  ['author.avatar-fg', 'author.avatar-bg', TEXT, 'author initials'],
  ['author.role', 'color.bg.page', TEXT, 'author role'],
  ['author.bio', 'color.bg.page', TEXT, 'author bio'],
  ['reading-time.fg', 'color.bg.page', TEXT, 'reading time'],
  ['embed.caption', 'color.bg.page', TEXT, 'embed caption'],
  ['embed.facade-fg', 'embed.bg', TEXT, 'embed load button'],
  ['embed.border', 'color.bg.page', UI, 'embed border on page'],
  // Estados (H3): texto sobre su fondo y sobre las superficies, y borde contra la página
  ...['danger', 'success', 'warning', 'info'].flatMap((k) => [
    [`color.status.${k}.fg`, `color.status.${k}.bg`, TEXT, `${k} text on its tint`],
    [`color.status.${k}.fg`, 'color.bg.page', TEXT, `${k} text on page`],
    [`color.status.${k}.fg`, 'color.bg.surface', TEXT, `${k} text on surface`],
    [`color.status.${k}.border`, 'color.bg.page', UI, `${k} border on page`],
    [`color.status.${k}.border`, 'color.bg.surface', UI, `${k} border on surface`],
    [`color.status.${k}.border`, `color.status.${k}.bg`, UI, `${k} border on its tint`],
  ]),
  // H3 · controles de formulario y UI esencial
  ['input.fg', 'input.bg', READING, 'input text'],
  ['input.placeholder', 'input.bg', TEXT, 'input placeholder'],
  ['input.border', 'color.bg.page', UI, 'input border on page'],
  ['input.border', 'color.bg.surface', UI, 'input border on surface'],
  ['input.border-hover', 'color.bg.page', UI, 'input border (hover)'],
  ['input.invalid-border', 'color.bg.page', UI, 'input invalid border on page'],
  ['input.invalid-border', 'color.bg.surface', UI, 'input invalid border on surface'],
  ['input.icon', 'input.bg', UI, 'input icon'],
  ['field.label', 'color.bg.page', TEXT, 'field label'],
  ['field.hint', 'color.bg.page', TEXT, 'field hint'],
  ['field.error', 'color.bg.page', TEXT, 'field error on page'],
  ['field.error', 'color.bg.surface', TEXT, 'field error on surface'],
  ['field.required', 'color.bg.page', TEXT, 'field required mark'],
  ['select.icon', 'input.bg', UI, 'select chevron'],
  ['checkbox.border', 'color.bg.page', UI, 'checkbox border on page'],
  ['checkbox.border', 'color.bg.surface', UI, 'checkbox border on surface'],
  ['checkbox.checked-fg', 'checkbox.checked-bg', UI, 'checkbox mark on its fill'],
  ['checkbox.checked-bg', 'color.bg.page', UI, 'checkbox fill on page'],
  ['checkbox.invalid-border', 'color.bg.page', UI, 'checkbox invalid border'],
  ['checkbox.label', 'color.bg.page', TEXT, 'checkbox label'],
  ['checkbox.description', 'color.bg.page', TEXT, 'checkbox description'],
  ['radio.border', 'color.bg.page', UI, 'radio border on page'],
  ['radio.checked-fg', 'radio.checked-bg', UI, 'radio dot on its fill'],
  ['radio.checked-bg', 'color.bg.page', UI, 'radio fill on page'],
  ['radio.invalid-border', 'color.bg.page', UI, 'radio invalid border'],
  ['radio.label', 'color.bg.page', TEXT, 'radio label'],
  ['switch.track-border', 'color.bg.page', UI, 'switch track border on page'],
  ['switch.thumb', 'switch.track-bg', UI, 'switch thumb (off) on its track'],
  ['switch.thumb-on', 'switch.track-on-bg', UI, 'switch thumb (on) on its track'],
  ['switch.track-on-bg', 'color.bg.page', UI, 'switch track (on) on page'],
  ['switch.label', 'color.bg.page', TEXT, 'switch label'],
  ['switch.description', 'color.bg.page', TEXT, 'switch description'],
  ['slider.rail', 'color.bg.page', UI, 'slider rail on page'],
  ['slider.thumb-ring', 'slider.rail', UI, 'slider thumb ring on its rail'],
  ['slider.fill', 'color.bg.page', UI, 'slider fill on page'],
  ['slider.thumb', 'color.bg.page', UI, 'slider thumb on page'],
  ['slider.value', 'color.bg.page', TEXT, 'slider value'],
  ['tag-input.tag-fg', 'tag-input.tag-bg', TEXT, 'tag'],
  ['tag-input.tag-fg', 'tag-input.remove-hover-bg', TEXT, 'tag (remove hover)'],
  ['file-upload.border', 'color.bg.page', UI, 'dropzone border on page'],
  ['file-upload.drag-border', 'file-upload.drag-bg', UI, 'dropzone border while dragging'],
  ['color.fg.default', 'file-upload.drag-bg', TEXT, 'dropzone text while dragging'],
  ['file-upload.icon', 'file-upload.bg', UI, 'dropzone icon'],
  ['file-upload.hint', 'file-upload.bg', TEXT, 'dropzone hint'],
  ['file-upload.hint', 'file-upload.bg-hover', TEXT, 'dropzone hint (hover)'],
  ['file-upload.hint', 'file-upload.item-bg', TEXT, 'file row size'],
  ['file-upload.error', 'color.bg.page', TEXT, 'dropzone error'],
  ['link.fg', 'color.bg.page', TEXT, 'link on page'],
  ['link.fg-hover', 'color.bg.page', TEXT, 'link hover on page'],
  ['link.fg-visited', 'color.bg.page', TEXT, 'visited link on page'],
  ...['info', 'success', 'warning', 'danger'].flatMap((k) => [
    [`badge.${k}.fg`, `badge.${k}.bg`, TEXT, `${k} badge text`],
    [`badge.${k}.border`, 'color.bg.page', UI, `${k} badge border on page`],
  ]),
  // H4 · navegación y capas
  ['tabs.tab-fg', 'color.bg.page', TEXT, 'tab text on page'],
  ['tabs.tab-fg', 'tabs.tab-hover-bg', TEXT, 'tab text on hover'],
  ['tabs.tab-fg-selected', 'color.bg.page', TEXT, 'selected tab text'],
  ['tabs.indicator', 'color.bg.page', UI, 'selected tab indicator'],
  ['tabs.list-border', 'color.bg.page', 1, 'tab list rule (decorative)'],
  ['accordion.trigger-fg', 'color.bg.page', TEXT, 'accordion title'],
  ['accordion.trigger-fg', 'accordion.trigger-hover-bg', TEXT, 'accordion title on hover'],
  ['accordion.icon', 'color.bg.page', UI, 'accordion chevron'],
  ['accordion.panel-fg', 'color.bg.page', TEXT, 'accordion panel text'],
  ['breadcrumbs.fg', 'color.bg.page', TEXT, 'breadcrumb link'],
  ['breadcrumbs.current', 'color.bg.page', TEXT, 'breadcrumb current page'],
  ['breadcrumbs.separator', 'color.bg.page', UI, 'breadcrumb separator'],
  ['pagination.fg', 'color.bg.page', TEXT, 'page number'],
  ['pagination.fg', 'pagination.hover-bg', TEXT, 'page number on hover'],
  ['pagination.current-fg', 'pagination.current-bg', TEXT, 'current page number'],
  ['pagination.ellipsis', 'color.bg.page', TEXT, 'pagination ellipsis'],
  ['stepper.marker-fg', 'stepper.marker-bg', TEXT, 'step number'],
  ['stepper.marker-border', 'color.bg.page', UI, 'step marker border'],
  ['stepper.current-fg', 'stepper.current-bg', TEXT, 'current step number'],
  ['stepper.done-fg', 'stepper.done-bg', UI, 'done step check on its fill'],
  ['stepper.done-border', 'color.bg.page', UI, 'done step border on page'],
  ['stepper.label', 'color.bg.page', TEXT, 'step label'],
  ['stepper.label-muted', 'color.bg.page', TEXT, 'upcoming step label'],
  ['popover.fg', 'popover.bg', TEXT, 'popover text'],
  ['popover.border', 'color.bg.page', 1, 'popover border (decorative, shadow carries it)'],
  ['menu.item-fg', 'menu.bg', TEXT, 'menu item'],
  ['menu.item-fg', 'menu.item-hover-bg', TEXT, 'menu item on hover'],
  ['menu.item-fg', 'menu.item-active-bg', TEXT, 'menu item pressed'],
  ['menu.danger-fg', 'menu.bg', TEXT, 'danger menu item'],
  ['menu.danger-fg', 'menu.item-hover-bg', TEXT, 'danger menu item on hover'],
  ['combobox.option-fg', 'combobox.list-bg', TEXT, 'option'],
  ['combobox.option-fg', 'combobox.option-active-bg', TEXT, 'active option'],
  ['combobox.option-fg', 'combobox.option-selected-bg', TEXT, 'selected option'],
  ['combobox.empty', 'combobox.list-bg', TEXT, 'no results message'],
  ['tooltip.fg', 'tooltip.bg', TEXT, 'tooltip text'],
  ['modal.fg', 'modal.bg', TEXT, 'dialog text'],
  ['modal.description', 'modal.bg', TEXT, 'dialog description'],
  ['calendar.range-fg', 'calendar.range-bg', TEXT, 'day inside a range'],
  ['calendar.range-fg', 'calendar.bg', TEXT, 'range day text on the panel'],
  ['calendar.selected-bg', 'calendar.range-bg', UI, 'range edge against the band'],
  ['calendar.fg', 'calendar.bg', TEXT, 'calendar day'],
  ['calendar.fg', 'calendar.hover-bg', TEXT, 'calendar day on hover'],
  ['calendar.weekday', 'calendar.bg', TEXT, 'calendar weekday'],
  ['calendar.selected-fg', 'calendar.selected-bg', TEXT, 'selected day'],
  ['calendar.today-border', 'calendar.bg', UI, 'today marker'],
  ['alert.info.fg', 'alert.info.bg', TEXT, 'info alert title'],
  ['alert.success.fg', 'alert.success.bg', TEXT, 'success alert title'],
  ['alert.warning.fg', 'alert.warning.bg', TEXT, 'warning alert title'],
  ['alert.danger.fg', 'alert.danger.bg', TEXT, 'danger alert title'],
  ['alert.fg', 'alert.info.bg', TEXT, 'alert body on info'],
  ['alert.fg', 'alert.success.bg', TEXT, 'alert body on success'],
  ['alert.fg', 'alert.warning.bg', TEXT, 'alert body on warning'],
  ['alert.fg', 'alert.danger.bg', TEXT, 'alert body on danger'],
  ['alert.info.border', 'color.bg.page', UI, 'info alert border'],
  ['alert.success.border', 'color.bg.page', UI, 'success alert border'],
  ['alert.warning.border', 'color.bg.page', UI, 'warning alert border'],
  ['alert.danger.border', 'color.bg.page', UI, 'danger alert border'],
  ['divider.label-fg', 'color.bg.page', TEXT, 'divider label'],
  ['divider.color', 'color.bg.page', 1, 'divider rule (decorative)'],
  ['skeleton.bg', 'color.bg.page', 1.4, 'skeleton shape on the page (decorative, but it must be seen in both modes)'],
  ['skeleton.bg', 'color.bg.surface', 1.4, 'skeleton shape on a card (decorative, but it must be seen in both modes)'],
  ['empty-state.title-fg', 'color.bg.page', TEXT, 'empty state title'],
  ['empty-state.description-fg', 'color.bg.page', TEXT, 'empty state description'],
  ['empty-state.icon-fg', 'color.bg.page', UI, 'empty state icon'],
  ['panel.title-fg', 'panel.bg', TEXT, 'panel title'],
  ['panel.description-fg', 'panel.bg', TEXT, 'panel description'],
  ['panel.border', 'color.bg.page', 1, 'panel border (decorative; content is the boundary)'],
  ['panel.toggle-fg', 'panel.bg', UI, 'panel collapse chevron'],
  ['panel.toggle-fg', 'panel.toggle-hover-bg', UI, 'panel chevron on hover'],
  ['panel.icon.brand.fg', 'panel.icon.brand.bg', UI, 'panel icon (brand)'],
  ['panel.icon.info.fg', 'panel.icon.info.bg', UI, 'panel icon (info)'],
  ['panel.icon.success.fg', 'panel.icon.success.bg', UI, 'panel icon (success)'],
  ['panel.icon.warning.fg', 'panel.icon.warning.bg', UI, 'panel icon (warning)'],
  ['panel.icon.danger.fg', 'panel.icon.danger.bg', UI, 'panel icon (danger)'],
  ['avatar.fg', 'avatar.bg', TEXT, 'avatar initials'],
  ['avatar.overflow-fg', 'avatar.overflow-bg', TEXT, 'avatar group +N'],
  ['avatar.status-online', 'avatar.ring', UI, 'online dot'],
  ['avatar.status-away', 'avatar.ring', UI, 'away dot'],
  ['avatar.status-busy', 'avatar.ring', UI, 'busy dot'],
  ['avatar.status-offline', 'avatar.ring', UI, 'offline dot'],
  ['progress.fill.brand', 'progress.track', UI, 'progress fill (brand) on track'],
  ['progress.fill.success', 'progress.track', UI, 'progress fill (success) on track'],
  ['progress.fill.warning', 'progress.track', UI, 'progress fill (warning) on track'],
  ['progress.fill.danger', 'progress.track', UI, 'progress fill (danger) on track'],
  ['progress.track', 'color.bg.page', 1, 'progress track (decorative)'],
  ['progress.value-fg', 'color.bg.page', TEXT, 'progress value'],
  ['progress.label-fg', 'color.bg.page', TEXT, 'progress label'],
  ['spinner.arc', 'color.bg.page', UI, 'spinner arc'],
  ['spinner.arc', 'color.bg.surface', UI, 'spinner arc on a surface'],
  ['toast.info.fg', 'toast.info.bg', TEXT, 'info toast title'],
  ['toast.fg', 'toast.info.bg', TEXT, 'toast body on info'],
  ['toast.action', 'toast.info.bg', TEXT, 'toast action on info'],
  ['toast.info.border', 'color.bg.page', UI, 'info toast border'],
  ['toast.success.fg', 'toast.success.bg', TEXT, 'success toast title'],
  ['toast.fg', 'toast.success.bg', TEXT, 'toast body on success'],
  ['toast.action', 'toast.success.bg', TEXT, 'toast action on success'],
  ['toast.success.border', 'color.bg.page', UI, 'success toast border'],
  ['toast.warning.fg', 'toast.warning.bg', TEXT, 'warning toast title'],
  ['toast.fg', 'toast.warning.bg', TEXT, 'toast body on warning'],
  ['toast.action', 'toast.warning.bg', TEXT, 'toast action on warning'],
  ['toast.warning.border', 'color.bg.page', UI, 'warning toast border'],
  ['toast.danger.fg', 'toast.danger.bg', TEXT, 'danger toast title'],
  ['toast.fg', 'toast.danger.bg', TEXT, 'toast body on danger'],
  ['toast.action', 'toast.danger.bg', TEXT, 'toast action on danger'],
  ['toast.danger.border', 'color.bg.page', UI, 'danger toast border'],
  ['count-badge.fg', 'count-badge.bg', TEXT, 'count badge number'],
  ['count-badge.danger-fg', 'count-badge.danger-bg', TEXT, 'count badge number, danger tone'],
  ['notification-center.title-fg', 'popover.bg', TEXT, 'notification title'],
  ['notification-center.title-fg', 'notification-center.unread-bg', TEXT, 'unread notification title'],
  ['notification-center.body-fg', 'popover.bg', TEXT, 'notification body'],
  ['notification-center.body-fg', 'notification-center.unread-bg', TEXT, 'unread notification body'],
  ['notification-center.time-fg', 'popover.bg', TEXT, 'notification time'],
  ['notification-center.empty-fg', 'popover.bg', TEXT, 'no notifications message'],
  ['notification-center.action', 'popover.bg', TEXT, 'mark all as read'],
  ['notification-center.rule', 'popover.bg', 1, 'notification rule (decorative)'],
  ['notification-center.icon.brand.fg', 'notification-center.icon.brand.bg', UI, 'notification icon (brand)'],
  ['notification-center.icon.success.fg', 'notification-center.icon.success.bg', UI, 'notification icon (success)'],
  ['notification-center.icon.warning.fg', 'notification-center.icon.warning.bg', UI, 'notification icon (warning)'],
  ['notification-center.icon.danger.fg', 'notification-center.icon.danger.bg', UI, 'notification icon (danger)'],
  ['button.vip.fg', 'button.vip.bg', TEXT, 'VIP button label'],
  ['button.vip.fg', 'button.vip.bg-hover', TEXT, 'VIP button label on hover'],
  ['button.vip.fg', 'button.vip.bg-active', TEXT, 'VIP button label when pressed'],
  ['button.vip.bg', 'color.gold.500', UI, 'VIP button on the darkest gold of the card'],
  ['button.vip.bg', 'color.gold.100', UI, 'VIP button on the lightest gold of the card'],
  ['program-card.title-fg', 'program-card.scrim', TEXT, 'program title over the scrim'],
  ['program-card.subtitle-fg', 'program-card.scrim', TEXT, 'program subtitle over the scrim'],
  ['program-card.price-fg', 'program-card.price-bg', TEXT, 'price pill'],
  ['program-card.price-bg', 'program-card.media-bg', UI, 'price pill over the cover'],
  ['color.fg.on-brand', 'color.bg.brand', TEXT, 'program badge on gold'],
  // The brand gold itself is only a text colour on ink, never on paper
  ['color.gold.400', 'color.ink.900', READING, 'brand gold on ink (dark surfaces)'],
)

if (import.meta.url === `file://${process.argv[1]}`) {
  let failures = 0
  for (const mode of ['light', 'dark']) {
    // the brand-gold-on-ink pair is mode-independent; run it once
    const list = pairs.filter(([f]) => mode === 'light' || f !== 'color.gold.400')
    const fails = list.filter(([f, b, min]) => ratio(f, b, mode) + 1e-9 < min)
    failures += fails.length
    console.log(`\n${mode.toUpperCase()} · ${list.length - fails.length}/${list.length} pairs pass`)
    for (const [f, b, min, what] of fails) console.log(`  ✗ ${ratio(f, b, mode).toFixed(2)}:1 < ${min}:1  ${what}`)
  }
  process.exit(failures ? 1 : 0)
}
