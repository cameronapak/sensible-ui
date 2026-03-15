# Sensible UI CSS

A semantic-ish CSS component library in the likeness of Shadcn UI, without the front-end framework overhead. 

- Styles native HTML elements by default, like typography elements, buttons, inputs, anchor tags, etc.
- Want components like cards, items, loading-spinners, etc.? Then we use data attributes, classes, and aria attributes.

Try Sensible UI Now!

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

## Development

```bash
bun install
bun dev
```

## Attributions

> [!NOTE]
> This project is a fork of [Basecoat](https://github.com/hunvreus/basecoat) by [Ronan Berder (hunvreus)](https://github.com/hunvreus), originally a vanilla CSS/JS port of [shadcn/ui](https://ui.shadcn.com). This fork reimagines Basecoat as a semantic CSS library — styling native HTML elements directly instead of using utility classes.

SVG's come from Lucide.dev

## License

[MIT](/LICENSE.md)
