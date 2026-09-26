# Sensible UI CSS

A semantic CSS component library in the likeness of shadcn/ui. The published stylesheet does not require Tailwind CSS or a JavaScript framework.

- Styles native HTML elements by default, like typography elements, buttons, inputs, anchor tags, etc.
- Want components like cards, items, loading-spinners, etc.? Then we use data attributes, classes, and aria attributes.

Add Sensible UI to your page:

```css
@import 'https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@latest/dist/sensible-ui.min.css';
```

```html
<link href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@latest/dist/sensible-ui.min.css" type="text/css" rel="stylesheet">
```

## Features

- **Semantic HTML** (as much as possible): Native elements like `<button>`, `<input>`, `<h1>` are styled automatically
- **Lightweight**: Just CSS, zero framework dependencies
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

```css
@import '@faith-tools/sensible-ui/utilities';
```

```html
<link href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@latest/dist/sensible-ui.utilities.min.css" type="text/css" rel="stylesheet">
```

The stylesheet provides familiar helpers such as `mt-4`, `px-2`, `gap-3`, `size-8`, `flex`, `items-center`, and `justify-between`. It is generated when Sensible UI is built, but consumers receive plain CSS and do not need JavaScript, template scanning, or configuration.

Spacing and sizing use the `--space-0`, `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`, `--space-12`, and `--space-16` tokens defined by the utility stylesheet. Override those custom properties after importing it to change the scale.

## Components

- [x] Accordion
- [x] Badge
- [x] Button
- [x] Image
- [x] Input
- [x] Item
- [x] Loading Spinner
- [x] Table
- [x] Typography
- [ ] More to be thought out soon...

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

SVG's come from Lucide.dev

## License

[MIT](/LICENSE.md)
