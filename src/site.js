document
  .querySelector("[data-theme-toggle]")
  ?.addEventListener("click", (event) => {
    const dark = document.documentElement.classList.toggle("dark");
    event.currentTarget.textContent = dark ? "Light mode" : "Dark mode";
  });
