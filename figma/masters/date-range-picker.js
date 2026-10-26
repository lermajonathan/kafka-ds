const D = 'Components/date-range-picker/'
const I = 'Components/input/'
const comps = []
const btn = (txt, ph, border) => ({ frame: true, name: 'Button', dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 360, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [{ text: txt, style: 'UI/Input', fill: I + (ph ? 'placeholder' : 'fg'), fillWidth: true }, { icon: 'Calendar', size: 20, fill: I + 'icon' }] })
const preset = (t) => ({ frame: true, name: 'Preset', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: 'Components/chip/padding-x', radius: 'Components/chip/radius', minHeight: 44, minHeightVar: 'Components/chip/min-height', fill: 'Components/chip/bg', stroke: 'Components/chip/border', sw: 1, children: [{ text: t, style: 'UI/Label', fill: 'Components/chip/fg' }] })
for (const [name, kids] of [
  ['State=Empty', [btn('Elige las fechas', true, 'border')]],
  ['State=With value', [btn('Del 10 de nov de 2026 al 20 de nov de 2026', false, 'border-focus')]],
  ['State=Presets', [btn('Elige las fechas', true, 'border-focus'), { frame: true, name: 'Presets', dir: 'HORIZONTAL', gap: D + 'preset-gap', stroke: D + 'footer-border', sw: { t: D + 'footer-border-width' }, pt: D + 'footer-padding-top', children: [preset('Este mes'), preset('Esta temporada')] }]],
  ['State=Invalid', [btn('Elige las fechas', true, 'invalid-border')]]]) {
  comps.push(await H.comp({ name, dir: 'VERTICAL', gap: D + 'gap', children: kids }, host))
}
return [H.variants(comps, 'DateRangePicker', host)]
