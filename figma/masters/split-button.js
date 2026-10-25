const B = 'Components/button/'
const S = 'Components/split-button/'
const comps = []
for (const v of ['primary', 'outline']) {
  const outline = v === 'outline'
  const fg = B + v + '/fg'
  const part = (name, children, extra) => ({ frame: true, name, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', height: 44, radius: B + 'radius', fill: outline ? null : B + 'primary/bg', stroke: outline ? B + 'outline/border' : null, sw: 1, children, ...extra })
  comps.push(await H.comp({ name: 'Variant=' + v[0].toUpperCase() + v.slice(1), dir: 'HORIZONTAL', gap: S + 'gap', children: [
    part('Main', [{ icon: 'Upload', size: 20, fill: fg }, { text: 'Publicar', style: 'UI/Button', fill: fg }], { px: B + 'padding-x', gap: B + 'gap' }),
    part('Toggle', [{ icon: 'ChevronDown', size: 20, fill: fg }], { width: 44, wvar: S + 'toggle-width' })] }, host))
}
return [H.variants(comps, 'SplitButton', host)]
