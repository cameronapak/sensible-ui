document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-code]");
  if (!button) return;

  const code = button
    .closest(".docs-example")
    ?.querySelector("pre code")?.textContent;
  if (!code) return;

  const originalLabel = button.textContent;

  try {
    await navigator.clipboard.writeText(code);
    button.textContent = "Copied";
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    button.textContent = copied ? "Copied" : "Copy failed";
  }

  window.setTimeout(() => {
    button.textContent = originalLabel;
  }, 1500);
});
