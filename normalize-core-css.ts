const layerOrder =
  /@layer base,\s*typography,\s*components,\s*button,\s*utilities;(?:\n\n)?/

for (const path of [
  "./dist/sensible-ui.css",
  "./dist/sensible-ui.min.css",
]) {
  const css = await Bun.file(path).text()
  await Bun.write(path, css.replace(layerOrder, ""))
}

export {}
