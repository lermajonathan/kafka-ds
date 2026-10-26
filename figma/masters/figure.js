const T = 'Components/figure/'
const make = (name, h) => H.comp({ name, width: 420, gap: T + 'gap', children: [
  { rect: true, name: 'Image', w: 420, h, fill: T + 'bg', radius: T + 'radius', fillW: true },
  { frame: { name: 'Caption', dir: 'HORIZONTAL', gap: 8, wrap: true, children: [
    { text: 'La luz llega siempre tarde al fondo del cuadro.', style: 'UI/Caption', fill: T + 'caption' },
    { text: 'Ilustración de ejemplo', style: 'UI/Caption', fill: T + 'credit' } ] }, fillW: true } ] }, host)
const comps = [await make('Ratio=16:10', 262), await make('Ratio=1:1', 420), await make('Ratio=3:4', 560)]
return [H.variants(comps, 'Figure', host)]
