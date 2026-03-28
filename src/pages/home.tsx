/** @jsxImportSource mono-jsx */
import { version } from '../../package.json'

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
      <div class="y-stack">
        <div class="x-stack">
          <h1>Sensible UI</h1>
          <code>v{version}</code>
          <span class="badge">beta</span>
        </div>

        <p class="text-muted-foreground">
          <code>shadcn/ui</code> style primitives using semantic CSS
        </p>

        <nav class="x-stack flex-wrap gap-1!">
          <a href="#typography" class="badge" data-variant="outline">
            Typography
          </a>
          <a href="#buttons" class="badge" data-variant="outline">
            Buttons
          </a>
          <a href="#forms" class="badge" data-variant="outline">
            Form Elements
          </a>
          <a href="#card" class="badge" data-variant="outline">
            Card
          </a>
          <a href="#badges" class="badge" data-variant="outline">
            Badges
          </a>
          <a href="#stacks" class="badge" data-variant="outline">
            Stacks
          </a>
          <a href="#spinner" class="badge" data-variant="outline">
            Spinner
          </a>
          <a href="#item" class="badge" data-variant="outline">
            Item
          </a>
          <a href="#accordion" class="badge" data-variant="outline">
            Accordion
          </a>
          <a href="#description-list" class="badge" data-variant="outline">
            Description List
          </a>
          <a href="#table" class="badge" data-variant="outline">
            Table
          </a>
        </nav>
      </div>

      <hr />

      <h2>This is for those who want...</h2>

      <ul>
        <li>...beautiful HTML elements by default</li>
        <li>...the look and feel of shadcn/ui, without the React framework overhead</li>
        <li>...to use as minimal CSS classes as necessary</li>
      </ul>

      <h2>
        This is <em>NOT</em> for those who want...
      </h2>

      <ul>
        <li>
          ...to use shadcn/ui with React <em class="text-muted-foreground">(because then you should reach for shadcn/ui)</em>
        </li>
        <li>...to meticulously style every element on the page</li>
      </ul>

      <hr />

      <section class="section card">
        <header>
          <h3>How to install</h3>
        </header>
        <section>
          <p>
            Simply add this to your <code>head</code> tag in your HTML
          </p>
          <pre>
            <code>
              &#60;link href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@{version}/dist/sensible-ui.min.css" type="text/css"
              rel="stylesheet"&#62;
            </code>
          </pre>
          <p>
            Instructions on how to use this with Tailwind CSS and <code>shadcn/ui</code> CSS themes coming soon!
          </p>
        </section>
      </section>

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
          This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, <a href="#">a link</a>, and <mark>marked text</mark>
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

      <hr />

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

      <hr />

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

      <hr />

      <section class="section max-w-sm" id="card">
        <h2>Card</h2>
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

      <hr />

      <section class="section" id="badges">
        <h2>Badge</h2>

        <div class="x-stack">
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
        </div>
      </section>

      <hr />

      <section class="section y-stack" id="stacks">
        <h2>
          Stacks <em>(helper classes)</em>
        </h2>

        <div class="x-stack">
          <h3>
            This is an <code>.x-stack</code>
          </h3>
          <span class="badge bg-blue-600">New</span>
        </div>

        <div class="y-stack">
          <h3>
            This is a <code>.y-stack</code>
          </h3>
          <span class="badge bg-blue-600">New</span>
        </div>
      </section>

      <hr />

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

      <hr />

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
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </section>

      <hr />

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

        <details name="same">
          <summary>Can you have a connected accordion?</summary>
          <p>Yep!</p>
        </details>

        <details open={true} name="same">
          <summary>Who lives in a pineapple under the sea?</summary>
          <p>I'm afraid that's copyrighted.</p>
        </details>
      </section>

      <hr />

      <section class="section" id="description-list">
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl" target="_blank">
          <h2>Description List</h2>
        </a>

        <dl>
          <div>
            <dt>Name</dt>
            <dd>Godzilla</dd>
          </div>
          <div>
            <dt>Born</dt>
            <dd>1952</dd>
          </div>
          <div>
            <dt>Birthplace</dt>
            <dd>Japan</dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>Green</dd>
          </div>
        </dl>

        <h3>Single term, multiple descriptions</h3>

        <dl>
          <dt>Firefox</dt>
          <dd>
            A free, open source, cross-platform, graphical web browser developed by the Mozilla Corporation and hundreds of volunteers.
          </dd>
          <dd>
            The Red Panda also known as the Lesser Panda, Wah, Bear Cat or Firefox, is a mostly herbivorous mammal, slightly larger than a
            domestic cat (60 cm long).
          </dd>
        </dl>

        <h3>Multiple terms, single description</h3>

        <dl>
          <dt>Fx</dt>
          <dt>Firefox</dt>
          <dt>Mozilla Firefox</dt>
          <dd>
            A free, open source, cross-platform, graphical web browser developed by the Mozilla Corporation and hundreds of volunteers.
          </dd>

          <dt>JavaScript</dt>
          <dt>JS</dt>
          <dd>
            A free, open source, cross-platform, graphical web browser developed by the Mozilla Corporation and hundreds of volunteers.
          </dd>
        </dl>

        <h3>
          Here's a card <code>dl.card</code>
        </h3>

        <dl class="card">
          <dt>Banana</dt>
          <dd>A yellow fruit that is easy to peel.</dd>
          <dd>Which also grows on a tree.</dd>
          <dt>Cashew</dt>
          <dd>A tan nut without a peel.</dd>
          <dt>Cherry</dt>
          <dd>A red fruit that is hard to peel.</dd>
        </dl>
      </section>

      <section id="table" class="section y-stack">
        <h2>Table</h2>

        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">ID</th>
              <th scope="col">Member Since</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Margaret Nguyen</th>
              <td>427311</td>
              <td>
                <time dateTime="2010-06-03">June 3, 2010</time>
              </td>
              <td>0.00</td>
            </tr>
            <tr>
              <th scope="row">Edvard Galinski</th>
              <td>533175</td>
              <td>
                <time dateTime="2011-01-13">January 13, 2011</time>
              </td>
              <td>37.00</td>
            </tr>
            <tr>
              <th scope="row">Hoshi Nakamura</th>
              <td>601942</td>
              <td>
                <time dateTime="2012-07-23">July 23, 2012</time>
              </td>
              <td>15.00</td>
            </tr>
          </tbody>
        </table>

        <table class="card">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">ID</th>
              <th scope="col">Member Since</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Margaret Nguyen</th>
              <td>427311</td>
              <td>
                <time dateTime="2010-06-03">June 3, 2010</time>
              </td>
              <td>0.00</td>
            </tr>
            <tr>
              <th scope="row">Edvard Galinski</th>
              <td>533175</td>
              <td>
                <time dateTime="2011-01-13">January 13, 2011</time>
              </td>
              <td>37.00</td>
            </tr>
            <tr>
              <th scope="row">Hoshi Nakamura</th>
              <td>601942</td>
              <td>
                <time dateTime="2012-07-23">July 23, 2012</time>
              </td>
              <td>15.00</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer>
        <h3>Sensible UI</h3>
        <p>
          Sensible UI is a fork of{' '}
          <a href="https://basecoatui.com" target="_blank">
            Basecoat UI
          </a>{' '}
          that's been re-written from the ground-up to style elements semantically
        </p>
        <h4>Resources</h4>
        <ul>
          <li>
            <a href="https://github.com/cameronapak/sensible-ui" target="_blank">
              GitHub Repo
            </a>
          </li>
          <li>
            Part of the{' '}
            <a href="https://faith.tools" target="_blank">
              faith.tools
            </a>{' '}
            ecosystem
          </li>
        </ul>
      </footer>
    </main>
  )
}
