# Sensible UI design guidance

## Overview

Sensible UI supplies a customizable, semantic-first baseline inspired by shadcn/ui. It is not a mandatory brand palette. **The consuming project's theme, fonts, and design decisions take precedence over the bundled defaults.** Read its existing DESIGN.md and theme file first; do not replace either with this document.

This is prose design guidance, not a complete machine-readable token export. CSS remains the implementation source of truth. It uses the section structure of the evolving [Google Labs DESIGN.md draft](https://github.com/google-labs-code/design.md), without claiming complete schema interoperability.

## Colors

Customize semantic CSS variables rather than hard-coding the default appearance. Preserve existing values unless the requested task changes them. Where a role has a foreground pair, update and contrast-check the pair together.

| Variables | Role in Sensible UI |
| --- | --- |
| `--background`, `--foreground` | Base surface and readable content. |
| `--card`, `--card-foreground` | Card surfaces and content. |
| `--popover`, `--popover-foreground` | Native select popup treatment where supported. Not a general popover component API. |
| `--primary`, `--primary-foreground` | High-emphasis actions, selected controls, badges, and progress. |
| `--secondary`, `--secondary-foreground` | Supporting surfaces and secondary actions. |
| `--muted`, `--muted-foreground` | Subtle surfaces and lower-emphasis text. |
| `--accent`, `--accent-foreground` | Hover/active emphasis, including navigation. |
| `--destructive` | Destructive actions and invalid state emphasis. |
| `--border`, `--input`, `--ring` | Separators, field borders, and focus indication. |
| `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border` | Sidebar surfaces, content, selected/hovered items, and borders. |

### shadcn theme compatibility

Sensible UI defines the familiar shadcn surface/foreground names, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` through `--chart-5`, sidebar token names, and `--radius`. Those shared names are customization points, not a guarantee that every shadcn or TweakCN export is interchangeable.

- Colors must be complete CSS colors such as `oklch(...)`, `hsl(...)`, or hex. Sensible UI uses `var(--primary)` directly and in `color-mix()`. Legacy declarations such as `--primary: 222.2 47.4% 11.2%` are not colors here; wrap the channels in `hsl(...)`.
- Copy/adapt relevant `:root` and `.dark` variable declarations, not Tailwind `@theme`, `@apply`, `@custom-variant`, or shadcn runtime/component imports. Sensible UI does not compile those directives or supply Tailwind's mapped `--color-*` utilities.
- `--chart-*`, `--sidebar-primary`, `--sidebar-primary-foreground`, and `--sidebar-ring` are defined in the theme, but the current core components do not consume them. Sidebar focus uses `--ring`; active sidebar links use `--sidebar-accent` and its foreground. Defining a chart palette does not supply a chart component.
- The current core does not consume `--destructive-foreground`, `--font-serif`, shadcn's derived `--radius-*` tokens, or theme-export shadow/tracking scales. Destructive buttons use `--destructive` backgrounds (mixed with transparency in dark/interaction states) and literal white text, not a customizable destructive/foreground pair. Check contrast against white when changing that token. Do not promise these extra variables restyle the components.
- Theme compatibility is not React component, class-name, utility, or pixel-for-pixel compatibility. Add consumer-owned CSS only when the requested design needs something beyond documented tokens and variants.

### Cascade and dark mode

Load consumer overrides after the library, preferably as unlayered CSS in the existing theme file. Ordinary unlayered author rules override the library's layered defaults. For global mode, use `:root` and `.dark`. For scoped mode, apply overrides to `.sensible-ui` and `.sensible-ui.dark` (or a consumer-owned selector matching the scope root under its dark ancestor); the scope root establishes its own defaults rather than merely inheriting `:root` values.

```css
/* Illustrative brand choices, not required colors. Keep existing values. */
.sensible-ui.account-theme {
  --primary: oklch(0.48 0.16 155);
  --primary-foreground: oklch(0.99 0 0);
}

.dark .sensible-ui.account-theme,
.sensible-ui.account-theme.dark {
  --primary: oklch(0.8 0.13 155);
  --primary-foreground: oklch(0.18 0.02 155);
}
```

Choose `.dark` according to the app's existing theme state. The library does not automatically follow system color preference. Check both modes after overrides, including contrast in disabled, selected, invalid, and focus states.

## Typography

Use semantic headings, body text, labels, and descriptions to convey hierarchy. Keep consumer fonts through `--font-sans` and `--font-mono`; Geist preferences and system fallbacks are defaults, not a font-loading requirement. Do not assume every font-size or weight in the stylesheet has a public token.

## Layout

Use `.stack`, `.cluster`, `.split`, and `.auto-grid` for common compositions. Adjust `--layout-gap` and `--min-item-size` to fit the consumer's content. Prefer intrinsic wrapping before adding breakpoints. Atomic utilities and their `--space-*` tokens require the optional utilities stylesheet; the core does not impose that spacing scale on every component.

Keep components below a neutral `.sensible-ui` boundary in scoped mode. The gallery's `docs-*` and `landing-*` classes are site-only, not library APIs.

## Elevation & depth

Use semantic surfaces, borders, and restrained depth to distinguish regions. Preserve the consumer's intended hierarchy. Several component shadows are CSS literals rather than exported shadow tokens; a shadcn theme's `--shadow-*` declarations alone do not replace them.

## Shapes

`--radius` is the shared base corner-radius customization point. Components derive their corners with their own calculations; they do not use shadcn's entire derived radius scale. Check small radii against controls before adopting them.

## Components

Prefer native elements where HTML supplies semantics. Existing `.card`, `.badge`, `.item`, and named layout classes remain supported. Light-DOM `sensible-*` wrappers name patterns without native elements and style without registration. They do not add implicit roles or replace native controls.

Use documented variants, sizes, and native/ARIA state. Optional scripts add behavior only for tooltip, input group, and highlighted code; the CSS-only core remains independent of them. Component markup and imports are documented in the skill's component reference and the [gallery](https://sensibleui.com/).

## Do's and don'ts

- Do preserve consumer token overrides, fonts, and dark-mode choices.
- Do adapt shared shadcn variables by role and valid CSS value, checking actual consumption rather than assuming complete compatibility.
- Do provide labels, descriptions, focus visibility, contrast, and meaningful no-JavaScript content.
- Do inspect narrow layouts and affected interaction states, including reduced motion where applicable.
- Don't reset the theme to the bundled neutral colors or copy gallery-only styles.
- Don't introduce React, Tailwind, a provider, or a runtime just to use Sensible UI.
- Don't overwrite a consumer's DESIGN.md, invent unavailable components, or mistake a styled wrapper for complete accessible behavior.
