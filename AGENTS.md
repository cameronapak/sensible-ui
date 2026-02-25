# AGENTS.md

## Commands
- `bun dev` — Start dev server (Bun with hot reload, serves index.html)
- No test or lint commands configured yet. Use `bunx prettier --check .` to format-check.

## Architecture
Semantic CSS component library (fork of Basecoat/shadcn). Styles native HTML elements directly — no classes needed.
- `src/css/` — Component CSS files using Tailwind v4 `@apply` inside `@layer` blocks. Entry: `index.css`.
- `src/js/` — Light DOM custom elements (`<bc-*>`) as `class extends HTMLElement` with `customElements.define()`.
- `index.ts` — Bun dev server. `index.html` — demo/showcase page.
- Two component types: **native** (styled globally via element selectors) and **custom** (`<bc-*>` elements).
- Variants use `data-variant` / `data-size` attributes, NOT CSS classes.

## Code Style
- CSS: Tailwind v4 utilities via `@apply`. Each component in its own `@layer` block in a separate file.
- JS: Vanilla custom elements, no frameworks. Use `connectedCallback()`, guard with `this.dataset.initialized`.
- Use `data-*` attributes for variants/sizes, not classes. Keep HTML semantic.
- Bun runtime, ES modules (`"type": "module"`).
- Format with Prettier.
