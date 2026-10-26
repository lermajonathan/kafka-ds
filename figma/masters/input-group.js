const G = 'Components/input-group/'
const I = 'Components/input/'
const B = 'Components/button/'
const comps = []
const addon = (t) => ({ frame: true, name: 'Addon', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', gap: G + 'addon-gap', px: G + 'addon-padding-x', minHeight: 44, minHeightVar: I + 'min-height', fill: G + 'addon-bg', children: [{ text: t, style: 'UI/Input', fill: G + 'addon-fg' }] })
const input = (t) => ({ frame: true, name: 'Input', dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', minHeight: 44, minHeightVar: I + 'min-height', fillWidth: true, children: [{ text: t, style: 'UI/Input', fill: I + 'placeholder', fillWidth: true }] })
const action = { frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', minHeight: 44, minHeightVar: B + 'min-height', fill: B + 'soft/bg', children: [{ text: 'Buscar', style: 'UI/Button', fill: B + 'soft/fg' }] }
for (const [name, kids] of [
  ['Addons=Text', [addon('https://'), input('mi-sitio'), addon('.com')]],
  ['Addons=Unit', [addon('COP'), input('200000'), addon('por persona')]],
  ['Addons=Action', [input('Título o autor'), action]]]) {
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', width: 400, radius: I + 'radius', clip: true, fill: I + 'bg', stroke: I + 'border', sw: 1, swvar: I + 'border-width', children: kids }, host))
}
return [H.variants(comps, 'InputGroup', host)]
