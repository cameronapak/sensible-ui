# Basecoat v2: Web Component Conversion Plan

## Philosophy

Two types of components:

1. **Native elements styled directly** — `<button>`, `<input>`, `<table>`, `<details>`, etc. get styled globally. Variants via `data-*` attributes. No classes needed.
2. **Custom elements (light DOM)** — For concepts with no native HTML equivalent: `<bc-alert>`, `<bc-badge>`, `<bc-dropdown>`, etc. No Shadow DOM — global CSS cascades in. Variants via element attributes.

**Why no Shadow DOM?** Basecoat is a CSS framework built on Tailwind. Shadow DOM blocks CSS cascade = breaks the entire value prop. Light DOM custom elements give us the nice `<bc-*>` tag API without the encapsulation pain.

---

## Component-by-Component Conversion

### Legend

| Column | Meaning |
|--------|---------|
| **Type** | `native` = style the HTML element directly, `custom` = register a `<bc-*>` custom element |
| **Needs JS** | Whether the component needs JavaScript behavior |

---

### 1. Alert

| | |
|---|---|
| **Current** | `.alert`, `.alert-destructive` |
| **New** | `<bc-alert>` custom element |
| **Type** | `custom` — no native HTML alert element |
| **Needs JS** | No |
| **Attributes** | `variant="default\|destructive"` |

```html
<!-- Before -->
<div class="alert-destructive">
  <svg>...</svg>
  <strong>Error</strong>
  <section><p>Something went wrong</p></section>
</div>

<!-- After -->
<bc-alert variant="destructive">
  <svg>...</svg>
  <strong>Error</strong>
  <section><p>Something went wrong</p></section>
</bc-alert>
```

**CSS selector change:** `.alert` → `bc-alert`, `.alert-destructive` → `bc-alert[variant="destructive"]`

---

### 2. Badge

| | |
|---|---|
| **Current** | `.badge`, `.badge-primary`, `.badge-secondary`, `.badge-destructive`, `.badge-outline` |
| **New** | `<bc-badge>` custom element |
| **Type** | `custom` — no native badge element |
| **Needs JS** | No |
| **Attributes** | `variant="primary\|secondary\|destructive\|outline"` |

```html
<!-- Before -->
<span class="badge-destructive">Error</span>

<!-- After -->
<bc-badge variant="destructive">Error</bc-badge>
```

**CSS selector change:** `.badge` → `bc-badge`, `.badge-secondary` → `bc-badge[variant="secondary"]`

---

### 3. Button

| | |
|---|---|
| **Current** | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-link`, `.btn-destructive`, `.btn-sm`, `.btn-lg`, `.btn-icon`, + ~50 more combos |
| **New** | Style `<button>` directly |
| **Type** | `native` — keep native button behavior (form submission, keyboard, etc.) |
| **Needs JS** | No |
| **Attributes** | `data-variant="primary\|secondary\|outline\|ghost\|link\|destructive"`, `data-size="sm\|lg\|icon"` |

```html
<!-- Before -->
<button class="btn-sm-destructive">Delete</button>
<button class="btn-icon-ghost"><svg>...</svg></button>

<!-- After -->
<button data-variant="destructive" data-size="sm">Delete</button>
<button data-variant="ghost" data-size="icon"><svg>...</svg></button>

<!-- Default (primary) — no attributes needed -->
<button>Save</button>
```

**CSS selector change:**
- `.btn` → `button, [type="submit"], [type="reset"], [type="button"]`
- `.btn-destructive` → `button[data-variant="destructive"]`
- `.btn-sm` → `button[data-size="sm"]`
- `.btn-sm-destructive` → `button[data-variant="destructive"][data-size="sm"]`
- `.btn-icon` → `button[data-size="icon"]`
- Link-as-button: `<a class="button" href="#">` (single class exception like Oat)

**This eliminates ~60 classes down to 2 attributes.**

---

### 4. Button Group

| | |
|---|---|
| **Current** | `.button-group` |
| **New** | `<bc-button-group>` custom element |
| **Type** | `custom` |
| **Needs JS** | No |
| **Attributes** | `orientation="vertical"` (horizontal is default) |

```html
<!-- Before -->
<div class="button-group">
  <button class="btn-outline">Left</button>
  <button class="btn-outline">Right</button>
