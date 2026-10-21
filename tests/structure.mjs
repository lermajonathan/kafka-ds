// Structural rules for the token files (the ones Pance learned the hard way, see its audit §6):
//   1. Components read semantic or component tokens, never raw colour, shadow, type, radius, motion, opacity or layer primitives.
//      Scale primitives (space, size, border width, measure, breakpoint) are allowed on purpose.
//   2. Every token with a dark value resolves in both modes, and every alias resolves.
//   3. Scales are monotonic (breakpoints, layers, type sizes, spacing).
//   4. Every colour token is an actual colour once resolved.
import fs from 'node:fs'

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../tokens/${f}.json`, import.meta.url), 'utf8'))
const tokens = new Map()
const walk = (node, path, tier, type) => {
  const t = node.$type ?? type
  if ('$value' in node) { tokens.set(path.join('.'), { path, tier, type: t, value: node.$value, dark: node.$extensions?.['kafka.modes']?.dark }); return }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...path, k], tier, t)
}
for (const tier of ['primitives', 'semantic', 'components']) walk(read(tier), [], tier, undefined)

const REF = /^\{([^}]+)\}$/
const errors = []
const fail = (m) => errors.push(m)
const resolve = (raw, mode, key, depth = 0) => {
  if (depth > 20) { fail(`${key}: alias loop`); return undefined }
  const m = typeof raw === 'string' && raw.match(REF)
  if (!m) return raw
  const t = tokens.get(m[1])
  if (!t) { fail(`${key}: unresolved alias {${m[1]}}`); return undefined }
  return resolve(mode === 'dark' && t.dark !== undefined ? t.dark : t.value, mode, m[1], depth + 1)
}

// 1 · components must not reach into primitives for anything but scales
const SCALE_ROOTS = new Set(['space', 'size', 'borderWidth', 'measure', 'breakpoint'])
const refsOf = (v) => (typeof v === 'string' ? [...v.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]) : v && typeof v === 'object' ? Object.values(v).flatMap(refsOf) : [])
for (const [key, tok] of tokens) {
  if (tok.tier !== 'components') continue
  for (const ref of refsOf(tok.value)) {
    const target = tokens.get(ref)
    if (target?.tier === 'primitives' && !SCALE_ROOTS.has(ref.split('.')[0])) fail(`${key}: aliases the primitive {${ref}}; go through a semantic token`)
  }
}

// 2 · both modes resolve
let modeChecked = 0
for (const [key, tok] of tokens) {
  for (const mode of ['light', 'dark']) {
    const v = resolve(mode === 'dark' && tok.dark !== undefined ? tok.dark : tok.value, mode, key)
    modeChecked++
    // 4 · colours
    if (tok.type === 'color' && v !== undefined && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(String(v))) fail(`${key}: "${v}" is not a colour`)
  }
}

// 3 · monotonic scales
const num = (key, mode = 'light') => { const t = tokens.get(key); const v = resolve(t.value, mode, key); return parseFloat(String(v)) * (/rem$/.test(String(v)) ? 16 : 1) }
const increasing = (what, keys) => { const vals = keys.map((k) => num(k)); vals.slice(1).forEach((v, i) => { if (!(v > vals[i])) fail(`${what}: ${keys[i + 1]} (${v}) must be greater than ${keys[i]} (${vals[i]})`) }) }
increasing('breakpoints', ['breakpoint.sm', 'breakpoint.md', 'breakpoint.lg', 'breakpoint.xl'])
increasing('layers', ['zIndex.base', 'zIndex.sticky', 'zIndex.dropdown', 'zIndex.overlay', 'zIndex.modal', 'zIndex.toast', 'zIndex.tooltip'])
increasing('durations', ['duration.fast', 'duration.base', 'duration.slow', 'duration.shine'])
increasing('type scale', ['fontSize.12', 'fontSize.14', 'fontSize.16', 'fontSize.18', 'fontSize.20', 'fontSize.24', 'fontSize.32', 'fontSize.44', 'fontSize.64'])
increasing('radius', ['radius.4', 'radius.8', 'radius.12', 'radius.16', 'radius.20'])
// print leading must sit on the baseline grid (multiples of 3.5pt)
const base = parseFloat(resolve('{physical.baseline}', 'light', 'physical.baseline'))
for (const [key, tok] of tokens) {
  if (!key.startsWith('physical.leading.')) continue
  const n = parseFloat(tok.value) / base
  if (Math.abs(n - Math.round(n)) > 1e-9) fail(`${key}: ${tok.value} is not a multiple of the ${base}pt baseline`)
}
// touch target never below 44px, focus ring never below 2px
if (num('size.touch') < 44) fail('size.touch must be at least 44px')
if (num('borderWidth.thick') < 2) fail('focus ring (borderWidth.thick) must be at least 2px')

console.log(`  ${tokens.size} tokens · ${modeChecked} resolutions checked in light and dark`)
if (errors.length) { console.log(errors.map((e) => `  ✗ ${e}`).join('\n')); process.exit(1) }
console.log('✓ Token structure is sound')
