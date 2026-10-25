const D = 'Components/divider/'
const comps = []
const rule = (v) => v ? { frame: true, name: 'Rule', width: 1, height: 32, wvar: D + 'width', fill: D + 'color', children: [] } : { frame: true, name: 'Rule', height: 1, hvar: D + 'width', fillWidth: true, fill: D + 'color', children: [] }
comps.push(await H.comp({ name: 'Orientation=Horizontal', dir: 'VERTICAL', width: 360, children: [rule(false)] }, host))
comps.push(await H.comp({ name: 'Orientation=Horizontal, Label=True', dir: 'HORIZONTAL', align: 'CENTER', gap: D + 'gap', width: 360, children: [rule(false), { text: 'o continúa con', style: 'UI/Caption', fill: D + 'label-fg' }, rule(false)] }, host))
comps.push(await H.comp({ name: 'Orientation=Vertical', dir: 'HORIZONTAL', align: 'CENTER', gap: D + 'gap', children: [{ text: 'Taller', style: 'UI/Caption', fill: D + 'label-fg' }, rule(true), { text: 'Poesía', style: 'UI/Caption', fill: D + 'label-fg' }] }, host))
return [H.variants(comps, 'Divider', host)]
