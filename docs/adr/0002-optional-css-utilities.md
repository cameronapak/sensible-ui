# Ship atomic utilities as optional generated CSS

Sensible UI ships atomic layout utilities as an optional stylesheet that does not require consumer-side JavaScript or template scanning. Repetitive utility families are generated with Bun during package development, while named layout recipes remain hand-written in the core bundle.

This keeps the default experience semantic and CSS-only. A separate UnoCSS preset may be considered later, but an on-demand CSS engine is not part of the core package contract.
