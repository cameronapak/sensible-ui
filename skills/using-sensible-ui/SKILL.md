---
name: using-sensible-ui
description: Builds and troubleshoots interfaces with @faith-tools/sensible-ui. Use when a project uses Sensible UI, when integrating its CSS or optional custom elements, or when customizing its theme variables. Not for unrelated UI libraries or general design work without Sensible UI.
license: MIT
---

# Using Sensible UI

Build semantic HTML with the consuming project's theme, not a copy of the gallery's appearance. Sensible UI has a CSS-only core, native controls, existing component classes, and light-DOM `sensible-*` wrappers. It does not require React or Tailwind.

## Read the project first

1. Find the installed `@faith-tools/sensible-ui` version or the version pinned in its CDN URLs. Check existing CSS imports, theme files, framework conventions, and the project's own DESIGN.md before editing.
2. Prefer references inside that installed package's `skills/using-sensible-ui/` directory. A separately installed skill can be older than the dependency. For CDN projects, use the same version's package-CDN documents. Website documents describe the current release, not every older version.
3. Preserve consumer CSS variable overrides, fonts, dark-mode strategy, and brand choices. Change only tokens needed by the requested task, in the existing theme file. Never reset a theme to Sensible UI defaults or overwrite the project's DESIGN.md.
4. Read the relevant references below before writing markup. Do not infer APIs from shadcn React examples or invent component tags, variants, or package exports.

## Choose the reference

| Task | Read |
| --- | --- |
| Install, choose imports, or integrate into an existing app | [Usage](references/usage.md) |
| Build controls, cards, navigation, or optional behaviors | [Components](references/components.md), then only the needed sections |
| Customize colors, fonts, radius, or layouts; apply a brand spec | [Design guidance](references/design.md) and the consumer's existing theme |

## Integration rules

- Prefer native HTML. Buttons perform actions; links navigate; labels name fields; `details` provides disclosure; `dialog.showModal()` provides modal behavior.
- Choose global **or** scoped CSS. For scoped adoption, put `.sensible-ui` on a neutral wrapper, with components and layout classes beneath it. Global imports still affect the whole page. Portals outside the wrapper need their own scoped container.
- Use documented `data-variant` and `data-size` values. Native and ARIA attributes express state. A custom element adds no implicit role, accessible name, or application behavior.
- CSS styles `sensible-*` tags without registration. Load only the optional scripts the task requires. `code` is a JavaScript export, unlike the root CSS export; see the component reference.
- Use named layouts first. Atomic utilities require the separate utilities stylesheet and are not the full Tailwind API.
- Theme through semantic variables such as `--primary` / `--primary-foreground`, not copied default color literals. Shared shadcn token names accept complete CSS color values here; bare legacy HSL channels need conversion. Read the compatibility limits in the design reference.

## Check the consuming app

Run its existing checks, not Sensible UI's contributor commands. Inspect the rendered result at normal and narrow widths and in affected light/dark states. Exercise keyboard focus and any added dialog or tooltip behavior. Check that labels, validation messages, and accessible names remain useful, the host outside a scoped region remains unchanged, and consumer theme overrides still win. Report checks that could not run.
