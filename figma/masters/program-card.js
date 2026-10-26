const P = 'Components/program-card/'
const K = 'Components/card/'
const B = 'Components/button/'
const comps = []
const STATUS = [['Open', 'Tone=Success', '$200.000'], ['Last spots', 'Tone=Warning', '$200.000'], ['Plain', 'Tone=Neutral', '$150.000']]
for (const hl of ['None', 'Featured']) {
  const featured = hl === 'Featured'
  for (const [status, badge, price] of STATUS) {
    comps.push(await H.comp({
      name: 'Highlight=' + hl + ', Status=' + status, dir: 'VERTICAL', width: 360, fill: K + 'bg', radius: 'Semantic/radius/card',
      stroke: featured ? K + 'featured/border' : K + 'border', sw: 1, swvar: featured ? K + 'featured/border-width' : K + 'border-width', clip: true,
      children: [
        { frame: true, name: 'Media', dir: 'VERTICAL', justify: 'SPACE_BETWEEN', width: 360, height: 225, fill: P + 'cover-' + (featured ? 'amber' : 'gold'), pt: P + 'badge-offset', pl: P + 'badge-offset', pr: P + 'badge-offset', pb: P + 'media-padding', children: [
          { frame: true, name: 'Top', dir: 'HORIZONTAL', align: 'MIN', justify: 'SPACE_BETWEEN', fillWidth: true, children: [
            { inst: 'Badge', variant: badge },
            { frame: true, name: 'Price', dir: 'HORIZONTAL', align: 'CENTER', px: P + 'price-padding-x', py: P + 'price-padding-y', radius: 'Semantic/radius/pill', fill: P + 'price-bg', children: [{ text: price, style: 'UI/Label', fill: P + 'price-fg' }] }] },
          { frame: true, name: 'Title', dir: 'VERTICAL', gap: 4, px: 8, fillWidth: true, children: [
            { text: 'Taller de poesía', style: 'Reading/Heading SM', fill: P + 'title-fg' },
            { text: 'Con Gabriel Rodríguez', style: 'UI/Label', fill: P + 'subtitle-fg' }] }] },
        { frame: true, name: 'Body', dir: 'VERTICAL', p: P + 'body-padding', gap: P + 'body-gap', fillWidth: true, children: [
          { text: 'Diez sesiones para escribir, leer en voz alta y revisar tus propios poemas.', style: 'Reading/Body', fill: 'Semantic/color/fg/default', fillWidth: true },
          { frame: true, name: 'Meta', dir: 'HORIZONTAL', align: 'CENTER', gap: P + 'meta-gap', fillWidth: true, children: [
            { icon: 'Calendar', size: 16, fill: 'Semantic/color/fg/muted' },
            { text: '12 de marzo · Presencial', style: 'UI/Caption', fill: 'Semantic/color/fg/muted' }] },
          { frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fillWidth: true, fill: B + 'primary/bg', children: [{ text: status === 'Plain' ? 'Ver el taller' : 'Inscribirme', style: 'UI/Button', fill: B + 'primary/fg' }] }] }] }, host))
  }
}
return [H.variants(comps, 'ProgramCard', host)]
