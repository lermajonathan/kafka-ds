const T = 'Components/reading-progress/'
const make = async (pct) => H.comp({ name: 'Progress=' + pct, width: 520, height: 4, hvar: T + 'height', dir: 'HORIZONTAL', fill: T + 'track', children: pct ? [{ rect: true, name: 'Fill', w: Math.max(1, Math.round(520 * pct / 100)), h: 4, fill: T + 'fill' }] : [] }, host)
const comps = [await make(0), await make(40), await make(100)]
return [H.variants(comps, 'ReadingProgress', host)]
