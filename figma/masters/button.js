const B = 'Components/button/'
const VARIANTS = ['primary', 'soft', 'outline', 'vip', 'link']
const fgOf = (v, s) => (v === 'link' ? B + 'link/' + (s === 'Hover' || s === 'Active' ? 'fg-hover' : 'fg') : B + v + '/fg')
const bgOf = (v, s) => {
  if (v === 'link') return null
  const hover = s === 'Hover' || s === 'Active'
  return v === 'outline' ? (hover ? B + v + '/bg-' + s.toLowerCase() : null) : B + v + '/bg' + (hover ? '-' + s.toLowerCase() : '')
}
const make = async (name, v, s, label, lead, trail) => {
  const fg = fgOf(v, s)
  const kids = []
  if (lead) kids.push({ icon: lead, size: 20, fill: fg })
  kids.push({ text: label, style: 'UI/Button', fill: fg, underline: v === 'link' })
  if (trail) kids.push({ icon: trail, size: 20, fill: fg })
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: v === 'link' ? B + 'link/padding-x' : B + 'padding-x', py: B + 'padding-y', gap: B + 'gap', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: bgOf(v, s), stroke: v === 'outline' ? B + 'outline/border' : null, sw: 2, children: kids }, host)
  if (s === 'Disabled') c.setBoundVariable('opacity', H.V.get(B + 'disabled-opacity'))
  return c
}
const cap = (v) => v[0].toUpperCase() + v.slice(1)
const states = []
for (const v of VARIANTS) for (const s of ['Default', 'Hover', 'Active', 'Disabled']) states.push(await make('Variant=' + cap(v) + ', State=' + s, v, s, 'Inscribirme'))
const content = []
for (const v of ['primary', 'soft', 'outline', 'link']) {
  content.push(await make('Variant=' + cap(v) + ', Content=Label', v, 'Default', 'Inscribirme'))
  content.push(await make('Variant=' + cap(v) + ', Content=Icon left', v, 'Default', 'Hazte miembro', 'Crown'))
  content.push(await make('Variant=' + cap(v) + ', Content=Icon right', v, 'Default', 'Continuar', null, 'ArrowRight'))
  content.push(await make('Variant=' + cap(v) + ', Content=Both icons', v, 'Default', 'Ver membresías', 'Crown', 'ArrowRight'))
}
return [H.variants(states, 'Button', host), H.variants(content, 'Button · Content', host)]
