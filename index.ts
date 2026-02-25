import homepage from './index.html'

const server = Bun.serve({
  routes: {
    '/': homepage,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`semantics/ui dev server running at ${server.url}`)
