// Figma payload: turns tokens/*.json into the variable collections of the Kafka Figma library.
//   Primitives (1 mode: Value, hidden scopes)  ·  Semantic (Light / Dark)  ·  Components (aliases only; follows Semantic's mode)
// Typography, shadow and gradient tokens are not variables: they become text, effect and paint styles (scripts/figma/styles.mjs).
import fs from 'node:fs'

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../../tokens/${f}.json`, import.meta.url), 'utf8'))
const REF = /^\{([^}]+)\}$/
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const TIERS = [
  { tier: 'primitives', name: 'Primitives', modes: ['Value'] },
  { tier: 'semantic', name: 'Semantic', modes: ['Light', 'Dark'] },
  { tier: 'components', name: 'Components', modes: ['Default'] },
]
const STYLE_TYPES = new Set(['typography', 'shadow', 'gradient'])

function loadTokens() {
  const tokens = new Map()
  const walk = (node, path, tier, type) => {
    const t = node.$type ?? type
    if ('$value' in node) {
      // A few primitive groups (the status hues) inherit no $type; the root name tells.
      const inferred = t ?? (path[0] === 'color' ? 'color' : undefined)
      tokens.set(path.join('.'), { key: path.join('.'), path, tier, type: inferred, value: node.$value, dark: node.$extensions?.['kafka.modes']?.dark, description: node.$description })
      return
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...path, k], tier, t)
  }
  for (const { tier } of TIERS) walk(read(tier), [], tier, undefined)
  return tokens
}

const finalToken = (tokens, tok) => {
  const m = typeof tok.value === 'string' && tok.value.match(REF)
  return m ? finalToken(tokens, tokens.get(m[1])) : tok
}
const hex = (v) => {
  const s = String(v).toLowerCase()
  return /^#[0-9a-f]{3}$/.test(s) ? `#${[...s.slice(1)].map((c) => c + c).join('')}` : s
}
// Literal → Figma value + variable type
function literal(type, raw) {
  if (type === 'color') return { type: 'COLOR', value: hex(raw) }
  if (type === 'fontFamily') return { type: 'STRING', value: Array.isArray(raw) ? raw.join(', ') : String(raw) }
  if (type === 'cubicBezier') return { type: 'STRING', value: String(raw) }
  if (type === 'duration') return { type: 'FLOAT', value: parseFloat(raw) }
  if (type === 'number' || type === 'fontWeight' || type === 'opacity') return { type: 'FLOAT', value: Number(raw) }
  if (type === 'dimension') {
    const m = String(raw).match(/^(-?[\d.]+)(px|rem|em)?$/)
    if (!m) return { type: 'STRING', value: String(raw) } // ch, mm, pt, % — kept as written
    const n = parseFloat(m[1])
    return { type: 'FLOAT', value: m[2] === 'rem' ? n * 16 : m[2] === 'em' ? n * 100 : n } // em → percent, as Figma letter spacing
  }
  throw new Error(`Unsupported token type ${type}`)
}

// The role word nearest the end of the name decides: "option-hover-bg" → fill, "checked-fg" → text, "invalid-border" → stroke.
// Modifiers (hover, brand, selected, checked…) carry no role and are skipped.
const STROKE_WORDS = new Set(['border', 'stroke', 'outline', 'ring', 'rule', 'line', 'separator', 'divider', 'arc', 'focus'])
const TEXT_WORDS = new Set(['fg', 'text', 'attribution', 'credit', 'name', 'role', 'bio', 'hint', 'error', 'required', 'description', 'legend', 'direction', 'value', 'current', 'caption', 'title', 'label', 'link', 'dropcap', 'ellipsis', 'empty', 'weekday', 'action', 'icon', 'placeholder', 'subtitle', 'body', 'meta', 'message', 'number', 'count', 'ink', 'muted', 'soft', 'heading'])
const FILL_WORDS = new Set(['bg', 'surface', 'fill', 'track', 'thumb', 'rail', 'scrim', 'overlay', 'page', 'sunken', 'shimmer', 'shine', 'dot', 'tone', 'status', 'handle', 'bar', 'highlight', 'indicator', 'glow', 'range', 'mark', 'progress', 'cover', 'facade'])
function colorScopes(path) {
  const words = path.flatMap((seg) => seg.split('-')).reverse()
  if (path[0] === 'color' && path[1] === 'shadow') return ['EFFECT_COLOR']
  for (const w of words) {
    if (w === 'shadow') return ['EFFECT_COLOR']
    if (STROKE_WORDS.has(w)) return ['STROKE_COLOR']
    if (TEXT_WORDS.has(w)) return ['TEXT_FILL', 'SHAPE_FILL']
    if (FILL_WORDS.has(w)) return ['FRAME_FILL', 'SHAPE_FILL']
  }
  return ['ALL_FILLS']
}
function floatScopes(path, kind) {
  const [root] = path
  const leaf = path[path.length - 1]
  if (root === 'fontSize') return ['FONT_SIZE']
  if (root === 'lineHeight') return ['LINE_HEIGHT']
  if (root === 'fontWeight') return ['FONT_WEIGHT']
  if (root === 'letterSpacing') return ['LETTER_SPACING']
  if (root === 'space') return ['GAP']
  if (root === 'radius') return ['CORNER_RADIUS']
  if (root === 'borderWidth') return ['STROKE_FLOAT']
  if (root === 'size') return ['WIDTH_HEIGHT']
  if (root === 'opacity' || /opacity/.test(leaf)) return ['OPACITY']
  if (/radius/.test(leaf)) return ['CORNER_RADIUS']
  if (/^(padding|gap|space|margin|indent|offset-gap)/.test(leaf)) return ['GAP']
  if (/(border-width|stroke|thickness|^width$)/.test(leaf) && /border|stroke|thickness/.test(leaf)) return ['STROKE_FLOAT']
  if (/(height|width|size|^min-|^max-|track|thumb|dot|icon)/.test(leaf)) return ['WIDTH_HEIGHT']
  return kind === 'dimension' ? ['WIDTH_HEIGHT', 'GAP'] : []
}

export function buildPayload() {
  const tokens = loadTokens()
  const info = Object.fromEntries(TIERS.map((t) => [t.tier, t]))
  const eligible = (tok) => !STYLE_TYPES.has(finalToken(tokens, tok).type)
  const ref = (tok) => `${info[tok.tier].name}/${tok.path.join('/')}`
  const collections = TIERS.map(({ tier, name, modes }) => {
    const variables = []
    for (const tok of tokens.values()) {
      if (tok.tier !== tier || !eligible(tok)) continue
      const end = finalToken(tokens, tok)
      const lit = literal(end.type, end.value)
      const valueFor = (raw) => {
        const m = typeof raw === 'string' && raw.match(REF)
        if (m) return { alias: ref(tokens.get(m[1])) }
        return { value: literal(end.type, raw).value }
      }
      const values = {}
      for (const mode of modes) values[mode] = valueFor(mode === 'Dark' && tok.dark !== undefined ? tok.dark : tok.value)
      const scopes = tier === 'primitives' ? [] : lit.type === 'COLOR' ? colorScopes(tok.path) : lit.type === 'FLOAT' ? floatScopes(tok.path, end.type) : end.type === 'fontFamily' ? ['FONT_FAMILY'] : []
      const v = { name: tok.path.join('/'), type: lit.type, scopes, syntax: `var(--kafka-${kebab(tok.path.join('-'))})`, values }
      if (tok.description && tier !== 'components') v.description = tok.description
      variables.push(v)
    }
    return { key: name, name, modes, variables }
  })
  return { collections }
}
