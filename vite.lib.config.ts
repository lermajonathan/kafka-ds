// Builds the publishable @kafka/react package into packages/react/dist.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    outDir: 'packages/react/dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: { entry: 'src/lib.ts', formats: ['es'], fileName: () => 'index.js', cssFileName: 'styles' },
    rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/, /^@phosphor-icons\/react($|\/)/] },
  },
})
