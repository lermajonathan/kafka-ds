const P = 'Components/program-card/'
const K = 'Components/card/'
const comps = []
for (const hl of ['None', 'Featured']) {
  const featured = hl === 'Featured'
  comps.push(await H.comp({
    name: 'Highlight=' + hl, dir: 'VERTICAL', width: 360, fill: K + 'bg', radius: 'Semantic/radius/card',
    stroke: featured ? K + 'featured/border' : K + 'border', sw: 1, swvar: featured ? K + 'featured/border-width' : K + 'border-width', clip: true,
    children: [
      { frame: true, name: 'Media', dir: 'VERTICAL', justify: 'MAX', width: 360, height: 200, fill: P + 'cover-' + (featured ? 'amber' : 'gold'), p: P + 'media-padding', gap: 4, children: [
        { text: 'Taller de poesía', style: 'Reading/Heading SM', fill: P + 'title-fg' },
        { text: 'Con Gabriel Rodríguez', style: 'UI/Label', fill: P + 'subtitle-fg' } ] },
      { frame: true, name: 'Body', dir: 'VERTICAL', p: P + 'body-padding', gap: P + 'body-gap', children: [
        { text: 'Diez sesiones para escribir, leer en voz alta y revisar tus propios poemas.', style: 'Reading/Body', fill: 'Semantic/color/fg/default', fillWidth: true },
        { text: '12 de marzo · Presencial', style: 'UI/Caption', fill: 'Semantic/color/fg/muted' } ] } ] }, host))
}
return [H.variants(comps, 'ProgramCard', host)]
