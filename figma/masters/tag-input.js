const T = 'Components/tag-input/'
const I = 'Components/input/'
const comps = []
const tag = (txt) => ({ frame: true, name: 'Tag', dir: 'HORIZONTAL', align: 'CENTER', pl: T + 'tag-padding-left', radius: T + 'tag-radius', minHeight: 44, minHeightVar: T + 'remove-size', fill: T + 'tag-bg', children: [
  { text: txt, style: 'UI/Label', fill: T + 'tag-fg' },
  { frame: true, name: 'Remove', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: T + 'remove-size', hvar: T + 'remove-size', children: [{ text: '×', style: 'UI/Label', fill: T + 'tag-fg' }] }] })
for (const [name, tags, invalid] of [['State=Empty', [], false], ['State=Tags', ['poesía', 'cuento', 'ensayo'], false], ['State=Invalid', ['poesía'], true]]) {
  const kids = tags.map(tag)
  kids.push({ text: tags.length ? 'Añadir…' : 'Escribe y pulsa Enter', style: 'UI/Input', fill: I + 'placeholder' })
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: T + 'gap', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 400, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + (invalid ? 'invalid-border' : 'border'), sw: 1, swvar: I + 'border-width', children: kids }, host))
}
return [H.variants(comps, 'TagInput', host)]
