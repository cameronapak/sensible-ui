const modules = {
  accordion: "::details-content",
  badge: ".badge {",
  base: "scroll-behavior: smooth",
  button: '[data-size="icon"]',
  card: ".card {",
  "description-list": "dl > dt:has( + dd)",
  image: "figure {",
  input: '[role="switch"]',
  item: ".item {",
  spinner: "sensible-spinner-spin",
  table: "caption-side: bottom",
  typography: "blockquote {",
  utils: ".touch-hitbox",
} as const

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

console.log(`Verified ${Object.keys(modules).length + 1} standalone CSS exports`)

export {}
