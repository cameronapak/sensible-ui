# AGENTS.md — Sensible UI (aka Basecoat)

## Overview
CSS-only UI component library inspired by shadcn/ui. Pure semantic HTML + CSS, no JS framework. Uses Tailwind CSS v4 `@apply` directives inside `@layer` blocks. Published as `@faith-tools/sensible-ui`.

## Commands
- `bun run dev` — Start dev server (Bun) + Tailwind watcher concurrently
- `bun run build` — Build minified CSS to `dist/sensible-ui.min.css`
- No test suite exists. Verify changes visually via the dev server at localhost.

## Architecture
- `src/css/` — Component CSS files (button, card, badge, etc.), each wrapped in `@layer <name>`
- `src/css/index.css` — Entry point that `@import`s Tailwind + all component files
- `src/css/theme.css` — Design tokens as CSS custom properties (oklch colors, shadcn-style naming). Dark mode via `.dark` class.
- `src/html/` — Demo HTML pages served by Bun dev server (`index.ts`)
- `dist/` — Built CSS output (do not edit directly)
- Components are individually exportable via package.json `exports` map.

## Code Style
- Use `@layer <component-name> { ... }` for each component file
- Style native HTML elements/attributes — no custom class names. Use `data-variant`, `data-size` attributes for variants.
- Use Tailwind v4 `@apply` for styling. Use theme variables (`--primary`, `--foreground`, etc.) from `theme.css`.
- Colors use `oklch()`. Follow the `--name` / `--name-foreground` pairing pattern.
- Keep selectors targeting semantic HTML (e.g., `button`, `table`, `input`) not class-based.
