import { Hono } from 'hono'
import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Home } from './pages/home.tsx'
import { ScopedDemo } from './pages/scoped.tsx'
import { CodeBreak } from './pages/code-break.tsx'
import { TableBreak } from './pages/table-break.tsx'

const siteUrl = 'https://sensibleui.com/'
const title = 'Sensible UI: Bring the beauty of shadcn/ui to plain HTML'
const description =
  'Sensible UI styles native HTML with readable CSS and theme variables. Use the whole stylesheet, import one component, or limit it to one section of an existing app.'
const imageAlt =
  'Bring the beauty of shadcn/ui to plain HTML. Sign-up, notification, and question cards styled by Sensible UI.'

const app = new Hono()

app.use(
  jsxRenderer(({ children }) => (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="./favicon.ico" sizes="32x32" />
        <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sensible UI" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={imageAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}og-image.png`} />
        <meta name="twitter:image:alt" content={imageAlt} />
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
        <script src="./input-group.js" type="module"></script>
        <script src="./tooltip.js" type="module"></script>
      </head>
      <body>{children}</body>
    </html>
  )),
)

app.get('/', (context) => context.render(<Home />))
app.get('/code-break', (context) => context.render(<CodeBreak />))
app.get('/table-break', (context) =>
  context.render(
    <TableBreak data={context.req.query('data')} width={context.req.query('width')} />,
  ),
)
app.get('/scoped/', (context) =>
  context.html(html`<!DOCTYPE html>${<ScopedDemo />}`),
)

export default app
