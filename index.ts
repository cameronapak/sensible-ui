import homepage from './index.html'

const server = Bun.serve({
  routes: {
    '/': homepage,
  },
  development: true,
})

console.log(`Semantic UI dev server running at ${server.url}`)
