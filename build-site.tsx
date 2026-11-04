import { mkdir } from 'node:fs/promises'
import app from './src/app.tsx'

const output = './dist/static'
await mkdir(output, { recursive: true })
await mkdir(`${output}/scoped`, { recursive: true })

const response = await app.request('/')
if (!response.ok) {
  throw new Error(`Failed to render the static site: ${response.status}`)
}

const scopedResponse = await app.request('/scoped/')
if (!scopedResponse.ok) {
  throw new Error(`Failed to render the scoped demo: ${scopedResponse.status}`)
}
const scopedHtml = await scopedResponse.text()
if (!scopedHtml.startsWith('<!DOCTYPE html>')) {
  throw new Error('The scoped demo must render in standards mode')
}

await Promise.all([
  Bun.write(`${output}/index.html`, await response.text()),
  Bun.write(`${output}/scoped/index.html`, scopedHtml),
  Bun.write(`${output}/index.css`, Bun.file('./dist/sensible-ui.css')),
  Bun.write(`${output}/code.css`, Bun.file('./src/css/code.css')),
  Bun.write(`${output}/code.js`, Bun.file('./dist/sensible-code.js')),
  Bun.write(`${output}/input-group.js`, Bun.file('./dist/sensible-input-group.js')),
  Bun.write(`${output}/tooltip.js`, Bun.file('./dist/sensible-tooltip.js')),
  Bun.write(`${output}/scoped.css`, Bun.file('./dist/scoped/sensible-ui.css')),
  Bun.write(`${output}/utilities.css`, Bun.file('./dist/sensible-ui.utilities.css')),
  Bun.write(`${output}/site.css`, Bun.file('./src/site.css')),
  Bun.write(`${output}/site.js`, Bun.file('./src/site.js')),
  Bun.write(`${output}/favicon.ico`, Bun.file('./src/favicon.ico')),
  Bun.write(`${output}/favicon.svg`, Bun.file('./src/favicon.svg')),
  Bun.write(`${output}/og-image.png`, Bun.file('./src/og-image.png')),
])
