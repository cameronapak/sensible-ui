import { version } from "../../package.json";

type CodeExampleProps = {
  code: string;
  dark?: boolean;
};

function CodeExample({ code, dark = false }: CodeExampleProps) {
  const markup = code.trim();

  return (
    <div class="docs-example">
      <div
        class={`docs-preview${dark ? " dark" : ""}`}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <div class="docs-code-toolbar">
        <span>HTML</span>
        <button
          type="button"
          data-copy-code
          aria-label="Copy HTML example"
          aria-live="polite"
        >
          Copy
        </button>
      </div>
      <pre>
        <code>{markup}</code>
      </pre>
    </div>
  );
}

function StandaloneImport({ path }: { path: string }) {
  return (
    <p class="docs-import">
      Standalone import: <code>@import '@faith-tools/sensible-ui/{path}';</code>
    </p>
  );
}

const typographyExample = `
<article>
  <h1>A clear heading</h1>
  <p>Use <strong>semantic HTML</strong> for meaning and <em>emphasis</em>.</p>
  <blockquote>Good defaults should support the content.</blockquote>
  <p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search.</p>
  <pre><code>const greeting = "Hello";</code></pre>
</article>`;

const buttonExample = `
<div class="cluster">
  <button type="button">Primary</button>
  <button type="button" data-variant="secondary">Secondary</button>
  <button type="button" data-variant="outline">Outline</button>
  <button type="button" data-variant="ghost">Ghost</button>
  <button type="button" data-variant="link">Link</button>
  <button type="button" data-variant="destructive">Destructive</button>
  <button type="button" data-size="sm">Small</button>
  <button type="button" data-size="lg">Large</button>
  <button type="button" aria-pressed="true">Pressed</button>
  <button type="button" disabled>Disabled</button>
  <a class="button" href="#buttons">Link as button</a>
</div>`;

const textInputExample = `
<div class="stack">
  <div>
    <label for="profile-email">Email</label>
    <input id="profile-email" name="email" type="email" placeholder="name@example.com">
  </div>
  <div>
    <label for="profile-id">Account ID</label>
    <input id="profile-id" name="id" value="04D6H89Z" readonly>
  </div>
  <div>
    <label for="invalid-email">Email with an error</label>
    <input id="invalid-email" type="email" aria-invalid="true" aria-describedby="email-error">
    <small id="email-error">Enter a valid email address.</small>
  </div>
  <div>
    <label for="disabled-input">Disabled input</label>
    <input id="disabled-input" disabled value="Unavailable">
  </div>
</div>`;

const textareaExample = `
<div>
  <label for="profile-about">About</label>
  <textarea id="profile-about" name="about" placeholder="Tell us about yourself"></textarea>
</div>`;

const selectExample = `
<div>
  <label for="timezone">Time zone</label>
  <select id="timezone" name="timezone">
    <option value="">Choose a time zone</option>
    <optgroup label="North America">
      <option value="America/Chicago">Central Time</option>
      <option value="America/New_York">Eastern Time</option>
    </optgroup>
  </select>
</div>`;

const checkboxExample = `
<fieldset>
  <legend>Notifications</legend>
  <div>
    <input id="product-updates" type="checkbox" name="updates" checked>
    <label for="product-updates">Product updates</label>
  </div>
  <div>
    <input id="security-alerts" type="checkbox" name="security" disabled>
    <label for="security-alerts">Security alerts</label>
  </div>
</fieldset>`;

const radioExample = `
<fieldset>
  <legend>Contact preference</legend>
  <div>
    <input id="contact-email" type="radio" name="contact" value="email" checked>
    <label for="contact-email">Email</label>
  </div>
  <div>
    <input id="contact-phone" type="radio" name="contact" value="phone">
    <label for="contact-phone">Phone</label>
  </div>
</fieldset>`;

const switchExample = `
<label>
  <input type="checkbox" role="switch" name="marketing" checked>
  Marketing emails
</label>`;

const rangeExample = `
<div>
  <label for="volume">Volume</label>
  <input id="volume" name="volume" type="range" min="0" max="100" value="65">
</div>`;

const dateExample = `
<div class="auto-grid" style="--min-item-size: 12rem">
  <div>
    <label for="start-date">Start date</label>
    <input id="start-date" name="start-date" type="date">
  </div>
  <div>
    <label for="appointment">Appointment</label>
    <input id="appointment" name="appointment" type="datetime-local">
  </div>
</div>`;

