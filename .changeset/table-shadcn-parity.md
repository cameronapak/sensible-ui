---
"@faith-tools/sensible-ui": patch
---

Align the table with shadcn/ui's table and improve how wide tables behave:

- Wrap a table in `<div data-slot="table-container">` so wide content scrolls horizontally instead of overflowing the page, including in RTL. Add `class="card"` to the container for the bordered treatment; its rounded border clips the table and caption. `<table class="card">` still works but does not scroll.
- Inside the container, the caption stays in the visible area while columns scroll, and a fade marks each edge that hides more columns in browsers that support scroll-driven animations. Swiping past the end no longer triggers browser back navigation, and keyboard focus on the container shows a ring. Give the container `role="region"`, `tabindex="0"`, and `aria-labelledby` pointing at the caption so keyboard users can scroll it.
- Body and footer cells now wrap text, unlike shadcn/ui, so ordinary data fits narrow screens before the table scrolls. Header cells in `thead` stay on one line.
- Row header cells in the body and footer use the same padding as data cells, so body rows are 37px instead of 40px. Only header cells in `thead` keep the 40px height.
- Rows with `aria-selected="true"` use the muted background, and rows containing an element with `aria-expanded="true"` keep the hover background.
- Native checkboxes in cells now remove the cell's inline-end padding and center vertically, like `[role="checkbox"]` elements.
- Header cells align to the inline start, so they follow `dir="rtl"`.
- Captions in card tables have balanced spacing above and below.

These changes apply to the global, scoped, and standalone CSS.
