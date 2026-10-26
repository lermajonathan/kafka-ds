const T = 'Components/embed/'
const c = await H.comp({ name: 'Embed', width: 520, gap: T + 'gap', children: [
  { frame: { name: 'Frame', width: 520, height: 292, dir: 'VERTICAL', align: 'CENTER', justify: 'CENTER', gap: T + 'facade-gap', fill: T + 'bg', stroke: T + 'border', sw: T + 'border-width', radius: T + 'radius', children: [
    { icon: 'Play', weight: 'Fill', size: 32, fill: T + 'facade-fg' },
    { text: 'Cargar contenido externo', style: 'UI/Label', fill: T + 'facade-fg' } ] }, fillW: true },
  { text: 'Se carga al pulsar el botón.', style: 'UI/Caption', fill: T + 'caption', fillW: true },
  { frame: { name: 'Open link', dir: 'HORIZONTAL', align: 'CENTER', gap: 8, children: [{ text: 'Abrir en una pestaña nueva', style: 'UI/Label', fill: 'Semantic/color/fg/link' }, { icon: 'External', size: 16, fill: 'Semantic/color/fg/link' }] } } ] }, host)
return [c]
