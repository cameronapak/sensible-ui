# Sensible UI CSS

A semantic CSS component library with useful visual defaults for native HTML. Use it without a front-end framework or a build step. Optional web components add behavior where HTML and CSS are not enough.

- Styles native HTML elements by default, like typography elements, buttons, inputs, anchor tags, etc.
- Want components like cards, items, loading-spinners, etc.? Then we use data attributes, classes, and aria attributes.

Add the stylesheet to an HTML page to style native content and controls:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sensible UI example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/dist/sensible-ui.min.css">
  </head>
  <body>
    <main>
      <h1>Get in touch</h1>
      <p>Send a message and we will reply by email.</p>
      <form>
        <label for="email">Email</label>
        <input id="email" name="email" type="email">
        <button type="submit">Send message</button>
      </form>
    </main>
  </body>
</html>
```

Serve the file over HTTP, including when testing locally. The CDN URL pins version `1.7.0`; change the version when you want to update. The stylesheet provides visual defaults, while you choose the page layout.

If you use a bundler, install `@faith-tools/sensible-ui` and import the complete stylesheet in your CSS:

```css
@import '@faith-tools/sensible-ui';
```

### Limit styles to part of a page

Use the scoped stylesheet when you add Sensible UI to an existing application and don't want its semantic defaults to affect the whole page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/dist/scoped/sensible-ui.min.css">
```

```html
<section class="sensible-ui">
  <h2>Account settings</h2>
  <label for="display-name">Display name</label>
  <input id="display-name">
  <button>Save changes</button>
</section>
```

If you use a bundler, import `@faith-tools/sensible-ui/scoped` in your CSS instead of using the CDN link.

The `.sensible-ui` parent establishes local theme and base defaults. Its descendants receive Sensible UI's semantic and component styles. Use the class on a neutral wrapper around the styled markup, not on a component element such as a card, table, link, or form control. Sensible UI layout and utility classes such as `.stack`, `.mt-4`, and `.size-8` also belong on descendants, not the scope root. You can combine `.sensible-ui` with a host-owned wrapper class. Elements outside the parent don't. Use the global and scoped stylesheets as alternatives. Importing the global stylesheet still applies semantic defaults to the whole document.

Scoped mode uses the Baseline `@scope` CSS rule and requires a browser that supports it. Unsupported browsers ignore the scoped rules instead of applying them globally.

The scoped stylesheet doesn't isolate the subtree like Shadow DOM. Host styles can still cascade into it, and inherited styles can continue beyond it. If a framework renders a dialog or popover in a portal outside the subtree, add `sensible-ui` to the portal container.

Dark mode works when `dark` is on the scope root, inside it, or on an ancestor:

```html
<section class="sensible-ui dark">...</section>
```

Override scoped theme tokens on the scope root instead of `:root`:

```css
.sensible-ui {
  --primary: oklch(0.5 0.2 260);
}
```

The minified CDN build is available at `dist/scoped/sensible-ui.min.css`. Scoped standalone imports use the same component names as global standalone imports, such as `@faith-tools/sensible-ui/scoped/button`. Scoped utilities are available from `@faith-tools/sensible-ui/scoped/utilities`.

## Features

- **Semantic HTML** (as much as possible): Native elements like `<button>`, `<input>`, `<h1>` are styled automatically
- **Lightweight**: CSS-only core with no framework dependency; optional JavaScript for behavior
- **Accessible**: Semantic HTML and ARIA roles baked in
- **Dark mode ready**: Built-in dark theme support
- **Easy customization**: Override a handful of CSS variables to theme everything
- **Free and open source**: MIT licensed

To change the theme, override the CSS variables after importing the stylesheet:

```css
:root {
  --primary: oklch(0.5 0.2 260);
  --primary-foreground: oklch(1 0 0);
}

.dark {
  --primary: oklch(0.75 0.14 260);
  --primary-foreground: oklch(0.145 0 0);
}
```

The full set of light and dark tokens is in [`src/css/theme.css`](src/css/theme.css).

## Optional highlighted code

The `sensible-code` web component adds syntax highlighting, line wrapping, and a Copy button without adding JavaScript to the core stylesheet. Add its CSS and browser module to a page that needs it. Its CSS also works without the main Sensible UI stylesheet:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/src/css/code.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/dist/sensible-code.js"></script>
```

Put the source in a read-only text area. The component creates `<pre><code>` when its JavaScript loads:

```html
<sensible-code language="html">
  <textarea readonly><button>Save</button></textarea>
</sensible-code>
```

If you use a bundler, install `@faith-tools/sensible-ui`, then import the styles in your CSS and the component in your browser JavaScript:

```css
@import '@faith-tools/sensible-ui/code/css';
```

```js
import '@faith-tools/sensible-ui/code';
```

Code scrolls horizontally by default, including on narrow screens. Add `data-wrap="true"` to `<sensible-code>` to start with wrapped lines instead. When JavaScript loads, readers can use **Wrap lines** to switch either way for that block. The attribute also wraps the read-only text area when JavaScript is unavailable.

Without JavaScript, the read-only text area remains visible. In HTML source, escape `&` before entity names. If the example contains `</textarea>`, write its opening angle bracket as `&lt;` to prevent the HTML parser from closing the text area. The component accepts Sugar High language names and common aliases such as `js` and `py`; an unknown or missing language displays as plain text. A `content` attribute would require quote escaping and would not provide readable source without JavaScript.

## Page view transitions

Cross-document page view transitions are available as an opt-in stylesheet:

```css
@import '@faith-tools/sensible-ui/view-transition';
```

This enables same-origin navigation with `@view-transition { navigation: auto; }` when the user has not requested reduced motion. The default bundle does not enable page view transitions.

## Motion preferences

Sensible UI respects `prefers-reduced-motion: reduce`. Smooth scrolling becomes immediate, accordion state changes happen without transitions, spinners keep their busy indicator without rotating, and the optional page view transitions stay disabled.

Future components should put decorative motion behind `prefers-reduced-motion: no-preference` or provide a reduced-motion rule that preserves the visible state change without animation.

## Fonts

Sensible UI prefers Geist and Geist Mono, then falls back to your system fonts. The core stylesheet does not download fonts for you.

For a plain HTML site, load Geist from Google Fonts before Sensible UI:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">
```

