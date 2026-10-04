import { defineConfig, devices } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

/** Reuse the Chromium build already present in the Playwright cache instead of downloading one. */
function localChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const cache = path.join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(cache)) return undefined;
  const versions = readdirSync(cache)
    .filter((name) => name.startsWith('chromium-'))
    .sort()
    .reverse();
  for (const version of versions) {
    for (const relative of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
      const candidate = path.join(cache, version, relative);
      if (existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}

const executablePath = localChromium();

/**
 * Browser lane for the learning site. Uses the Chromium build already installed for Playwright
 * (no download step in CI), one worker, no retries, and no video/trace.
 */
export default defineConfig({
  testDir: 'tests/browser',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list']],
  outputDir: '.artifacts/playwright',
  // The site is deployed at a GitHub Pages project sub-path, so the browser lane runs against that
  // exact shape instead of the root. `webServer` serves the current `dist` under the same base the
  // Pages workflow publishes, which removes the stale-hand-started-server evidence gap.
  webServer: {
    command: 'node app/build/serve.mjs 4173 --base physics2',
    url: 'http://127.0.0.1:4173/physics2/',
    reuseExistingServer: false,
    timeout: 20_000,
  },
  use: {
    baseURL: process.env.SITE_URL ?? 'http://localhost:4173/physics2/',
    trace: 'off',
    video: 'off',
    screenshot: 'off',
    locale: 'fa-IR',
    reducedMotion: 'no-preference',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 780 }, isMobile: false },
    },
  ],
});