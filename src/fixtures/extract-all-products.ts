import { test as base, type Locator } from '@playwright/test';
import { ProductData } from '@/types/index.ts';
import { DashboardPage } from '@/pages/index.ts';

type ExportProductsFixture = {
  productsData: ProductData[];
};

export const test = base.extend<ExportProductsFixture>({
  productsData: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);

    await dashboard.productsItems.first().waitFor({ state: 'visible', timeout: 10000 });
    const productElements = await dashboard.productsItems.all();

    const products: ProductData[] = await Promise.all(
      productElements.map(async (product: Locator, index: number) => {
        const productItem = dashboard.getProductItem(index);

        const name = await productItem.name.innerText();
        const description = await productItem.description.innerText();
        const price = await productItem.price.innerText();
        const imageSrc = await productItem.image.getAttribute('src');
        return {
          name: name.trim(),
          description: description.trim(),
          price: price.trim(),
          priceValue: parseFloat(price.replace('$', '').trim()),
          imageSrc: imageSrc?.trim(),
        } as ProductData;
      })
    );
    // logAllProductData(products); uncomment for debugging

    await use(products);
  },
});
