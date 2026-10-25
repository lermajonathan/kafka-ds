const B = 'Components/button/'
const comps = []
for (const v of ['primary', 'soft', 'outline', 'vip']) for (const s of ['Default', 'Hover', 'Active', 'Disabled']) {
  const bg = v === 'outline' ? (s === 'Hover' || s === 'Active' ? B + v + '/bg-' + s.toLowerCase() : null) : B + v + '/bg' + (s === 'Hover' || s === 'Active' ? '-' + s.toLowerCase() : '')
  const c = await H.comp({ name: 'Variant=' + v[0].toUpperCase() + v.slice(1) + ', State=' + s, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', py: B + 'padding-y', gap: B + 'gap', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: bg, stroke: v === 'outline' ? B + 'outline/border' : null, sw: 1, children: [{ text: 'Inscribirme', style: 'UI/Button', fill: B + v + '/fg' }] }, host)
  if (s === 'Disabled') c.setBoundVariable('opacity', H.V.get(B + 'disabled-opacity'))
  comps.push(c)
}
return [H.variants(comps, 'Button', host)]
