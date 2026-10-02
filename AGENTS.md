# AGENTS.md — Sensible UI (aka Basecoat)

## Overview
CSS-only core inspired by shadcn/ui, with optional web components for behavior. The core uses semantic HTML + CSS and has no JS framework or Tailwind dependency. Published as `@faith-tools/sensible-ui`.

Read `CONTEXT.md` before changing the public styling model, compatibility expectations, or package boundaries. Read `docs/adr/0003-parent-scoped-css.md` before changing scoped output, scope-root behavior, or the `.sensible-ui` contract.
For component, gallery, export, or build work, use the task-to-files map and build gotchas in `CONTEXT.md`.

## Commands
- `bun run dev` — Start the Bun dev server and CSS bundle watcher concurrently
- `bun run build` — Build the global and scoped CSS bundles and standalone modules
- `bun run build:site` — Render the gallery and scoped demo and copy their CSS to `dist/static`
- `bun run test:scoped` — Run the scoped CSS builder tests
- `bun run test:browser` — Build and run all Playwright browser tests; install Chromium once with `bunx playwright install chromium`
- `bun run check` — Run types, tests, builds, export validation, and generated-file checks
- `amp orb services ensure` — Start the supervised gallery and print its preview portals
- For visual changes, inspect the normal state and a likely failure state (such as narrow width, long content, or a changed state) through the dev server; exercise the relevant user action.

## Architecture
- `src/css/` — Component CSS files (button, card, badge, etc.), each wrapped in `@layer <name>`
- `src/css/index.css` — Entry point that `@import`s all component files
- `src/css/theme.css` — Design tokens as CSS custom properties (oklch colors, shadcn-style naming). Dark mode via `.dark` class.
- `src/pages/home.tsx` — Demo page served by Bun (`index.tsx`) and rendered for the static site (`build-site.tsx`)
- `build-scoped-css.ts` — Generates native `@scope (.sensible-ui)` counterparts from the shared CSS source graph
- `dist/` — Built CSS output (do not edit directly)
- Components are individually exportable via package.json `exports` map.

## Code Style
- Use the existing `base`, `typography`, `components`, `button`, and `utilities` cascade layers
- Style native HTML elements and attributes first. Named component and layout classes are also part of the current public API; do not add classes merely to imitate a utility framework.
- Use `data-variant` and `data-size` attributes for visual alternatives, and native or ARIA attributes for state.
- Use native CSS declarations and theme variables (`--primary`, `--foreground`, etc.) from `theme.css`. Do not introduce Tailwind directives or generated `--tw-*` variables.
- Colors use `oklch()`. Follow the `--name` / `--name-foreground` pairing pattern.
- Treat strict semantic styling and future changes to the current hybrid as open design directions. Parent-scoped CSS is part of the current public model, not a permanent policy.
- Use web components when they own meaningful behavior or state, or when their structure is unusually complex. Do not wrap CSS-only presentation in a custom element. Prefer dependency-free, light-DOM progressive enhancement that preserves semantic content without JavaScript.

## Agent skills

### Issue tracker

Issues and specs are tracked in GitHub Issues using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

This repo uses the single-context domain doc layout. See `docs/agents/domain.md`.
