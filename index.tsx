import app from './src/app.tsx'

const server = Bun.serve({
  routes: {
    '/index.css': Bun.file('./dist/sensible-ui.css'),
    '/code.css': Bun.file('./src/css/code.css'),
    '/code.js': Bun.file('./dist/sensible-code.js'),
    '/input-group.js': Bun.file('./dist/sensible-input-group.js'),
    '/tooltip.js': Bun.file('./dist/sensible-tooltip.js'),
    '/scoped.css': Bun.file('./dist/scoped/sensible-ui.css'),
    '/utilities.css': Bun.file('./dist/sensible-ui.utilities.css'),
    '/site.css': Bun.file('./src/site.css'),
    '/site.js': Bun.file('./src/site.js'),
    '/favicon.ico': Bun.file('./src/favicon.ico'),
    '/favicon.svg': Bun.file('./src/favicon.svg'),
    '/og-image.png': Bun.file('./src/og-image.png'),
  },
  fetch: app.fetch,
})

console.log(`Sensible UI dev server running at ${server.url}`)
