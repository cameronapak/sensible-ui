# Evaluate consumer guidance

Run this when changing the public skill or its integration guidance. Model evaluations are manual, not part of CI. `bun run check:agents` checks deterministic distribution contracts: metadata, links, documented imports, npm packed contents, and development/static document parity. Run `bun run build:docs` and `bun run check:site` first after changing their sources.

## Fresh-consumer comparison

1. Build and pack the local package with scripts disabled. Extract it as `node_modules/@faith-tools/sensible-ui` in two temporary consumer fixtures outside this repository. Do not let either agent read this repository or the other fixture.
2. Give both fixtures the same package metadata, task, existing DESIGN.md, and theme.css. In the baseline fixture remove the package skill directory; leave its README, CSS, and public design guidance available. In the skill fixture install the package's skill with the documented skills CLI. Verify that the agent's catalog lists it and that all three reference files were installed, not just SKILL.md.
3. Give each fresh agent the task below. Expose the skill through its normal metadata or a consumer-owned file pointer in the skill fixture. Do not teach either agent the expected implementation in its prompt. Do not let it inspect the validation checks. Record which files it actually reads.
4. Independently run both outputs in a browser. Record failures before making changes; do not correct an agent's output and count the corrected version as its initial success.

### Seed theme

```css
:root {
  --primary: oklch(0.46 0.13 150);
  --primary-foreground: oklch(0.99 0 0);
  --ring: oklch(0.63 0.12 210);
  --font-sans: "Trebuchet MS", sans-serif;
  --radius: 0.8rem;
}

.dark {
  --primary: oklch(0.78 0.12 150);
  --primary-foreground: oklch(0.18 0.02 150);
}
```

Seed the consumer's DESIGN.md with the requirement to preserve this green brand, font, focus ring, radius, and native host styling. These asymmetric colors distinguish the light theme, dark theme, focus token, and library defaults.

### Task

Build a plain-HTML account settings page using the installed package. Keep a host heading and button outside the styled account region. Inside it, add a responsive card, labelled email field, primary Save button, outline button opening a labelled native modal with Close, independently named tooltip trigger with a description that remains connected without JavaScript, and labelled indeterminate progress. Add a host button toggling a dark ancestor. Preserve existing theme values and DESIGN.md; adapt override selectors where needed. Use only local package files, with no network, new dependencies, or copied component CSS. Do not run the browser yourself; the evaluator checks the output separately.

### Independent acceptance checks

- The consumer loads scoped CSS, not global CSS. Components/layouts are descendants of a neutral boundary; host controls retain native styling.
- The Save button actually renders the supplied light/dark primary and foreground colors, not just custom-property declarations. Font, radius, and ring are preserved. Wait for legitimate color transitions before sampling computed colors.
- Labels and descriptions resolve to existing elements. The progress element omits `value`; its visible label names it.
- The native dialog opens modally, closes with its control, and returns focus to the opener. No invented dialog script export is loaded.
- Keyboard focus opens the visual tooltip; Escape closes it. With JavaScript disabled, the description still resolves and the native field remains usable.
- At 360px the document does not overflow horizontally. Local assets load without HTTP or JavaScript errors.
- Complete OKLCH and HSL colors are accepted; bare legacy HSL channels are not valid CSS colors. Inspect source consumption before claiming other shadcn theme variables work.

Also test a plain global HTML form and a matching-version CDN task when changing those instructions. Test an unrelated Python CSV-parser request against the skill metadata; it should not select Sensible UI. Separate native skill discovery, model selection, document access, and task correctness in the result. An explicit pointer test does not prove implicit activation in every agent.

Report the baseline honestly. If both outputs pass, that establishes usability, not measured superiority or guaranteed activation. Preserve a short result record with the package/CLI versions, prompts, checks, and limitations; delete temporary fixtures when finished.
