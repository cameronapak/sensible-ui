# Sensible UI Context

## Purpose

Sensible UI is an experimental, broadly reusable CSS library that gives semantic HTML shadcn-like visual defaults. It should also work as a lightweight starter stylesheet that people can copy, customize, and learn from.

The published core is CSS-only. It does not require Tailwind, a JavaScript framework, or a runtime dependency. People who want shadcn/ui's React component model should use shadcn/ui instead.

## Current product model

The current release is a semantic-first hybrid:

- Native elements such as headings, buttons, inputs, tables, and `details` receive default styles.
- Named classes cover the existing components and layout concepts that HTML cannot identify precisely, including `.card`, `.badge`, `.item`, `.button`, `.x-stack`, and `.y-stack`.
- New patterns without a native element use light-DOM `sensible-*` custom elements, such as `<sensible-button-group>`, as recorded in [ADR-0008](docs/adr/0008-light-dom-custom-elements.md). Core CSS styles them without JavaScript. Elements that own behavior ship an optional, dependency-free script under `./<name>/js`.
- The core bundle includes named layout recipes. Atomic layout utilities are an opt-in companion stylesheet.
- Native state and ARIA attributes express state. `data-*` attributes express visual variants, sizes, or slots.
- CSS custom properties are the theming API. A `.dark` ancestor selects the bundled dark theme.
- Consumers can import the complete bundle or standalone modules through package exports.
- Consumers adopting Sensible UI inside an existing application can use the generated `.sensible-ui`-scoped bundle or its scoped standalone modules instead of the global exports.
- The optional light-DOM `<sensible-code>` web component bundles Sugar High for highlighting and adds Copy and Wrap controls. Its JavaScript and CSS are separate exports, as recorded in [ADR-0004](docs/adr/0004-optional-code-component.md). The core remains CSS-only.

This model describes the current implementation. It is not a permanent commitment. Strict semantic styling and future changes to the current hybrid remain open design directions.

## Compatibility

The library is beta and may make breaking changes. When a change breaks a published selector, theme token, package export, or default element behavior:

1. Call out the break in the issue or pull request.
2. Add a changeset that describes the consumer impact.
3. Update the demo and documentation to show the replacement.

Do not preserve an awkward API only because it has shipped, but do not break it silently.

## Boundaries

- `src/css/` owns the library's CSS; `src/components/` owns optional web-component behavior.
- `dist/` and `src/css/generated/` contain generated artifacts. Change their sources and rebuild rather than editing the output.
- The gallery documents and exercises the public API. New public behavior should have a representative example there.

## Task-to-files map

| Task | Start here | Related contracts |
| --- | --- | --- |
| Add or change a CSS component | `src/css/<name>.css`; `src/css/index.css` composes the core | `src/css/entries/<name>.css` supplies standalone dependencies; `package.json` exports; `build-scoped-css.ts` lists scoped entries; `check-css-exports.ts` validates exports |
| Change theme tokens or native defaults | `src/css/theme.css`, `src/css/base.css` | `tests/scoped.spec.ts` checks scope-root defaults and host isolation; scoped behavior follows [ADR-0003](docs/adr/0003-parent-scoped-css.md) |
| Add or change a custom element | `src/css/<name>.css` styles the tag; `src/components/<name>.ts` holds optional behavior | [ADR-0008](docs/adr/0008-light-dom-custom-elements.md); `./<name>/js` export, `package.json` `files`, build scripts, `check-generated.ts`, `index.tsx` and `build-site.tsx` gallery assets |
| Change highlighted code | `src/components/code.ts`, `src/css/code.css` | `tests/code.spec.ts`; `src/pages/code-break.tsx` at `/code-break`; separate CSS and JS exports follow [ADR-0004](docs/adr/0004-optional-code-component.md) |
| Change gallery examples or import guidance | `src/pages/home.tsx`, `README.md` | `tests/home-theme.spec.ts` checks documentation, highlighting, and theme behavior; `tests/dialog.spec.ts` exercises native dialog examples |
| Change gallery-only appearance or behavior | `src/site.css`, `src/site.js` | These files are not published library styles or component behavior. Check them when the gallery differs from standalone usage. |
| Change layouts or atomic utilities | `src/css/utils.css` owns named layouts; `generate-utilities.ts` owns atomic families | `src/css/entries/utils.css`, `src/css/entries/utilities.css`; [ADR-0002](docs/adr/0002-optional-css-utilities.md) records the split |
| Change scoped output | `build-scoped-css.ts`, `src/pages/scoped.tsx` | `build-scoped-css.test.ts`, `tests/scoped.spec.ts`, `check-css-exports.ts`; read [ADR-0003](docs/adr/0003-parent-scoped-css.md) first |
| Change site routing or asset delivery | `src/app.tsx` owns the shared document and routes; `index.tsx` serves assets | `build-site.tsx` renders the same app and copies static assets; `/code-break` is a development stress page, not a static-site output |
| Change consumer agent guidance | `skills/using-sensible-ui/SKILL.md`, its `references/usage.md`, `DESIGN.md`, `llms.txt`, `docs/agents.md` | `build-agent-docs.ts` generates component examples from `src/pages/home.tsx` and the bundled design copy; `src/agent-docs.ts` maps development/static delivery; `check-agent-docs.ts` checks distribution; `docs/agents/consumer-evaluation.md` describes fresh-agent evaluation |
| Diagnose build or test setup | `package.json` scripts and `packageManager`, `check-generated.ts`, `playwright.config.ts` | `.agents/setup` prepares orbs; `.github/workflows/check.yml` runs the full check in CI |

