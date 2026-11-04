// Shows a [role="tooltip"] child when people hover, focus, or long-press the
// element's first child. Browsers with interest invokers (interestfor) handle
// the interaction natively; other browsers use the listeners below.
const nativeInterest =
  "interestForElement" in HTMLButtonElement.prototype &&
  "popover" in HTMLElement.prototype;

const showDelay = 500;
const hideDelay = 250;
const touchHold = 500;
const touchLinger = 1500;
// After a tooltip closes, the next one skips the show delay for this long, so
// people can cross the gap between neighboring triggers.
const warmGrace = 300;

let count = 0;
let openTooltip: SensibleTooltip | undefined;
const tooltips = new Set<SensibleTooltip>();

// Once one tooltip is showing, people are reading tooltips, so neighbors show
// without the initial delay until no tooltip has been open for warmGrace.
let warm = false;
let coolTimer: ReturnType<typeof setTimeout> | undefined;

function setWarm(next: boolean) {
  clearTimeout(coolTimer);
  if (warm === next) return;
  warm = next;
  for (const tooltip of tooltips) tooltip.syncDelay();
}

function coolLater() {
  clearTimeout(coolTimer);
  coolTimer = setTimeout(() => {
    if (![...tooltips].some((tooltip) => tooltip.open)) setWarm(false);
  }, warmGrace);
}

class SensibleTooltip extends HTMLElement {
  #controller?: AbortController;
  #observer?: MutationObserver;
  #timer?: ReturnType<typeof setTimeout>;
  #tip?: HTMLElement;
  #nativeTrigger?: HTMLElement;

  get open() {
    return !!this.#tip?.matches(":popover-open");
  }

  // Native interest invokers read their show delay from CSS.
  syncDelay() {
    this.#nativeTrigger?.style.setProperty(
      "interest-delay-start",
      warm ? "0s" : "",
    );
  }

  connectedCallback() {
    if (!this.#wire()) {
      this.#observer = new MutationObserver(() => {
        if (this.#wire()) this.#observer?.disconnect();
      });
      this.#observer.observe(this, { childList: true });
    }
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#controller?.abort();
    this.hide();
    tooltips.delete(this);
  }

  show() {
    clearTimeout(this.#timer);
    if (!this.#tip || this.#tip.matches(":popover-open")) return;
    if (openTooltip !== this) openTooltip?.hide();
    openTooltip = this;
    this.#tip.showPopover();
  }

  hide() {
    clearTimeout(this.#timer);
    if (openTooltip === this) openTooltip = undefined;
    if (this.#tip?.matches(":popover-open")) this.#tip.hidePopover();
  }

  #later(action: () => void, delay: number) {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(action, delay);
  }

  #wire() {
    const tip = this.querySelector<HTMLElement>(':scope > [role="tooltip"]');
    const trigger = this.firstElementChild as HTMLElement | null;
    if (!tip || !trigger || trigger === tip) return false;
    this.#controller?.abort();
    this.#controller = new AbortController();
    this.#tip = tip;

    tip.id ||= `sensible-tooltip-${++count}`;
    const labelledBy = trigger.getAttribute("aria-labelledby")?.split(/\s+/);
    const describedBy = trigger.getAttribute("aria-describedby")?.split(/\s+/) ?? [];
    if (!labelledBy?.includes(tip.id) && !describedBy.includes(tip.id)) {
      trigger.setAttribute("aria-describedby", [...describedBy, tip.id].join(" "));
    }

    const signal = this.#controller.signal;
    tooltips.add(this);
    tip.addEventListener(
      "toggle",
      (event) => {
        if ((event as ToggleEvent).newState === "open") setWarm(true);
        else coolLater();
      },
      { signal },
    );
    // Capture Escape so the tooltip closes before an enclosing dialog.
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape" || !tip.matches(":popover-open")) return;
        event.preventDefault();
        event.stopPropagation();
        this.hide();
        // Dismissing ends the reading session.
        setWarm(false);
      },
      { signal, capture: true },
    );

    if (nativeInterest && trigger.matches("button, a[href]")) {
      tip.popover = "hint";
      trigger.setAttribute("interestfor", tip.id);
      this.#nativeTrigger = trigger;
      this.syncDelay();
      return true;
    }

    tip.popover = "manual";
    const listen = (
      target: EventTarget,
      type: string,
      listener: (event: Event) => void,
    ) => target.addEventListener(type, listener, { signal });

    for (const target of [trigger, tip]) {
      listen(target, "pointerenter", (event) => {
        if ((event as PointerEvent).pointerType === "touch") return;
        if (warm || target === tip || tip.matches(":popover-open")) this.show();
        else this.#later(() => this.show(), showDelay);
      });
      listen(target, "pointerleave", (event) => {
        if ((event as PointerEvent).pointerType === "touch") return;
        this.#later(() => this.hide(), hideDelay);
      });
    }

    listen(trigger, "focusin", () => {
      if (trigger.matches(":focus-visible")) this.show();
    });
    listen(trigger, "focusout", () => this.hide());
    listen(trigger, "pointerdown", (event) => {
      if ((event as PointerEvent).pointerType === "touch") {
        this.#later(() => this.show(), touchHold);
      } else {
        this.hide();
      }
    });
    listen(trigger, "pointerup", (event) => {
      if ((event as PointerEvent).pointerType !== "touch") return;
      if (tip.matches(":popover-open")) this.#later(() => this.hide(), touchLinger);
      else clearTimeout(this.#timer);
    });
    listen(trigger, "pointercancel", () => this.hide());
    return true;
  }
}

if (!customElements.get("sensible-tooltip")) {
  customElements.define("sensible-tooltip", SensibleTooltip);
}
