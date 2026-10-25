const B = 'Components/button/'
const G = 'Components/button-group/'
const btn = (t, v) => ({ frame: true, name: 'Button', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', py: B + 'padding-y', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height',
  fill: v === 'primary' ? B + 'primary/bg' : null, stroke: v === 'outline' ? B + 'outline/border' : null, sw: 1, children: [{ text: t, style: 'UI/Button', fill: B + v + '/fg' }] })
const comps = []
for (const [name, dir, kids] of [
  ['Orientation=Horizontal', 'HORIZONTAL', [btn('Cancelar', 'outline'), btn('Guardar borrador', 'outline'), btn('Publicar', 'primary')]],
  ['Orientation=Vertical', 'VERTICAL', [btn('Publicar', 'primary'), btn('Guardar borrador', 'outline'), btn('Cancelar', 'outline')]]]) {
  comps.push(await H.comp({ name, dir, gap: G + 'gap', children: kids }, host))
}
return [H.variants(comps, 'ButtonGroup', host)]
