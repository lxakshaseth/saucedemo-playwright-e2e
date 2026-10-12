import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '@/pages/index.ts';

type VerifyDashboardProductFixture = {
  verifyDashboardItems: () => Promise<void>;
};

export const test = base.extend<VerifyDashboardProductFixture>({
  verifyDashboardItems: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    const verify = async () => {
      const count = await dashboard.productsItems.count();
      for (let i = 0; i < count; i++) {
        const product = dashboard.getProductItem(i);
        const nameText = await product.name.innerText();
        const descText = await product.description.innerText();
        const src = await product.image.getAttribute('src');
        const addToCartBtn = await product.addToCartBtn.isVisible();

        expect.soft(nameText.trim().length).toBeGreaterThan(10);
        expect.soft(descText.trim().length).toBeGreaterThan(20);
        expect.soft(src).toContain(process.env.DASHBOARD_PICTURE_URL!);
        expect.soft(product.price).toHaveText(/^\$\d+\.\d{2}$/);
        expect.soft(addToCartBtn).toBe(true);
      }
    };
    await use(verify);
  },
});