</div>

<!-- After -->
<bc-button-group>
  <button data-variant="outline">Left</button>
  <button data-variant="outline">Right</button>
</bc-button-group>
```

---

### 5. Card

| | |
|---|---|
| **Current** | `.card` |
| **New** | `<bc-card>` custom element |
| **Type** | `custom` |
| **Needs JS** | No |
| **Attributes** | None (internal structure uses `<header>`, `<section>`, `<footer>`) |

```html
<!-- Before -->
<div class="card">
  <header><h2>Title</h2><p>Description</p></header>
  <section>Content</section>
  <footer><button class="btn">Save</button></footer>
</div>

<!-- After -->
<bc-card>
  <header><h2>Title</h2><p>Description</p></header>
  <section>Content</section>
  <footer><button>Save</button></footer>
</bc-card>
```

---

### 6. Checkbox

| | |
|---|---|
| **Current** | `input[type="checkbox"]` inside `.form`/`.field`, or `.input[type="checkbox"]` |
| **New** | Style `input[type="checkbox"]` globally |
| **Type** | `native` |
| **Needs JS** | No |

```html
<!-- Before -->
<div class="field">
  <label><input type="checkbox"> Accept terms</label>
</div>

<!-- After (no wrapper needed) -->
<label><input type="checkbox"> Accept terms</label>
```

**CSS selector change:** `:is(.form, .field) input[type='checkbox']` → `input[type="checkbox"]:not([role="switch"])`

---

### 7. Collapsible / Accordion

| | |
|---|---|
| **Current** | `details`/`summary` (already styled natively) |
| **New** | No change — already semantic |
| **Type** | `native` |
| **Needs JS** | No |

```html
<!-- Same as current — already perfect -->
<details>
  <summary>Click to expand</summary>
  <p>Hidden content</p>
</details>
```

---

### 8. Command

| | |
|---|---|
| **Current** | `.command` + `.command-dialog` + `command.js` |
| **New** | `<bc-command>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — filtering, keyboard navigation |

```html
<!-- Before -->
<dialog class="command-dialog">
  <div class="command">
    <header><svg>...</svg><input placeholder="Search..."></header>
    <div role="menu">
      <button role="menuitem">Item 1</button>
    </div>
  </div>
</dialog>

<!-- After -->
<dialog>
  <bc-command>
    <header><svg>...</svg><input placeholder="Search..."></header>
    <div role="menu">
      <button role="menuitem">Item 1</button>
    </div>
  </bc-command>
</dialog>
```

**JS:** Convert IIFE → `class BcCommand extends HTMLElement` with `connectedCallback()`. Same filtering/keyboard logic, just uses `this` instead of passed `container`.

---

### 9. Dialog

| | |
|---|---|
| **Current** | `dialog.dialog` (native dialog + class) |
| **New** | Style `<dialog>` directly |
| **Type** | `native` |
| **Needs JS** | No (uses native `dialog.showModal()`) |

```html
<!-- Before -->
<dialog class="dialog">
  <div>
    <header><h2>Title</h2></header>
    <section>Content</section>
    <footer><button class="btn">Confirm</button></footer>
  </div>
</dialog>

<!-- After -->
<dialog>
  <div>
    <header><h2>Title</h2></header>
    <section>Content</section>
    <footer><button>Confirm</button></footer>
  </div>
</dialog>
```

**CSS selector change:** `.dialog` → `dialog`

---

### 10. Dropdown Menu

| | |
|---|---|
| **Current** | `.dropdown-menu` + `dropdown-menu.js` |
| **New** | `<bc-dropdown>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — toggle, keyboard nav, outside click |

```html
<!-- Before -->
<div class="dropdown-menu">
  <button class="btn-outline" aria-expanded="false">Options</button>
  <div data-popover aria-hidden="true">
    <div role="menu">
      <button role="menuitem">Edit</button>
      <button role="menuitem">Delete</button>
    </div>
  </div>
