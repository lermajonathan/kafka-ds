const T = 'Components/tabs/'
const comps = []
const labels = ['Resumen', 'Programa', 'Precio', 'Próximamente']
for (let active = 0; active < 3; active++) {
  const tabs = labels.map((l, i) => ({ frame: true, name: i === 3 ? 'Tab Disabled' : 'Tab', dir: 'VERTICAL', align: 'CENTER', children: [
    { frame: true, name: 'Label', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: T + 'tab-padding-x', minHeight: 44, minHeightVar: T + 'tab-min-height', radius: T + 'radius', fill: i === 1 && active !== 1 ? T + 'tab-hover-bg' : null, children: [{ text: l, style: 'UI/Label', fill: i === active ? T + 'tab-fg-selected' : T + 'tab-fg' }] },
    { frame: true, name: 'Indicator', height: 4, hvar: T + 'indicator-width', fillWidth: true, fill: i === active ? T + 'indicator' : null, children: [] }] }))
  const c = await H.comp({ name: 'Selected=' + labels[active], dir: 'VERTICAL', width: 480, children: [
    { frame: true, name: 'List', dir: 'HORIZONTAL', gap: T + 'gap', fillWidth: true, stroke: T + 'list-border', sw: { b: T + 'list-border-width' }, children: tabs },
    { frame: true, name: 'Panel', dir: 'VERTICAL', pt: T + 'panel-padding-top', fillWidth: true, children: [{ text: ['Cuatro sábados de lectura y escritura, de 9 a 12 m.', 'Sesión 1: la arquitectura del texto.', '$200.000 COP, con 10 % de descuento.'][active], style: 'Reading/Body', fill: 'Semantic/color/fg/default', fillWidth: true }] }] }, host)
  c.findAll((n) => n.name === 'Tab Disabled').forEach((n) => n.setBoundVariable('opacity', H.V.get(T + 'disabled-opacity')))
  comps.push(c)
}
return [H.variants(comps, 'Tabs', host)]
