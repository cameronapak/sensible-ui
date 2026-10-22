# Keep Sugar High instead of Kirari

Decision: keep the current Sugar High implementation of the optional `<sensible-code>` component instead of switching to Kirari. This October 21, 2026 evaluation supplements [ADR-0004](0004-optional-code-component.md); the CSS-only core, public markup, Copy and Wrap controls, no-JavaScript fallback, and separate `./code` and `./code/css` exports stay unchanged. [ADR-0006](0006-keep-sugar-high-instead-of-pierre-highlights.md) records the separate decision against `@pierre/highlights`.

Sensible UI needs readable examples, predictable buildless adoption, runtime light/dark colors, and a small optional module. Kirari does not currently deliver enough consumer benefit to justify its cost. It is a viable candidate to revisit, not an unsuitable design.

## Measured bundle sizes

All sizes below are bytes. They measure complete minified Sensible UI browser modules, including the custom element, toolbar, clipboard fallback, wrapping, lifecycle handling, and engine integration. They are not vendor core-only figures.

Tested `@vortexlabs/kirari` 1.1.1 in disposable builds without adding it to Sensible UI's dependencies. The package is JavaScript-only, DOM-free, has no runtime dependencies, exports individual language definitions, and renders CSS classes without inline token styles. These properties fit the component's architecture. They do not establish that the complete integration is smaller.

The installed Sugar High 2.5.0 registry has **31 canonical entries, including plaintext**, rather than 25. Its JavaScript and TypeScript entries also accept JSX and TSX. The compatibility-oriented Kirari build registers the same 31 named definitions plus Kirari's separate JSX and TSX definitions. It uses those structural scanners for JavaScript and TypeScript inputs, retains existing canonical toolbar labels and aliases, and falls back to plaintext for unknown labels. This preserves the tested component contract, not a guarantee of identical lexical classifications.

| Complete optional JavaScript module | Minified | Gzip | Brotli |
| --- | ---: | ---: | ---: |
| Current Sugar High, 31 entries | 33,852 | 12,247 | 10,906 |
| Kirari, reduced 8-definition set | 30,124 | 12,011 | 10,898 |
| Kirari, compatibility-oriented 33-definition set | 58,614 | 20,982 | 18,901 |
| Kirari, all 48 definitions | 72,397 | 24,543 | 21,865 |

The reduced set is HTML, CSS, JavaScript, TypeScript, JSX, TSX, Python, and plaintext. It is **not a like-for-like replacement**: it drops other languages accepted by the existing component. The 33-definition set is the relevant comparison for retaining current coverage. The 48-definition set explores expanding coverage, not reducing the existing bundle.

Kirari needs additional CSS to map its token classes onto the existing light/dark `--sh-*` palette. The prototype retains the existing code CSS and adds eight grouped, component-scoped color rules for 19 colored token categories; plain text inherits the component foreground. It does not import a global Kirari theme or change core CSS.

| Minified optional CSS | Minified | Gzip | Brotli |
| --- | ---: | ---: | ---: |
| Current `code/css` | 6,105 | 1,249 | 1,017 |
| With Kirari token mappings | 6,879 | 1,409 | 1,162 |

Compressing JavaScript and CSS separately and adding their byte counts gives:

| Optional JavaScript plus CSS | Minified | Gzip | Brotli |
| --- | ---: | ---: | ---: |
| Current Sugar High | 39,957 | 13,496 | 11,923 |
| Kirari reduced set | 37,003 | 13,420 | 12,060 |
| Kirari compatibility set | 65,493 | 22,391 | 20,063 |
| Kirari all definitions | 79,276 | 25,952 | 23,027 |

Retaining coverage costs **8,895 additional gzipped bytes, about 66% more**, across the two optional assets. Even the reduced set saves only 76 bytes gzipped overall and is 137 bytes larger with Brotli. These are asset-byte comparisons, not HTTP overhead, execution-time, or memory benchmarks.

## Actual Kirari integration work

The disposable prototype starts from the unchanged Sensible UI component. It replaces only the highlighting imports, language resolution, and highlight call; it retains the original textarea capture, carriage-return escaping, toolbar, clipboard logic, and Wrap behavior.

The public integration APIs are:

```ts
import { tokenize, render } from '@vortexlabs/kirari/core';
import { createRegistry } from '@vortexlabs/kirari/registry';
// Named imports from @vortexlabs/kirari/languages, limited to the measured set.
const registry = createRegistry(definitions);
```

`/core` avoids the root entry's implicit JavaScript default. Language definitions, rather than language strings, go into `tokenize`. The compatibility build needs these ten overrides in addition to Kirari's registry:

```ts
const aliases = new Map([
  ['jsx', 'javascript'], ['node', 'javascript'],
  ['tsx', 'typescript'], ['scss', 'css'], ['python3', 'python'],
  ['jsonc', 'json'], ['dotnet', 'csharp'], ['xml', 'html'],
  ['mdx', 'markdown'], ['terraform', 'hcl'],
]);
function lang(value: string) {
  const normalized = value.trim().toLowerCase().replace(/^\./, '');
  return aliases.get(normalized) ?? registry.resolve(normalized)?.name;
}
```

After the existing `lang(attribute) ?? 'plaintext'` resolution, the highlight expression becomes:

```ts
render(tokenize(source, registry.resolve(
  language === 'javascript' ? 'jsx' :
  language === 'typescript' ? 'tsx' : language,
) ?? plaintext)).replaceAll('\r', '&#13;');
```

