# Sensible UI

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