</div>

<!-- After -->
<bc-dropdown>
  <button data-variant="outline" aria-expanded="false">Options</button>
  <div data-popover aria-hidden="true">
    <div role="menu">
      <button role="menuitem">Edit</button>
      <button role="menuitem">Delete</button>
    </div>
  </div>
</bc-dropdown>
```

---

### 11. Field

| | |
|---|---|
| **Current** | `.field`, `.fieldset` |
| **New** | `<bc-field>` custom element, style `<fieldset>` directly |
| **Type** | `custom` for field, `native` for fieldset |
| **Needs JS** | No |
| **Attributes** | `orientation="horizontal"`, `invalid` |

```html
<!-- Before -->
<div class="field" data-orientation="horizontal">
  <label>Name</label>
  <input type="text">
  <p>Enter your full name</p>
</div>

<!-- After -->
<bc-field orientation="horizontal">
  <label>Name</label>
  <input type="text">
  <p>Enter your full name</p>
</bc-field>
```

---

### 12. Input

| | |
|---|---|
| **Current** | `input` inside `.form`/`.field`, or `.input[type="text"]` etc. |
| **New** | Style all text-like inputs globally |
| **Type** | `native` |
| **Needs JS** | No |

```html
<!-- Before -->
<div class="field">
  <input type="email" placeholder="Email">
</div>

<!-- After (styled automatically) -->
<input type="email" placeholder="Email">
```

**CSS selector change:** Remove the `:is(.form, .field)` scoping and `.input` class. Target `input:not([type="checkbox"], [type="radio"], [type="range"], [type="hidden"], [type="file"], [type="color"])` directly.

---

### 13. Kbd

| | |
|---|---|
| **Current** | `.kbd` |
| **New** | Style `<kbd>` directly |
| **Type** | `native` |
| **Needs JS** | No |

```html
<!-- Before -->
<span class="kbd">⌘K</span>

<!-- After -->
<kbd>⌘K</kbd>
```

**CSS selector change:** `.kbd` → `kbd`

---

### 14. Label

| | |
|---|---|
| **Current** | `.label` or `label` inside `.form`/`.field` |
| **New** | Style `<label>` directly |
| **Type** | `native` |
| **Needs JS** | No |

**CSS selector change:** `:is(.form, .field) label` → `label`

---

### 15. Popover

| | |
|---|---|
| **Current** | `.popover` + `popover.js` |
| **New** | `<bc-popover>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — toggle, outside click, escape |

```html
<!-- Before -->
<div class="popover">
  <button class="btn-outline">Open</button>
  <div data-popover aria-hidden="true">Content</div>
</div>

<!-- After -->
<bc-popover>
  <button data-variant="outline">Open</button>
  <div data-popover aria-hidden="true">Content</div>
</bc-popover>
```

---

### 16. Radio

| | |
|---|---|
| **Current** | `input[type="radio"]` inside `.form`/`.field` |
| **New** | Style `input[type="radio"]` globally |
| **Type** | `native` |
| **Needs JS** | No |

**CSS selector change:** `:is(.form, .field) input[type='radio']` → `input[type="radio"]`

---

### 17. Range / Slider

| | |
|---|---|
| **Current** | `input[type="range"]` inside `.form`/`.field` |
| **New** | Style `input[type="range"]` globally |
| **Type** | `native` |
| **Needs JS** | No (keep the tiny inline `--slider-value` JS if desired) |

---

### 18. Select (Native)

| | |
|---|---|
| **Current** | `select` inside `.form`/`.field`, or `select.select` |
| **New** | Style `<select>` globally |
| **Type** | `native` |
| **Needs JS** | No |

**CSS selector change:** `:is(.form, .field) select` → `select`

---

### 19. Select (Custom)