const colorExample = `
<label>
  <input name="accent" type="color" value="#2563eb">
  Accent color
</label>`;

const fileExample = `
<div>
  <label for="avatar-file">Profile image</label>
  <input id="avatar-file" name="avatar" type="file" accept="image/*">
</div>`;

const cardExample = `
<article class="card">
  <header>
    <h3>Team plan</h3>
    <p>For growing organizations</p>
    <button type="button" data-slot="card-action" data-variant="outline">Manage</button>
  </header>
  <section>
    <p>Invite collaborators and share project settings.</p>
  </section>
  <footer>
    <button type="button">Choose plan</button>
    <button type="button" data-variant="outline">Learn more</button>
  </footer>
</article>`;

const badgeExample = `
<div class="cluster">
  <span class="badge">Default</span>
  <span class="badge" data-variant="secondary">Secondary</span>
  <span class="badge" data-variant="outline">Outline</span>
  <span class="badge" data-variant="destructive">Destructive</span>
  <a class="badge" data-variant="outline" href="#badges">Linked badge</a>
</div>`;

const imageExample = `
<figure>
  <img
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80"
    alt="A mountain ridge beneath a cloudy sky"
    width="960"
    height="540"
  >
  <figcaption>Images and captions receive sensible defaults.</figcaption>
</figure>`;

const itemExample = `
<div class="stack">
  <div class="item">
    <section>
      <h3>Project settings</h3>
      <p>Manage members, billing, and notifications.</p>
    </section>
    <button type="button" data-variant="outline">Open</button>
  </div>
  <a class="item" href="#item">
    <section>
      <h3>Linked item</h3>
      <p>The whole row is one descriptive link.</p>
    </section>
    <span aria-hidden="true">→</span>
  </a>
</div>`;

const spinnerExample = `
<div class="stack">
  <button type="button" aria-busy="true" disabled>Saving</button>
  <div class="card" aria-busy="true" data-variant="overlay">
    <header><h3>Loading report</h3></header>
    <section><p>The current content remains visible while loading.</p></section>
  </div>
</div>`;

const accordionExample = `
<div>
  <details name="questions">
    <summary>Does this require JavaScript?</summary>
    <p>No. It uses the native details and summary elements.</p>
  </details>
  <details name="questions" open>
    <summary>Can only one item stay open?</summary>
    <p>Yes. Give related details elements the same name.</p>
  </details>
</div>`;

const descriptionListExample = `
<dl class="card">
  <dt>Status</dt>
  <dd>Active</dd>
  <dt>Plan</dt>
  <dd>Team</dd>
  <dt>Renewal date</dt>
  <dd><time datetime="2027-01-15">January 15, 2027</time></dd>
</dl>`;

const tableExample = `
<table class="card">
  <caption>Current project members</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Margaret Nguyen</th>
      <td>Owner</td>
      <td>Active</td>
    </tr>
    <tr>
      <th scope="row">Hoshi Nakamura</th>
      <td>Editor</td>
      <td>Invited</td>
    </tr>
  </tbody>
  <tfoot>
    <tr><th scope="row" colspan="2">Total</th><td>2</td></tr>
  </tfoot>
</table>`;

const layoutsExample = `
<div class="stack">
  <div class="cluster">
    <span class="badge">Cluster</span>
    <span class="badge" data-variant="secondary">Wraps inline content</span>
  </div>
  <div class="split">
    <strong>Split layout</strong>
    <button type="button" data-size="sm">Action</button>
  </div>
  <div class="auto-grid" style="--min-item-size: 10rem">
    <div class="card"><section>First</section></div>
    <div class="card"><section>Second</section></div>
    <div class="card"><section>Third</section></div>
  </div>
</div>`;

const utilitiesExample = `
<div class="x-stack">
  <div class="card relative w-16 shrink-0 aspect-square overflow-hidden">
    <span class="absolute inset-0 flex items-center justify-center">1:1</span>
  </div>
  <div class="y-stack min-w-0 grow shrink" style="--layout-gap: var(--space-1)">
    <span class="sr-only">Status:</span>
    <strong>Utility example</strong>
    <p class="truncate">A long status message is truncated with an ellipsis when the available inline space is limited, preserving a compact row without wrapping into the content below or pushing neighboring controls out of view.</p>
  </div>
</div>`;

