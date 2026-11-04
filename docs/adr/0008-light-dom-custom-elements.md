# Name non-native patterns with light-DOM custom elements

New patterns that HTML cannot express with a native element use a light-DOM `sensible-*` custom element as their public API instead of a new class. Native elements remain the API wherever HTML has the semantics: `progress`, buttons, form controls, links, lists, and landmarks keep their native markup, attributes, and ARIA. This supersedes the earlier guidance not to wrap CSS-only presentation in a custom element. It applies to new patterns only; existing class APIs such as `.card`, `.badge`, `.item`, `.stack`, and `.container` remain supported and unchanged.

A custom element is a declarative wrapper around native children. It never replaces a native control and is not form-associated, so labels, form submission, validation, focus order, and accessibility semantics come from the native elements inside it. A wrapper adds no implicit ARIA role. Authors add `role`, `aria-label`, or `aria-describedby` when a visual grouping is also a semantic one, because visual grouping and accessibility semantics are separate decisions.

Styling does not depend on registration. The core CSS bundle styles each `sensible-*` tag before or without JavaScript, since browsers render unknown elements and match tag selectors without a definition. The tags work under the scoped bundle exactly as classes do: `@scope (.sensible-ui)` matches them, including popovers rendered in the top layer from inside the scope root. Element attributes use plain names such as `orientation` and `side`, because the element owns its attribute namespace. Native elements keep `data-variant` and `data-size`.

JavaScript is optional and per element. An element ships a script only when it owns behavior that HTML and CSS cannot provide, such as wiring descriptions and dismissal for a tooltip. Each script is a dependency-free light-DOM `HTMLElement` subclass with its own `./<name>/js` package export, registers its tag only once, and cleans up when disconnected. The CSS-only root import and the scoped bundle remain free of JavaScript. Elements without behavior, such as layout and grouping wrappers, ship no script.

Each element documents what works without JavaScript. When a script adds behavior, the markup must remain meaningful before it loads: content stays in the DOM, controls keep their accessible names, and no essential information appears only after upgrade.

This records vanilla custom elements without a runtime. A shared runtime such as Datastar Rocket remains a separate decision.
