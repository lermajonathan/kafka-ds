const B = 'Components/button/'
const G = 'Components/button-group/'
const S = 'Components/split-button/'
const comps = []
// One element: a single rounded shape with a line inside between the main action and the arrow (DDR-KF-014).
for (const v of ['primary', 'soft', 'outline']) {
  const outline = v === 'outline'
  const fg = outline ? B + 'outline/fg' : B + v + '/fg'
  const fill = outline ? null : B + v + '/bg'
  comps.push(await H.comp({ name: 'Variant=' + v[0].toUpperCase() + v.slice(1), dir: 'HORIZONTAL', radius: B + 'radius', clip: true, fill, stroke: outline ? B + 'outline/border' : null, sw: 2, children: [
    { frame: true, name: 'Main', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', height: 44, px: B + 'padding-x', gap: B + 'gap', children: [{ icon: 'Upload', size: 20, fill: fg }, { text: 'Publicar', style: 'UI/Button', fill: fg }] },
    { frame: true, name: 'Toggle', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', height: 44, width: 44, wvar: S + 'toggle-width', stroke: G + 'divider', sw: { l: G + 'divider-width' }, children: [{ icon: 'ChevronDown', size: 20, fill: fg }] }] }, host))
}
return [H.variants(comps, 'SplitButton', host)]
