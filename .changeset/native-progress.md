---
"@faith-tools/sensible-ui": minor
---

Style the native `<progress>` element without a class. Determinate bars fill with `--primary` on a lighter track. Indeterminate bars, which have no `value`, show a segment that moves back and forth; with reduced motion they show still stripes instead. A `label` directly before a progress bar gets space below it. In a flex row the bar shrinks but keeps at least 4rem, and it stays visible in forced colors and when printed.

Import it alone with `@faith-tools/sensible-ui/progress` or `@faith-tools/sensible-ui/scoped/progress`. The complete global and scoped bundles include it.
