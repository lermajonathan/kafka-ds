/// <reference types="vite/client" />
declare module 'virtual:kafka-site' {
  interface Page { path: string; title: string; html: string }
  interface Component { id: string; path: string; name: string; summary: string; html: string }
  interface Decision { id: string; path: string; title: string; status: string; html: string }
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
}
