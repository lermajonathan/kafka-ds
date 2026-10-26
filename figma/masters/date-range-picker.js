const D = 'Components/date-range-picker/'
const I = 'Components/input/'
const T = 'Components/tooltip/'
const comps = []
const FULL = 'Del 10 de nov de 2026 al 20 de nov de 2026'
// Icon first, like the component. The value stays on one line and is cut with an ellipsis, so the field never grows taller.
const btn = (txt, ph, border, width = 440) => ({ frame: true, name: 'Button', dir: 'HORIZONTAL', align: 'CENTER', gap: I + 'icon-gap', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [{ icon: 'Calendar', size: 20, fill: I + 'icon' }, { text: txt, style: 'UI/Input', fill: I + (ph ? 'placeholder' : 'fg'), fillWidth: true, truncate: true }] })
const preset = (t) => ({ frame: true, name: 'Preset', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: 'Components/chip/padding-x', radius: 'Components/chip/radius', minHeight: 44, minHeightVar: 'Components/chip/min-height', fill: 'Components/chip/bg', stroke: 'Components/chip/border', sw: 1, children: [{ text: t, style: 'UI/Label', fill: 'Components/chip/fg' }] })
// When the value is cut, a tooltip below the field carries the whole text
const tip = { frame: true, name: 'Tip', dir: 'HORIZONTAL', align: 'CENTER', px: T + 'padding-x', py: T + 'padding-y', radius: T + 'radius', maxWidth: 224, maxWidthVar: T + 'max-width', fill: T + 'bg', children: [{ text: FULL, style: 'UI/Caption', fill: T + 'fg', fillWidth: true }] }
for (const [name, kids] of [
  ['State=Empty', [btn('Elige las fechas', true, 'border')]],
  ['State=With value', [btn(FULL, false, 'border-focus')]],
  ['State=Truncated', [btn(FULL, false, 'border-focus', 240), tip]],
  ['State=Presets', [btn('Elige las fechas', true, 'border-focus'), { frame: true, name: 'Presets', dir: 'HORIZONTAL', gap: D + 'preset-gap', stroke: D + 'footer-border', sw: { t: D + 'footer-border-width' }, pt: D + 'footer-padding-top', children: [preset('Este mes'), preset('Esta temporada')] }]],
  ['State=Invalid', [btn('Elige las fechas', true, 'invalid-border')]]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', align: name === 'State=Truncated' ? 'CENTER' : 'MIN', gap: name === 'State=Truncated' ? T + 'offset' : D + 'gap', children: kids }, host)
  if (name === 'State=Truncated') {
    const tipNode = c.findOne((x) => x.name === 'Tip')
    const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
    if (eff) await tipNode.setEffectStyleIdAsync(eff.id)
    const a = figma.createRectangle(); a.name = 'Arrow'; const S = 8, k = Math.SQRT1_2
    a.resize(S, S); a.cornerRadius = 2; tipNode.appendChild(a); a.layoutPositioning = 'ABSOLUTE'
    a.fills = [H.solid(T + 'bg')]
    a.setBoundVariable('width', H.V.get(T + 'arrow-size')); a.setBoundVariable('height', H.V.get(T + 'arrow-size'))
    a.relativeTransform = [[k, -k, tipNode.width / 2], [k, k, -S * k]]
  }
  comps.push(c)
}
return [H.variants(comps, 'DateRangePicker', host)]
