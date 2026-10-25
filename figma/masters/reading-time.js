const T = 'Components/reading-time/'
const c = await H.comp({ name: 'ReadingTime', dir: 'HORIZONTAL', align: 'CENTER', gap: T + 'gap', children: [{ icon: 'Clock', size: 16, fill: T + 'fg' }, { text: '5 min de lectura', style: 'UI/Caption', fill: T + 'fg' }] }, host)
return [c]
