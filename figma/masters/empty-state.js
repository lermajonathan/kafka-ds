const E = 'Components/empty-state/'
const B = 'Components/button/'
const comps = []
const body = (title, desc, withAction) => [
  { frame: true, name: 'Icon', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 24, height: 24, wvar: E + 'icon-size', hvar: E + 'icon-size', children: [{ icon: 'File', size: 24, fill: E + 'icon-fg' }] },
  { text: title, style: 'Reading/Heading SM', fill: E + 'title-fg', fillWidth: true, align: 'CENTER' },
  { text: desc, style: 'UI/Input', fill: E + 'description-fg', fillWidth: true, align: 'CENTER' },
  ...(withAction ? [{ frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: B + 'primary/bg', children: [{ text: 'Ver talleres', style: 'UI/Button', fill: B + 'primary/fg' }] }] : [])]
for (const [name, t, d, a] of [
  ['Action=With action', 'Aún no tienes inscripciones', 'Cuando te inscribas en un taller, lo verás aquí con el estado de tu pago.', true],
  ['Action=None', 'Sin resultados', 'Prueba con otra palabra.', false]]) {
  comps.push(await H.comp({ name, dir: 'VERTICAL', align: 'CENTER', gap: E + 'gap', p: E + 'padding', width: 448, maxWidth: 448, children: body(t, d, a) }, host))
}
return [H.variants(comps, 'EmptyState', host)]
