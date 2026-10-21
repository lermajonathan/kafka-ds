// Playground: renders every example in /examples. Used by the keyboard, axe and visual tests (and, in H7, the docs site).
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'playground',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src'), '@examples': resolve(import.meta.dirname, 'examples') } },
  build: { outDir: '../dist/playground', emptyOutDir: true },
  server: { host: '0.0.0.0' },
})
