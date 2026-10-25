const P = 'Components/pin-input/'
const I = 'Components/input/'
const comps = []
for (const [name, border, digits] of [['State=Empty', 'border', ['', '', '', '', '', '']], ['State=Filled', 'border', ['4', '8', '1', '', '', '']], ['State=Invalid', 'invalid-border', ['4', '8', '1', '0', '7', '2']]]) {
  const kids = digits.map((d) => ({ frame: true, name: 'Cell', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 48, height: 48, wvar: P + 'cell-width', hvar: P + 'cell-height', radius: P + 'radius', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: d ? [{ text: d, style: 'Reading/Heading MD', fill: I + 'fg' }] : [] }))
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', gap: P + 'gap', children: kids }, host))
}
return [H.variants(comps, 'PinInput', host)]
