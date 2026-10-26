const T = 'Components/tag-input/'
const I = 'Components/input/'
const comps = []
// Small tags (32 px) live inside the field, so a few tags never make it taller (DDR-KF-015)
const tag = (txt) => ({ frame: true, name: 'Tag', dir: 'HORIZONTAL', align: 'CENTER', pl: T + 'tag-padding-left', radius: T + 'tag-radius', minHeight: 32, minHeightVar: T + 'tag-height', fill: T + 'tag-bg', children: [
  { text: txt, style: 'UI/Label', fill: T + 'tag-fg' },
  { frame: true, name: 'Remove', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 32, height: 32, wvar: T + 'remove-size', hvar: T + 'remove-size', children: [{ icon: 'Close', size: 16, fill: T + 'tag-fg' }] }] })
const box = (txt) => ({ frame: true, name: 'Text box', dir: 'HORIZONTAL', align: 'CENTER', minWidth: 96, minWidthVar: T + 'input-min-width', minHeight: 32, minHeightVar: T + 'tag-height', children: [{ text: txt, style: 'UI/Input', fill: I + 'placeholder' }] })
const MANY = ['poesía', 'cuento', 'ensayo', 'crónica', 'teatro', 'novela', 'microrrelato']
for (const [name, tags, invalid] of [['State=Empty', [], false], ['State=Tags', ['poesía', 'cuento'], false], ['State=Invalid', ['poesía'], true], ['State=Many', MANY, false]]) {
  const kids = tags.map(tag)
  kids.push(box(tags.length ? 'Añadir' : 'Escribe y pulsa Enter'))
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', wrap: true, gap: T + 'gap', px: I + 'padding-x', py: T + 'field-padding-y', radius: I + 'radius', width: 400, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + (invalid ? 'invalid-border' : 'border'), sw: 1, swvar: I + 'border-width', children: kids }, host)
  c.setBoundVariable('counterAxisSpacing', H.V.get(T + 'gap'))
  comps.push(c)
}
return [H.variants(comps, 'TagInput', host)]
