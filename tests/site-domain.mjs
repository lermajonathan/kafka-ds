// The docs site answers at its own domain (DDR-KF-020): the build ships a CNAME with that domain and is served from "/".
import fs from 'node:fs'

const DOMAIN = 'kafka-ds.jonathanlerma.com'
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

// 1. GitHub Pages keeps the custom domain only if every deployment carries a CNAME file with it.
const cname = fs.existsSync(new URL('../playground/public/CNAME', import.meta.url)) ? read('playground/public/CNAME').trim() : null
check(cname === DOMAIN, `playground/public/CNAME must contain "${DOMAIN}" (it was ${cname === null ? 'missing' : `"${cname}"`})`)

// 2. At its own domain the site lives at the root: the default base is "/", not "/kafka-ds/".
const config = read('vite.site.config.ts')
check(/KAFKA_SITE_BASE \?\? '\/'/.test(config), `vite.site.config.ts: the default base must be '/'`)
check(!/\/kafka-ds\//.test(config.replace(/github\.com\/lermajonathan\/kafka-ds/g, '')), 'vite.site.config.ts: no reference to the /kafka-ds/ path may remain')

if (failures.length) { console.error(failures.map((f) => `✗ ${f}`).join('\n')); process.exit(1) }
console.log(`site domain: ${DOMAIN} (CNAME + base "/") ok`)
