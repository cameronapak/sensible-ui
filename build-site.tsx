import { mkdir } from 'node:fs/promises'
import app from './src/app.tsx'

const output = './dist/static'
await mkdir(output, { recursive: true })

const response = await app.request('/')
if (!response.ok) {
  throw new Error(`Failed to render the static site: ${response.status}`)
}

await Promise.all([
  Bun.write(`${output}/index.html`, await response.text()),
  Bun.write(`${output}/index.css`, Bun.file('./dist/sensible-ui.css')),
  Bun.write(`${output}/utilities.css`, Bun.file('./dist/sensible-ui.utilities.css')),
  Bun.write(`${output}/site.css`, Bun.file('./src/site.css')),
  Bun.write(`${output}/site.js`, Bun.file('./src/site.js')),
])
