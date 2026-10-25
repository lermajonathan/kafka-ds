const S = 'Components/skeleton/'
const comps = []
const line = (w) => ({ frame: true, name: 'Line', height: 12, hvar: S + 'line-height', width: w, radius: S + 'radius', fill: S + 'bg', children: [] })
const block = { frame: true, name: 'Block', height: 96, hvar: S + 'block-height', width: 320, radius: S + 'radius', fill: S + 'bg', children: [] }
const circle = { frame: true, name: 'Circle', width: 48, height: 48, wvar: S + 'circle-size', hvar: S + 'circle-size', radius: 'Semantic/radius/pill', fill: S + 'bg', children: [] }
for (const [name, kids, dir] of [
  ['Shape=Lines', [line(320), line(320), line(200)], 'VERTICAL'],
  ['Shape=Block', [block], 'VERTICAL'],
  ['Shape=Avatar and text', [circle, { frame: true, name: 'Lines', dir: 'VERTICAL', gap: S + 'gap', children: [line(240), line(160)] }], 'HORIZONTAL']]) {
  comps.push(await H.comp({ name, dir, gap: dir === 'HORIZONTAL' ? 16 : S + 'gap', children: kids }, host))
}
return [H.variants(comps, 'Skeleton', host)]
