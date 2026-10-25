const T = 'Components/prev-next/'
const card = (dir, state) => H.comp({ name: 'Direction=' + dir + ', State=' + state, width: 380, pad: T + 'padding', gap: T + 'gap', minHeightVar: T + 'min-height', minHeight: 44, fill: state === 'Hover' ? T + 'bg-hover' : T + 'bg', stroke: state === 'Hover' ? T + 'border-hover' : T + 'border', sw: T + 'border-width', radius: T + 'radius', align: dir === 'Next' ? 'MAX' : 'MIN', children: [
  { frame: { name: 'Direction', dir: 'HORIZONTAL', gap: 8, align: 'CENTER', children: dir === 'Next' ? [{ text: 'SIGUIENTE', style: 'UI/Overline', fill: T + 'direction' }, { icon: 'ArrowRight', weight: 'Bold', size: 16, fill: T + 'direction' }] : [{ icon: 'ArrowLeft', weight: 'Bold', size: 16, fill: T + 'direction' }, { text: 'ANTERIOR', style: 'UI/Overline', fill: T + 'direction' }] } },
  { text: dir === 'Next' ? 'Umbrales de lo cotidiano' : 'La arquitectura del texto', style: 'Reading/Heading SM', fill: T + 'title', fillW: true, align: dir === 'Next' ? 'RIGHT' : 'LEFT' } ] }, host)
const comps = []
for (const d of ['Previous', 'Next']) for (const s of ['Default', 'Hover']) comps.push(await card(d, s))
return [H.variants(comps, 'PrevNext', host)]
