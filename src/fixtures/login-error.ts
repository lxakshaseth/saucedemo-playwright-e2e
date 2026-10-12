import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@/pages/index.ts';

type LoginErrorFixture = {
  loginErrorMsg: {
    verifyErrorMessage: (text: string) => Promise<boolean>;
  };
};

export const test = base.extend<LoginErrorFixture>({
  loginErrorMsg: async ({ page }, use) => {
    const loginErrorPage = new LoginPage(page);
    await use({
      verifyErrorMessage: async (text: string) => {
        try {
          await expect.soft(page.getByText(text)).toBeVisible();
          await loginErrorPage.verifyErrorIconsCount();
          await loginErrorPage.verifyErrorIconsVisibility();
          await loginErrorPage.verifyErrorbackgroundColor();
          return true;
        } catch {
          return false;
        }
      },
    });
  },
});
