const F = 'Components/field/'
const I = 'Components/input/'
const comps = []
for (const [name, hint, err] of [['State=Hint', 'Te escribiremos aquí para confirmar.', null], ['State=Error', null, 'Escribe solo números, sin puntos.']]) {
  const kids = [{ text: 'Documento (obligatorio)', style: 'UI/Label', fill: F + 'label' },
    { frame: true, name: 'Control', dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: err ? I + 'invalid-border' : I + 'border', sw: 1, swvar: I + 'border-width', children: [{ text: '12.345', style: 'UI/Input', fill: I + 'fg' }] }]
  kids.push(err ? { text: err, style: 'UI/Caption', fill: F + 'error' } : { text: hint, style: 'UI/Caption', fill: F + 'hint' })
  comps.push(await H.comp({ name, dir: 'VERTICAL', gap: F + 'gap', width: 320, children: kids }, host))
}
return [H.variants(comps, 'Field', host)]
