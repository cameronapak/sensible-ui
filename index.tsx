import homepage from './src/html/index.html'

const server = Bun.serve({
  development: {
    hmr: true,
    console: true,
  },
  routes: {
    '/': homepage,
  },
})

console.log(`Sensible UI dev server running at ${server.url}`)
