import { test as base } from '@playwright/test';
import { LoginPage, DashboardPage, ShoppingCart } from '@/pages/index.ts';

type PagesFixture = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  shoppingCart: ShoppingCart;
};

export const test = base.extend<PagesFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  shoppingCart: async ({ page }, use) => {
    await use(new ShoppingCart(page));
  },
});
