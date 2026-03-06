# WIP: semantics/ui

A (work-in-progress) semantic CSS component library — style native HTML elements directly, no little to no classes / attributes needed.

> [!NOTE]
> This project is a fork of [Basecoat](https://github.com/hunvreus/basecoat) by [Ronan Berder (hunvreus)](https://github.com/hunvreus), originally a vanilla CSS/JS port of [shadcn/ui](https://ui.shadcn.com). This fork reimagines Basecoat as a semantic CSS library — styling native HTML elements directly instead of using utility classes.

![Banner](./banner.png)

![Banner 2](./banner-2.png)


## Features

- **Semantic HTML** (as much as possible): Native elements like `<button>`, `<input>`, `<dialog>` are styled automatically
- **Lightweight**: Tiny CSS and JS footprint, zero framework dependencies
- **Accessible**: Semantic HTML and ARIA roles baked in
- **Dark mode ready**: Built-in dark theme support
- **Easy customization**: Override a handful of CSS variables to theme everything
- **Free and open source**: MIT licensed

## Development

```bash
bun install
bun dev
```

### Known Issues

- **CSS hot reload requires Tailwind CLI watcher.** Bun's dev server doesn't track transitive CSS `@import` dependencies for HMR ([oven-sh/bun#19734](https://github.com/oven-sh/bun/issues/19734)). Editing an imported CSS file (e.g. `button.css`) won't trigger a reload on its own. The `dev` script works around this by running `tailwindcss --watch` alongside the Bun server via `concurrently` — Tailwind CLI compiles all source CSS into `src/css/generated.css`, which Bun _does_ detect changes to.

## License

[MIT](/LICENSE.md)
