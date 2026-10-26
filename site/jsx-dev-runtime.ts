// Development twin of jsx-runtime.ts (vite dev uses react/jsx-dev-runtime).
// @ts-expect-error — the real runtime, imported by path because "react/jsx-dev-runtime" is aliased to this file
import * as runtime from '../node_modules/react/jsx-dev-runtime.js'
import { withBase } from './jsx-runtime'

export const Fragment = runtime.Fragment
export const jsxDEV = (type: unknown, props: Record<string, unknown>, ...rest: unknown[]) => runtime.jsxDEV(type, withBase(type, props), ...rest)
