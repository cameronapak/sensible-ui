const scenarios = [
  ["Empty source", "", "720px"],
  ["One word", "Save", "720px"],
  ["Typical HTML", '<button type="button">Save</button>', "720px"],
  [
    "Several lines",
    "<article>\n  <h1>Updates</h1>\n  <p>First sentence. Second sentence.</p>\n</article>",
    "720px",
  ],
  [
    "One unbreakable line",
    `<a href="/${"long-path/".repeat(24)}">Read</a>`,
    "720px",
  ],
  ["Emoji and diacritics", "const café = '👩🏽‍💻 Sélection नमस्ते';", "720px"],
  ["RTL and mixed direction", "مرحبا <button>Save</button> שלום 123", "720px"],
  ["Numbers in columns", "12  123.45\n123  45.67", "720px"],
  ["320px container", '<button type="button">Save changes</button>', "320px"],
  [
    "Squeezed container",
    "const filename = 'a-really-long-asset-name-without-a-break.js';",
    "240px",
  ],
  ["Wide container", '<button type="button">Save changes</button>', "1100px"],
] as const;

export function CodeBreak() {
  return (
    <main class="docs-page container stack">
      <h1>Sensible code stress cases</h1>
      {scenarios.map(([label, source, width]) => (
        <section>
          <h2>{label}</h2>
          {label === "Empty source" && (
            <p>Break: blank panel without a language label or Copy button.</p>
          )}
          <div style={`width: ${width}; max-width: 100%`}>
            <sensible-code language="html">
              <textarea readonly>{source}</textarea>
            </sensible-code>
          </div>
        </section>
      ))}
    </main>
  );
}
