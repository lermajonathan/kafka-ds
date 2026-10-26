const T = 'Components/tooltip/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const tip = (t) => ({ frame: true, name: 'Tip', dir: 'HORIZONTAL', align: 'CENTER', px: T + 'padding-x', py: T + 'padding-y', radius: T + 'radius', maxWidth: 224, maxWidthVar: T + 'max-width', fill: T + 'bg', children: [{ text: t, style: 'UI/Caption', fill: T + 'fg', fillWidth: true }] })
const btn = { frame: true, name: 'Icon button', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, radius: 'Components/icon-button/radius', stroke: 'Components/button/outline/border', sw: 1, children: [{ icon: 'Close', size: 20, fill: 'Components/button/outline/fg' }] }
// The arrow is a square turned 45°, centred on the tip's edge that faces the control, in the tip colour
const arrow = (tipNode, side) => {
  const a = figma.createRectangle(); a.name = 'Arrow'
  const S = 8, k = Math.SQRT1_2
  a.resize(S, S); a.cornerRadius = 2
  tipNode.appendChild(a)
  a.layoutPositioning = 'ABSOLUTE'
  a.fills = [H.solid(T + 'bg')]
  a.setBoundVariable('width', H.V.get(T + 'arrow-size')); a.setBoundVariable('height', H.V.get(T + 'arrow-size'))
  const w = tipNode.width, h = tipNode.height
  const [cx, cy] = side === 'Top' ? [w / 2, h] : side === 'Bottom' ? [w / 2, 0] : side === 'Left' ? [w, h / 2] : [0, h / 2]
  a.relativeTransform = [[k, -k, cx], [k, k, cy - S * k]]
}
const SIDES = [['Top', 'VERTICAL', false], ['Bottom', 'VERTICAL', true], ['Left', 'HORIZONTAL', false], ['Right', 'HORIZONTAL', true]]
for (const [side, dir, after] of SIDES) {
  for (const [text, txt] of [['Short', side === 'Top' ? 'Cerrar sin guardar' : 'Aparece ' + { Bottom: 'abajo', Left: 'a la izquierda', Right: 'a la derecha' }[side]], ...(side === 'Top' ? [['Long', 'Cierra el panel y descarta los cambios que no hayas guardado']] : [])]) {
    const t = tip(txt)
    const c = await H.comp({ name: 'Side=' + side + ', Text=' + text, dir, align: 'CENTER', gap: T + 'offset', children: after ? [btn, t] : [t, btn] }, host)
    const tipNode = c.findOne((x) => x.name === 'Tip')
    if (eff) await tipNode.setEffectStyleIdAsync(eff.id)
    arrow(tipNode, side)
    comps.push(c)
  }
}
return [H.variants(comps, 'Tooltip', host)]
