# Sensible UI Context

## Purpose

Sensible UI is an experimental, broadly reusable CSS library that gives semantic HTML shadcn-like visual defaults. It should also work as a lightweight starter stylesheet that people can copy, customize, and learn from.

The published core is CSS-only. It does not require Tailwind, a JavaScript framework, or a runtime dependency. People who want shadcn/ui's React component model should use shadcn/ui instead.

## Current product model

The current release is a semantic-first hybrid:

- Native elements such as headings, buttons, inputs, tables, and `details` receive default styles.
- Named classes cover components or layout concepts that HTML cannot identify precisely, including `.card`, `.badge`, `.item`, `.button`, `.x-stack`, and `.y-stack`.
- Native state and ARIA attributes express state. `data-*` attributes express visual variants, sizes, or slots.
- CSS custom properties are the theming API. A `.dark` ancestor selects the bundled dark theme.
- Consumers can import the complete bundle or standalone modules through package exports.

This model describes the current implementation. It is not a permanent commitment. Strict semantic styling, the current hybrid, and an opt-in or parent-scoped mode all remain open design directions.

## Compatibility

The library is beta and may make breaking changes. When a change breaks a published selector, theme token, package export, or default element behavior:

1. Call out the break in the issue or pull request.
2. Add a changeset that describes the consumer impact.
3. Update the demo and documentation to show the replacement.

Do not preserve an awkward API only because it has shipped, but do not break it silently.

## Boundaries

- `src/css/` is the source of truth for the library. Each component or styling concern owns one CSS module, and `src/css/index.css` composes the complete bundle.
- `dist/sensible-ui.css` and `dist/sensible-ui.min.css` are generated, published artifacts. Keep them in sync with the source by running `bun run check`.
- `src/pages/home.tsx` is both the component gallery and the source for the static site. New public behavior should have a representative example there.
- `src/app.tsx` defines the shared Hono JSX document and gallery route.
- `index.tsx` serves the Hono app during development. `build-site.tsx` renders the same app for static hosting.

## Vocabulary

- **Semantic default**: Styling applied directly to a native HTML element without an opt-in class.
- **Component**: A reusable visual pattern that may use semantic elements, a named class, attributes, or a combination of them.
- **Variant**: A visual alternative selected with `data-variant` or another documented `data-*` attribute.
- **State**: Meaning carried by native state or ARIA, such as `disabled`, `open`, `aria-busy`, or `aria-invalid`.
- **Theme token**: A public CSS custom property, such as `--primary` or `--border`, that consumers can override.
- **Bundle**: The generated stylesheet containing every source module.
- **Standalone module**: A package subpath stylesheet that includes the theme and base styles required to work without another Sensible UI import.
- **Gallery**: The home page that documents and visually exercises the public API.

## Direction under exploration

Interactive features may eventually use web components to keep adoption simple without turning the CSS core into a framework-specific library. [Ilha](https://ilha.build/guide/ui/custom-elements) and Datastar Rocket are possible implementation references. Even layout APIs such as `x-stack` and `y-stack` may be explored as web components.

This is a direction, not an architecture decision. Record a decision before adding a web-component runtime or changing the package's CSS-only core.

Design references are [Oat CSS](https://oat.ink/), [Basecoat](https://basecoatui.com/), [Web Awesome](https://webawesome.com/docs/components/), shadcn/ui, [Ilha](https://ilha.build/guide/ui/custom-elements), and [Datastar Rocket](https://data-star.dev/reference/rocket). Treat them as inspiration, not specifications.
