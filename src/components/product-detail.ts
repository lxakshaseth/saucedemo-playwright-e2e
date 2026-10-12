import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@/components/base-component.ts';
import { Labels } from '@/data/index.ts';
import { component } from '@/locators/index.ts';

export class ProductDetail extends BaseComponent {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToCart: Locator;
  readonly removeFromCart: Locator;

  constructor(page: Page) {
    super(page, component.inventoryDetail);
    this.name = page.locator('.inventory_details_name'),
    this.description = page.locator('.inventory_details_desc'),
    this.price = page.locator('.inventory_details_price'),
    this.image = page.locator('img.inventory_details_img'),
    this.addToCart = page.locator(`button:has-text("${Labels.elementLabels['addToCartButton']}")`);
    this.removeFromCart = page.locator(`button:has-text("${Labels.elementLabels['removeButton']}")`);
  }

  async goBackFromItemDetail() {
    await this.page.goBack();
  }

  async productDetailData() {
    return {
      name: await this.name.innerText(),
      description: await this.description.innerText(),
      price: await this.price.innerText(),
      image: await this.image.getAttribute('src'),
      addToCart: await this.addToCart.isVisible(),
      removeFromCart: await this.removeFromCart.isVisible(),
    };
  }
}
