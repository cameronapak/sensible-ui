document
  .querySelector("[data-theme-toggle]")
  ?.addEventListener("click", (event) => {
    const dark = document.documentElement.classList.toggle("dark");
    event.currentTarget.textContent = dark ? "Light mode" : "Dark mode";
  });

// Keep the docs navigation open as a sidebar on wide screens and collapsed
// behind its summary on narrow screens.
const docsNav = document.querySelector("[data-docs-nav]");
if (docsNav) {
  const wide = matchMedia("(width >= 64rem)");
  const sync = () => {
    docsNav.open = wide.matches;
  };
  sync();
  wide.addEventListener("change", sync);
  docsNav.addEventListener("click", (event) => {
    if (!wide.matches && event.target.closest("a")) docsNav.open = false;
  });
}
