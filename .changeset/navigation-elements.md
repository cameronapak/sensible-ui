---
"@faith-tools/sensible-ui": minor
---

Add three CSS-only custom elements for navigation:

- `<sensible-navbar>` spreads a site header or footer across one row and lays out the links in a `nav` list horizontally. Its children and links wrap on narrow screens, and a direct link shows as the brand.
- `<sensible-sidebar>` draws a panel of stacked links with heading-named groups. Native `details` elements make collapsible groups, and closed groups leave the tab order.
- `<sensible-sidebar-layout>` puts its first child beside its last child at `--sidebar-width` and stacks them when the content would get narrower than 60% of the layout. Add `side="end"` to place the sidebar after the content.

Links marked with `aria-current="page"` show as current with a background and a heavier weight. Long labels wrap inside the panel, and focus and the current page stay visible in forced colors. The elements add no landmarks; keep native `header`, `footer`, `aside`, and `nav` elements. Import them alone with `@faith-tools/sensible-ui/navigation` or `@faith-tools/sensible-ui/scoped/navigation`.
