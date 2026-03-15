import homepage from './index.html'
import demo from './screenshots-page.html'
import demo2 from './dropin-template.html'

const server = Bun.serve({
  routes: {
    '/': homepage,
    '/demo': demo,
    '/demo-2': demo2,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`Sensible UI dev server running at ${server.url}`)
