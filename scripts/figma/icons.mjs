// Icon payload: the Phosphor selection in src/icons.tsx, one SVG per weight (DDR-KF-002 uses all five).
// Rendered with the real @phosphor-icons/react so Figma matches the code pixel for pixel.
import fs from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as Phosphor from '@phosphor-icons/react'

export const WEIGHTS = ['regular', 'bold', 'light', 'fill', 'duotone']

export function buildIcons() {
  const src = fs.readFileSync(new URL('../../src/icons.tsx', import.meta.url), 'utf8')
  return [...src.matchAll(/export const (Icon[A-Za-z]+): IconType = ([A-Za-z]+)/g)].map(([, name, phosphor]) => {
    const Component = Phosphor[phosphor]
    if (!Component) throw new Error(`${phosphor} is not a Phosphor icon`)
    const weights = Object.fromEntries(WEIGHTS.map((weight) => {
      const svg = renderToStaticMarkup(createElement(Component, { weight, size: 24 }))
      return [weight, svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replaceAll('></path>', '/>')] // inner paths only
    }))
    return { name, phosphor, weights }
  })
}
