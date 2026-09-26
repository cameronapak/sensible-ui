# AGENTS.md — Sensible UI (aka Basecoat)

## Overview
CSS-only UI component library inspired by shadcn/ui. Pure semantic HTML + CSS, no JS framework or Tailwind dependency. Published as `@faith-tools/sensible-ui`.

Read `CONTEXT.md` before changing the public styling model, compatibility expectations, or package boundaries.

## Commands
- `bun run dev` — Start the Bun dev server and CSS bundle watcher concurrently
- `bun run build` — Bundle plain CSS to `dist/sensible-ui.css` and `dist/sensible-ui.min.css`
- `bun run build:site` — Render `src/pages/home.tsx` and copy the CSS to `dist/static` for the static site
- `bun run check` - Rebuild the published CSS and fail when the committed bundles are stale
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
- Style native HTML elements and attributes first. Named component and layout classes are also part of the current public API; do not add classes merely to imitate a utility framework.
- Use `data-variant` and `data-size` attributes for visual alternatives, and native or ARIA attributes for state.
- Use native CSS declarations and theme variables (`--primary`, `--foreground`, etc.) from `theme.css`. Do not introduce Tailwind directives or generated `--tw-*` variables.
- Colors use `oklch()`. Follow the `--name` / `--name-foreground` pairing pattern.
- Treat strict semantic styling, the current hybrid, and opt-in scoping as open design directions. Do not silently turn the current implementation into a permanent policy.

## Agent skills

### Issue tracker

Issues and specs are tracked in GitHub Issues using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

This repo uses the single-context domain doc layout. See `docs/agents/domain.md`.
