import { html } from 'hono/html'

export function ScopedDemo() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Scoped mode - Sensible UI</title>
        <link rel="stylesheet" href="../scoped.css" />
        <style>{html`
          body {
            margin: 0;
            padding: 2rem;
            background: #f3efe7;
            color: #352f27;
            font-family: Georgia, serif;
          }

          main {
            max-width: 64rem;
            margin-inline: auto;
          }

          .comparison {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
            gap: 1.5rem;
            align-items: start;
          }

          .test-panel {
            min-height: 21rem;
            padding: 1.5rem;
            border: 2px dashed #9a8f7e;
          }

          .test-panel > small {
            display: block;
            margin-bottom: 1rem;
            font-family: ui-monospace, monospace;
          }

          #outside-button {
            border: 3px ridge #ca8a04;
            background: #fef3c7;
            color: #713f12;
          }

          #direct-code {
            display: block;
            width: fit-content;
            margin-bottom: 0.75rem;
          }

          #direct-button {
            margin-bottom: 1rem;
          }

          @media (width < 40rem) {
            body { padding: 1rem; }
          }
        `}</style>
      </head>
      <body>
        <main>
          <h1>Scoped mode</h1>
          <p>
            The left panel keeps host styles. The other panels opt in with{' '}
            <code>.sensible-ui</code>.
          </p>

          <div class="comparison">
            <section class="test-panel" id="outside">
              <small>Outside the scope</small>
              <h2>Legacy account</h2>
              <p>These elements keep the host application’s defaults.</p>
              <label for="outside-name">Display name</label>
              <input id="outside-name" value="Ada" />
              <button id="outside-button">Save changes</button>
            </section>

            <section class="test-panel sensible-ui" id="inside">
              <small>Inside .sensible-ui</small>
              <code id="direct-code">Direct-child code</code>
              <button id="direct-button" data-variant="outline">
                Direct-child button
              </button>
              <div class="card">
                <header>
                  <h2>Account settings</h2>
                  <p>Semantic elements receive Sensible UI styles.</p>
                </header>
                <section>
                  <label for="inside-name">Display name</label>
                  <input id="inside-name" value="Ada" />
                </section>
                <footer>
                  <button>Save changes</button>
                </footer>
              </div>
            </section>

            <section class="test-panel sensible-ui dark" id="inside-dark">
              <small>Inside .sensible-ui.dark</small>
              <div class="card">
                <header>
                  <h2>Dark settings</h2>
                  <p>Dark tokens are local to this scope.</p>
                </header>
                <section>
                  <label for="dark-name">Display name</label>
                  <input id="dark-name" value="Ada" />
                </section>
                <footer>
                  <button>Save changes</button>
                </footer>
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  )
}
