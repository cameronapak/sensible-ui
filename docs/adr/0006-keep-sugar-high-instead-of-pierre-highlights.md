# Keep Sugar High instead of Pierre Highlights

Decision: keep the current Sugar High implementation of the optional `<sensible-code>` component and reject the local `@pierre/highlights` migration. This October 21, 2026 evaluation supplements [ADR-0004](0004-optional-code-component.md); the CSS-only core, public markup, Copy and Wrap controls, no-JavaScript fallback, and separate `./code` and `./code/css` exports stay unchanged. [ADR-0007](0007-keep-sugar-high-instead-of-kirari.md) records the separate Kirari comparison.

Sensible UI needs readable examples, predictable buildless adoption, runtime light/dark colors, and a small optional module. Highlights does not currently deliver enough consumer benefit to justify its distribution and initialization costs.

## Trial integration

The trial bundled `@pierre/highlights` 0.2.0 only, not `@pierre/diffs`. It rendered token text with DOM APIs, preserved gaps between token offsets, guarded unsupported languages with a plaintext fallback, and mapped a local CSS-variable theme to Sensible UI's existing palette. It did not import a theme catalog. The existing markup, textarea fallback, Copy source, Wrap behavior, and optional exports were retained.

## Measured bundle sizes

All sizes below are bytes. They measure complete minified Sensible UI browser modules, including the custom element, toolbar, clipboard fallback, wrapping, lifecycle handling, and engine integration. They are not vendor core-only figures or estimates from WASM file size.

| Optional `dist/sensible-code.js` | Sugar High 2.5.0 | Highlights 0.2.0 | Increase |
| --- | ---: | ---: | ---: |
| Minified | 33,852 | 276,368 | 242,516 |
| Gzip | 12,247 | 119,861 | 107,614 |
| Brotli | 10,906 | 102,129 | 91,223 |

## Tradeoffs and recommendation

Highlights provides broad built-in language coverage and a synchronous token API. The prototype could use Sensible UI's existing light/dark palette without importing a theme catalog or re-tokenizing when the theme changed. Text-node rendering kept untrusted code inert and preserved captured source, including Unicode and line endings.

However, its bundled WebAssembly makes the optional module about **9.8 times as large gzipped**. It also adds a WebAssembly compilation requirement: restrictive `script-src` policies need `'wasm-unsafe-eval'`. The trial's browser test confirmed that blocked compilation leaves the textarea readable but prevents enhancement and its controls. No existing Sensible UI requirement warrants these costs.

**Recommendation: keep Sugar High.** It already meets the component's contract, is smaller, has no required runtime dependencies or WebAssembly requirement, and uses the existing light/dark palette. Its highlighting remains heuristic and its language coverage is narrower. Reconsider Highlights only when a concrete need justifies the complete optional bundle and initialization requirements, not merely because the engine exposes a suitable API.

## Measurement and verification method

- Baseline: the [existing component](https://github.com/cameronapak/sensible-ui/blob/5dfda3002ddaa656b230b3401885f37886336934/src/components/code.ts), Sugar High 2.5.0, Bun 1.3.10 on Linux x64. Build with `bun build --target=browser <component.ts> --outfile=<bundle.js> --minify`, the same command as `build:code`. No splitting, source maps, theme catalog, or development server code enters the measured module.
- Highlights: the 0.2.0 trial used that build command and the local CSS-variable theme described above, not `@pierre/diffs`. The table preserves the actual measured output from that trial.
- Compression: run Bun's `node:zlib` implementation on the emitted bytes, using `gzipSync(bytes, { level: 9 })` and `brotliCompressSync(bytes)` with default options. Raw size is `bytes.length`. Another runtime or server's compression settings may produce different compressed sizes. ADR-0007 uses the same method for Kirari.
- Trial verification: type checking passed, followed by 21 initial targeted browser tests. The final full browser run passed 31 tests, including unsupported-language and CSP-blocked WebAssembly fallback coverage. The scoped-builder tests, full builds, static site, and export checks passed. Rebuilding the optional module produced the same SHA-256; other generated CSS files were unchanged. The full `check` command stopped only at its final generated-file guard because the candidate JavaScript asset was intentionally uncommitted.
- These checks verified the tested component behavior, not broad grammar equivalence, scanning speed, or memory use. After reverting the trial, `bun run check` passed completely: 29 browser tests, 2 scoped-builder tests, types, builds, site rendering, export validation, and the generated-file guard.

## Consequences

Revert the trial's component, CSS, tests, dependency/lockfile, generated asset, documentation changes, and migration changeset. Preserve its measurements here rather than leaving documentation that describes a migration that did not ship. The evaluation adds only a decision record and does not require a package release.

## Sources

- [Highlights browser initialization](https://github.com/pierrecomputer/pierre/blob/main/packages/highlights/lib/default.ts) and [package](https://github.com/pierrecomputer/pierre/tree/main/packages/highlights).
- [ADR-0004: optional code component](0004-optional-code-component.md).