The renderer escapes source HTML, but carriage returns still need the existing entity replacement before assigning `innerHTML`, because HTML parsing otherwise normalizes them. Copy continues to use the captured source. The class mapping is:

| Kirari categories | Existing palette variable |
| --- | --- |
| keyword, boolean, null, deleted | `--sh-keyword` |
| variable | `--sh-identifier` |
| property, attribute | `--sh-property` |
| function, heading, tag | `--sh-entity` |
| string, regex, inserted | `--sh-string` |
| number, type, entity | `--sh-class` |
| comment | `--sh-comment` |
| operator, punctuation | `--sh-sign` |

HTML also brings JavaScript and CSS scanners for embedded script/style bodies. Per-language imports do not make these transitive costs disappear. Aliases and token categories differ from Sugar High, so a switch also requires integration code, CSS mappings, and engine-specific test selector changes. No additional runtime, framework, WebAssembly, worker, or lazy-loading system is needed.

## Pros, cons, and recommendation

- **Keep Sugar High:** The existing implementation already meets the component's contract, has no required runtime dependencies or WebAssembly requirement, uses the existing light/dark palette, and is smaller at current language coverage. Its disadvantages are fewer language definitions and heuristic highlighting. The current omnibus imports ship all 31 entries even on HTML-only pages. Sugar High also has per-language exports if a deliberately narrower future entry is useful; that option does not require an engine change.
- **Kirari advantages:** Class-only token output avoids inline token styles, named language imports support deliberate subsets, the package offers more language definitions, and the tested prototype preserves the current user interactions. Streaming APIs and richer integrations exist, but Sensible UI's current component does not need them, and the measured bundle does not import them.
- **Kirari disadvantages:** Keeping coverage increases the optional asset cost, requires alias and theme integration, and changes lexical output. As of this evaluation, its first functional npm release was October 18, 2026; version 1.1.1 was published October 21. Its short history and recent scanner, JSX, and performance fixes warrant caution, not an assumption that it is broken. Neither 1.x versioning nor the successful integration checks establish broad grammar accuracy or production maturity.

**Recommendation: keep Sugar High.** Reconsider Kirari when a concrete need for its extra languages, class-only output, or streaming justifies the larger integration, or after new measurements show a material improvement with the same coverage. A migration should preserve aliases and fallback behavior, verify representative difficult syntax, and use complete Sensible UI asset sizes rather than published core-only figures.

## Measurement and verification method

- Baseline: the [existing component](https://github.com/cameronapak/sensible-ui/blob/5dfda3002ddaa656b230b3401885f37886336934/src/components/code.ts), Sugar High 2.5.0, Bun 1.3.10 on Linux x64. Build with `bun build --target=browser <component.ts> --outfile=<bundle.js> --minify`, the same command as `build:code`. No splitting, source maps, theme catalog, or development server code enters the measured module.
- Kirari: install pinned 1.1.1 outside the project; generate variants from the baseline component using the pipeline above. Select the baseline names in Sugar High registry order and append JSX/TSX for the 33-definition build; use the listed order for the reduced set and alphabetic named exports for all 48. Include only alias overrides where native registry resolution differs. Generate the CSS mapping in the category order shown above, group selectors by palette value, append it in `@layer components`, and minify both CSS variants with the same Bun browser build.
- Compression for every table: run Bun's `node:zlib` implementation on the emitted bytes, using `gzipSync(bytes, { level: 9 })` and `brotliCompressSync(bytes)` with default options. Raw size is `bytes.length`. This uses the same method as the separate Highlights comparison in ADR-0006; another runtime or server's compression settings may produce different compressed sizes.
- Kirari verification: intercept the gallery's optional JavaScript and CSS requests with the compatibility prototype. Run the existing 20 code/gallery browser tests with token selectors changed from Sugar High to Kirari and the private Sugar High line-wrapper assertion removed. All 20 passed. One additional browser scenario passed all 69 existing canonical names/aliases plus two unknown labels, hostile markup, Unicode, CRLF, trailing whitespace, clipboard output, and Wrap. The reduced and all-definition variants were built and measured, not given the full compatibility browser run.
- These 21 prototype checks cover the tested component behavior, standalone styling, both themes, narrow layouts, selection, late/parser upgrades, and script-unavailable fallback. They do not prove grammar equivalence, scanning speed, memory use, or behavior under every CSP. The restored Sugar High project also passes `bun run check`: 29 browser tests, 2 scoped-builder tests, types, builds, site rendering, export validation, and the generated-file guard.

The evaluation leaves no candidate dependency, generated candidate asset, migration changeset, or prototype test in the repository. It adds only a decision record and does not require a package release.

## Sources

- [Kirari 1.1.1 package manifest](https://github.com/vortexkit/kirari/blob/d9bc81978e6efcd92b283b16b2cc84a27c3518e9/packages/kirari/package.json), [registry](https://github.com/vortexkit/kirari/blob/d9bc81978e6efcd92b283b16b2cc84a27c3518e9/packages/kirari/src/registry.ts), and [renderer](https://github.com/vortexkit/kirari/blob/d9bc81978e6efcd92b283b16b2cc84a27c3518e9/packages/kirari/src/render.ts).
- [Kirari npm release timestamps](https://registry.npmjs.org/@vortexlabs/kirari), [changelog](https://github.com/vortexkit/kirari/blob/d9bc81978e6efcd92b283b16b2cc84a27c3518e9/packages/kirari/CHANGELOG.md), and [documented accuracy limits](https://github.com/vortexkit/kirari/blob/d9bc81978e6efcd92b283b16b2cc84a27c3518e9/docs/accuracy.md).
