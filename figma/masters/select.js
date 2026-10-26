const S = 'Components/select/'
const I = 'Components/input/'
const B = 'Components/combobox/'
const comps = []
const chevron = (open) => {
  const v = figma.createVector(); v.name = 'Chevron'
  v.vectorPaths = [{ windingRule: 'NONE', data: open ? 'M 0 6 L 6 0 L 12 6' : 'M 0 0 L 6 6 L 12 0' }]
  v.fills = []; v.strokes = [H.solid(S + 'icon')]; v.strokeWeight = 2; v.strokeCap = 'ROUND'; v.strokeJoin = 'ROUND'
  return v
}
const field = (border, txt, fill) => ({ frame: true, name: 'Field', dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [{ text: txt, style: 'UI/Input', fill: I + fill, fillWidth: true }] })
for (const [name, border] of [['State=Default', 'border'], ['State=Focus', 'border-focus'], ['State=Invalid', 'invalid-border']]) {
  const c = await H.comp({ name, dir: 'VERTICAL', children: [field(border, 'Elige una opción', 'placeholder')] }, host)
  c.findOne((n) => n.name === 'Field').appendChild(chevron(false))
  comps.push(c)
}
// Open: the list is drawn by the operating system (native select, DDR-KF-009), so this variant only illustrates it
const opt = (txt, active) => ({ frame: true, name: 'Option', dir: 'HORIZONTAL', align: 'CENTER', px: B + 'option-padding-x', radius: B + 'option-radius', minHeight: 44, minHeightVar: B + 'option-min-height', fillWidth: true, fill: active ? B + 'option-active-bg' : null, children: [{ text: txt, style: 'UI/Input', fill: B + 'option-fg', fillWidth: true }] })
const list = { frame: true, name: 'List', dir: 'VERTICAL', p: B + 'list-padding', radius: B + 'list-radius', width: 320, fill: B + 'list-bg', stroke: B + 'list-border', sw: 1, swvar: B + 'list-border-width', children: [opt('Poema', true), opt('Cuento', false), opt('Ensayo', false)] }
const open = await H.comp({ name: 'State=Open', dir: 'VERTICAL', gap: B + 'offset', children: [field('border-focus', 'Poema', 'fg'), list, { text: 'Ilustrativo: la lista la dibuja el sistema', style: 'UI/Caption', fill: B + 'empty' }] }, host)
open.findOne((n) => n.name === 'Field').appendChild(chevron(true))
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
if (eff) open.findAll((n) => n.name === 'List').forEach((n) => n.setEffectStyleIdAsync(eff.id))
comps.push(open)
return [H.variants(comps, 'Select', host)]
