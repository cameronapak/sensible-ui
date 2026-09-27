# Keep syntax highlighting in an opt-in web component

The default and scoped Sensible UI bundles remain CSS-only. A separate `./code` JavaScript export bundles Sugar High and registers the light-DOM `<sensible-code>` element. Its styles ship through `./code/css` and are not imported by the core stylesheet. Consumers pay for the highlighting code only when they import the optional JavaScript entry.

The element takes a `language` attribute and reads its direct read-only `<textarea>` child. The text area lets authors write HTML source without escaping angle brackets and remains readable without JavaScript. On upgrade, the component replaces it with semantic `<pre><code>`, highlights the source, and adds a Copy button. HTML entities and a literal `</textarea>` still require care when authored in HTML. It does not take a `content` attribute because embedding code in an HTML attribute requires escaping quotes and ampersands, has no readable no-JavaScript fallback, and cannot be written as a self-closing custom element in HTML.

This is an exception to the CSS-only package's presentation components: the element owns meaningful behavior. It does not change the `.sensible-ui` scope-root contract; place it beneath a scope root when using the scoped bundle.
