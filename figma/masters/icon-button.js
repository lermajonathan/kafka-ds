const B = 'Components/button/'
const I = 'Components/icon-button/'
const comps = []
for (const [v, icon] of [['primary', 'ArrowRight'], ['soft', 'Crown'], ['outline', 'Close']]) for (const s of ['Default', 'Disabled']) {
  const c = await H.comp({ name: 'Variant=' + v[0].toUpperCase() + v.slice(1) + ', State=' + s, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: I + 'size', hvar: I + 'size', radius: I + 'radius',
    fill: v === 'outline' ? null : B + v + '/bg', stroke: v === 'outline' ? B + 'outline/border' : null, sw: 1, children: [{ icon, size: 20, fill: v === 'outline' ? B + 'outline/fg' : B + v + '/fg' }] }, host)
  if (s === 'Disabled') c.setBoundVariable('opacity', H.V.get(B + 'disabled-opacity'))
  comps.push(c)
}
return [H.variants(comps, 'IconButton', host)]
