# AGENTS.md — Sensible UI (aka Basecoat)

## Overview
CSS-only UI component library inspired by shadcn/ui. Pure semantic HTML + CSS, no JS framework or Tailwind dependency. Published as `@faith-tools/sensible-ui`.

## Commands
- `bun run dev` — Start the Bun dev server and CSS bundle watcher concurrently
- `bun run build` — Bundle plain CSS to `dist/sensible-ui.css` and `dist/sensible-ui.min.css`
- `bun run build:site` — Render `src/pages/home.tsx` and copy the CSS to `dist/static` for the static site
- No test suite exists. Verify changes visually via the dev server at localhost.

## Architecture
- `src/css/` — Component CSS files (button, card, badge, etc.), each wrapped in `@layer <name>`
- `src/css/index.css` — Entry point that `@import`s all component files
- `src/css/theme.css` — Design tokens as CSS custom properties (oklch colors, shadcn-style naming). Dark mode via `.dark` class.
- `src/pages/home.tsx` — Demo page served by Bun (`index.tsx`) and rendered for the static site (`build-site.tsx`); `src/html/` contains other standalone demos
- `dist/` — Built CSS output (do not edit directly)
- Components are individually exportable via package.json `exports` map.

## Code Style
- Use the existing `base`, `typography`, `components`, `button`, and `utilities` cascade layers
- Style native HTML elements/attributes — no custom class names. Use `data-variant`, `data-size` attributes for variants.
- Use native CSS declarations and theme variables (`--primary`, `--foreground`, etc.) from `theme.css`. Do not introduce Tailwind directives or generated `--tw-*` variables.
- Colors use `oklch()`. Follow the `--name` / `--name-foreground` pairing pattern.
- Keep selectors targeting semantic HTML (e.g., `button`, `table`, `input`) not class-based.
