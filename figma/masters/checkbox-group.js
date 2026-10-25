const G = 'Components/checkbox-group/'
const K = 'Components/checkbox/'
const box = (on) => ({ frame: true, name: 'Box', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 24, height: 24, wvar: K + 'size', hvar: K + 'size', radius: K + 'radius', fill: K + (on ? 'checked-bg' : 'bg'), stroke: K + 'border', sw: 2, swvar: K + 'border-width', children: on ? [{ icon: 'Check', weight: 'Bold', size: 16, fill: K + 'checked-fg' }] : [] })
const row = (txt, on) => ({ frame: true, name: 'Row', dir: 'HORIZONTAL', align: 'CENTER', gap: K + 'gap', minHeight: 44, minHeightVar: K + 'min-height', children: [box(on), { text: txt, style: 'UI/Input', fill: K + 'label' }] })
const comps = []
for (const [name, checks] of [['State=None', [false, false, false]], ['State=Some', [true, false, true]], ['State=All', [true, true, true]]]) {
  const some = checks.some(Boolean) && !checks.every(Boolean)
  const kids = [
    { text: 'Talleres de interés', style: 'UI/Label', fill: 'Semantic/color/fg/default' },
    { frame: true, name: 'Select all', dir: 'VERTICAL', pb: G + 'select-all-padding-bottom', stroke: G + 'select-all-border', sw: 1, swvar: G + 'select-all-border-width', children: [row('Seleccionar todos' + (some ? ' (mixto)' : ''), checks.every(Boolean) || some)] },
    row('Poesía', checks[0]), row('Cuento', checks[1]), row('Ensayo', checks[2])]
  comps.push(await H.comp({ name, dir: 'VERTICAL', gap: G + 'gap', width: 320, children: kids }, host))
}
return [H.variants(comps, 'CheckboxGroup', host)]