const darkExample = `
<div class="auto-grid" style="--min-item-size: 12rem">
  <article class="card">
    <header><h3>Dark card</h3><p>The same semantic markup works.</p></header>
    <section><span class="badge" data-variant="secondary">Dark theme</span></section>
  </article>
  <form>
    <div>
      <label for="dark-email">Email</label>
      <input id="dark-email" type="email" placeholder="name@example.com">
    </div>
    <button type="button">Continue</button>
  </form>
</div>`;

export function Home() {
  return (
    <main class="container docs-page">
      <header class="docs-hero stack">
        <div class="cluster">
          <h1>Sensible UI</h1>
          <code>v{version}</code>
          <span class="badge">beta</span>
        </div>
        <p>
          A semantic-first CSS component library with shadcn-style visual
          defaults.
        </p>
        <nav class="docs-nav" aria-label="Component documentation">
          <a href="#getting-started">Getting started</a>
          <a href="#typography">Typography</a>
          <a href="#buttons">Buttons</a>
          <a href="#forms">Forms</a>
          <a href="#card">Card</a>
          <a href="#badges">Badge</a>
          <a href="#image">Image</a>
          <a href="#item">Item</a>
          <a href="#spinner">Spinner</a>
          <a href="#accordion">Accordion</a>
          <a href="#description-list">Description list</a>
          <a href="#table">Table</a>
          <a href="#layouts">Layouts</a>
          <a href="#utilities">Utilities</a>
          <a href="#dark-mode">Dark mode</a>
        </nav>
      </header>

      <section class="docs-section stack" id="getting-started">
        <h2>Getting started</h2>
        <p>
          Import the complete stylesheet when you want every semantic default
          and component:
        </p>
        <pre>
          <code>@import '@faith-tools/sensible-ui';</code>
        </pre>
        <p>Or use the versioned CDN build:</p>
        <pre>
          <code>{`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/sensible-ui.min.css">`}</code>
        </pre>
        <p>
          Standalone component imports include the theme and base styles they
          need. When markup combines components, import each component. For
          example, <code>&lt;table class="card"&gt;</code> needs both{" "}
          <code>/table</code> and <code>/card</code>.
        </p>
        <details>
          <summary>All public stylesheet exports</summary>
          <div class="docs-table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Export</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <code>.</code>, <code>/css</code>
                  </th>
                  <td>Complete bundled stylesheet</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/min</code>
                  </th>
                  <td>Minified complete bundle</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/index</code>
                  </th>
                  <td>Source CSS entry point</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/base</code>
                  </th>
                  <td>Theme tokens and semantic reset</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/theme</code>
                  </th>
                  <td>Theme tokens and cascade layer order</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/accordion</code>, <code>/badge</code>,{" "}
                    <code>/button</code>, <code>/card</code>
                  </th>
                  <td>Standalone component modules</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/description-list</code>, <code>/image</code>,{" "}
                    <code>/input</code>, <code>/item</code>
                  </th>
                  <td>Standalone component modules</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/spinner</code>, <code>/table</code>,{" "}
                    <code>/typography</code>
                  </th>
                  <td>Standalone component modules</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/utils</code>
                  </th>
                  <td>Named layouts, container, and composition helpers</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/utilities</code>, <code>/utilities/min</code>
                  </th>
                  <td>Optional generated atomic utilities</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/view-transition</code>
                  </th>
                  <td>Optional same-origin page transitions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <section class="docs-section stack" id="typography">
        <h2>Typography</h2>
        <StandaloneImport path="typography" />
        <p>
          Headings, paragraphs, links, lists, code, keyboard input, quotations,
          and inline text semantics are styled without classes. Keep the native
          element that matches the content’s meaning.
        </p>
        <CodeExample code={typographyExample} />
      </section>

      <section class="docs-section stack" id="buttons">
        <h2>Buttons</h2>
        <StandaloneImport path="button" />
        <p>
          Native buttons, button-like inputs, and <code>a.button</code> are
          supported. Use <code>data-variant</code> for primary, secondary,
          outline, ghost, link, or destructive treatment. Use{" "}
          <code>data-size</code> for <code>sm</code>, <code>lg</code>, or{" "}
          <code>icon</code>. Native <code>disabled</code>,{" "}
          <code>aria-pressed</code>, <code>aria-busy</code>, and{" "}
          <code>aria-invalid</code> attributes style state.
        </p>
        <p>
          Use a button for actions and a link for navigation. Give icon-only
          buttons an accessible name.
        </p>
        <CodeExample code={buttonExample} />
      </section>

      <section class="docs-section stack" id="forms">
        <h2>Form controls</h2>
        <StandaloneImport path="input" />
        <p>
          The input module styles native controls and their labels. Associate
          every control with a label. Use <code>fieldset</code> and
          <code>legend</code> for related choices, and use{" "}
          <code>aria-describedby</code> when an error or hint needs to be
          announced.
        </p>

        <section class="docs-subsection stack" id="text-input">
          <h3>Text-like inputs and states</h3>
          <p>
            Text, email, password, number, search, URL, and similar inputs share
            the same semantic default.
          </p>
          <CodeExample code={textInputExample} />
        </section>

        <section class="docs-subsection stack" id="textarea">
          <h3>Textarea</h3>
          <CodeExample code={textareaExample} />
        </section>

        <section class="docs-subsection stack" id="select">
          <h3>Select</h3>
          <p>
            Use the native select when choosing one option from a list. Group
            long option lists with optgroup.
          </p>
          <CodeExample code={selectExample} />
        </section>

        <section class="docs-subsection stack" id="checkbox">
          <h3>Checkbox</h3>
          <p>
            Use checkboxes for independent choices. The checked and disabled
            states are native.
          </p>
          <CodeExample code={checkboxExample} />
        </section>

        <section class="docs-subsection stack" id="radio">
          <h3>Radio group</h3>
          <p>
            Radio buttons with the same name represent one choice. Wrap the
            group in a fieldset with a legend.
          </p>
          <CodeExample code={radioExample} />
        </section>

        <section class="docs-subsection stack" id="switch">
          <h3>Switch</h3>
          <p>
            Add <code>role="switch"</code> to a checkbox only when the control
            immediately turns a setting on or off.
          </p>
          <CodeExample code={switchExample} />
        </section>

        <section class="docs-subsection stack" id="range">
          <h3>Range</h3>
          <p>
            Provide a visible label and meaningful minimum, maximum, and initial
            values.
          </p>
          <CodeExample code={rangeExample} />
        </section>

        <section class="docs-subsection stack" id="date-time">
          <h3>Date and time</h3>
          <p>
            Date and datetime-local inputs preserve each browser’s native picker
            and keyboard behavior.
          </p>
          <CodeExample code={dateExample} />
        </section>

        <section class="docs-subsection stack" id="color">
          <h3>Color</h3>
          <CodeExample code={colorExample} />
        </section>

        <section class="docs-subsection stack" id="file">
          <h3>File</h3>
          <p>
            Use the accept attribute as a picker hint, not as file validation.
          </p>
          <CodeExample code={fileExample} />
        </section>
      </section>

      <section class="docs-section stack" id="card">
        <h2>Card</h2>
        <StandaloneImport path="card" />
        <p>
          Add <code>class="card"</code> to a semantic container. Direct{" "}
          <code>header</code>, <code>section</code>, and <code>footer</code>{" "}
          children define its regions. Add <code>data-slot="card-action"</code>{" "}
          to a header action. Cards adapt their layout through container
          queries.
        </p>
        <CodeExample code={cardExample} />
      </section>

      <section class="docs-section stack" id="badges">
        <h2>Badge</h2>
        <StandaloneImport path="badge" />
        <p>
          Add <code>class="badge"</code> to short status or category text.
          Supported variants are primary, secondary, outline, and destructive.
          Use a link only when the badge navigates somewhere.{" "}
          <code>aria-invalid="true"</code> provides the invalid state.
        </p>
        <CodeExample code={badgeExample} />
      </section>

      <section class="docs-section stack" id="image">
        <h2>Image</h2>
        <StandaloneImport path="image" />
        <p>
          Images receive responsive sizing and rounded corners. Use an empty alt
          value for decorative images and useful alternative text for
          informative images. Pair an image and caption with <code>figure</code>{" "}
          and <code>figcaption</code>.
        </p>
        <CodeExample code={imageExample} />
      </section>

      <section class="docs-section stack" id="item">
        <h2>Item</h2>
        <StandaloneImport path="item" />
        <p>
          An item is a compact content row with an optional icon or action. Use{" "}
          <code>a.item</code> when the entire row navigates. Do not put another
          interactive control inside a linked item.
        </p>
        <CodeExample code={itemExample} />
      </section>

      <section class="docs-section stack" id="spinner">
        <h2>Loading spinner</h2>
        <StandaloneImport path="spinner" />
        <p>
          Add <code>aria-busy="true"</code> while an element is updating. Add{" "}
          <code>data-variant="overlay"</code> to dim existing children. Keep
          visible loading text or an accessible name so the state is
          understandable without relying on motion.
        </p>
        <CodeExample code={spinnerExample} />
      </section>

      <section class="docs-section stack" id="accordion">
        <h2>Accordion</h2>
        <StandaloneImport path="accordion" />
        <p>
          Native <code>details</code> and <code>summary</code> provide
          disclosure behavior without JavaScript. The <code>open</code>{" "}
          attribute sets the initial state. Give related details elements the
          same <code>name</code> when only one should remain open.
        </p>
        <CodeExample code={accordionExample} />
      </section>

      <section class="docs-section stack" id="description-list">
        <h2>Description list</h2>
        <StandaloneImport path="description-list" />
        <p>
          Use a description list for name-value groups, terms and definitions,
          or metadata. Multiple terms may share a description and one term may
          have multiple descriptions. Add <code>class="card"</code> and import
          the card module for the bordered treatment.
        </p>
        <CodeExample code={descriptionListExample} />
      </section>

      <section class="docs-section stack" id="table">
        <h2>Table</h2>
        <StandaloneImport path="table" />
        <p>
          Use tables for two-dimensional data. Add a caption when the
          surrounding context does not already identify the table, and use
          <code>scope</code> on row and column headers. Add{" "}
          <code>class="card"</code> and import the card module for the bordered
          treatment.
        </p>
        <div class="docs-table-scroll">
          <CodeExample code={tableExample} />
        </div>
      </section>

      <section class="docs-section stack" id="layouts">
        <h2>Named layouts</h2>
        <StandaloneImport path="utils" />
        <p>
          The core bundle includes <code>.stack</code> for vertical flow,{" "}
          <code>.cluster</code> for wrapping inline groups, <code>.split</code>{" "}
          for separated content, and <code>.auto-grid</code> for intrinsic
          grids. <code>.y-stack</code> aliases stack and <code>.x-stack</code>{" "}
          is a non-wrapping inline stack. Set <code>--layout-gap</code> to
          adjust spacing and <code>--min-item-size</code> to control grid
          wrapping.
        </p>
        <CodeExample code={layoutsExample} />
      </section>

      <section class="docs-section stack" id="utilities">
        <h2>Optional atomic utilities</h2>
        <p class="docs-import">
          Optional import:{" "}
          <code>@import '@faith-tools/sensible-ui/utilities';</code>
        </p>
        <p>
          The companion stylesheet provides token-backed display, flex, grid,
          alignment, sizing, spacing, positioning, overflow, text, aspect-ratio,
          and accessibility helpers. It is plain generated CSS and requires no
          template scanning or consumer-side tooling. Override the{" "}
          <code>--space-*</code> custom properties to change its spacing scale.
          Prefer named helpers such as <code>.stack</code>, <code>.y-stack</code>,
          and <code>.x-stack</code> for common composition, then use atomic
          helpers for exceptions. Breakpoint-prefixed variants are intentionally
          not generated; use intrinsic layouts or consumer-owned media queries
          instead.
        </p>
        <CodeExample code={utilitiesExample} />
      </section>

      <section class="docs-section stack" id="dark-mode">
        <h2>Dark mode</h2>
        <p>
          Add <code>class="dark"</code> to an ancestor to select the bundled
          dark theme. Components use the same markup in both themes. System
          preference behavior is not enabled by the core bundle.
        </p>
        <CodeExample code={darkExample} dark />
      </section>

      <footer class="docs-footer stack">
        <h2>Sensible UI</h2>
        <p>
          Sensible UI is a semantic-first fork of{" "}
          <a href="https://basecoatui.com">Basecoat</a>, influenced by shadcn/ui
          and Oat CSS.
        </p>
        <p>
          <a href="https://github.com/cameronapak/sensible-ui">GitHub</a> ·{" "}
          <a href="https://faith.tools">faith.tools</a>
        </p>
      </footer>
    </main>
  );
}
