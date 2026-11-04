import { scopedEntries } from "./build-scoped-css.ts"

const modules = {
  accordion: "::details-content",
  badge: ".badge {",
  base: "scroll-behavior: smooth",
  button: '[data-size="icon"]',
  "button-group": "sensible-button-group",
  card: ".card {",
  dialog: "dialog {",
  "description-list": "dl > dt:has( + dd)",
  image: "figure {",
  input: '[role="switch"]',
  "input-group": "sensible-input-group",
  item: ".item {",
  navigation: "sensible-sidebar-layout",
  progress: "sensible-progress-indeterminate",
  spinner: "sensible-spinner-spin",
  table: "caption-side: bottom",
  tooltip: "sensible-tooltip",
  typography: "blockquote {",
  utils: ".touch-hitbox",
} as const

// Bun copies :is() into :-webkit-any() and :-moz-any() fallbacks. Inside a
// forgiving :where() or :is(), WebKit recovers from the unknown copy by
// keeping the middle items of its list, so `:where(x > :-moz-any(a, b, c))`
// styles every `b` on the page. Write those selectors as plain lists instead.
function assertForgivingSelectorsSurvive(css: string, label: string) {
  const enclosing: string[] = []
  for (const match of css.matchAll(/(:[-\w]+)?\(|\)/g)) {
    if (match[0] === ")") {
      enclosing.pop()
      continue
    }
    const name = match[1] ?? ""
    if (
      /^:-(?:moz|webkit)-any$/.test(name) &&
      /^:(?:where|is)$/.test(enclosing.at(-1) ?? "")
    ) {
      const index = match.index ?? 0
      throw new Error(
        `${label} nests a vendor :is() fallback in a forgiving selector: ${css
          .slice(Math.max(0, index - 60), index + 40)
          .replace(/\s+/g, " ")}`,
      )
    }
    enclosing.push(name)
  }
  // Bun drops invalid items, such as pseudo-elements, from a forgiving list
  // and can leave it empty, which silently removes the rule.
  const empty = css.match(/:(?:where|is)\(\s*\)/)
  if (empty) {
    const index = empty.index ?? 0
    throw new Error(
      `${label} has an empty forgiving selector: ${css
        .slice(Math.max(0, index - 60), index + 40)
        .replace(/\s+/g, " ")}`,
    )
  }
}

const layerOrder = "@layer base, typography, components, button, utilities;"
const theme = await Bun.file("./src/css/theme.css").text()
if (!theme.includes(layerOrder)) {
  throw new Error("The theme is missing the public cascade layer order")
}

for (const [name, moduleMarker] of Object.entries(modules)) {
  const entry = await Bun.file(`./src/css/entries/${name}.css`).text()
  const imports = ['@import "../theme.css";', '@import "../base.css";']
  if (name !== "base") {
    imports.push(`@import "../${name}.css";`)
  }

  for (const dependency of imports) {
    if (!entry.includes(dependency)) {
      throw new Error(`The ${name} export is missing ${dependency}`)
    }
  }

  const result = await Bun.build({
    entrypoints: [`./src/css/entries/${name}.css`],
    target: "browser",
  })

  if (!result.success) {
    throw new AggregateError(result.logs, `Failed to build the ${name} export`)
  }

  const css = await result.outputs[0].text()
  assertForgivingSelectorsSurvive(css, `The ${name} export`)
  for (const marker of [
    "--primary:",
    "scroll-behavior: smooth",
    moduleMarker,
  ]) {
    if (!css.includes(marker)) {
      throw new Error(`The ${name} export is missing ${JSON.stringify(marker)}`)
    }
  }
}

const utilitiesEntry = await Bun.file("./src/css/entries/utilities.css").text()
if (!utilitiesEntry.includes('@import "../generated/utilities.css";')) {
  throw new Error("The utilities export is missing its generated stylesheet")
}

const utilitiesResult = await Bun.build({
  entrypoints: ["./src/css/entries/utilities.css"],
  target: "browser",
})
if (!utilitiesResult.success) {
  throw new AggregateError(
    utilitiesResult.logs,
    "Failed to build the utilities export",
  )
}

