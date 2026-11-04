---
"@faith-tools/sensible-ui": minor
---

Add `<sensible-tooltip>` for short descriptions on hover, keyboard focus, and touch hold. Put a focusable control first and a `role="tooltip"` element after it. Set `side` to `top`, `bottom`, `left`, or `right`; the tooltip flips when it would leave the screen. Core CSS styles and positions it with CSS anchor positioning.

Showing tooltips needs the optional, dependency-free script: load `dist/sensible-tooltip.js` as a module or import `@faith-tools/sensible-ui/tooltip/js`. The script links the tooltip with `aria-describedby`, unless the control already names itself with `aria-labelledby` pointing at the tooltip. In browsers with interest invokers (`interestfor`), the browser handles hover, focus, long press, and Escape. Other browsers get a 500ms hover delay, immediate keyboard-focus display, a half-second touch hold, a hoverable tooltip, and Escape dismissal. Escape closes the tooltip before an enclosing dialog. Without the script, the text stays visually hidden next to its control. With reduced motion, tooltips appear without scaling or fading.

Import the styles alone with `@faith-tools/sensible-ui/tooltip` or `@faith-tools/sensible-ui/scoped/tooltip`.
