const F = 'Components/file-upload/'
const comps = []
for (const [name, bg, border] of [['State=Default', 'bg', 'border'], ['State=Hover', 'bg-hover', 'border'], ['State=Dragging', 'drag-bg', 'drag-border']]) {
  const c = await H.comp({ name, dir: 'VERTICAL', align: 'CENTER', justify: 'CENTER', gap: F + 'gap', p: F + 'padding', radius: F + 'radius', width: 400, fill: F + bg, stroke: F + border, sw: 2, swvar: F + 'border-width', children: [
    { text: 'Elige un archivo o suéltalo aquí', style: 'UI/Label', fill: 'Semantic/color/fg/default' },
    { text: 'PDF o Word, hasta 5 MB', style: 'UI/Caption', fill: F + 'hint' }] }, host)
  c.dashPattern = [8, 6]
  comps.push(c)
}
const item = await H.comp({ name: 'State=With file', dir: 'VERTICAL', gap: F + 'gap', width: 400, children: [
  { frame: true, name: 'Item', dir: 'HORIZONTAL', align: 'CENTER', gap: F + 'gap', p: F + 'item-padding', radius: F + 'item-radius', fill: F + 'item-bg', fillWidth: true, children: [
    { text: 'cuento-final.pdf', style: 'UI/Label', fill: 'Semantic/color/fg/default', fillWidth: true },
    { frame: true, name: 'Remove', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: F + 'remove-size', hvar: F + 'remove-size', children: [{ text: '×', style: 'UI/Label', fill: F + 'icon' }] }] },
  { text: 'El archivo supera 5 MB.', style: 'UI/Caption', fill: F + 'error' }] }, host)
comps.push(item)
return [H.variants(comps, 'FileUpload', host)]
