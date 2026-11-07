# Sensible UI usage

Use this reference with the matching installed package version. Preserve the consuming project's CSS variables and configuration. See [design guidance](design.md) for token roles and shadcn compatibility limits, and [components](components.md) for exact markup.

## Choose the stylesheet

For a bundler, install `@faith-tools/sensible-ui` with the project's package manager and import CSS from its existing stylesheet:

```css
@import '@faith-tools/sensible-ui';
```

The root is CSS, not a JavaScript component library. Do not add React, Tailwind, a provider, or a runtime to use it.

For an existing app where global semantic defaults would interfere, use this **instead**:

```css
@import '@faith-tools/sensible-ui/scoped';
```

```html
<section class="sensible-ui account-theme">
  <div class="stack">
    <h2>Account</h2>
    <label for="account-name">Name</label>
    <input id="account-name" name="name">
    <button type="button">Save</button>
  </div>
</section>
```

`.sensible-ui` is a neutral boundary, not a component. Do not put `.card`, `.stack`, or utility classes on that same element. Keep those on descendants. The wrapper establishes local theme/base defaults; root-only overrides on `:root` may be replaced there, so apply the consumer's theme to the scope root too.

Scoped mode requires browser support for native `@scope`. Unsupported browsers ignore scoped rules. It is not Shadow DOM: host styles can still cascade in. A dialog/popover that remains a DOM descendant retains the scope even in the top layer; a framework portal outside it needs `.sensible-ui` on its neutral portal container. Do not add a global import to fix a scoped integration.

For selected components, standalone CSS subpaths include their own theme and base dependencies:

```css
@import '@faith-tools/sensible-ui/button';
@import '@faith-tools/sensible-ui/card';
```

Use `scoped/button` and `scoped/card` for their scoped counterparts. Import each component used in combined markup, such as both `table` and `card` for a table in a card. Standalone global imports still bring global base defaults.

## CDN projects

Use version-pinned URLs. Replace `VERSION` below with the project's chosen published version, not the literal word:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@VERSION/dist/sensible-ui.min.css">
```

For scoped mode, use `dist/scoped/sensible-ui.min.css` instead. Standalone global CSS lives at `src/css/entries/<component>.css`; scoped modules live at `dist/scoped/<component>.css`. Serve pages over HTTP, especially when using browser modules. Keep CSS, optional scripts, and reference documents on the same package version.

## Layout and state

The core includes `.stack` / `.y-stack`, `.x-stack`, `.cluster`, `.split`, `.auto-grid`, and `.container`. Customize composition with `--layout-gap` and `--min-item-size`; use consumer-owned media queries where needed. Named layouts alone are also available from `@faith-tools/sensible-ui/utils`.

Atomic utilities are a separate opt-in import:

```css
@import '@faith-tools/sensible-ui/utilities';
```

Use `scoped/utilities` for scoped mode. This is a limited set of plain CSS helpers, not Tailwind: no template scanning, configuration, or breakpoint-prefixed variants. The `--space-*` scale is supplied by that companion stylesheet, not the core theme. Do not assume arbitrary Tailwind class names exist.

Use native `disabled`, `checked`, `open`, and `required` attributes where applicable. Use `aria-invalid="true"` with a described error message, `aria-pressed` for toggle buttons, and `aria-busy` on updating regions. Attributes do not implement application state transitions; the app owns those.

## Optional JavaScript

| Pattern | CSS import | Browser JavaScript import | Without JavaScript |
| --- | --- | --- | --- |
| Tooltip | `@faith-tools/sensible-ui/tooltip` | `@faith-tools/sensible-ui/tooltip/js` | Tooltip text remains in the DOM and visually hidden; authors should explicitly connect its description. No visual tooltip interaction. |
| Input group | `@faith-tools/sensible-ui/input-group` | `@faith-tools/sensible-ui/input-group/js` | Native field and buttons still work; clicking surrounding text does not gain field-focusing behavior. |
| Highlighted code | `@faith-tools/sensible-ui/code/css` | `@faith-tools/sensible-ui/code` | Read-only textarea remains readable; no highlighting, Copy, or Wrap controls. |

The complete core already includes tooltip and input-group CSS, but not code CSS. For scoped tooltip/input-group CSS use their `scoped/` subpaths; their JavaScript imports stay the same. There is no `scoped/code` or `code/js` export. Code CSS is a separate standalone stylesheet, not a generated scoped module.

On the CDN, corresponding scripts are `dist/sensible-tooltip.js`, `dist/sensible-input-group.js`, and `dist/sensible-code.js`, loaded with `type="module"`. Code CSS is `src/css/code.css`. Button groups and navigation wrappers have no script to import. Native dialogs need application wiring, not a Sensible UI dialog script.

## Fonts, motion, and accessibility

The core prefers Geist/Geist Mono with system fallbacks but downloads no fonts. Keep the consumer's chosen fonts. `--font-sans` and `--font-mono` accept their existing font stacks; Geist integrations can supply `--font-geist-sans` and `--font-geist-mono`.

Respect reduced motion and browser zoom. Give icon-only controls names, connect labels and descriptions to fields, retain native keyboard behavior, and check contrast after consumer overrides. A styled wrapper does not provide ARIA roles, focus management, validation, or accessible naming automatically.
