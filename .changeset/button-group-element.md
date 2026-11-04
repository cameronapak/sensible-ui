---
"@faith-tools/sensible-ui": minor
---

Add `<sensible-button-group>`, the first light-DOM custom element for a pattern without a native HTML element. It joins the borders and corners of the native buttons, `a.button` links, inputs, selects, and `span` text placed directly inside it, and of controls wrapped in `<sensible-tooltip>`. Add `orientation="vertical"` to stack them, an `hr` to separate buttons without borders, and nested groups to space groups apart. A row too long for its container wraps onto more rows, and text inputs keep at least 8rem. Corners follow the nearest `dir` attribute. Core CSS styles the element, so it needs no JavaScript.

The element adds no ARIA role. Add `role="group"` and an `aria-label` when the controls belong together. Import it alone with `@faith-tools/sensible-ui/button-group` or `@faith-tools/sensible-ui/scoped/button-group`.

[ADR-0008](https://github.com/cameronapak/sensible-ui/blob/main/docs/adr/0008-light-dom-custom-elements.md) records the custom-element approach for new patterns. Existing class APIs are unchanged.
