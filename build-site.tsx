/** @jsxImportSource mono-jsx */
import { mkdir } from 'node:fs/promises'
import { Home } from './src/pages/home.tsx'

const output = './dist/static'
await mkdir(output, { recursive: true })

const page = (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Sensible UI</title>
      <link rel="stylesheet" href="./index.css" />
    </head>
    <body>
      <Home title="Sensible UI" />
    </body>
  </html>
)

await Promise.all([
  Bun.write(`${output}/index.html`, await page.text()),
  Bun.write(`${output}/index.css`, Bun.file('./dist/sensible-ui.css')),
])
