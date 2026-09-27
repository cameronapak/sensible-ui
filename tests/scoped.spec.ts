import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('scopes component, root, and theme styles without changing the host page', async ({
  page,
}) => {
  await page.goto('/scoped/')

  const styles = await page.evaluate(() => {
    const computed = (selector: string) =>
      getComputedStyle(document.querySelector(selector)!)

    const outside = computed('#outside')
    const inside = computed('#inside')
    const dark = computed('#inside-dark')

    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="dark"><section class="sensible-ui" id="dark-above"></section></div>
       <section class="sensible-ui"><div class="dark" id="dark-inside"></div></section>`,
    )

    return {
      compatMode: document.compatMode,
      bodyScrollbarGutter: computed('body').scrollbarGutter,
      outsideBoxSizing: outside.boxSizing,
      outsidePrimary: outside.getPropertyValue('--primary').trim(),
      insideBoxSizing: inside.boxSizing,
      insidePrimary: inside.getPropertyValue('--primary').trim(),
      directButtonDisplay: computed('#direct-button').display,
      directButtonHeight: computed('#direct-button').height,
      directCodeBackground: computed('#direct-code').backgroundColor,
      directCodePadding: computed('#direct-code').paddingTop,
      lightBackground: inside.getPropertyValue('--background').trim(),
      darkBackground: dark.getPropertyValue('--background').trim(),
      darkAboveBackground: computed('#dark-above')
        .getPropertyValue('--background')
        .trim(),
      darkInsideBackground: computed('#dark-inside')
        .getPropertyValue('--background')
        .trim(),
    }
  })

  expect(styles.compatMode).toBe('CSS1Compat')
  expect(styles.bodyScrollbarGutter).toBe('auto')
  expect(styles.outsideBoxSizing).toBe('content-box')
  expect(styles.outsidePrimary).toBe('')
  expect(styles.insideBoxSizing).toBe('border-box')
  expect(styles.insidePrimary).not.toBe('')
  expect(styles.directButtonDisplay).toBe('inline-flex')
  expect(styles.directButtonHeight).toBe('36px')
  expect(styles.directCodeBackground).not.toBe('rgba(0, 0, 0, 0)')
  expect(styles.directCodePadding).toBe('2px')
  expect(styles.darkBackground).not.toBe(styles.lightBackground)
  expect(styles.darkAboveBackground).toBe(styles.darkBackground)
  expect(styles.darkInsideBackground).toBe(styles.darkBackground)

  await page.setViewportSize({ width: 375, height: 800 })
  await expect(page.locator('body')).toHaveCSS('padding', '16px')
  await expect(page.locator('#inside > small')).toHaveCSS('display', 'block')
})

test('keeps generated bundle variants and standalone exports equivalent', async ({
  page,
}) => {
  const [readable, minified, button, utilities, global] = await Promise.all([
    readFile('./dist/scoped/sensible-ui.css', 'utf8'),
    readFile('./dist/scoped/sensible-ui.min.css', 'utf8'),
    readFile('./dist/scoped/button.css', 'utf8'),
    readFile('./dist/scoped/utilities.css', 'utf8'),
    readFile('./dist/sensible-ui.css', 'utf8'),
  ])
  const layerOrder = (await readFile('./src/css/theme.css', 'utf8')).match(
    /^@layer [^;]+;/,
  )![0]
  for (const css of [readable, minified, button, utilities]) {
    expect(css).toContain(layerOrder)
  }

  const measureBundle = async (css: string) => {
    await page.setContent(`
      <button id="outside">Outside</button>
      <section class="sensible-ui">
        <button id="inside" data-variant="outline">Inside</button>
        <code id="code">Code</code>
      </section>
    `)
    await page.addStyleTag({
      content: '*, *::before, *::after { transition: none !important; }',
    })
    await page.addStyleTag({ content: css })

    return page.evaluate(() => {
      const style = (selector: string) =>
        getComputedStyle(document.querySelector(selector)!)

      return {
        outsideDisplay: style('#outside').display,
        insideDisplay: style('#inside').display,
        insideHeight: style('#inside').height,
        codePadding: style('#code').paddingTop,
      }
    })
  }

  expect(await measureBundle(minified)).toEqual(await measureBundle(readable))

  const standalone = await measureBundle(button)
  expect(standalone.insideDisplay).toBe('inline-flex')
  expect(standalone.outsideDisplay).not.toBe('inline-flex')

  await page.setContent(`
    <div class="mt-4 size-8" id="outside-utility"></div>
    <section class="sensible-ui mt-4 size-8" id="scope-root">
      <div class="mt-4 size-8" id="inside-utility"></div>
    </section>
  `)
  await page.addStyleTag({ content: utilities })

  await expect(page.locator('#inside-utility')).toHaveCSS('margin-top', '16px')
  await expect(page.locator('#inside-utility')).toHaveCSS('width', '32px')
  await expect(page.locator('#outside-utility')).not.toHaveCSS('width', '32px')
  await expect(page.locator('#scope-root')).not.toHaveCSS('width', '32px')

  await page.setContent('<main>Global mode</main>')
  await page.addStyleTag({ content: global })
  await expect(page.locator('body')).toHaveCSS('scrollbar-gutter', 'stable')
  await expect(page.locator('html')).toHaveCSS('overscroll-behavior', 'none')
})
