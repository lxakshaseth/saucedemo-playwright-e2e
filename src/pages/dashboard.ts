import { expect, type Page, type Locator } from '@playwright/test';
import { Labels, type FilterOptions} from '@/data/index.ts';
import { component, shoppingCart, productItem} from '@/locators/index.ts';
import { SideBar, ProductDetail } from '@/components/index.ts';
import { ProductData } from '@/types/index.ts';

export class DashboardPage {
  readonly page: Page;
  readonly sidebar: SideBar;
  readonly productDetail: ProductDetail;
  readonly title: Locator;
  readonly shoppingCart: Locator;
  readonly productsTitle: Locator;
  readonly productsItems: Locator;
  readonly productSortFilter: Locator;
  readonly selectedSortFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SideBar(page);
    this.productDetail = new ProductDetail(page);
    this.title = page.locator('.app_logo');
    this.shoppingCart = page.locator('#shopping_cart_container');
    this.productsTitle = page.getByText(Labels.elementLabels['productsTitle']);
    this.productsItems = page.locator(component.inventoryItem),
    this.productSortFilter = page.getByTestId('product-sort-container');
    this.selectedSortFilter = page.getByTestId('active-option');
  }

  async verifyDashboard() {
    await expect.soft(this.title).toHaveText(Labels.elementLabels['pageHeader']);
    await expect.soft(this.shoppingCart).toBeVisible();
    await expect.soft(this.productsTitle).toBeVisible();
    await expect.soft(this.page).toHaveURL(process.env.DASHBOARD_URL!);
  }

  async countInventory(expected: number) {
    return await expect.soft(this.productsItems).toHaveCount(expected);
  }

  async clickShoppingBasket() {
    await shoppingCart(this.page).cartLink.click();
  }

  async selectSortFilter(filterOption: FilterOptions) {
    await this.productSortFilter.selectOption(filterOption.elementAttribute);
    await expect(this.selectedSortFilter).toHaveText(filterOption.label);
  }

  async verifyProductsSorting(expectedProducts: ProductData[]): Promise<void> {
    const count = await this.productsItems.count();
    expect(count).toBe(expectedProducts.length);
    for (let i = 0; i < count; i++) {
      const product = this.getProductItem(i);
      const expectedData = expectedProducts[i];
      await expect.soft(product.name).toHaveText(expectedData.name, { timeout: 7000 });
      await expect.soft(product.description).toHaveText(expectedData.description, { timeout: 7000 });
      await expect.soft(product.price).toHaveText(expectedData.price, { timeout: 7000 });
    }
  }

  async getAllProductItems() {
    const count = await this.productsItems.count();
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(this.getProductItem(i));
    }
    return products;
  }

  getProductItem(index: number) {
    const root = this.productsItems.nth(index);
    return productItem(root);
  }
}
