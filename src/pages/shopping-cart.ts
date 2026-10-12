import { expect, type Page, type Locator } from '@playwright/test';
import * as locators from '@/locators/index.ts';
import { Labels, Colors } from '@/data/index.ts';
import { hexToRgb } from '@/utils/index.ts';

export class ShoppingCart {
  readonly page: Page;
  readonly cartTitle: Locator;
  readonly productsItems: Locator;
  readonly orderCompleted: { header: Locator; fullText: Locator; goHomeButton: Locator };
  readonly userData: { firstName: Locator; lastName: Locator; zipCode: Locator };
  readonly cartButtons: {
    continueShoppingBtn: Locator;
    continueBtn: Locator;
    checkoutBtn: Locator;
    finishBtn: Locator;
    cancelBtn: Locator;
  };
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTitle = this.page.getByTestId('title');
    this.productsItems = this.page.locator(locators.component.inventoryItem);
    this.orderCompleted = locators.completeOrder(this.page);
    this.userData = locators.userCheckoutData(this.page);
    this.cartButtons = locators.cartButtons(this.page);
    this.errorMessage = this.page.locator('.error-message-container.error');
  }

  async assertCartTitle(title: string) {
    await expect(this.cartTitle).toBeVisible();
    await expect(this.cartTitle).toHaveText(`${title}`);
  }

  async countItemsInCart(expected: number) {
    return await expect.soft(this.productsItems).toHaveCount(expected);
  }

  async fillInCheckout(firstName: string = '', lastName: string = '', zipCode: string = ''): Promise<void> {
    if (firstName !== '') {
      await this.userData.firstName.fill(firstName);
    }
    if (lastName !== '') {
      await this.userData.lastName.fill(lastName);
    }
    if (zipCode !== '') {
      await this.userData.zipCode.fill(zipCode);
    }
    await expect(this.userData.firstName).toHaveValue(firstName);
    await expect(this.userData.lastName).toHaveValue(lastName);
    await expect(this.userData.zipCode).toHaveValue(zipCode);
  }

  async verifyCompleteOrderPage() {
    await this.assertCartTitle(Labels.shoppingCart['orderCompleteTitle']);
    await expect.soft(this.orderCompleted.header).toHaveText(Labels.shoppingCart['completeOrder']);
    await expect.soft(this.orderCompleted.fullText).toHaveText(Labels.shoppingCart['completeOrderFullText']);
    await expect.soft(this.orderCompleted.goHomeButton).toBeVisible();
    await expect.soft(this.orderCompleted.goHomeButton).toHaveCSS('background-color', hexToRgb(Colors.eucalyptus));
  }

  async verifyErrorMessage(message: string) {
    await expect.soft(this.errorMessage).toBeAttached();
    await expect.soft(this.errorMessage).toBeVisible();
    await expect.soft(this.errorMessage).toHaveText(message);
    await expect.soft(this.errorMessage).toHaveCSS('background-color', hexToRgb(Colors.alizarinCrimson));
  }
}
