const T = 'Components/textarea/'
const I = 'Components/input/'
const comps = []
for (const [name, border] of [['State=Default', 'border'], ['State=Focus', 'border-focus'], ['State=Invalid', 'invalid-border']]) {
  comps.push(await H.comp({ name, dir: 'VERTICAL', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 96, minHeightVar: T + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [{ text: 'Una o dos frases bastan.', style: 'UI/Input', fill: I + 'placeholder', fillWidth: true }] }, host))
}
return [H.variants(comps, 'Textarea', host)]
