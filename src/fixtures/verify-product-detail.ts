import { test as base, expect } from '@playwright/test';
import { ProductData } from '@/types/index.ts';
import { DashboardPage } from '@/pages/index.ts';

type VerifyProductDetailFixture = {
  verifyProductDetail: (expectedProducts: ProductData[]) => Promise<void>;
};

export const test = base.extend<VerifyProductDetailFixture>({
  verifyProductDetail: async ({ page }, use) => {
    await use(async (expectedProducts: ProductData[]) => {
      const dashboardPage = new DashboardPage(page);

      const count = await dashboardPage.productsItems.count();
      for (let i = 0; i < count; i++) {
        const productItem = dashboardPage.getProductItem(i);
        const expectedData = expectedProducts[i];
        await productItem.name.click();

        // On product detail
        const detail = await dashboardPage.productDetail.productDetailData();
        await dashboardPage.productDetail.expectVisible();
        expect.soft(detail.name).toBe(expectedData.name);
        expect.soft(detail.description).toBe(expectedData.description);
        expect.soft(detail.price).toBe(expectedData.price);
        expect.soft(detail.image).toBe(expectedData.imageSrc);
        expect.soft(detail.addToCart||detail.removeFromCart).toBe(true);
        await dashboardPage.productDetail.goBackFromItemDetail();

        // On dashboard page
        await expect(dashboardPage.title).toBeVisible();
      }
    });
  },
});