const utilitiesCss = await utilitiesResult.outputs[0].text()
for (const marker of ["--space-1:", ".mt-1 {", ".size-8 {"]) {
  if (!utilitiesCss.includes(marker)) {
    throw new Error(`The utilities export is missing ${JSON.stringify(marker)}`)
  }
}

const scopedMarkers = {
  ...modules,
  "description-list": "dl > dt:has(+ dd)",
  "sensible-ui": ".card {",
  theme: "--primary:",
  utilities: ".mt-1",
} as const satisfies Record<keyof typeof scopedEntries, string>

for (const name of Object.keys(scopedEntries) as Array<
  keyof typeof scopedEntries
>) {
  const moduleMarker = scopedMarkers[name]
  const path = `./dist/scoped/${name}.css`
  const file = Bun.file(path)
  if (!(await file.exists())) {
    throw new Error(`The scoped ${name} export is missing ${path}`)
  }

  const css = await file.text()
  for (const marker of [
    "@layer sensible-ui",
    "@scope (.sensible-ui)",
    moduleMarker,
  ]) {
    if (!css.includes(marker)) {
      throw new Error(
        `The scoped ${name} export is missing ${JSON.stringify(marker)}`,
      )
    }
  }
  if (!css.includes(":where(:scope)")) {
    throw new Error(`The scoped ${name} export is missing scope-root defaults`)
  }
}

const packageJson = (await Bun.file("./package.json").json()) as {
  exports: Record<string, string>
}

for (const [subpath, target] of Object.entries(packageJson.exports)) {
  if (!(await Bun.file(target).exists())) {
    throw new Error(`The ${subpath} package export points to missing ${target}`)
  }
}

const expectedScopedExports: Record<string, string> = {
  "./scoped": "./dist/scoped/sensible-ui.css",
  "./scoped/css": "./dist/scoped/sensible-ui.css",
  "./scoped/index": "./dist/scoped/sensible-ui.css",
  "./scoped/min": "./dist/scoped/sensible-ui.min.css",
  "./scoped/utilities/min": "./dist/scoped/utilities.min.css",
}

for (const name of Object.keys(scopedEntries)) {
  if (name !== "sensible-ui") {
    expectedScopedExports[`./scoped/${name}`] = `./dist/scoped/${name}.css`
  }
}

for (const [subpath, target] of Object.entries(expectedScopedExports)) {
  if (packageJson.exports[subpath] !== target) {
    throw new Error(
      `The ${subpath} package export must point to ${target}, received ${packageJson.exports[subpath] ?? "nothing"}`,
    )
  }
}

const actualScopedExports = Object.keys(packageJson.exports).filter(
  (subpath) => subpath === "./scoped" || subpath.startsWith("./scoped/"),
)
for (const subpath of actualScopedExports) {
  if (!(subpath in expectedScopedExports)) {
    throw new Error(`Unexpected scoped package export ${subpath}`)
  }
}

for (const name of ["sensible-ui", "utilities"]) {
  if (!(await Bun.file(`./dist/scoped/${name}.min.css`).exists())) {
    throw new Error(`The minified scoped ${name} export is missing`)
  }
}

const expectedScopedFiles = new Set([
  ...Object.keys(scopedEntries).map((name) => `${name}.css`),
  "sensible-ui.min.css",
  "utilities.min.css",
])
for await (const file of new Bun.Glob("*.css").scan("./dist/scoped")) {
  if (!expectedScopedFiles.has(file)) {
    throw new Error(`Unexpected generated scoped stylesheet ${file}`)
  }
}

for (const pattern of ["dist/*.css", "dist/scoped/*.css"]) {
  for await (const path of new Bun.Glob(pattern).scan(".")) {
    assertForgivingSelectorsSurvive(await Bun.file(path).text(), path)
  }
}

console.log(
  `Verified ${Object.keys(modules).length + 1} global and ${Object.keys(scopedEntries).length} scoped CSS exports`,
)

export {}
