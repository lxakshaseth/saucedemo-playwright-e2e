import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

if (!process.env.CI) {
  dotenv.config();
}

export default defineConfig({
  timeout: 70 * 1000,
  globalTimeout: 10 * 60 * 1000,
  testDir: './tests',
  testMatch: ['**/e2e/*.ts'],
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright'],
    ['list', { printSteps: true }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: 'https://www.saucedemo.com/',
    testIdAttribute: 'data-test',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    video: 'on-first-retry',
    trace: 'on',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        isMobile: false,
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        isMobile: false,
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        isMobile: false,
      },
    },

    // Mobile emulator
    {
      name: 'mobile chrome',
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium',
        isMobile: true,
        channel: 'chrome',
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        browserName: 'webkit',
        isMobile: true,
      },
    },
  ],
});
