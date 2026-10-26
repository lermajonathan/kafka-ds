// Docs site: React app in /site, built from docs/*.md and the live examples. Served from GitHub Pages under /kafka-ds/.
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
// @ts-expect-error — plain ES module without types
import { buildSiteData } from './scripts/site/data.mjs'

const VIRTUAL = 'virtual:kafka-site'
const PAGE = 'virtual:kafka-site-page/'
const THEME_KEY = 'kafka-site-theme'
// Same logic as themeInitScript(): the first paint already has the reader's theme.
const themeInit = `(function(){try{var m=localStorage.getItem(${JSON.stringify(THEME_KEY)})||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.setAttribute('data-theme',d?'dark':'light');e.style.colorScheme=d?'dark':'light'}catch(e){}})()`

/** Exposes the markdown-derived data. The index (names, summaries, counts) is one small module; each page's html and
 *  each component's examples are their own chunk, fetched when the page opens. Nothing generated is committed. */
function siteData(): Plugin {
  const root = import.meta.dirname
  let cache: ReturnType<typeof buildSiteData> | null = null
  const load = () => (cache ??= buildSiteData({ root }))
  const withoutHtml = <T extends { html?: string }>(x: T) => { const { html: _html, ...rest } = x; return rest }
  return {
    name: 'kafka-site-data',
    buildStart() { cache = null },
    handleHotUpdate() { cache = null },
    resolveId: (id) => (id === VIRTUAL || id.startsWith(PAGE) ? '\0' + id : undefined),
    load(id) {
      if (!id.startsWith('\0' + VIRTUAL)) return
      this.addWatchFile(resolve(root, 'docs'))
      const data = load()
      if (id.startsWith('\0' + PAGE)) {
        const route = id.slice(('\0' + PAGE).length)
        const page = [...data.pages, ...data.components, ...data.decisions].find((p: { path: string }) => p.path === route)
        if (!page) throw new Error(`no page for ${route}`)
        return `export default ${JSON.stringify(page.html)}`
      }
      const pages = [...data.pages, ...data.components, ...data.decisions]
      const loaders = pages.map((p: { path: string }) => `${JSON.stringify(p.path)}: () => import(${JSON.stringify(PAGE + p.path)}).then((m) => m.default)`)
      const examples = data.components.map((c: { id: string }) => `${JSON.stringify(c.id)}: () => import(${JSON.stringify('@examples/' + c.id)}).then((m) => m.examples)`)
      const index = { ...data, components: data.components.map(withoutHtml), decisions: data.decisions.map(withoutHtml), pages: data.pages.map(withoutHtml) }
      return `export default ${JSON.stringify(index)}\nexport const pageLoaders = {\n${loaders.join(',\n')}\n}\nexport const exampleLoaders = {\n${examples.join(',\n')}\n}`
    },
    transformIndexHtml: (html) => html.replace('<!--theme-init-->', `<script>${themeInit}</script>`),
  }
}

export default defineConfig({
  root: 'site',
  base: process.env.KAFKA_SITE_BASE ?? '/kafka-ds/',
  publicDir: resolve(import.meta.dirname, 'playground/public'), // portada.svg, avatar.svg and embed-demo.html used by the examples
  plugins: [react(), tailwindcss(), siteData()],
  resolve: {
    alias: [
      { find: '@examples', replacement: resolve(import.meta.dirname, 'examples') },
      { find: '@', replacement: resolve(import.meta.dirname, 'src') },
      // Examples use root-relative asset paths; under /kafka-ds/ they need the base. See site/jsx-runtime.ts.
      { find: /^react\/jsx-runtime$/, replacement: resolve(import.meta.dirname, 'site/jsx-runtime.ts') },
      { find: /^react\/jsx-dev-runtime$/, replacement: resolve(import.meta.dirname, 'site/jsx-dev-runtime.ts') },
    ],
  },
  build: { outDir: '../dist/site', emptyOutDir: true },
  server: { host: '0.0.0.0' },
})
