import { watch } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { format } from 'prettier'

export const scopeClass = 'sensible-ui'

export const scopedEntries = {
  'sensible-ui': './src/css/index.css',
  accordion: './src/css/entries/accordion.css',
  badge: './src/css/entries/badge.css',
  base: './src/css/entries/base.css',
  button: './src/css/entries/button.css',
  card: './src/css/entries/card.css',
  dialog: './src/css/entries/dialog.css',
  'description-list': './src/css/entries/description-list.css',
  image: './src/css/entries/image.css',
  input: './src/css/entries/input.css',
  item: './src/css/entries/item.css',
  spinner: './src/css/entries/spinner.css',
  table: './src/css/entries/table.css',
  theme: './src/css/theme.css',
  typography: './src/css/entries/typography.css',
  utilities: './src/css/entries/utilities.css',
  utils: './src/css/entries/utils.css',
} as const

export function scopeCss(css: string) {
  return `@layer ${scopeClass} {
    @scope (.${scopeClass}) {
      ${css}
    }
  }`
}

async function bundle(entrypoint: string, minify = false) {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    target: 'browser',
    minify,
  })

  if (!result.success) {
    throw new AggregateError(result.logs, `Failed to bundle ${entrypoint}`)
  }

  return result.outputs[0].text()
}

export async function buildScopedCss() {
  await rm('./dist/scoped', { recursive: true, force: true })
  await mkdir('./dist/scoped', { recursive: true })
  const layerOrder = (await Bun.file('./src/css/theme.css').text()).match(
    /^@layer [^;]+;/,
  )?.[0]
  const withLayerOrder = (css: string) =>
    layerOrder && !css.includes(layerOrder) ? `${layerOrder}\n${css}` : css

  for (const [name, entrypoint] of Object.entries(scopedEntries)) {
    const scoped = scopeCss(withLayerOrder(await bundle(entrypoint)))
    const readable = await format(scoped, { parser: 'css' })
    await Bun.write(`./dist/scoped/${name}.css`, readable)

    if (name === 'sensible-ui' || name === 'utilities') {
      const minified = scopeCss(withLayerOrder(await bundle(entrypoint, true)))
      await Bun.write(`./dist/scoped/${name}.min.css`, minified)
    }
  }
}

async function watchScopedCss() {
  let building = false
  let dirty = true
  let timeout: ReturnType<typeof setTimeout> | undefined

  const rebuild = async () => {
    if (building) return
    building = true
    try {
      do {
        dirty = false
        await buildScopedCss()
        console.log('Rebuilt scoped CSS')
      } while (dirty)
    } finally {
      building = false
    }
  }

  watch('./src/css', { recursive: true }, () => {
    dirty = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      void rebuild().catch((error) => console.error(error))
    }, 50)
  })
  await rebuild()
  console.log('Watching scoped CSS sources')
}

if (import.meta.main) {
  if (Bun.argv.includes('--watch')) await watchScopedCss()
  else await buildScopedCss()
}
