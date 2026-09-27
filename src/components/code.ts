import { highlight } from "sugar-high";
import { lang } from "sugar-high/lang";

class SensibleCode extends HTMLElement {
  #source?: string;
  #observer?: MutationObserver;

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
    const button = document.createElement("button");
    button.type = "button";
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
    toolbar.append(label, button);
    this.prepend(toolbar);
  }
}

customElements.define("sensible-code", SensibleCode);
