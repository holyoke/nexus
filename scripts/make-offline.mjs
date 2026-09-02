import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve('dist')
const html = await readFile(resolve(dist, 'index.html'), 'utf8')
const scriptPath = html.match(/<script[^>]+src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/)?.[1]
const stylePath = html.match(/<link[^>]+href="\.\/(assets\/[^"]+\.css)"[^>]*>/)?.[1]

if (!scriptPath || !stylePath) throw new Error('Unable to locate Vite build assets')

const [script, style] = await Promise.all([
  readFile(resolve(dist, scriptPath), 'utf8'),
  readFile(resolve(dist, stylePath), 'utf8'),
])

const offline = html
  .replace(/<script[^>]+src="\.\/assets\/[^"]+\.js"[^>]*><\/script>/, `<script>${script.replaceAll('</script>', '<\\/script>')}</script>`)
  .replace(/<link[^>]+href="\.\/assets\/[^"]+\.css"[^>]*>/, `<style>${style.replaceAll('</style>', '<\\/style>')}</style>`)

await writeFile(resolve(dist, 'offline.html'), offline, 'utf8')
console.log('Created dist/offline.html')
