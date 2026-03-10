import homepage from './index.html'
import demo from './screenshots-page.html'

const server = Bun.serve({
  routes: {
    '/': homepage,
    '/demo': demo,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`semantics/ui dev server running at ${server.url}`)
