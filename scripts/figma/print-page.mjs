// Prints the full use_figma body that rebuilds one Phase B page:  node scripts/figma/print-page.mjs <cover|getting-started|icons|decisions>
import { pageCall } from './pages.mjs'
console.log(pageCall(process.argv[2]))