### Build and preview gotchas

Run `bun run check:toolchain` before diagnosing generated-file drift. It checks the Bun version used by package scripts; if it differs from `bun --version`, inspect `node_modules/.bin/bun` for a stale shim.

The development watchers write generated CSS without the release build's formatting. Run `bun run build` before reviewing generated diffs. The final generated-file check rejects uncommitted output changes, including intentional ones; inspect those diffs before committing them.

In an orb, run `amp orb services ensure` for the gallery, scoped demo, and code stress-page portals declared in `.amp/services.yaml`. The preview serves the existing generated bundles without watchers. After changing library sources, run `bun run build`; after changing server code, run `amp orb service restart gallery`.

## Vocabulary

- **Semantic default**: Styling applied directly to a native HTML element without an opt-in class.
- **Component**: A reusable visual pattern that may use semantic elements, a named class, a custom element, attributes, or a combination of them.
- **Custom element**: A light-DOM `sensible-*` tag that names a pattern HTML lacks. Core CSS styles it without registration; an optional script adds behavior.
- **Variant**: A visual alternative selected with `data-variant` or another documented `data-*` attribute.
- **State**: Meaning carried by native state or ARIA, such as `disabled`, `open`, `aria-busy`, or `aria-invalid`.
- **Theme token**: A public CSS custom property, such as `--primary` or `--border`, that consumers can override.
- **Bundle**: The generated stylesheet containing every core source module.
- **Companion stylesheet**: An optional stylesheet that extends the core without requiring consumer-side JavaScript or build tooling.
- **Standalone module**: A package subpath stylesheet that includes the theme and base styles required to work without another Sensible UI import.
- **Scoped bundle**: A generated stylesheet that applies Sensible UI declarations only to a `.sensible-ui` scope root and its descendants.
- **Gallery**: The home page that documents and visually exercises the public API.

## Direction under exploration

Whether existing class APIs such as `x-stack` and `y-stack` should move to custom elements remains open; ADR-0008 covers new patterns only. [Ilha](https://ilha.build/guide/ui/custom-elements) and Datastar Rocket are possible implementation references, not dependencies of the shipped `<sensible-code>` component.

ADR-0004 records the optional code component and ADR-0008 records vanilla light-DOM elements; neither chooses a shared runtime. Record a decision before adding a web-component runtime or changing the package's CSS-only core. The Rocket prototype and runtime decision remain separate roadmap work.

Design references are [Oat CSS](https://oat.ink/), [Basecoat](https://basecoatui.com/), [Web Awesome](https://webawesome.com/docs/components/), shadcn/ui, [Ilha](https://ilha.build/guide/ui/custom-elements), and [Datastar Rocket](https://data-star.dev/reference/rocket). Treat them as inspiration, not specifications.
