/** @jsxImportSource mono-jsx */
import { buildRoutes } from 'mono-jsx'
import { Home } from './src/pages/home.tsx'

const routes = {
  '/': Home,
}

const server = Bun.serve({
  development: {
    hmr: true,
    console: true,
  },
  routes: {
    ...buildRoutes((req) => (
      <html request={req} routes={routes}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/index.css" />
        </head>

        <router />
      </html>
    )),
    '/index.css': Bun.file('./dist/sensible-ui.css'),
  },
})

console.log(`Sensible UI dev server running at ${server.url}`)
