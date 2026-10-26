// Docs site: React app in /site, built from docs/*.md and the live examples. Served from GitHub Pages under /kafka-ds/.
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
// @ts-expect-error — plain ES module without types
import { buildSiteData } from './scripts/site/data.mjs'

const VIRTUAL = 'virtual:kafka-site'
const THEME_KEY = 'kafka-site-theme'
// Same logic as themeInitScript(): the first paint already has the reader's theme.
const themeInit = `(function(){try{var m=localStorage.getItem(${JSON.stringify(THEME_KEY)})||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.setAttribute('data-theme',d?'dark':'light');e.style.colorScheme=d?'dark':'light'}catch(e){}})()`

/** Exposes the markdown-derived data as one module, so nothing generated is committed. */
function siteData(): Plugin {
  return {
    name: 'kafka-site-data',
    resolveId: (id) => (id === VIRTUAL ? '\0' + VIRTUAL : undefined),
    load(id) {
      if (id !== '\0' + VIRTUAL) return
      this.addWatchFile(resolve(import.meta.dirname, 'docs'))
      return `export default ${JSON.stringify(buildSiteData({ root: import.meta.dirname }))}`
    },
    transformIndexHtml: (html) => html.replace('<!--theme-init-->', `<script>${themeInit}</script>`),
  }
}

export default defineConfig({
  root: 'site',
  base: process.env.KAFKA_SITE_BASE ?? '/kafka-ds/',
  publicDir: resolve(import.meta.dirname, 'playground/public'), // portada.svg, avatar.svg and embed-demo.html used by the examples
  plugins: [react(), tailwindcss(), siteData()],
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src'), '@examples': resolve(import.meta.dirname, 'examples') } },
  build: { outDir: '../dist/site', emptyOutDir: true },
  server: { host: '0.0.0.0' },
})
