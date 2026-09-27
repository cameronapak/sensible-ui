import { describe, expect, test } from 'bun:test'
import { scopeCss } from './build-scoped-css.ts'

describe('scopeCss', () => {
  test('wraps CSS without rewriting its contents', () => {
    const css = `@keyframes spin { to { rotate: 360deg; } }
a[href="/?one=1&two=2"]::after { content: "Tom & Jerry"; }`
    const output = scopeCss(css)

    expect(output.trimStart()).toStartWith('@layer sensible-ui {')
    expect(output).toContain('@scope (.sensible-ui)')
    expect(output).toContain(css)
  })

  test('keeps dark ancestor conditions on the styled subject', async () => {
    const glob = new Bun.Glob('*.css')
    const invalid: string[] = []

    for await (const path of glob.scan('./src/css')) {
      const css = await Bun.file(`./src/css/${path}`).text()
      if (/\.dark\s+&/.test(css)) invalid.push(path)
    }

    expect(invalid).toEqual([])
  })
})
