import { highlight } from "sugar-high";
import { lang } from "sugar-high/lang";

class SensibleCode extends HTMLElement {
  static observedAttributes = ["data-wrap"];

  #source?: string;
  #observer?: MutationObserver;

  attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if ((oldValue === "true") === (newValue === "true")) return;
    const button = this.querySelector<HTMLButtonElement>(
      ":scope > .sensible-code-toolbar .sensible-code-wrap",
    );
    if (button) {
      button.setAttribute("aria-pressed", String(newValue === "true"));
      button.dataset.variant = newValue === "true" ? "primary" : "outline";
    }
    const pre = this.querySelector(":scope > pre");
    if (pre) {
      pre.scrollLeft = 0;
      pre.scrollTop = 0;
    }
  }

  connectedCallback() {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          if (this.isConnected) this.#enhanceOrObserve();
        },
        { once: true },
      );
      return;
    }
    this.#enhanceOrObserve();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
  }

  #enhanceOrObserve() {
    this.#enhance();
    if (this.#source !== undefined) return;
    this.#observer ??= new MutationObserver(() => this.#enhance());
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  #enhance() {
    const textarea = this.querySelector(":scope > textarea");
    if (!textarea || !textarea.textContent) return;

    this.#source ??= textarea.textContent;
    this.#observer?.disconnect();
    const language =
      lang(this.getAttribute("language") ?? "plaintext") ?? "plaintext";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.innerHTML = highlight(this.#source, { lang: language }).replaceAll(
      "\r",
      "&#13;",
    );
    pre.append(code);
    textarea.replaceWith(pre);

    if (this.querySelector(":scope > .sensible-code-toolbar")) return;

    const toolbar = document.createElement("div");
    toolbar.className = "sensible-code-toolbar";
    const label = document.createElement("span");
    label.textContent = language.toUpperCase();
    const actions = document.createElement("div");
    actions.className = "sensible-code-actions";
    const wrapButton = document.createElement("button");
    wrapButton.type = "button";
    wrapButton.dataset.size = "sm";
    wrapButton.dataset.variant =
      this.dataset.wrap === "true" ? "primary" : "outline";
    wrapButton.className = "sensible-code-wrap";
    wrapButton.textContent = "Wrap lines";
    wrapButton.setAttribute(
      "aria-pressed",
      String(this.dataset.wrap === "true"),
    );
    wrapButton.addEventListener("click", () => {
      if (this.dataset.wrap === "true") {
        this.removeAttribute("data-wrap");
      } else {
        this.dataset.wrap = "true";
      }
    });
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.size = "sm";
    button.dataset.variant = "outline";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("aria-live", "polite");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.#source ?? "");
        button.textContent = "Copied";
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = this.#source ?? "";
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        button.textContent = document.execCommand("copy")
          ? "Copied"
          : "Copy failed";
        textarea.remove();
      }
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1500);
    });
    actions.append(wrapButton, button);
    toolbar.append(label, actions);
    this.prepend(toolbar);
  }
}

customElements.define("sensible-code", SensibleCode);
