import { Hono } from 'hono'
import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Home } from './pages/home.tsx'
import { ScopedDemo } from './pages/scoped.tsx'
import { CodeBreak } from './pages/code-break.tsx'

const app = new Hono()

app.use(
  jsxRenderer(({ children }) => (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sensible UI</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
        />
        <link rel="stylesheet" href="./index.css" />
        <link rel="stylesheet" href="./utilities.css" />
        <link rel="stylesheet" href="./code.css" />
        <link rel="stylesheet" href="./site.css" />
        <script src="./site.js" defer></script>
        <script src="./code.js" type="module"></script>
      </head>
      <body>{children}</body>
    </html>
  )),
)

app.get('/', (context) => context.render(<Home />))
app.get('/code-break', (context) => context.render(<CodeBreak />))
app.get('/scoped/', (context) =>
  context.html(html`<!DOCTYPE html>${<ScopedDemo />}`),
)

export default app
