/// <reference types="vite/client" />
declare module 'virtual:kafka-site' {
  import type { Example } from '../examples/types'
  interface Page { path: string; title: string }
  interface Component { id: string; path: string; name: string; summary: string }
  interface Decision { id: string; path: string; title: string; status: string }
  const data: {
    version: string
    counts: { components: number; tokens: number; decisions: number }
    components: Component[]
    families: { name: string; ids: string[] }[]
    decisions: Decision[]
    pages: Page[]
    repo: string
  }
  export default data
  /** The html of a page, fetched when it opens. */
  export const pageLoaders: Record<string, () => Promise<string>>
  /** The runnable examples of a component, fetched when its page opens. */
  export const exampleLoaders: Record<string, () => Promise<Example[]>>
}
