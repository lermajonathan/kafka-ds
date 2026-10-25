const D = 'Components/drawer/'
const M = 'Components/modal/'
const B = 'Components/button/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /floating/i.test(s.name))
const btn = (t, primary) => ({ frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: primary ? B + 'primary/bg' : null, stroke: primary ? null : B + 'outline/border', sw: 1, children: [{ text: t, style: 'UI/Button', fill: primary ? B + 'primary/fg' : B + 'outline/fg' }] })
const body = [
  { text: 'Filtros', style: 'Reading/Heading MD', fill: M + 'fg', fillWidth: true },
  { text: 'Elige qué programas quieres ver.', style: 'UI/Input', fill: M + 'description', fillWidth: true },
  { frame: true, name: 'Spacer', dir: 'VERTICAL', fillWidth: true, height: 120, children: [] },
  { frame: true, name: 'Actions', dir: 'HORIZONTAL', gap: M + 'actions-gap', justify: 'MAX', fillWidth: true, children: [btn('Limpiar', false), btn('Aplicar', true)] }]
for (const [name, w, h] of [['Side=End', 320, 420], ['Side=Start', 320, 420], ['Side=Bottom', 480, 300]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: M + 'gap', p: M + 'padding', width: w, height: h, wvar: name === 'Side=Bottom' ? null : D + 'width', fill: M + 'bg', stroke: M + 'border', sw: 1, swvar: M + 'border-width', children: body }, host)
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Drawer', host)]
