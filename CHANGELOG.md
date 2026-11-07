# Sensible UI

## 1.8.2

### Patch Changes

- b00c08f: Ship a portable consumer skill with version-matched usage, component examples, and design guidance. Make direct use of the bundled guidance the default, with no separate skill installation required; registration remains optional. Document scoped integration, preservation of consumer theme overrides, and the limits of shared shadcn theme variables.

  Add a homepage introduction with a copyable agent prompt and links to skill setup and design guidance.

## 1.8.1

### Patch Changes

- bde3648: Prevent double-tap zoom on links with href, buttons, button-like inputs, checkboxes, radios, selects, and disclosure summaries with touch-action: manipulation. Scrolling and pinch zoom remain allowed. Text fields and page containers keep their default touch behavior. The shared base styles cover global, scoped, and standalone imports.

## 1.8.0

### Minor Changes

- b885cb0: Add `<sensible-button-group>`, the first light-DOM custom element for a pattern without a native HTML element. It joins the borders and corners of the native buttons, `a.button` links, inputs, selects, and `span` text placed directly inside it, and of controls wrapped in `<sensible-tooltip>`. Add `orientation="vertical"` to stack them, an `hr` to separate buttons without borders, and nested groups to space groups apart. A row too long for its container wraps onto more rows, and text inputs keep at least 8rem. Corners follow the nearest `dir` attribute. Core CSS styles the element, so it needs no JavaScript.

  The element adds no ARIA role. Add `role="group"` and an `aria-label` when the controls belong together. Import it alone with `@faith-tools/sensible-ui/button-group` or `@faith-tools/sensible-ui/scoped/button-group`.

  [ADR-0008](https://github.com/cameronapak/sensible-ui/blob/main/docs/adr/0008-light-dom-custom-elements.md) records the custom-element approach for new patterns. Existing class APIs are unchanged.

- 47ffa2d: Add `<sensible-input-group>` for text inputs and text areas with icons, text, and buttons inside one border. The group shows a single focus ring when its field has keyboard focus, and it takes the field's `aria-invalid` and `disabled` states. With a text area, rows of text or actions sit below it. Core CSS styles the element without JavaScript.

  An optional, dependency-free script makes a click on an icon, text, or empty space focus the field. Load `dist/sensible-input-group.js` as a module or import `@faith-tools/sensible-ui/input-group/js`. Import the styles alone with `@faith-tools/sensible-ui/input-group` or `@faith-tools/sensible-ui/scoped/input-group`.

- 0f3b98c: Style the native `<progress>` element without a class. Determinate bars fill with `--primary` on a lighter track. Indeterminate bars, which have no `value`, show a segment that moves back and forth; with reduced motion they show still stripes instead. A `label` directly before a progress bar gets space below it. In a flex row the bar shrinks but keeps at least 4rem, and it stays visible in forced colors and when printed.

  Import it alone with `@faith-tools/sensible-ui/progress` or `@faith-tools/sensible-ui/scoped/progress`. The complete global and scoped bundles include it.

- 26ae47d: Add three CSS-only custom elements for navigation:
  - `<sensible-navbar>` spreads a site header or footer across one row and lays out the links in a `nav` list horizontally. Its children and links wrap on narrow screens, and a direct link shows as the brand.
  - `<sensible-sidebar>` draws a panel of stacked links with heading-named groups. Native `details` elements make collapsible groups, and closed groups leave the tab order.
  - `<sensible-sidebar-layout>` puts its first child beside its last child at `--sidebar-width` and stacks them when the content would get narrower than 60% of the layout. Add `side="end"` to place the sidebar after the content.

  Links marked with `aria-current="page"` show as current with a background and a heavier weight. Long labels wrap inside the panel, and focus and the current page stay visible in forced colors. The elements add no landmarks; keep native `header`, `footer`, `aside`, and `nav` elements. Import them alone with `@faith-tools/sensible-ui/navigation` or `@faith-tools/sensible-ui/scoped/navigation`.

- ba16f06: Add `<sensible-tooltip>` for short descriptions on hover, keyboard focus, and touch hold. Put a focusable control first and a `role="tooltip"` element after it. Set `side` to `top`, `bottom`, `left`, or `right`; the tooltip flips when it would leave the screen, and a side tooltip moves above or below its control when neither side has room. The wrapper adds no box, so wrapped fields keep their width. Core CSS styles and positions it with CSS anchor positioning.

  Showing tooltips needs the optional, dependency-free script: load `dist/sensible-tooltip.js` as a module or import `@faith-tools/sensible-ui/tooltip/js`. The script links the tooltip with `aria-describedby`, unless the control already names itself with `aria-labelledby` pointing at the tooltip. In browsers with interest invokers (`interestfor`), the browser handles hover, focus, long press, and Escape. Other browsers get a 500ms hover delay, immediate keyboard-focus display, a half-second touch hold, a hoverable tooltip, and Escape dismissal. Escape closes the tooltip before an enclosing dialog and marks the event as handled with `defaultPrevented`. Only one tooltip shows at a time, and a fallback tooltip closes once its control scrolls out of view. When anchor positioning leaves a tooltip away from its control, as Firefox does in a right-to-left part of a left-to-right page, the script places it beside the control. In both cases, once a tooltip is visible, moving to another trigger shows its tooltip immediately. The delay returns when no tooltip has been open for 300ms, or right after Escape. Without the script, the text stays visually hidden next to its control. With reduced motion, tooltips appear without scaling or fading.

  Import the styles alone with `@faith-tools/sensible-ui/tooltip` or `@faith-tools/sensible-ui/scoped/tooltip`.

### Patch Changes

- fa024fe: Show the keyboard focus ring on default, primary, secondary, and outline buttons. Their variant shadows replaced the ring, so these buttons showed no focus indicator. Outline buttons also take the ring color on their border.
- 45735cc: Apply defensive CSS so long or unexpected content stays inside its container. Long words now wrap in text, lists, links, labels, legends, figures, accordion summaries, items, and `x-stack`, `cluster`, and `split` text. Long badges clip at the end.

  Other defensive changes:
  - Hover styles apply only on devices that can hover. Pressed states still show on touch devices.
  - `select` uses 16px text below 48rem to prevent iOS Safari zoom.
  - Buttons use `min-height` instead of a fixed `height`. Outline buttons in card and dialog footers now match the 36px default height.
  - Text buttons have a minimum width of 3.5rem, 4rem, or 4.5rem, depending on size.
  - Images use `object-fit: cover` when both dimensions are set.
  - Dialogs and code blocks contain scroll chaining.
  - Unbundled standalone modules no longer drop the color swatch and range thumb styles.

  These changes apply to the global, scoped, and standalone CSS.

- d067c11: Replace downward button press movement with subtle scaling, use ease-out accordion and switch transitions, and shorten the spinner rotation to 750ms. Buttons and switches now respect reduced-motion preferences; switch movement preserves RTL direction. Applies to global, scoped, and standalone CSS.
- bc7589f: Align the table with shadcn/ui's table and improve how wide tables behave:
  - Wrap a table in `<div data-slot="table-container">` so wide content scrolls horizontally instead of overflowing the page, including in RTL. Add `class="card"` to the container for the bordered treatment; its rounded border clips the table and caption. `<table class="card">` still works but does not scroll.
  - Inside the container, the caption stays in the visible area while columns scroll, and a fade marks each edge that hides more columns in browsers that support scroll-driven animations. Swiping past the end no longer triggers browser back navigation, and keyboard focus on the container shows a ring. Give the container `role="region"`, `tabindex="0"`, and `aria-labelledby` pointing at the caption so keyboard users can scroll it.
  - Body and footer cells now wrap text, unlike shadcn/ui, so ordinary data fits narrow screens before the table scrolls. Header cells in `thead` stay on one line.
  - Row header cells in the body and footer use the same padding as data cells, so body rows are 37px instead of 40px. Only header cells in `thead` keep the 40px height.
  - Rows with `aria-selected="true"` use the muted background, and rows containing an element with `aria-expanded="true"` keep the hover background.
  - Native checkboxes in cells now remove the cell's inline-end padding and center vertically, like `[role="checkbox"]` elements.
  - Header cells align to the inline start, so they follow `dir="rtl"`.
  - Captions in card tables have balanced spacing above and below.

  These changes apply to the global, scoped, and standalone CSS.

## 1.7.0

### Minor Changes

- 0d4b476: Add native dialog styles, a standalone export, and accessible modal and non-modal examples. Backdrop dismissal remains opt-in through `closedby="any"`.
- 9539ac2: Let authors start sensible-code blocks wrapped with `data-wrap="true"`, and let readers toggle wrapping per block. Code scrolls by default at all screen widths. Switching modes resets the code panel to the start so previously scrolled content stays readable.

## 1.6.0

### Minor Changes

- 4738ad8: Add an opt-in syntax-highlighted code web component with separate JavaScript and CSS imports.

## 1.5.0

### Minor Changes

- c3d0932: Add optional `.sensible-ui`-scoped bundle, component, and utility exports for adopting Sensible UI inside existing applications without applying semantic defaults globally.

## 1.4.0

### Minor Changes

- 62d3fbd: Expand the optional utility stylesheet with accessibility, overflow, text, aspect-ratio, positioning, inset, z-index, and height-bound helpers.

### Patch Changes

- 6777ad7: Respect reduced-motion preferences for smooth scrolling, accordions, spinners, and optional page transitions.

## 1.3.0

### Minor Changes

- 1baf18c: Add an optional generated CSS utility stylesheet with token-backed spacing, sizing, flexbox, grid, and alignment helpers. Add stack, cluster, split, and intrinsic grid layouts to the core bundle.

### Patch Changes

- 5d3ec00: Make busy buttons easier to read by placing a foreground-colored spinner beside the visible label without changing the button height. Use the wait cursor for busy buttons while leaving disabled behavior under consumer control.

## 1.2.0

### Minor Changes

- dd58681: Make every component subpath export standalone by including its required theme and base styles. Move shared card styling into the card module so importing `@faith-tools/sensible-ui/card` provides the complete card interface.
- 70d071d: Prefer Geist and Geist Mono when available, and add font family theme tokens for customization.

### Patch Changes

- 00fceff: Make cross-document page view transitions opt-in through the `@faith-tools/sensible-ui/view-transition` export instead of enabling them in the default bundle.
- 653c6cf: Keep card text and actions contained when content grows or the card is squeezed into a narrow layout.

## 1.1.0

### Minor Changes

- 8097b37: Remove the Tailwind CSS dependency and ship native CSS bundles while retaining the shadcn-style theme variables and dark mode. Build the static site from the same demo as the Bun preview, and fix the duplicate border on card tables.

## 1.0.5

### Patch Changes

- ac43c70: Introduce CSS for description lists (`<dl>`) with variants for standard lists and a card-like display. This includes styling for `<dt>` and `<dd>` elements to ensure proper spacing, borders, and text wrapping. Also adds example usage to the home page.

## 1.0.4

### Patch Changes

- Added a chevron arrow icon to the accordion component. Icon provied by https://lucide.dev

## 1.0.3

### Patch Changes

- Added accordion component CSS styles

## 1.0.2

### Patch Changes

- Forgot to build before publishing lol

## 1.0.1

### Patch Changes

- Updated README and want it to update on npmjs.com lol

## 1.0.0

### Major Changes

- Renaming from Semantics UI CSS to Sensible UI.

## 0.1.4

### Patch Changes

- Got the minified CSS file smaller than the regular, but it's only a 1kb difference. I have some work to do.

## 0.1.3

### Patch Changes

- Fixed the deploy of the minified CSS. The filename was improperly named.

## 0.1.2

### Patch Changes

- Added minified CSS file

## 0.1.1

### Patch Changes

- Made it where SVG's in `.item` do not shrink and where the item does not wrap on small screens if it has an SVG in it.

## 0.1.0

### Minor Changes

- 17b74b9: Added: badge, item, and a loading spinner. I've also added some fun utility classes, like `.stack-x` or `.stack-y` for easily lining up and spacing components.

  Fixed: some padding missing on the card component footer when not using a `.border-t` class.
