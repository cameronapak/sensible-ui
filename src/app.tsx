import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Home } from './pages/home.tsx'

const app = new Hono()

app.use(
  jsxRenderer(({ children }) => (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sensible UI</title>
        <link rel="stylesheet" href="./index.css" />
      </head>
      <body>{children}</body>
    </html>
  )),
)

app.get('/', (context) => context.render(<Home />))

export default app
