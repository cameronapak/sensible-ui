/** @jsxImportSource mono-jsx */

interface Props {
  title: string
}

interface State {
  title: string
}

export function Home(this: FC<State>, props: Props) {
  this.title = props.title

  return (
    <main class="container">
      <h1>Sensible UI CSS</h1>
      <p class="text-muted-foreground">
        <code>shadcn/ui</code> style primitives using semantic CSS
      </p>

      <nav class="x-stack flex-wrap gap-1!">
        <a
          href="#typography"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('typography')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Typography
        </a>
        <a
          href="#buttons"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('buttons')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Buttons
        </a>
        <a
          href="#forms"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('forms')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Form Elements
        </a>
        <a
          href="#card"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('card')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Card
        </a>
        <a
          href="#badges"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('badges')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Badges
        </a>
        <a
          href="#stacks"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('stacks')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Stacks
        </a>
        <a
          href="#spinner"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('spinner')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Spinner
        </a>
        <a
          href="#item"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('item')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Item
        </a>
        <a
          href="#accordion"
          class="badge"
          data-variant="outline"
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            document.getElementById('accordion')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Accordion
        </a>
      </nav>

      <hr />

      <section class="section" id="typography">
        <h2>Typography</h2>

        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>

        <p>
          This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and <a href="#">a link</a>.
        </p>

        <p>
          Here's some <code>inline code</code> and a code block:
        </p>

        <pre>
          <code>console.log('Hello, World!');</code>
        </pre>

        <blockquote>This is a blockquote. It's styled automatically.</blockquote>

        <ul>
          <li>Unordered list item 1</li>
          <li>Unordered list item 2</li>
          <li>Unordered list item 3</li>
        </ul>

        <ol>
          <li>Ordered list item 1</li>
          <li>Ordered list item 2</li>
          <li>Ordered list item 3</li>
        </ol>
      </section>

      <section class="section" id="buttons">
        <h2>Buttons</h2>

        <h3>Variants</h3>
        <div class="x-stack flex-wrap">
          <button>Primary (default)</button>
          <button data-variant="secondary">Secondary</button>
          <button data-variant="outline">Outline</button>
          <button data-variant="ghost">Ghost</button>
          <button data-variant="link">Link</button>
          <button data-variant="destructive">Destructive</button>
        </div>

        <h3>Sizes</h3>
        <div class="x-stack flex-wrap">
          <button data-variant="primary" data-size="sm">
            Small
          </button>
          <button data-variant="primary">Default</button>
          <button data-variant="primary" data-size="lg">
            Large
          </button>
          <button data-variant="primary" data-size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>

        <h3>States</h3>
        <div class="x-stack flex-wrap">
          <button data-variant="primary" disabled>
            Disabled
          </button>
          <button data-variant="primary" aria-pressed="true">
            Pressed
          </button>
        </div>

        <h3>As Link</h3>
        <a href="#" class="button" data-variant="primary">
          Link as Button
        </a>
      </section>

      <section class="section" id="forms">
        <h2>Form elements</h2>
        <form class="card">
          <header>
            <h2>Form in a card</h2>
          </header>

          <section class="y-stack">
            <div>
              <label for="email">Email</label>
              <input type="email" name="email" id="email" placeholder="john.doe@gmail.com" />
            </div>

            <div>
              <label for="id">User id (read only)</label>
              <input readOnly name="id" id="id" value="04D6H89Z" />
            </div>

            <div>
              <label for="disabled">Random disabled input</label>
              <input disabled name="disabled" id="disabled" placeholder="Because why not?" />
            </div>

            <div>
              <label for="about">About me</label>
              <textarea name="about" id="about" placeholder="I am a textarea..."></textarea>
            </div>

            <div>
              <input type="checkbox" name="remember" id="remember" />
              <label for="remember">Remember me</label>
            </div>

            <div>
              <label>
                <input type="checkbox" name="in-label" id="in-label" checked />
                Is this checkbox inside a <code>&lt;label&gt;</code> element?
              </label>
            </div>

            <div>
              <fieldset>
                <legend>Choose a cardinal direction:</legend>

                <div>
                  <input type="radio" id="north" name="direction" value="north" checked />
                  <label for="north">North</label>
                </div>

                <div>
                  <input type="radio" id="east" name="direction" value="east" />
                  <label for="east">East</label>
                </div>

                <div>
                  <input type="radio" id="south" name="direction" value="south" />
                  <label for="south">South</label>
                </div>

                <div>
                  <input type="radio" id="west" name="direction" value="west" />
                  <label for="west">West</label>
                </div>
              </fieldset>
            </div>

            <input type="file" accept="image/*" />

            <label>
              {' '}
              <input type="checkbox" role="switch" /> Switch{' '}
            </label>
            <label>
              {' '}
              <input type="checkbox" role="switch" checked /> Switch{' '}
            </label>

            <button type="submit">Submit</button>
          </section>
        </form>
      </section>

      <section class="section max-w-sm" id="card">
        <div class="card">
          <header>
            <h2>Today is the Lord's day</h2>
            <p>Fart</p>
          </header>
          <section>I can put whatever info I want in here</section>
          <footer class="border-t">
            <button>Go!</button>
            <button data-variant="outline">Cancel</button>
          </footer>
        </div>
      </section>

      <section class="section x-stack" id="badges">
        <span class="badge">Default</span>
        <span data-variant="secondary" class="badge">
          Secondary
        </span>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
          <span data-variant="outline" class="badge">
            Outline
          </span>
        </a>
        <span data-variant="destructive" class="badge">
          Destructive
        </span>
      </section>

      <section class="section x-stack max-w-sm" id="stacks">
        <h3>
          This is an <code>.x-stack</code>
        </h3>
        <span class="badge bg-blue-600">New</span>
      </section>

      <section class="section y-stack max-w-sm">
        <h3>
          This is a <code>.y-stack</code>
        </h3>
        <span class="badge bg-blue-600">New</span>
      </section>

      <section class="section y-stack" id="spinner">
        <h2>Spinner</h2>
        <p>
          All you need to do is add <code>aria-busy="true"</code> to any element
        </p>
        <div aria-busy="true"></div>
        <p>
          And, if you want an overlay, you'll need to also add <code>data-variant="overlay"</code>
        </p>
        <div aria-busy="true" class="card" data-variant="overlay">
          <header>
            <h3>This is a card</h3>
          </header>
          <section>
            <p>All the things and contents in here</p>
          </section>
        </div>
      </section>

      <section class="section y-stack" id="item">
        <h2>Item</h2>

        <div class="item">
          <div>
            <h3>Basic Item</h3>
            <p>A simple item with title and description.</p>
          </div>

          <button data-variant="outline">Action</button>
        </div>

        <a class="item" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-sparkle-icon lucide-sparkle"
          >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
          </svg>
          <section>
            <h2>Link Item</h2>
            <p>Another simple item with title and description.</p>
          </section>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-right-icon lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </section>

      <section class="section" id="accordion">
        <h2>Accordion</h2>

        <details>
          <summary>What is an accordion?</summary>
          <p>All I know is that it plays music...</p>
        </details>

        <details>
          <summary>
            <h2>What is Sensible UI?</h2>
          </summary>
          <p>Think "shadcn/ui" as a semantic CSS library. We are a fork of BasecoatCSS and influenced by Oat</p>
        </details>

        {/* @ts-ignore - name is a property */}
        <details name="same">
          <summary>Can you have a connected accordion?</summary>
          <p>Yep!</p>
        </details>

        {/* @ts-ignore - name is a property */}
        <details name="same">
          <summary>Who lives in a pineapple under the sea?</summary>
          <p>I'm afraid that's copyrighted.</p>
        </details>
      </section>
    </main>
  )
}
