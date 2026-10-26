const D = 'Components/drawer/'
const M = 'Components/modal/'
const B = 'Components/button/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const btn = (t, primary) => ({ frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: primary ? B + 'primary/bg' : null, stroke: primary ? null : B + 'outline/border', sw: 1, children: [{ text: t, style: 'UI/Button', fill: primary ? B + 'primary/fg' : B + 'outline/fg' }] })
const chip = (t, on) => ({ frame: true, name: 'Chip', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: 'Components/chip/padding-x', radius: 'Components/chip/radius', minHeight: 44, minHeightVar: 'Components/chip/min-height', fill: on ? 'Components/chip/selected-bg' : 'Components/chip/bg', stroke: on ? null : 'Components/chip/border', sw: 1, children: [{ text: t, style: 'UI/Label', fill: on ? 'Components/chip/selected-fg' : 'Components/chip/fg' }] })
// A real filters panel: title, a group of options, and the actions pinned to the foot
const body = [
  { text: 'Filtros', style: 'Reading/Heading MD', fill: M + 'fg', fillWidth: true },
  { text: 'Elige qué programas quieres ver.', style: 'UI/Input', fill: M + 'description', fillWidth: true },
  { frame: true, name: 'Group', dir: 'VERTICAL', gap: 8, fillWidth: true, children: [
    { text: 'Tipo de programa', style: 'UI/Label', fill: M + 'fg' },
    { frame: true, name: 'Chips', dir: 'HORIZONTAL', wrap: true, gap: 8, fillWidth: true, children: [chip('Talleres', true), chip('Seminarios', false), chip('Masterclass', false)] }] },
  { frame: true, name: 'Spacer', dir: 'VERTICAL', fillWidth: true, height: 8, children: [] },
  { frame: true, name: 'Actions', dir: 'HORIZONTAL', gap: M + 'actions-gap', justify: 'MAX', fillWidth: true, children: [btn('Limpiar', false), btn('Aplicar', true)] }]
// Desktop size: the side drawers are as tall as the screen; only the corners that face the page are rounded
for (const [name, w, h, corners] of [['Side=End', 388, 800, ['topLeftRadius', 'bottomLeftRadius']], ['Side=Start', 388, 800, ['topRightRadius', 'bottomRightRadius']], ['Side=Bottom', 960, 360, ['topLeftRadius', 'topRightRadius']]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: M + 'gap', p: M + 'padding', width: w, height: h, wvar: name === 'Side=Bottom' ? null : D + 'width', fill: M + 'bg', stroke: M + 'border', sw: 1, swvar: M + 'border-width', children: body }, host)
  for (const k of corners) c.setBoundVariable(k, H.V.get(D + 'radius'))
  const spacer = c.findOne((n) => n.name === 'Spacer'); spacer.layoutGrow = 1; spacer.layoutAlign = 'STRETCH'
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Drawer', host)]
