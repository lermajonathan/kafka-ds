// Phase B pages of the Figma file (Cover, Getting started, Icons, Decisions). Numbers come from the repo; the page code lives in figma/pages/<id>.js.
// Print one with:  node scripts/figma/print-page.mjs <id>   and paste the result in use_figma.
import { readFileSync } from 'node:fs'
import { buildDocs } from './docs.mjs'

export const PAGES = ['cover', 'getting-started', 'icons', 'decisions']

const leaves = (o) => Object.entries(o).reduce((n, [k, v]) => n + (k.startsWith('$') ? 0 : v && typeof v === 'object' ? ('$value' in v ? 1 : leaves(v)) : 0), 0)
const countTokens = () => ['primitives', 'semantic', 'components'].reduce((n, f) => n + leaves(JSON.parse(readFileSync(new URL(`../../tokens/${f}.json`, import.meta.url), 'utf8'))), 0)

const FAMILY_NOTES = {
  Reading: 'Prosa, citas, versos, notas',
  Actions: 'Botones y enlaces',
  'Data display': 'Insignias, avatares, programas',
  Forms: 'Campos, selección, fechas',
  Navigation: 'Pestañas, rutas, pasos',
  Overlays: 'Menús, diálogos, avisos',
  Feedback: 'Alertas, progreso, vacíos',
  Layout: 'Tarjeta, panel, divisor',
}

const NEW_DDRS = [
  { id: 'DDR-KF-013', slug: 'notas-al-final-del-capitulo-en-impresion', title: 'Notas al final del capítulo', status: 'Aceptada · 2026-10-26', body: 'Chromium no soporta notas al pie por página (float: footnote). En impresión las notas van al final de cada capítulo, sobre la rejilla y sin enlace de vuelta.', note: 'Paged.js solo si un texto real lo pide.' },
  { id: 'DDR-KF-014', slug: 'botones-unidos-y-split-en-un-solo-elemento', title: 'Botones unidos y SplitButton', status: 'Aceptada · 2026-10-26', body: 'SplitButton y ButtonGroup unido son un solo elemento con divisor interno y foco hacia dentro. Button gana la variante link, siempre subrayada.', note: 'Reemplaza el espacio de 2 px de DDR-KF-012.' },
  { id: 'DDR-KF-015', slug: 'etiquetas-pequenas-dentro-del-campo', title: 'Etiquetas pequeñas dentro del campo', status: 'Aceptada · 2026-10-26', body: 'TagInput usa etiquetas de 32 px dentro del campo de 44 px, en varias filas. RadioCard lleva un icono cuadrado con radius.tile.', note: 'Quitar mide 32 px: cumple WCAG 2.5.8, no nuestra regla de 44.' },
  { id: 'DDR-KF-016', slug: 'tooltip-con-flecha-y-valores-truncados', title: 'Tooltip con flecha y valores cortados', status: 'Aceptada · 2026-10-26', body: 'Tooltip con flecha en cuatro lados que se voltea con su lado. DateRangePicker se queda en una línea y muestra un tooltip solo si el texto se corta.', note: 'Un contenido vacío apaga el tooltip.' },
  { id: 'DDR-KF-017', slug: 'drawer-con-radio-y-esqueleto-visible', title: 'Drawer con radio y esqueleto visible', status: 'Aceptada · 2026-10-26', body: 'Drawer redondea las esquinas que miran a la página. El esqueleto usa color.bg.placeholder (≥ 1,4:1 en claro y oscuro). ConfirmDialog alinea icono y mensaje.', note: 'La auditoría de Figma mide las sombras recortadas.' },
  { id: 'DDR-KF-018', slug: 'patrones-tarjeta-completa-y-notificaciones-separadas', title: 'Patrones: tarjeta completa y notificaciones', status: 'Aceptada · 2026-10-26', body: 'ProgramCard en Figma es la tarjeta completa: portada, insignia, precio y acción. Cada notificación sin leer es una pieza propia con inset de 4 px.', note: 'La separación de notificaciones queda abierta a ajuste.' },
]

export function buildPageData() {
  const docs = buildDocs()
  const counts = new Map()
  for (const d of docs) counts.set(d.category, (counts.get(d.category) || 0) + 1)
  const order = ['Reading', 'Actions', 'Data display', 'Forms', 'Navigation', 'Overlays', 'Feedback', 'Layout']
  return {
    version: JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version,
    components: docs.length,
    tokens: countTokens(),
    families: order.filter((n) => counts.has(n)).map((name) => ({ name, count: counts.get(name), note: FAMILY_NOTES[name] })),
    newDdrs: NEW_DDRS,
    repo: 'https://github.com/lermajonathan/kafka-ds',
    phosphor: 'https://phosphoricons.com',
  }
}

export function pageCall(id) {
  if (!PAGES.includes(id)) throw new Error('unknown page id: ' + id)
  const code = readFileSync(new URL(`../../figma/pages/${id}.js`, import.meta.url), 'utf8')
  return `const DATA = ${JSON.stringify(buildPageData())}
const AF = Object.getPrototypeOf(async function () {}).constructor
return await new AF('figma', 'DATA', ${JSON.stringify(code)})(figma, DATA)`
}
