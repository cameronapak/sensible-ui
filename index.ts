import homepage from './src/html/index.html'
import demoB from './src/html/demo-b.html'
import demoC from './src/html/demo-c.html'

const server = Bun.serve({
  routes: {
    '/': homepage,
    '/demo-b': demoB,
    '/demo-c': demoC,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`Sensible UI dev server running at ${server.url}`)