| | |
|---|---|
| **Current** | `div.select` + `select.js` |
| **New** | `<bc-select>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — full custom select with search, keyboard nav, multi-select |
| **Attributes** | `multiple`, `searchable`, `placeholder="..."`, `close-on-select` |

```html
<!-- Before -->
<div class="select" data-placeholder="Choose...">
  <button class="btn-outline" aria-expanded="false">
    <span>Choose...</span>
    <svg>...</svg>
  </button>
  <input type="hidden" name="fruit" value="">
  <div data-popover aria-hidden="true">
    <div role="listbox">
      <div role="option" data-value="apple">Apple</div>
      <div role="option" data-value="banana">Banana</div>
    </div>
  </div>
</div>

<!-- After -->
<bc-select placeholder="Choose..." name="fruit">
  <button data-variant="outline" aria-expanded="false">
    <span>Choose...</span>
    <svg>...</svg>
  </button>
  <input type="hidden" name="fruit" value="">
  <div data-popover aria-hidden="true">
    <div role="listbox">
      <div role="option" data-value="apple">Apple</div>
      <div role="option" data-value="banana">Banana</div>
    </div>
  </div>
</bc-select>
```

---

### 20. Sidebar

| | |
|---|---|
| **Current** | `.sidebar` + `sidebar.js` |
| **New** | `<bc-sidebar>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — responsive toggle, mobile overlay |
| **Attributes** | `open`, `breakpoint="768"`, `side="left\|right"` |

```html
<!-- Before -->
<aside class="sidebar" data-initial-open="true" data-breakpoint="768">
  <nav>...</nav>
</aside>

<!-- After -->
<bc-sidebar open breakpoint="768">
  <nav>...</nav>
</bc-sidebar>
```

**Trigger:** `document.dispatchEvent(new CustomEvent('basecoat:sidebar'))` stays the same.

---

### 21. Switch

| | |
|---|---|
| **Current** | `input[type="checkbox"][role="switch"]` inside `.form`/`.field` |
| **New** | Style `input[type="checkbox"][role="switch"]` globally |
| **Type** | `native` |
| **Needs JS** | No |

**CSS selector change:** `:is(.form, .field) input[type='checkbox'][role='switch']` → `input[type="checkbox"][role="switch"]`

---

### 22. Table

| | |
|---|---|
| **Current** | `.table` |
| **New** | Style `<table>` directly |
| **Type** | `native` |
| **Needs JS** | No |

```html
<!-- Before -->
<table class="table">...</table>

<!-- After -->
<table>...</table>
```

**CSS selector change:** `.table` → `table`

---

### 23. Tabs

| | |
|---|---|
| **Current** | `.tabs` + `tabs.js` |
| **New** | `<bc-tabs>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — tab switching, keyboard nav |

```html
<!-- Before -->
<div class="tabs">
  <div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
    <button role="tab" aria-controls="panel-2">Tab 2</button>
  </div>
  <div role="tabpanel" id="panel-1">Content 1</div>
  <div role="tabpanel" id="panel-2" hidden>Content 2</div>
</div>

<!-- After -->
<bc-tabs>
  <div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
    <button role="tab" aria-controls="panel-2">Tab 2</button>
  </div>
  <div role="tabpanel" id="panel-1">Content 1</div>
  <div role="tabpanel" id="panel-2" hidden>Content 2</div>
</bc-tabs>
```

---

### 24. Textarea

| | |
|---|---|
| **Current** | `textarea` inside `.form`/`.field`, or `.textarea` |
| **New** | Style `<textarea>` globally |
| **Type** | `native` |
| **Needs JS** | No |

---

### 25. Toast

| | |
|---|---|
| **Current** | `.toaster` + `.toast` + `toast.js` |
| **New** | `<bc-toaster>` custom element |
| **Type** | `custom` |
| **Needs JS** | Yes — auto-dismiss, pause on hover, create API |

```html
<!-- Before -->
<div id="toaster" class="toaster">...</div>

