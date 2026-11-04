document
  .querySelector("[data-theme-toggle]")
  ?.addEventListener("click", (event) => {
    const dark = document.documentElement.classList.toggle("dark");
    event.currentTarget.setAttribute("aria-pressed", String(dark));
  });

// Show the docs navigation as an open sidebar while it sits beside the
// content. When sensible-sidebar-layout stacks it above the content, collapse
// it behind its summary and close it after a jump.
const docsNav = document.querySelector("[data-docs-nav]");
const layout = docsNav?.closest("sensible-sidebar-layout");
if (docsNav && layout) {
  const summary = docsNav.querySelector(":scope > summary");
  const stacked = () =>
    layout.firstElementChild.offsetLeft === layout.lastElementChild.offsetLeft;
  let wasStacked;
  new ResizeObserver(() => {
    const isStacked = stacked();
    if (isStacked === wasStacked) return;
    wasStacked = isStacked;
    summary.hidden = !isStacked;
    docsNav.open = !isStacked;
  }).observe(layout);
  docsNav.addEventListener("click", (event) => {
    if (wasStacked && event.target.closest("a")) docsNav.open = false;
  });
}
