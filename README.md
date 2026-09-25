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

`bun run build` bundles the plain CSS source into `dist/sensible-ui.css` and `dist/sensible-ui.min.css`.
`bun run build:site` renders the same demo used by the Bun preview into `dist/static` with its CSS for static hosting.

## Attributions

> [!NOTE]
> This project is a fork of [Basecoat](https://github.com/hunvreus/basecoat) by [Ronan Berder (hunvreus)](https://github.com/hunvreus), originally a vanilla CSS/JS port of [shadcn/ui](https://ui.shadcn.com). This fork reimagines Basecoat as a semantic CSS library — styling native HTML elements directly instead of using utility classes.

SVG's come from Lucide.dev

## License

[MIT](/LICENSE.md)
