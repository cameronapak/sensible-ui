# Generate parent-scoped CSS from the global sources

Sensible UI ships `.sensible-ui`-scoped counterparts to the global bundle and standalone exports. The scoped artifacts are generated from the existing CSS source graph so component styles have one source of truth.

The shared CSS sources express root behavior with `:scope`. Global output resolves `:scope` against the document root. Scoped output places the same bundled CSS inside native `@scope (.sensible-ui)`, where it resolves against the opt-in parent. The builder does not rewrite selectors or declarations.

The scope root establishes local theme and base defaults, while its descendants receive semantic and component styles. The boundary prevents sibling selectors from styling elements outside it without repeating a parent condition on every selector. Document scrolling behavior remains the host application's responsibility.

The scope root is a neutral styling boundary, not a component element. Component markup and Sensible UI layout or utility classes belong beneath it. A consumer may combine `.sensible-ui` with a host-owned wrapper class, but classes such as `.card`, `.stack`, `.mt-4`, or `.size-8` do not apply to the scope root itself. This keeps structural selectors such as `table thead tr` and `a > .badge` equivalent between global and scoped modes without rewriting every selector around a possible component-shaped scope root.

Selectors whose target may be a direct child of the scope root keep ancestor exclusions on the styled subject. For example, use `button:not(form[method="dialog"] > *)` instead of `:not(form[method="dialog"]) > button`. Likewise, use subject-side dark conditions such as `&:is(.dark *)` instead of `.dark &`, so dark mode can be selected above the scope root.

Scoped artifacts use a top-level `sensible-ui` cascade layer. This prevents their internal `base`, `typography`, `components`, `button`, and `utilities` layer names from establishing layer order in the host application.

Scoped mode requires browsers that support `@scope`. Scoping proximity participates in cascade resolution, so a nearer scoped rule wins before source order when origin, importance, layer, and specificity are otherwise equal. A fixed `.sensible-ui` class avoids making build-time selector configuration part of the public API.
