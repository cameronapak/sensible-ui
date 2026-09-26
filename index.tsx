import app from './src/app.tsx'

const server = Bun.serve({
  routes: {
    '/index.css': Bun.file('./dist/sensible-ui.css'),
    '/utilities.css': Bun.file('./dist/sensible-ui.utilities.css'),
    '/site.css': Bun.file('./src/site.css'),
    '/site.js': Bun.file('./src/site.js'),
  },
  fetch: app.fetch,
})

console.log(`Sensible UI dev server running at ${server.url}`)
