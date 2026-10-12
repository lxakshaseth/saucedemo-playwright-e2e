import { test as base } from '@playwright/test';

interface TestSetupFixtures {
  testSetup: void;
}

interface WorkerFixtures {
  workerCleanup: void;
}

export const test = base.extend<TestSetupFixtures, WorkerFixtures>({
  workerCleanup: [
    async ({}, use) => {
      await use();
      console.log('Worker cleanup completed');
    },
    { scope: 'worker', auto: true },
  ],

  testSetup: [
    async ({ page }, use) => {
      await page.context().clearCookies();
      try {
        if (page.url() !== 'about:blank') {
          await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
          });
        }
      } catch (error) {
        console.warn('Could not clear storage:', error);
      }

      await use();
    },
    { auto: true },
  ],
});
