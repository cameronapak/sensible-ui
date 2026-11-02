---
"@faith-tools/sensible-ui": patch
---

Apply defensive CSS so long or unexpected content stays inside its container. Long words now wrap in text, lists, links, labels, legends, figures, accordion summaries, items, and `x-stack`, `cluster`, and `split` text. Long badges clip at the end.

Other defensive changes:

- Hover styles apply only on devices that can hover. Pressed states still show on touch devices.
- `select` uses 16px text below 48rem to prevent iOS Safari zoom.
- Buttons use `min-height` instead of a fixed `height`. Outline buttons in card and dialog footers now match the 36px default height.
- Text buttons have a minimum width of 3.5rem, 4rem, or 4.5rem, depending on size.
- Images use `object-fit: cover` when both dimensions are set.
- Dialogs and code blocks contain scroll chaining.
- Unbundled standalone modules no longer drop the color swatch and range thumb styles.

These changes apply to the global, scoped, and standalone CSS.