For a Next.js app, install the official [`geist`](https://www.npmjs.com/package/geist) package:

```bash
npm install geist
```

Then expose its font variables on your root layout. Sensible UI uses these variables automatically:

```tsx
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

To use different fonts, override the theme tokens:

```css
:root {
  --font-sans: "Atkinson Hyperlegible", sans-serif;
  --font-mono: "Berkeley Mono", monospace;
}
```

## Individual modules

Every component subpath is standalone. It includes the theme tokens and base styles that its component needs:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/src/css/entries/button.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/src/css/entries/card.css">
```

If you use a bundler, import the matching package subpaths in your CSS:

```css
@import '@faith-tools/sensible-ui/button';
@import '@faith-tools/sensible-ui/card';
```

Use the root import when you want the complete bundle. Use subpath imports when you only need selected components.
If markup combines components, such as `<table class="card">`, import both subpaths.

## Layouts and optional utilities

The core bundle includes named layout helpers for common composition patterns:

- `.stack` arranges content vertically.
- `.cluster` arranges wrapping inline content.
- `.split` separates content across the available width.
- `.auto-grid` creates an intrinsic responsive grid. Set `--min-item-size` to control when its columns wrap.

Atomic layout utilities are available as an optional stylesheet:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@1.7.0/dist/sensible-ui.utilities.min.css">
```

If you use a bundler, import the utilities in your CSS instead:

```css
@import '@faith-tools/sensible-ui/utilities';
```

The stylesheet provides familiar helpers such as `mt-4`, `px-2`, `gap-3`, `size-8`, `flex`, `grow`, `items-center`, `justify-between`, `sr-only`, `truncate`, `aspect-square`, `relative`, `inset-0`, and `overflow-auto`. It also includes text alignment, z-index, and min/max-height helpers. It is generated when Sensible UI is built, but consumers receive plain CSS and do not need JavaScript, template scanning, or configuration.

Spacing and sizing use the `--space-0`, `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`, `--space-12`, and `--space-16` tokens defined by the utility stylesheet. Override those custom properties after importing it to change the scale.

Prefer the core `.stack`/`.y-stack`, `.x-stack`, `.cluster`, `.split`, and `.auto-grid` helpers for common composition. Use atomic utilities when no named layout describes the exception clearly.

The stylesheet does not generate breakpoint-prefixed variants. This keeps its size and public API predictable without imposing a breakpoint scale. Prefer intrinsic layouts such as `.auto-grid` and `.flex-wrap`, or add project-specific media queries when composition must change at a breakpoint.

## Component catalog

The [main gallery](https://sensibleui.com) documents each component's markup, variants, states, accessibility requirements, and standalone import.

| Component        | Standalone import                           |
| ---------------- | ------------------------------------------- |
| Accordion        | `@faith-tools/sensible-ui/accordion`        |
| Badge            | `@faith-tools/sensible-ui/badge`            |
| Button           | `@faith-tools/sensible-ui/button`           |
| Card             | `@faith-tools/sensible-ui/card`             |
| Description list | `@faith-tools/sensible-ui/description-list` |
| Dialog           | `@faith-tools/sensible-ui/dialog`           |
| Image and figure | `@faith-tools/sensible-ui/image`            |
| Form controls    | `@faith-tools/sensible-ui/input`            |
| Item             | `@faith-tools/sensible-ui/item`             |
| Loading spinner  | `@faith-tools/sensible-ui/spinner`          |
| Table            | `@faith-tools/sensible-ui/table`            |
| Typography       | `@faith-tools/sensible-ui/typography`       |

Named layouts are available from `@faith-tools/sensible-ui/utils` and are included in the complete bundle. The optional atomic utility stylesheet is available from `@faith-tools/sensible-ui/utilities`.

## Development

```bash
bun install
bun run dev
```

`bun run build` bundles the core and optional utility stylesheets into `dist`.
`bun run build:site` renders the same demo used by the Bun preview into `dist/static` with its CSS for static hosting.

## Attributions

> [!NOTE]
> This project is a fork of [Basecoat](https://github.com/hunvreus/basecoat) by [Ronan Berder (hunvreus)](https://github.com/hunvreus), originally a vanilla CSS/JS port of [shadcn/ui](https://ui.shadcn.com). This fork reimagines Basecoat as a semantic CSS library — styling native HTML elements directly instead of using utility classes.

The UI icons use [Lucide](https://lucide.dev/). The header's GitHub mark comes from [Simple Icons](https://github.com/simple-icons/simple-icons/blob/master/icons/github.svg). GitHub and the Invertocat are trademarks of GitHub, Inc.; this project is not affiliated with or endorsed by GitHub. The project's MIT license does not grant rights to the GitHub mark. See the [Simple Icons disclaimer](https://github.com/simple-icons/simple-icons/blob/master/DISCLAIMER.md) and [GitHub's brand guidelines](https://brand.github.com/foundations/logo).

## License

[MIT](/LICENSE.md)
