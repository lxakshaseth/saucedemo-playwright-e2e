import type { Page } from '@playwright/test';
import { Labels } from '@/data/index.ts';

export const shoppingCart = (page: Page) => ({
  cartLink: page.getByTestId('shopping-cart-link'),
  cartBadge: page.getByTestId('shopping-cart-badge'),
});

export const component = {
  inventoryItem: '[data-test="inventory-item"]',
  inventoryDetail: '[class="inventory_details"]',
  sidebar: '[class="bm-item-list"]',
};

export const userCheckoutData = (page: Page) => ({
  firstName: page.getByTestId('firstName'),
  lastName: page.getByTestId('lastName'),
  zipCode: page.getByTestId('postalCode'),
});

export const completeOrder = (page: Page) => ({
  header: page.locator('.complete-header'),
  fullText: page.locator('.complete-text'),
  goHomeButton: page.getByRole('button', { name: Labels.shoppingCart['goHomeBtn'] }),
});
