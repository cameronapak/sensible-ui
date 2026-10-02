# Keep native CSS instead of UnoCSS

Sensible UI tried UnoCSS to reduce code and maintenance while preserving semantic defaults, buildless adoption, runtime theme tokens, standalone modules, and scoped bundles. Keep native CSS and the existing Bun build and utility generator; do not adopt UnoCSS for component authoring, utility generation, or a public preset. The trial delivered extensibility, but its integration and distribution costs outweighed the small reduction in handwritten code.

## Considered options

- **UnoCSS migration:** Shared Wind3 rules shortened component declarations and replaced custom utility rules. Maintaining the existing consumer model also required directive compilation, token mappings, preset packaging, scoped integration, five additional development dependencies, and a dependency type patch. Across maintained implementation and checks, the trial saved only 109 net lines. Generated output grew by 21,577 net lines, largely from compiled standalone stylesheets and the preset embedding the core CSS. The minified core grew from 8,788 to 9,471 bytes gzipped. Generated lines are not handwritten upkeep, but the added build responsibilities remain.
- **Native CSS:** Retain direct semantic selectors, CSS custom properties, native `@scope`, and the finite optional companion stylesheet. This gives up the proposed UnoCSS extension surface but keeps the existing behavior with fewer integration layers.

## Consequences

Remove the local UnoCSS migration, its public preset, dependencies, type patch, and proposed breaking changes. Preserve the existing component catalog, package exports, spacing tokens, and fixed `.sensible-ui` scope. This supersedes the possible future UnoCSS preset mentioned in [ADR-0002](0002-optional-css-utilities.md); it does not prohibit consumers from using UnoCSS independently in their applications.

The October 2, 2026 trial established that shorter CSS recipes do not necessarily mean less total maintenance. Future simplification proposals need to reduce the responsibilities Sensible UI owns, not merely move declarations into another engine.