<!-- After -->
<bc-toaster></bc-toaster>
```

**API stays similar:** `document.dispatchEvent(new CustomEvent('basecoat:toast', { detail: { config } }))`

---

### 26. Tooltip

| | |
|---|---|
| **Current** | `[data-tooltip]` (already attribute-based!) |
| **New** | No change needed |
| **Type** | `native` (attribute-driven CSS) |
| **Needs JS** | No |

Already perfect. No conversion needed.

---

## Summary Table

| # | Component | Current | New | Type | JS? |
|---|-----------|---------|-----|------|-----|
| 1 | Alert | `.alert` | `<bc-alert>` | custom | No |
| 2 | Badge | `.badge-*` | `<bc-badge>` | custom | No |
| 3 | Button | `.btn-*` (60+) | `<button>` + `data-variant` + `data-size` | native | No |
| 4 | Button Group | `.button-group` | `<bc-button-group>` | custom | No |
| 5 | Card | `.card` | `<bc-card>` | custom | No |
| 6 | Checkbox | `.input[type=checkbox]` | `input[type=checkbox]` | native | No |
| 7 | Collapsible | `details/summary` | `details/summary` | native | No |
| 8 | Command | `.command` + JS | `<bc-command>` | custom | Yes |
| 9 | Dialog | `.dialog` | `<dialog>` | native | No |
| 10 | Dropdown | `.dropdown-menu` + JS | `<bc-dropdown>` | custom | Yes |
| 11 | Field | `.field` | `<bc-field>` | custom | No |
| 12 | Input | `.input` / scoped | `input[type=*]` | native | No |
| 13 | Kbd | `.kbd` | `<kbd>` | native | No |
| 14 | Label | `.label` / scoped | `<label>` | native | No |
| 15 | Popover | `.popover` + JS | `<bc-popover>` | custom | Yes |
| 16 | Radio | scoped | `input[type=radio]` | native | No |
| 17 | Range | scoped | `input[type=range]` | native | No |
| 18 | Select (native) | scoped | `<select>` | native | No |
| 19 | Select (custom) | `div.select` + JS | `<bc-select>` | custom | Yes |
| 20 | Sidebar | `.sidebar` + JS | `<bc-sidebar>` | custom | Yes |
| 21 | Switch | scoped | `input[role=switch]` | native | No |
| 22 | Table | `.table` | `<table>` | native | No |
| 23 | Tabs | `.tabs` + JS | `<bc-tabs>` | custom | Yes |
| 24 | Textarea | `.textarea` / scoped | `<textarea>` | native | No |
| 25 | Toast | `.toaster` + JS | `<bc-toaster>` | custom | Yes |
| 26 | Tooltip | `[data-tooltip]` | `[data-tooltip]` | native | No |

**Result:** 14 native-styled, 12 custom elements (7 with JS, 5 CSS-only)

---

## Implementation Order

### Phase 1: Foundation (do first)
1. **Button** — Highest impact. Eliminates 60+ classes. Sets the `data-variant`/`data-size` pattern.
2. **Input/Textarea/Select(native)/Label** — Global form element styling. Removes `.form`/`.field` scoping requirement.
3. **Checkbox/Radio/Switch/Range** — Complete the form elements.
4. **Table** — Simple selector change.
5. **Dialog** — Simple selector change.
6. **Kbd** — Trivial.

### Phase 2: CSS-only Custom Elements
7. **`<bc-alert>`** — Simple, sets the custom element pattern.
8. **`<bc-badge>`** — Simple variant pattern.
9. **`<bc-card>`** — Simple container.
10. **`<bc-field>`** — Form field wrapper.
11. **`<bc-button-group>`** — Layout container.

### Phase 3: JS Custom Elements
12. **`<bc-tabs>`** — Simplest JS component.
13. **`<bc-popover>`** — Foundation for dropdown/select.
14. **`<bc-dropdown>`** — Depends on popover pattern.
15. **`<bc-select>`** — Most complex, depends on popover pattern.
16. **`<bc-command>`** — Similar to select.
17. **`<bc-sidebar>`** — Standalone.
18. **`<bc-toaster>`** — Standalone.

### Phase 4: No changes needed
- Collapsible (`details`/`summary`) — already native
- Tooltip (`[data-tooltip]`) — already attribute-based

---

## JS Architecture for Custom Elements

Replace `basecoat.js` registry pattern with native `customElements.define()`:

```js
// src/js/bc-tabs.js
class BcTabs extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return
    // ... same logic as current tabs.js, using `this` instead of passed element
    this.dataset.initialized = 'true'
    this.dispatchEvent(new CustomEvent('basecoat:initialized'))
  }
}
customElements.define('bc-tabs', BcTabs)
```

**For CSS-only custom elements**, a minimal registration is still needed so the browser knows the element:

```js
// src/js/bc-alert.js  
class BcAlert extends HTMLElement {}
customElements.define('bc-alert', BcAlert)
```

Or skip JS registration entirely and just style the tag name in CSS — browsers render unknown elements as inline by default, so add `bc-alert { display: block; }` in CSS. **No JS file needed for CSS-only custom elements.**

### What happens to `basecoat.js`?

The MutationObserver registry (`window.basecoat.register()`) is **no longer needed**. Custom elements have built-in lifecycle — `connectedCallback` fires automatically when elements are added to the DOM, even dynamically. Delete `basecoat.js` entirely.

**Keep `window.basecoat` as a namespace** only for imperative APIs:
```js
window.basecoat = {
  toast: (config) => { /* create toast */ }
}
```

---

## CSS Architecture

### `@layer base` — Native element global styles
```css
@layer base {
  button, [type="submit"], [type="reset"], [type="button"] { /* button styles */ }
  input:not([type="checkbox"], [type="radio"], [type="range"], [type="hidden"]) { /* input styles */ }
  select { /* select styles */ }
  textarea { /* textarea styles */ }
  label { /* label styles */ }
  table { /* table styles */ }
  dialog { /* dialog styles */ }
  kbd { /* kbd styles */ }
  details { /* collapsible styles */ }
}
```

### `@layer components` — Custom element styles
```css
@layer components {
  bc-alert { display: grid; /* ... */ }
  bc-badge { display: inline-flex; /* ... */ }
  bc-card { display: flex; /* ... */ }
  bc-tabs { display: flex; /* ... */ }
  /* etc. */
}
```

---

## Breaking Changes

This is a **v2 major version bump**. Not backward compatible.

| What breaks | Migration |
|-------------|-----------|
| All `.btn-*` classes | Replace with `<button data-variant="..." data-size="...">` |
| `.alert`, `.alert-destructive` | Replace with `<bc-alert variant="...">` |
| `.badge-*` classes | Replace with `<bc-badge variant="...">` |
| `.card` class | Replace with `<bc-card>` |
| `.table` class | Remove class, just use `<table>` |
| `.dialog` class | Remove class, just use `<dialog>` |
| `.kbd` class | Remove class, just use `<kbd>` |
| `.field`/`.fieldset` wrappers | Replace with `<bc-field>`, style `<fieldset>` directly |
| `.form`/`.field` input scoping | Inputs styled globally — no wrapper needed |
| `.dropdown-menu` + JS | Replace with `<bc-dropdown>` |
| `.popover` + JS | Replace with `<bc-popover>` |
| `div.select` + JS | Replace with `<bc-select>` |
| `.tabs` + JS | Replace with `<bc-tabs>` |
| `.sidebar` + JS | Replace with `<bc-sidebar>` |
| `#toaster.toaster` + JS | Replace with `<bc-toaster>` |
| `.command` + JS | Replace with `<bc-command>` |
| `window.basecoat.register()` | Removed — custom elements auto-initialize |
| `window.basecoat.init()` | Removed — use `connectedCallback` |

---

## File Structure (After)

```
src/
├── css/
│   └── basecoat.css          # All CSS (native + custom element selectors)
└── js/
    ├── bc-command.js          # class BcCommand extends HTMLElement
    ├── bc-dropdown.js         # class BcDropdown extends HTMLElement
    ├── bc-popover.js          # class BcPopover extends HTMLElement
    ├── bc-select.js           # class BcSelect extends HTMLElement
    ├── bc-sidebar.js          # class BcSidebar extends HTMLElement
    ├── bc-tabs.js             # class BcTabs extends HTMLElement
    └── bc-toaster.js          # class BcToaster extends HTMLElement
```

No `basecoat.js` registry. No CSS-only JS files. 7 JS files (down from 8, and simpler).
