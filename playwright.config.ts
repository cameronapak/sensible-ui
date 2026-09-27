import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  outputDir: '/tmp/sensible-ui-playwright',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
  },
  webServer: {
    command: 'PORT=4173 bun run prod',
    url: 'http://127.0.0.1:4173/scoped/',
    reuseExistingServer: false,
  },
})
