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

// Inline properties set when the script places a tooltip itself.
const placedProperties = [
  "position-area",
  "position-try-fallbacks",
  "inset",
  "margin",
  "left",
  "top",
];

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

// The fallback cannot rely on position-visibility everywhere (Firefox ignores
// it), so its tooltip closes when the control scrolls out of view, including
// out of a scrolling container. Other scrolling leaves it open.
// A control counts as leaving only after it was seen, since keyboard focus
// may still be smooth-scrolling it into view when the tooltip opens.
const seen = new WeakSet<Element>();
const visibility = new IntersectionObserver((entries) => {
  for (const { isIntersecting, target } of entries) {
    if (isIntersecting) seen.add(target);
    else if (seen.has(target) && openTooltip?.firstElementChild === target) {
      openTooltip.hide();
    }
  }
});

// A tooltip the script placed itself does not follow its control, so place it
// again as the page scrolls.
addEventListener("scroll", () => openTooltip?.placeIfMisplaced(), {
  capture: true,
  passive: true,
});

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
    this.placeIfMisplaced();
    visibility.observe(this.firstElementChild!);
  }

  // CSS anchor positioning can still put a tooltip in the wrong place, as
  // Firefox does inside a right-to-left part of a left-to-right page. When
  // the tooltip does not sit next to its control, place it from the
  // control's box instead.
  placeIfMisplaced() {
    const tip = this.#tip;
    if (!tip?.matches(":popover-open")) return;
    for (const property of placedProperties) tip.style.removeProperty(property);
    const anchor = this.firstElementChild!.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    const near = 12;
    const acrossX = box.left < anchor.right && box.right > anchor.left;
    const acrossY = box.top < anchor.bottom && box.bottom > anchor.top;
    const above = box.bottom <= anchor.top + 1 && box.bottom >= anchor.top - near;
    const below = box.top >= anchor.bottom - 1 && box.top <= anchor.bottom + near;
    const before = box.right <= anchor.left + 1 && box.right >= anchor.left - near;
    const after = box.left >= anchor.right - 1 && box.left <= anchor.right + near;
    const onScreen = box.left >= 0 && box.right <= innerWidth;
    if (onScreen && ((acrossX && (above || below)) || (acrossY && (before || after)))) {
      return;
    }

    // Unscaled size, since the opening transition scales the tooltip.
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    const gap = 6;
    const edge = 8;
    const centerX = anchor.left + anchor.width / 2 - width / 2;
    const centerY = anchor.top + anchor.height / 2 - height / 2;
    const spots = {
      top: [centerX, anchor.top - gap - height],
      bottom: [centerX, anchor.bottom + gap],
      left: [anchor.left - gap - width, centerY],
      right: [anchor.right + gap, centerY],
    } as const;
    const side = this.getAttribute("side");
    const order: Array<keyof typeof spots> =
      side === "bottom"
        ? ["bottom", "top"]
        : side === "left"
          ? ["left", "right", "top", "bottom"]
          : side === "right"
            ? ["right", "left", "top", "bottom"]
            : ["top", "bottom"];
    // A side fits when the tooltip has room on that side; the other axis is
    // clamped to the viewport below.
    const fits = (name: keyof typeof spots) => {
      const [x, y] = spots[name];
      return name === "top" || name === "bottom"
        ? y >= edge && y + height <= innerHeight - edge
        : x >= edge && x + width <= innerWidth - edge;
    };
    const [x, y] = spots[order.find(fits) ?? order[0]];
    const clamp = (value: number, max: number) => Math.min(Math.max(value, edge), Math.max(edge, max - edge));
    tip.style.setProperty("position-area", "none");
    tip.style.setProperty("position-try-fallbacks", "none");
    tip.style.setProperty("inset", "auto");
    tip.style.setProperty("margin", "0");
    tip.style.setProperty("left", `${clamp(x, innerWidth - width)}px`);
    tip.style.setProperty("top", `${clamp(y, innerHeight - height)}px`);
  }

  hide() {
    clearTimeout(this.#timer);
    if (this.firstElementChild) {
      visibility.unobserve(this.firstElementChild);
      seen.delete(this.firstElementChild);
    }
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
        if ((event as ToggleEvent).newState !== "open") return coolLater();
        setWarm(true);
        // Native and fallback tooltips can both open, so close the others.
        // toggle fires a task later, so skip it if this one already closed.
        if (!this.open) return;
        for (const other of tooltips) if (other !== this) other.hide();
      },
      { signal },
    );
    // Capture Escape so the tooltip closes before an enclosing dialog.
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape" || !tip.matches(":popover-open")) return;
        event.preventDefault();
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
