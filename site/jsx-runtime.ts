// The examples point at files served from the root ("/portada.svg"). The site lives under a base path (/kafka-ds/),
// so every host element gets its root-relative src/href/poster prefixed as it is created: no request ever goes to the wrong place.
// Vite aliases react/jsx-runtime to this file for the site only; the library and the playground are untouched.
// @ts-expect-error — the real runtime, imported by path because "react/jsx-runtime" is aliased to this file
import * as runtime from '../node_modules/react/jsx-runtime.js'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const URL_PROPS = ['src', 'href', 'poster'] as const

export function withBase(type: unknown, props: Record<string, unknown>) {
  if (typeof type !== 'string' || !BASE) return props
  let next = props
  for (const name of URL_PROPS) {
    const v = props[name]
    if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(BASE + '/')) next = { ...next, [name]: BASE + v }
  }
  return next
}

export const Fragment = runtime.Fragment
export const jsx = (type: unknown, props: Record<string, unknown>, ...rest: unknown[]) => runtime.jsx(type, withBase(type, props), ...rest)
export const jsxs = (type: unknown, props: Record<string, unknown>, ...rest: unknown[]) => runtime.jsxs(type, withBase(type, props), ...rest)
