// Focuses the field when people click an icon, text, or empty space in the
// group. Controls, links, and labels keep their own click behavior.
class SensibleInputGroup extends HTMLElement {
  #controller?: AbortController;

  connectedCallback() {
    this.#controller = new AbortController();
    this.addEventListener(
      "click",
      (event) => {
        const target = event.target as Element;
        const control = target.closest(
          "input, textarea, select, button, a, label, [tabindex]",
        );
        // A focusable ancestor outside the group does not count.
        if (control && control !== this && this.contains(control)) return;
        this.querySelector<HTMLElement>(
          ":scope > :is(input, textarea):not(:disabled)",
        )?.focus();
      },
      { signal: this.#controller.signal },
    );
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }
}

if (!customElements.get("sensible-input-group")) {
  customElements.define("sensible-input-group", SensibleInputGroup);
}
