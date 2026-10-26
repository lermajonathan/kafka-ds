const N = 'Components/nav-menu/'
const comps = []
const ICON = { Personas: 'People', Talleres: 'Pen', Pagos: 'Success', Reportes: 'File' }
const item = (t, kind, collapsed) => ({ frame: true, name: kind === 'dis' ? 'Item Disabled' : 'Item', dir: 'HORIZONTAL', align: 'CENTER', gap: N + 'item-gap', px: N + 'item-padding-x', radius: N + 'item-radius', minHeight: 44, minHeightVar: N + 'item-min-height', fillWidth: true,
  fill: kind === 'act' ? N + 'active-bg' : kind === 'hov' ? N + 'hover-bg' : null,
  children: [
    ...(kind === 'act' ? [{ frame: true, name: 'Indicator', width: 4, height: 24, wvar: N + 'indicator-width', fill: N + 'indicator', children: [] }] : []),
    { icon: ICON[t] || 'File', size: 20, fill: kind === 'act' ? N + 'active-fg' : N + 'fg' },
    ...(collapsed ? [] : [{ text: t, style: 'UI/Label', fill: kind === 'act' ? N + 'active-fg' : kind === 'hov' ? N + 'fg-hover' : N + 'fg', fillWidth: true }])] })
const child = (t, act) => ({ frame: true, name: 'Child', dir: 'HORIZONTAL', align: 'CENTER', px: N + 'item-padding-x', radius: N + 'item-radius', minHeight: 44, minHeightVar: N + 'item-min-height', fillWidth: true, fill: act ? N + 'active-bg' : null, children: [{ text: t, style: 'UI/Label', fill: act ? N + 'active-fg' : N + 'fg' }] })
const group = { frame: true, name: 'Children', dir: 'VERTICAL', pl: N + 'child-indent', gap: N + 'list-gap', fillWidth: true, children: [child('Narrativa', true), child('Poesía', false)] }
const variants = [
  ['State=Default', 260, [item('Personas', 'act'), item('Talleres', 'hov'), item('Pagos', 'n'), item('Reportes', 'dis')]],
  ['State=Group open', 260, [item('Personas', 'n'), item('Talleres', 'n'), group, item('Pagos', 'n')]],
  ['State=Collapsed', 68, [item('Personas', 'act', true), item('Talleres', 'n', true), item('Pagos', 'n', true)]]]
for (const [name, w, kids] of variants) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: N + 'list-gap', width: w, children: kids }, host)
  c.findAll((n) => n.name === 'Item Disabled').forEach((n) => n.setBoundVariable('opacity', H.V.get(N + 'disabled-opacity')))
  comps.push(c)
}
return [H.variants(comps, 'NavMenu', host)]
