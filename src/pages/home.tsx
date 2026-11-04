import { version } from "../../package.json";

type CodeExampleProps = {
  code: string;
  dark?: boolean;
  language?: "html" | "css" | "javascript";
  showPreview?: boolean;
};

function CodeExample({
  code,
  dark = false,
  language = "html",
  showPreview = true,
}: CodeExampleProps) {
  const source = code.trim();

  return (
    <div class={`docs-example${showPreview ? "" : " docs-code-only"}`}>
      {showPreview && (
        <div
          class={`docs-preview${dark ? " dark" : ""}`}
          dangerouslySetInnerHTML={{ __html: source }}
        />
      )}
      <sensible-code language={language}>
        <textarea readonly>{source}</textarea>
      </sensible-code>
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

// Lucide icon paths (https://lucide.dev) for copyable examples.
const lucidePaths = {
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  bold: '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  italic: '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
} as const;

function lucide(name: keyof typeof lucidePaths) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lucidePaths[name]}</svg>`;
}

const buttonGroupExample = `
<div class="stack">
  <sensible-button-group role="group" aria-label="Message actions">
    <button type="button" data-variant="outline">Archive</button>
    <button type="button" data-variant="outline">Report</button>
    <button type="button" data-variant="outline">Snooze</button>
  </sensible-button-group>

  <sensible-button-group>
    <sensible-button-group role="group" aria-label="Text style">
      <button type="button" data-variant="outline" data-size="icon" aria-label="Bold" aria-pressed="true">
        ${lucide("bold")}
      </button>
      <button type="button" data-variant="outline" data-size="icon" aria-label="Italic" aria-pressed="false">
        ${lucide("italic")}
      </button>
      <button type="button" data-variant="outline" data-size="icon" aria-label="Underline" aria-pressed="false">
        ${lucide("underline")}
      </button>
    </sensible-button-group>
    <sensible-button-group role="group" aria-label="Pages">
      <button type="button" data-variant="outline">${lucide("arrowLeft")} Previous</button>
      <button type="button" data-variant="outline">Next ${lucide("arrowRight")}</button>
    </sensible-button-group>
  </sensible-button-group>

  <div class="cluster">
    <sensible-button-group orientation="vertical" role="group" aria-label="Zoom">
      <button type="button" data-variant="outline" data-size="icon" aria-label="Zoom in">
        ${lucide("plus")}
      </button>
      <button type="button" data-variant="outline" data-size="icon" aria-label="Zoom out">
        ${lucide("minus")}
      </button>
    </sensible-button-group>
    <sensible-button-group role="group" aria-label="Clipboard">
      <button type="button" data-variant="secondary">Copy</button>
      <hr>
      <button type="button" data-variant="secondary">Paste</button>
    </sensible-button-group>
    <sensible-button-group>
      <button type="button" disabled>Merge</button>
      <hr>
      <button type="button" data-size="icon" aria-label="More merge options" disabled>
        ${lucide("plus")}
      </button>
    </sensible-button-group>
  </div>

  <sensible-button-group>
    <input type="search" aria-label="Search the docs" placeholder="Search the docs">
    <button type="button" data-variant="outline">Search</button>
  </sensible-button-group>

  <sensible-button-group>
    <span>https://</span>
    <input aria-label="Website address" placeholder="example.com">
  </sensible-button-group>
</div>`;

const inputGroupExample = `
<div class="stack">
  <sensible-input-group>
    ${lucide("search")}
    <input type="search" aria-label="Search the docs" placeholder="Search the docs">
    <span>12 results</span>
  </sensible-input-group>

  <div>
    <label for="group-email">Email</label>
    <sensible-input-group>
      ${lucide("mail")}
      <input id="group-email" type="email" placeholder="name@example.com">
    </sensible-input-group>
  </div>

  <sensible-input-group>
    <span>https://</span>
    <input aria-label="Website address" placeholder="example">
    <span>.com</span>
  </sensible-input-group>

  <sensible-input-group>
    <input aria-label="Share link" value="https://sensibleui.com/r/8f2k" readonly>
    <button type="button" data-variant="ghost" data-size="icon" aria-label="Copy link">
      ${lucide("copy")}
    </button>
  </sensible-input-group>

  <div>
    <label for="group-username">Username</label>
    <sensible-input-group>
      <span>@</span>
      <input id="group-username" value="taken" aria-invalid="true" aria-describedby="group-username-error">
      <button type="button" data-variant="ghost" data-size="icon" aria-label="Clear username">
        ${lucide("x")}
      </button>
    </sensible-input-group>
    <small id="group-username-error">That username is taken.</small>
  </div>

  <sensible-input-group>
    ${lucide("search")}
    <input aria-label="Disabled search" placeholder="Search is unavailable" disabled>
  </sensible-input-group>

  <sensible-input-group>
    <textarea aria-label="Message" placeholder="Ask a question"></textarea>
    <div class="split">
      <span>Shift + Enter for a new line</span>
      <button type="button" data-size="icon" aria-label="Send message">
        ${lucide("arrowUp")}
      </button>
    </div>
  </sensible-input-group>
</div>`;

const headerExample = `
<header>
  <sensible-navbar>
    <strong>Acme</strong>
    <nav aria-label="Main">
      <ul>
        <li><a href="#navigation" aria-current="page">Overview</a></li>
        <li><a href="#navigation">Pricing</a></li>
        <li><a href="#navigation">Docs</a></li>
      </ul>
    </nav>
    <div class="cluster">
      <a class="button" data-variant="ghost" href="#navigation">Sign in</a>
      <a class="button" href="#navigation">Get started</a>
    </div>
  </sensible-navbar>
</header>`;

const sidebarExample = `
<sensible-sidebar-layout>
  <aside>
    <sensible-sidebar>
      <nav aria-label="Documentation">
        <h2>Getting started</h2>
        <ul>
          <li><a href="#navigation">${lucide("info")} Introduction</a></li>
          <li><a href="#navigation" aria-current="page">${lucide("save")} Installation</a></li>
        </ul>
        <h2>Components</h2>
        <ul>
          <li><a href="#navigation">Button</a></li>
          <li>
            <details open>
              <summary>Forms</summary>
              <ul>
                <li><a href="#navigation">Input</a></li>
                <li><a href="#navigation">Input group</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </sensible-sidebar>
  </aside>
  <article>
    <h3>Installation</h3>
    <p>Add one stylesheet, then write semantic HTML.</p>
  </article>
</sensible-sidebar-layout>`;

const footerExample = `
<footer>
  <sensible-navbar>
    <small>© 2026 Acme, Inc.</small>
    <nav aria-label="Footer">
      <ul>
        <li><a href="#navigation">Privacy</a></li>
        <li><a href="#navigation">Terms</a></li>
        <li><a href="#navigation">Contact</a></li>
      </ul>
    </nav>
  </sensible-navbar>
</footer>`;

const tooltipExample = `
<div class="cluster">
  <sensible-tooltip>
    <button type="button" data-variant="outline">Hover or focus</button>
    <span role="tooltip">Add to library</span>
  </sensible-tooltip>

  <sensible-tooltip side="bottom">
    <button type="button" data-variant="outline" data-size="icon" aria-label="Save">
      ${lucide("save")}
    </button>
    <span role="tooltip">Save draft <kbd>Ctrl</kbd> <kbd>S</kbd></span>
  </sensible-tooltip>

  <sensible-tooltip side="right">
    <button type="button" data-variant="outline" data-size="icon" aria-labelledby="bold-tip">
      ${lucide("bold")}
    </button>
    <span role="tooltip" id="bold-tip">Bold</span>
  </sensible-tooltip>

  <sensible-tooltip side="left">
    <a class="button" data-variant="link" href="#tooltip">Pricing details</a>
    <span role="tooltip">Prices include tax</span>
  </sensible-tooltip>
</div>`;

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

const progressExample = `
<div class="stack">
  <div>
    <label for="upload-progress" class="split">
      Uploading report.pdf <span aria-hidden="true">60%</span>
    </label>
    <progress id="upload-progress" max="100" value="60">60%</progress>
  </div>
  <div>
    <label for="sync-progress">Syncing your library</label>
    <progress id="sync-progress">Syncing</progress>
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

const dialogExample = `
<button type="button" onclick="document.getElementById('project-dialog').showModal()">View project</button>
<dialog id="project-dialog" aria-labelledby="project-title" aria-describedby="project-description">
  <header>
    <h2 id="project-title">Project details</h2>
    <p id="project-description">A quick look at your project.</p>
    <form method="dialog">
      <button type="submit" value="close" data-variant="ghost" data-size="icon" aria-label="Close" autofocus>×</button>
    </form>
  </header>
  <section><p>Website redesign is ready for review.</p></section>
  <footer>
    <form method="dialog"><button type="submit" value="done">Done</button></form>
  </footer>
</dialog>`;

const lightDismissDialogExample = `
<button type="button" onclick="document.getElementById('tip-dialog').showModal()">Show tip</button>
<dialog id="tip-dialog" closedby="any" aria-labelledby="tip-title">
  <header>
    <h2 id="tip-title">A quick tip</h2>
    <form method="dialog"><button type="submit" value="close" data-variant="ghost" data-size="icon" aria-label="Close" autofocus>×</button></form>
  </header>
  <section><p>Click outside this dialog, press Escape, or select Close.</p></section>
</dialog>`;

const longDialogExample = `
<button type="button" onclick="document.getElementById('long-dialog').showModal()">Read project notes</button>
<dialog id="long-dialog" aria-labelledby="long-title" aria-describedby="long-description">
  <header>
    <h2 id="long-title">Project notes</h2>
    <p id="long-description">Review the notes before continuing.</p>
    <form method="dialog"><button type="submit" value="close" data-variant="ghost" data-size="icon" aria-label="Close">×</button></form>
  </header>
  <section>
    <p>Start with the goals and the people the project serves.</p>
    <p>Check the scope, timeline, and remaining questions.</p>
    <p>Record feedback from the team and assign follow-up work.</p>
    <p>Review the revised design with stakeholders.</p>
    <p>Confirm the final content and accessibility checks.</p>
    <p>Prepare the handoff notes and the release checklist.</p>
    <p>Keep decisions and open questions together for reference.</p>
  </section>
  <footer><form method="dialog"><button type="submit" value="done">Done</button></form></footer>
</dialog>`;

const nonModalDialogExample = `
<button type="button" onclick="document.getElementById('note-dialog').show()">Open note</button>
<dialog id="note-dialog" aria-labelledby="note-title">
  <header>
    <h2 id="note-title">Quick note</h2>
    <form method="dialog"><button type="submit" value="close" data-variant="ghost" data-size="icon" aria-label="Close" autofocus>×</button></form>
  </header>
  <section><p>You can still use the rest of the page.</p></section>
</dialog>`;

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
<div data-slot="table-container" class="card" role="region" aria-labelledby="members-caption" tabindex="0">
  <table>
    <caption id="members-caption">Current project members</caption>
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
  </table>
</div>`;

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

const showcaseHtml = `
<article class="card">
  <header>
    <h3>Create your account</h3>
    <p>Start a free 14-day trial.</p>
  </header>
  <section>
    <form>
      <div>
        <label for="showcase-name">Name</label>
        <input id="showcase-name" name="name" autocomplete="name" placeholder="Ada Lovelace">
      </div>
      <div>
        <label for="showcase-email">Email</label>
        <input id="showcase-email" name="email" type="email" placeholder="ada@example.com">
      </div>
      <div>
        <input id="showcase-updates" type="checkbox" name="updates" checked>
        <label for="showcase-updates">Send me product updates</label>
      </div>
      <button type="button">Create account</button>
    </form>
  </section>
</article>

<div data-slot="table-container" class="card" role="region" aria-labelledby="showcase-members" tabindex="0">
  <table>
    <caption id="showcase-members">Team members</caption>
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
        <td><span class="badge">Active</span></td>
      </tr>
      <tr>
        <th scope="row">Hoshi Nakamura</th>
        <td>Editor</td>
        <td><span class="badge" data-variant="secondary">Invited</span></td>
      </tr>
      <tr>
        <th scope="row">Samuel Okafor</th>
        <td>Viewer</td>
        <td><span class="badge" data-variant="outline">Paused</span></td>
      </tr>
    </tbody>
  </table>
</div>

<article class="card">
  <header>
    <h3>Notifications</h3>
    <p>Choose what reaches your inbox.</p>
  </header>
  <section>
    <form>
      <label><input type="checkbox" role="switch" name="replies" checked> Comments and replies</label>
      <label><input type="checkbox" role="switch" name="deploys" checked> Failed deploys</label>
      <label><input type="checkbox" role="switch" name="summary"> Weekly summary</label>
      <div>
        <label for="showcase-digest">Email digest</label>
        <select id="showcase-digest" name="digest">
          <option>Daily</option>
          <option selected>Weekly</option>
          <option>Never</option>
        </select>
      </div>
    </form>
  </section>
</article>

<article class="card">
  <header>
    <h3>Projects</h3>
    <p>Two projects need review.</p>
    <button type="button" data-slot="card-action" data-variant="outline" onclick="document.getElementById('showcase-dialog').showModal()">Invite</button>
  </header>
  <section>
    <div class="stack">
      <a class="item" href="#item">
        <section>
          <h4>Website redesign</h4>
          <p>Updated 2 hours ago</p>
        </section>
        <span class="badge" data-variant="secondary">Review</span>
      </a>
      <a class="item" href="#item">
        <section>
          <h4>Mobile onboarding</h4>
          <p>Updated yesterday</p>
        </section>
        <span class="badge" data-variant="secondary">Review</span>
      </a>
    </div>
  </section>
</article>

<article class="card">
  <header>
    <h3>Questions</h3>
  </header>
  <section>
    <details name="showcase-faq" open>
      <summary>Do I need React or Tailwind?</summary>
      <p>No. Add one stylesheet and write HTML.</p>
    </details>
    <details name="showcase-faq">
      <summary>Do I need JavaScript?</summary>
      <p>Not for styles. Accordions use native details, and a dialog needs one line to open.</p>
    </details>
    <details name="showcase-faq">
      <summary>Can I match my brand?</summary>
      <p>Yes. Override CSS variables such as --primary and --radius.</p>
    </details>
  </section>
</article>

<article class="card">
  <header>
    <h3>Release 2.4</h3>
    <p>12 changes passed review.</p>
  </header>
  <footer>
    <button type="button">Publish release</button>
    <button type="button" data-variant="outline" aria-busy="true" disabled>Running checks</button>
  </footer>
</article>

<dialog id="showcase-dialog" closedby="any" aria-labelledby="showcase-dialog-title" aria-describedby="showcase-dialog-description">
  <header>
    <h2 id="showcase-dialog-title">Invite a teammate</h2>
    <p id="showcase-dialog-description">They will get an email with a link to join.</p>
    <form method="dialog"><button type="submit" value="close" data-variant="ghost" data-size="icon" aria-label="Close">×</button></form>
  </header>
  <section>
    <label for="showcase-invite">Email</label>
    <input id="showcase-invite" name="invite" type="email" placeholder="name@example.com" autofocus>
  </section>
  <footer>
    <form method="dialog"><button type="submit" value="cancel" data-variant="outline">Cancel</button></form>
    <form method="dialog"><button type="submit" value="send">Send invite</button></form>
  </footer>
</dialog>`;

const justHtmlExample = `
<article class="card">
  <header>
    <h3>Sign in</h3>
    <p>Use the email linked to your account.</p>
  </header>
  <section>
    <form>
      <div>
        <label for="signin-email">Email</label>
        <input id="signin-email" type="email" placeholder="name@example.com">
      </div>
      <div>
        <label for="signin-password">Password</label>
        <input id="signin-password" type="password">
      </div>
      <button type="button">Sign in</button>
      <button type="button" data-variant="outline">Create an account</button>
    </form>
  </section>
</article>`;

const cdnLink = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/sensible-ui.min.css">`;

const themeExample = `
:root {
  --primary: oklch(0.5 0.2 260);
  --primary-foreground: oklch(1 0 0);
  --radius: 0.375rem;
}

.dark {
  --primary: oklch(0.75 0.14 260);
  --primary-foreground: oklch(0.145 0 0);
}`;

const navGroups = [
  {
    title: "Get started",
    links: [
      ["getting-started", "Installation"],
      ["theming", "Theming"],
      ["dark-mode", "Dark mode"],
      ["scoped-mode", "Scoped adoption"],
    ],
  },
  {
    title: "HTML elements",
    links: [
      ["typography", "Typography"],
      ["buttons", "Buttons"],
      ["forms", "Forms"],
      ["image", "Image"],
      ["accordion", "Accordion"],
      ["dialog", "Dialog"],
      ["description-list", "Description list"],
      ["table", "Table"],
    ],
  },
  {
    title: "Components",
    links: [
      ["card", "Card"],
      ["badges", "Badge"],
      ["item", "Item"],
      ["spinner", "Spinner"],
      ["progress", "Progress"],
      ["button-group", "Button group"],
      ["input-group", "Input group"],
      ["tooltip", "Tooltip"],
    ],
  },
  {
    title: "Layout",
    links: [
      ["navigation", "Navigation"],
      ["container", "Container"],
      ["layouts", "Layouts"],
      ["utilities", "Utilities"],
    ],
  },
  {
    title: "Optional JavaScript",
    links: [["code", "Code web component"]],
  },
];

const reasons = [
  [
    "Native elements look right",
    <>
      Buttons, inputs, selects, checkboxes, switches, tables, dialogs, and
      accordions are styled without classes.
    </>,
  ],
  [
    "A few readable classes",
    <>
      Add <code>card</code>, <code>badge</code>, or <code>item</code> when HTML
      has no element for a pattern. Choose a style with{" "}
      <code>data-variant</code>.
    </>,
  ],
  [
    "Familiar theme tokens",
    <>
      Change <code>--primary</code>, <code>--radius</code>, and other
      shadcn/ui-style variables. Light and dark themes are included.
    </>,
  ],
  [
    "Fits your project",
    <>
      Use a CDN link or a bundler. The scoped stylesheet styles one part of an
      existing app, and an optional web component adds highlighted code.
    </>,
  ],
] as const;

export function Home() {
  return (
    <div class="container docs-page">
      <header>
        <sensible-navbar>
          <a href="./">
            Sensible UI
            <code>v{version}</code>
            <span class="badge" data-variant="secondary">
              beta
            </span>
          </a>
          <div class="cluster">
            <a
              class="button"
              data-variant="outline"
              data-size="icon"
              href="https://git.new/sensible"
              aria-label="GitHub repository"
            >
              <svg
                class="docs-github-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <button
              type="button"
              data-variant="outline"
              data-size="icon"
              aria-label="Dark mode"
              aria-pressed="false"
              data-theme-toggle
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            </button>
          </div>
        </sensible-navbar>
      </header>

      <main>
        <section
          class="landing-hero stack items-center text-center"
          aria-labelledby="landing-title"
        >
          <h1 id="landing-title">The shadcn/ui look. Just write HTML.</h1>
          <p class="landing-lead text-muted-foreground max-w-xl">
            Add one stylesheet, and your buttons, forms, tables, and dialogs
            look polished right away. Add a few readable classes for cards and
            badges, and theme everything with CSS variables. No React,
            Tailwind, or build step.
          </p>
          <div class="cluster justify-center">
            <a class="button" data-size="lg" href="#getting-started">
              Get started
            </a>
            <a
              class="button"
              data-size="lg"
              data-variant="outline"
              href="#typography"
            >
              Browse components
            </a>
          </div>
          <p class="text-muted-foreground max-w-xl">
            <small>
              Inspired by <a href="https://ui.shadcn.com">shadcn/ui</a>.
              Sensible UI is an independent project and is not affiliated with
              or endorsed by shadcn/ui.
            </small>
          </p>
        </section>

        <section class="stack pb-12" aria-label="Showcase">
          <div
            class="landing-showcase"
            dangerouslySetInnerHTML={{ __html: showcaseHtml.trim() }}
          />
          <p class="landing-note text-center text-muted-foreground">
            <small>
              Everything above is plain HTML styled by Sensible UI. Its only
              classes are <code>card</code>, <code>badge</code>,{" "}
              <code>item</code>, and <code>stack</code>.
            </small>
          </p>
        </section>

        <section class="stack pb-12" aria-labelledby="just-html-title">
          <h2 id="just-html-title">Write the HTML you already know</h2>
          <p>
            This sign-in card uses one class, <code>card</code>, and one
            attribute, <code>data-variant="outline"</code>. The headings,
            labels, inputs, and buttons get their styles because they are HTML.
          </p>
          <CodeExample code={justHtmlExample} />
        </section>

        <section class="stack pb-12" aria-labelledby="why-title">
          <h2 id="why-title">Why Sensible UI</h2>
          <div class="auto-grid" style="--min-item-size: 15rem">
            {reasons.map(([title, body]) => (
              <article>
                <h3>{title}</h3>
                <p class="text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <sensible-sidebar-layout class="border-t">
          <nav
            class="docs-nav sticky top-0 z-10 max-h-screen overflow-y-auto"
            aria-label="Documentation"
          >
            <sensible-sidebar>
              <details data-docs-nav>
                <summary>Browse the docs</summary>
                <div>
                  {navGroups.map((group) => (
                    <>
                      <h2>{group.title}</h2>
                      <ul>
                        {group.links.map(([id, label]) => (
                          <li>
                            <a href={`#${id}`}>{label}</a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ))}
                </div>
              </details>
            </sensible-sidebar>
          </nav>

          <div>
      <section class="docs-section stack" id="getting-started">
        <h2>Getting started</h2>
        <p>
          Pick the setup that matches your project. Every option gives you the
          same styles.
        </p>
        <h3>Add it to an HTML page</h3>
        <p>
          Paste the stylesheet link into your page’s <code>head</code>. You
          don’t need npm or JavaScript.
        </p>
        <CodeExample code={cdnLink} showPreview={false} />
        <p>
          Serve your page over HTTP, including when you test locally. The link
          pins version {version}; change the version when you want to update.
        </p>
        <h3>Write HTML</h3>
        <p>
          Native elements don’t need classes. Headings, text, forms, and buttons
          get their styles from the elements themselves.
        </p>
        <CodeExample
          code={`<section>
  <h1>Get in touch</h1>
  <p>Send a message and we will reply by email.</p>
  <form>
    <label for="example-email">Email</label>
    <input id="example-email" name="email" type="email">
    <button type="button">Send message</button>
  </form>
</section>`}
        />
        <p>
          To add a component, copy an example below. A few patterns that HTML
          can’t name use a class, such as <code>class="card"</code>. Choose a
          style with an attribute, such as <code>data-variant="outline"</code>.
          To change colors and corners, see <a href="#theming">Theming</a>.
        </p>
        <h3>Style part of an existing app</h3>
        <p>
          If your app already has its own styles, use the scoped stylesheet. It
          styles only the markup inside a <code>.sensible-ui</code> wrapper. See{" "}
          <a href="#scoped-mode">Scoped adoption</a>.
        </p>
        <h3>Use a bundler</h3>
        <p>
          Install <code>@faith-tools/sensible-ui</code>, then import the
          complete stylesheet in your CSS:
        </p>
        <CodeExample
          code="@import '@faith-tools/sensible-ui';"
          language="css"
          showPreview={false}
        />
        <p>
          Standalone component imports include the theme and base styles they
          need. When markup combines components, import each component. For
          example, <code>&lt;div data-slot="table-container" class="card"&gt;</code>{" "}
          needs both{" "}
          <code>/table</code> and <code>/card</code>.
        </p>
        <details>
          <summary>All public stylesheet exports</summary>
          <div data-slot="table-container">
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
                    <code>/code/css</code>
                  </th>
                  <td>
                    Optional code component styles; JavaScript is under{" "}
                    <code>/code</code>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/description-list</code>, <code>/dialog</code>,{" "}
                    <code>/image</code>, <code>/input</code>, <code>/item</code>
                  </th>
                  <td>Standalone component modules</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/progress</code>, <code>/spinner</code>,{" "}
                    <code>/table</code>, <code>/typography</code>
                  </th>
                  <td>Standalone component modules</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/button-group</code>, <code>/input-group</code>,{" "}
                    <code>/navigation</code>, <code>/tooltip</code>
                  </th>
                  <td>Standalone custom element styles</td>
                </tr>
                <tr>
                  <th scope="row">
                    <code>/input-group/js</code>, <code>/tooltip/js</code>
                  </th>
                  <td>Optional custom element behavior</td>
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

      <section class="docs-section stack" id="theming">
        <h2>Theming</h2>
        <p>
          Sensible UI uses shadcn/ui-style theme tokens, such as{" "}
          <code>--background</code>, <code>--primary</code>,{" "}
          <code>--muted</code>, <code>--border</code>, and{" "}
          <code>--radius</code>. Colors come in pairs: <code>--primary</code>{" "}
          colors a surface, and <code>--primary-foreground</code> colors the
          text on it.
        </p>
        <p>
          Override tokens after the Sensible UI stylesheet. Put dark theme
          values on <code>.dark</code>.
        </p>
        <CodeExample code={themeExample} language="css" showPreview={false} />
        <p>
          Find every light and dark token in{" "}
          <a href="https://github.com/cameronapak/sensible-ui/blob/main/src/css/theme.css">
            theme.css
          </a>
          . To change fonts, override <code>--font-sans</code> and{" "}
          <code>--font-mono</code>.
        </p>
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

      <section class="docs-section stack" id="scoped-mode">
        <h2>Limit styles to part of a page</h2>
        <p>
          Use the scoped bundle when adding Sensible UI to an existing
          application. Semantic defaults apply only inside a neutral{" "}
          <code>.sensible-ui</code> wrapper, leaving the rest of the page alone.
        </p>
        <CodeExample
          code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/scoped/sensible-ui.min.css">`}
          showPreview={false}
        />
        <CodeExample
          code={`<section class="sensible-ui">
  <h2>Account settings</h2>
  <label for="display-name">Display name</label>
  <input id="display-name">
  <button>Save changes</button>
</section>`}
          showPreview={false}
        />
        <p>
          If you use a bundler, import the scoped bundle in your CSS instead
          of using the CDN link:
        </p>
        <CodeExample
          code="@import '@faith-tools/sensible-ui/scoped';"
          language="css"
          showPreview={false}
        />
        <p>
          Put the class on a wrapper, not on a card, table, link, or form
          control. Sensible UI layout and utility classes such as{" "}
          <code>.stack</code>, <code>.mt-4</code>, and <code>.size-8</code> also
          belong on descendants, not the scope root. You can combine the scope
          class with a host-owned wrapper class. Scoped component and utility
          imports use the same names under <code>/scoped</code>, such as{" "}
          <code>/scoped/button</code> and <code>/scoped/utilities</code>. Scoped
          mode requires browser support for <code>@scope</code>.
        </p>
        <p>
          <a href="./scoped/">View the scoped bundle beside host styles</a>.
        </p>
      </section>

      <section class="docs-section stack" id="typography">
        <h2>Typography</h2>
        <StandaloneImport path="typography" />
        <p>
          Headings, paragraphs, links, lists, code, keyboard input, quotations,
          and inline text semantics are styled without classes. Keep the native
          element that matches the content’s meaning.
        </p>
        <p>
          Geist and Geist Mono are optional. The stylesheet prefers them but
          does not load them, so your system fonts are used unless you provide
          the fonts separately. See the{" "}
          <a href="https://github.com/cameronapak/sensible-ui#fonts">
            font setup in the README
          </a>{" "}
          for HTML and Next.js examples, or override <code>--font-sans</code>{" "}
          and <code>--font-mono</code> to use your own fonts.
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
          buttons an accessible name. Enabled buttons scale down slightly while
          pressed; reduced-motion preferences disable this movement.
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

      <section class="docs-section stack" id="dialog">
        <h2>Dialog</h2>
        <StandaloneImport path="dialog" />
        <p>
          A native <code>dialog</code> opens modally with{" "}
          <code>showModal()</code> or non-modally with <code>show()</code>. The
          standalone dialog import includes button styles; import{" "}
          <code>/input</code> separately for form controls. JavaScript only
          connects your trigger to the native method; no component runtime is
          required. Do not set <code>open</code> directly to create a modal.
        </p>
        <p>
          Identify the dialog with <code>aria-labelledby</code> and add{" "}
          <code>aria-describedby</code> for a short description. Direct{" "}
          <code>header</code>, <code>section</code>, and <code>footer</code>{" "}
          children provide the title, scrollable content, and actions. Provide a
          visible close control. A <code>form method="dialog"</code> closes
          without submitting data; handle saving in your application and close
          only after it succeeds. Choose initial focus with{" "}
          <code>autofocus</code> when needed.
        </p>
        <CodeExample code={dialogExample} />
        <div class="docs-subsection stack">
          <h3>Optional backdrop dismissal</h3>
          <p>
            Modal dialogs close with Escape by default, but a backdrop click
            does not dismiss them. Add <code>closedby="any"</code> only when
            discarding the dialog is safe. Keep a visible close control for
            browsers that do not support <code>closedby</code>.
          </p>
          <CodeExample code={lightDismissDialogExample} />
        </div>
        <div class="docs-subsection stack">
          <h3>Long content</h3>
          <p>
            The content region scrolls while the header and actions stay visible.
            On short viewports, the whole dialog scrolls so the body remains
            readable. The same layout works in dark mode and at narrow widths.
          </p>
          <CodeExample code={longDialogExample} />
        </div>
        <div class="docs-subsection stack">
          <h3>Non-modal</h3>
          <p>
            <code>show()</code> leaves the page interactive and has no backdrop
            or automatic Escape dismissal. Always include an explicit close
            control. Use a modal when the task requires focus to stay inside the
            dialog.
          </p>
          <CodeExample code={nonModalDialogExample} />
        </div>
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
          <code>scope</code> on row and column headers. Wrap the table in{" "}
          <code>data-slot="table-container"</code> so wide content scrolls
          horizontally instead of overflowing the page. Body cells wrap before
          the table scrolls, the caption stays in view, and a fade marks the
          edge with more columns. Give the container{" "}
          <code>role="region"</code>, <code>tabindex="0"</code>, and{" "}
          <code>aria-labelledby</code> pointing at the caption so keyboard
          users can scroll it. Add{" "}
          <code>class="card"</code> to the container and import the card module
          for the bordered treatment.
        </p>
        <CodeExample code={tableExample} />
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

      <section class="docs-section stack" id="progress">
        <h2>Progress</h2>
        <StandaloneImport path="progress" />
        <p>
          Use the native <code>progress</code> element without a class. Set{" "}
          <code>value</code> and <code>max</code> when you know how much work
          is done. Leave out the <code>value</code> attribute entirely for
          indeterminate work, and a segment moves along the track; browsers
          disagree about an empty <code>value=""</code>. With reduced motion, indeterminate
          progress shows still stripes instead.
        </p>
        <p>
          Give each bar a visible <code>label</code>. When people need the
          number, show it as text inside the label with{" "}
          <code>aria-hidden="true"</code>; screen readers already announce the
          bar's value.
          Change the color with <code>--primary</code>, and pick one dark
          enough to stand out from its lighter track. The bar is a block, so
          put it after text rather than inside a sentence. In a row with other
          content, the bar shrinks to make room but keeps at least 4rem. Use{" "}
          <code>aria-busy="true"</code> on the region that is updating, not on
          the progress bar.
        </p>
        <CodeExample code={progressExample} />
      </section>

      <section class="docs-section stack" id="button-group">
        <h2>Button group</h2>
        <StandaloneImport path="button-group" />
        <p>
          Wrap related controls in <code>&lt;sensible-button-group&gt;</code>{" "}
          to join their borders and corners. It works without JavaScript. Put
          native buttons, <code>a.button</code> links, inputs, selects, or text
          in a <code>span</code> directly inside it. Add{" "}
          <code>orientation="vertical"</code> to stack the controls. Use an{" "}
          <code>hr</code> to separate buttons that have no border, and nest
          groups to put space between them.
        </p>
        <p>
          A row that is too long for its container wraps onto more rows, and
          text inputs keep at least 8rem. Wrapped rows lose the joined look:
          corners at each break stay square, and a row that starts mid-group
          has no border on its start edge. When a set may not fit your
          narrowest screen, split it into nested groups, which wrap as whole
          groups, or use <code>orientation="vertical"</code>. Corners follow the nearest <code>dir</code>{" "}
          attribute, up to three nested levels, so set{" "}
          <code>dir="rtl"</code> on the page or the group rather than relying on{" "}
          <code>dir="auto"</code> or the CSS <code>direction</code> property. A <code>&lt;sensible-tooltip&gt;</code>{" "}
          around a control joins like the control itself. Other wrappers break
          the join, so put a checkbox inside a <code>label</code>, and point a
          button at a form with its <code>form</code> attribute instead of
          wrapping it in the <code>form</code>. Use one button size per group.
        </p>
        <p>
          The element only changes how controls look. When the controls act on
          the same thing, add <code>role="group"</code> and an{" "}
          <code>aria-label</code> so screen readers announce the group. Every
          control stays in the tab order. Mark toggles with{" "}
          <code>aria-pressed</code>, and give icon-only buttons an{" "}
          <code>aria-label</code>. Do not use <code>role="toolbar"</code>{" "}
          unless you also add arrow-key navigation; this element does not.
          Inputs still need an accessible name, because text such as{" "}
          <code>https://</code> beside an input is not its label.
        </p>
        <CodeExample code={buttonGroupExample} />
      </section>

      <section class="docs-section stack" id="input-group">
        <h2>Input group</h2>
        <StandaloneImport path="input-group" />
        <p>
          Wrap a text <code>input</code> or <code>textarea</code> in{" "}
          <code>&lt;sensible-input-group&gt;</code> to put icons, text, and
          buttons inside the same border. The group shows one focus ring when
          the field has keyboard focus, and it takes the field's{" "}
          <code>aria-invalid</code> and <code>disabled</code> states. Put
          icons, <code>span</code> text, and native buttons directly inside it.
          With a text area, put rows of text or actions in a <code>div</code>{" "}
          after it. The text area grows with its content up to 16rem, then
          scrolls.
        </p>
        <p>
          When space runs out, text after the field shortens with an ellipsis
          before the field gets narrower than 4rem, and button labels wrap.
          Prefixes such as a currency, and counts in an <code>output</code>,
          stay whole until they reach half the group. The group stays on one
          line, so keep its addons to what fits on your narrowest screen; move
          a count to help text and secondary actions beside or below the field
          when they do not fit. Put a long fixed domain in help
          text below the field instead of a suffix. A <code>select</code>{" "}
          inside the group is not supported; use a button group for a select
          beside a field.
        </p>
        <p>
          The examples use inline SVG icons from{" "}
          <a href="https://lucide.dev">Lucide</a>; any inline SVG works. Hide
          decorative icons with <code>aria-hidden="true"</code>. An icon or
          prefix is not a label, so give the field a <code>label</code> or an{" "}
          <code>aria-label</code>, and give icon-only buttons an{" "}
          <code>aria-label</code>. Buttons stay separate tab stops after the
          field.
        </p>
        <p>
          Styles work without JavaScript. The optional script makes a click on
          an icon, text, or empty space focus the field, as it would on a plain
          input:
        </p>
        <CodeExample
          code={`<script type="module" src="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/sensible-input-group.js"></script>`}
          showPreview={false}
        />
        <p>
          With a bundler, import <code>@faith-tools/sensible-ui/input-group/js</code>{" "}
          in your browser JavaScript.
        </p>
        <CodeExample code={inputGroupExample} />
      </section>

      <section class="docs-section stack" id="tooltip">
        <h2>Tooltip</h2>
        <StandaloneImport path="tooltip" />
        <p>
          A tooltip shows a short description when people hover over, focus,
          or press and hold a control. Wrap the control and a{" "}
          <code>role="tooltip"</code> element in{" "}
          <code>&lt;sensible-tooltip&gt;</code>, with the control first. Set{" "}
          <code>side</code> to <code>top</code> (the default),{" "}
          <code>bottom</code>, <code>left</code>, or <code>right</code>; other
          values show it on top. The tooltip flips to the other side when it
          would leave the screen, and a left or right tooltip moves above or
          below its control when neither side has room. The wrapper adds no
          box, so a wrapped field keeps its width and its <code>label</code>{" "}
          spacing.
        </p>
        <p>
          Showing the tooltip needs the optional script. Load it as a module,
          or import <code>@faith-tools/sensible-ui/tooltip/js</code> with a
          bundler:
        </p>
        <CodeExample
          code={`<script type="module" src="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/sensible-tooltip.js"></script>`}
          showPreview={false}
        />
        <p>
          The script links the tooltip to the control with{" "}
          <code>aria-describedby</code>, so screen readers announce it as a
          description. In browsers that support interest invokers, it adds{" "}
          <code>interestfor</code> and lets the browser handle hover, focus,
          long press, and <kbd>Esc</kbd>. Elsewhere, it shows the tooltip after
          a short hover delay, on keyboard focus, and after a half-second touch
          hold. People can move the pointer onto the tooltip, and{" "}
          <kbd>Esc</kbd> closes it. It also closes once its control scrolls
          out of view, so it never floats away from it. Touch behavior is
          tested with emulated touch input, not yet on real phones or tablets.
          If the
          browser's anchor positioning leaves a tooltip away from its control,
          as Firefox does in a right-to-left part of a left-to-right page, the
          script places it beside the control. Only one tooltip shows at a
          time. <kbd>Esc</kbd> that closes a tooltip has{" "}
          <code>defaultPrevented</code> set, so check it before your own{" "}
          <kbd>Esc</kbd> shortcuts act. In both cases, once a tooltip shows, the
          next tooltip shows without the delay while people move between
          controls. The delay returns 300ms after the last tooltip closes, or
          right after <kbd>Esc</kbd>. Without the script, the text stays hidden
          on screen but remains next to the control for assistive technology.
        </p>
        <p>
          Keep tooltips short and never put links or buttons in them. Do not
          put essential information only in a tooltip, because many touch users
          will not find it. The control needs its own accessible name. When the
          tooltip is the name of an icon button, give the tooltip an{" "}
          <code>id</code> and point <code>aria-labelledby</code> at it instead.
          Disabled buttons cannot receive focus or hover, so a tooltip on one
          never shows; explain why a control is unavailable in visible text.
        </p>
        <CodeExample code={tooltipExample} />
      </section>

      <section class="docs-section stack" id="navigation">
        <h2>Navigation</h2>
        <StandaloneImport path="navigation" />
        <p>
          Three elements arrange navigation without JavaScript. They do not
          add landmarks, so keep native <code>header</code>,{" "}
          <code>footer</code>, <code>aside</code>, and <code>nav</code>{" "}
          elements around or inside them. Put links in a <code>ul</code> inside
          the <code>nav</code>, mark the current page with{" "}
          <code>aria-current="page"</code>, and give each <code>nav</code> an{" "}
          <code>aria-label</code> when a page has more than one.
        </p>
        <h3>Header and footer</h3>
        <p>
          <code>&lt;sensible-navbar&gt;</code> spreads its children across one
          row and lays links out horizontally. On narrow screens its children
          and links wrap onto more rows. A link placed directly inside it, such
          as a logo beside a name, shows as the brand without an underline.
        </p>
        <CodeExample code={headerExample} />
        <CodeExample code={footerExample} />
        <h3>Sidebar</h3>
        <p>
          <code>&lt;sensible-sidebar&gt;</code> draws a panel with stacked
          links. Use headings to name groups and a native{" "}
          <code>details</code> element for a group that opens and closes.{" "}
          <code>&lt;sensible-sidebar-layout&gt;</code> puts its first child
          beside its last child at <code>--sidebar-width</code> (
          <code>16rem</code> by default), and stacks them when the content
          would get narrower than 60% of the layout. Add{" "}
          <code>side="end"</code> and put the sidebar last to place it after
          the content. Use <code>main</code> for the content on a real page.
          The sidebar does not collapse into a menu on small screens.
        </p>
        <p>
          Set <code>--sidebar-width</code> to a length or percentage, such as{" "}
          <code>20rem</code>; other values stack the layout. The layout expects
          two children, and any others take full rows. Put a link label in one{" "}
          <code>span</code> when it sits beside an icon or badge or mixes text
          with other inline elements, so the label wraps as one block. When a long sidebar stacks above the content on
          small screens, add a skip link to the content before it. A closed
          group that holds the current page highlights its summary.
        </p>
        <CodeExample code={sidebarExample} />
      </section>

      <section class="docs-section stack" id="container">
        <h2>Container</h2>
        <StandaloneImport path="utils" />
        <p>
          Add <code>class="container"</code> to center content and limit its
          width. It fills the available width up to <code>640px</code> by default,
          with <code>1rem</code> of padding on all sides. At viewport widths of{" "}
          <code>40rem</code> and above, the padding becomes <code>1.5rem</code>.
          The core bundle includes this class; no companion stylesheet is needed.
        </p>
        <p>
          Set <code>--container-width</code> on the container to choose a different
          maximum width. The example uses <code>32rem</code>. The class works on{" "}
          <code>main</code>, <code>section</code>, or <code>div</code>; a plain{" "}
          <code>main</code> does not get container styles automatically.{" "}
          <code>.page</code> is an alias for <code>.container</code>.
        </p>
        <CodeExample
          code={`<div class="container" style="--container-width: 32rem">
  <h3>Centered content</h3>
  <p>Keep content readable without stretching across the whole page.</p>
</div>`}
        />
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
          Prefer named helpers such as <code>.stack</code>,{" "}
          <code>.y-stack</code>, and <code>.x-stack</code> for common
          composition, then use atomic helpers for exceptions.
          Breakpoint-prefixed variants are intentionally not generated; use
          intrinsic layouts or consumer-owned media queries instead.
        </p>
        <CodeExample code={utilitiesExample} />
      </section>

      <section class="docs-section stack" id="code">
        <h2>Add highlighted code</h2>
        <p>
          Add the optional stylesheet and browser module to pages that need
          syntax highlighting. The component works without the main Sensible UI
          stylesheet. Serve the page over HTTP so the browser can load the
          module.
        </p>
        <ol>
          <li>
            <p>Add the component styles to your HTML:</p>
            <CodeExample
              code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/src/css/code.css">`}
              showPreview={false}
            />
          </li>
          <li>
            <p>Load the component as a browser module:</p>
            <CodeExample
              code={`<script type="module" src="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/sensible-code.js"></script>`}
              showPreview={false}
            />
          </li>
          <li>
            <p>
              Add <code>sensible-code</code> with a read-only{" "}
              <code>textarea</code> containing the source:
            </p>
            <CodeExample
              code={`<sensible-code language="html" data-wrap="true">
  <textarea readonly><button>Save</button></textarea>
</sensible-code>`}
              showPreview={false}
            />
          </li>
        </ol>
        <p>
          If you use a bundler, install <code>@faith-tools/sensible-ui</code>.
          Import the styles in your CSS and the component in your browser
          JavaScript instead of using the CDN tags:
        </p>
        <CodeExample
          code="@import '@faith-tools/sensible-ui/code/css';"
          language="css"
          showPreview={false}
        />
        <CodeExample
          code="import '@faith-tools/sensible-ui/code';"
          language="javascript"
          showPreview={false}
        />
        <p>
          The code below shows syntax colors, a Wrap lines toggle, and a Copy
          button. Code scrolls horizontally by default at every screen width.
          Set <code>data-wrap="true"</code> to start a block wrapped. Readers
          can switch either block between wrapping and scrolling. Without
          JavaScript, the read-only text area remains readable. The component
          creates <code>pre</code> and <code>code</code> when it loads. In HTML
          source, escape <code>&amp;</code> before entity names. If the example
          contains <code>&lt;/textarea&gt;</code>, write its opening angle
          bracket as <code>&amp;lt;</code>. Set <code>language</code> to a
          supported language name, such as <code>html</code>, <code>css</code>,
          or <code>python</code>.
        </p>
        <sensible-code language="html">
          <textarea readonly>
            {'<button type="button">Save</button>\n<p>Ready & waiting</p>'}
          </textarea>
        </sensible-code>
        <sensible-code language="html" data-wrap="true">
          <textarea readonly>
            {`<a href="/${"a/long/example/path/".repeat(10)}">Read the example</a>`}
          </textarea>
        </sensible-code>
      </section>

          </div>
        </sensible-sidebar-layout>
      </main>

      <footer class="border-t py-8">
        <sensible-navbar>
          <p>
            Sensible UI is a semantic-first fork of{" "}
            <a href="https://basecoatui.com">Basecoat</a>, influenced by
            shadcn/ui and Oat CSS.
          </p>
          <nav aria-label="Project">
            <ul>
              <li>
                <a href="https://github.com/cameronapak/sensible-ui">GitHub</a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/@faith-tools/sensible-ui">
                  npm
                </a>
              </li>
              <li>
                <a href="https://github.com/cameronapak/sensible-ui/blob/main/LICENSE.md">
                  MIT License
                </a>
              </li>
              <li>
                <a href="https://faith.tools">faith.tools</a>
              </li>
            </ul>
          </nav>
        </sensible-navbar>
      </footer>
    </div>
  );
}
