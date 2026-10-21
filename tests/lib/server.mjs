// Shared helpers for the browser tests: start `vite preview` on the built playground, open pages, clean up.
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

export const PORT = Number(process.env.KAFKA_TEST_PORT ?? 4173)
export const BASE = process.env.KAFKA_TEST_URL ?? `http://localhost:${PORT}`

async function up() {
  try { return (await fetch(BASE)).ok } catch { return false }
}

/** Uses a server that is already running (CI, local), or starts `vite preview` and stops it afterwards. */
export async function withBrowser(run) {
  let server
  if (!(await up())) {
    server = spawn('pnpm', ['exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
    for (let i = 0; i < 50 && !(await up()); i++) await new Promise((r) => setTimeout(r, 200))
    if (!(await up())) { server.kill(); throw new Error('Could not start vite preview. Run `pnpm build` first.') }
  }
  const browser = await chromium.launch()
  try { return await run(browser) } finally { await browser.close(); server?.kill() }
}

export const url = (params = {}) => `${BASE}/?${new URLSearchParams(params)}`
