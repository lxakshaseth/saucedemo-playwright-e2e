import type { Locator } from '@playwright/test';
import { Labels } from '@/data/index.ts';

export const productItem = (root: Locator) => ({
  name: root.getByTestId('inventory-item-name'),
  description: root.getByTestId('inventory-item-desc'),
  price: root.getByTestId('inventory-item-price'),
  image: root.locator('img.inventory_item_img'),
  addToCartBtn: root.locator(`button:has-text("${Labels.elementLabels['addToCartButton']}")`),
  removeBtn: root.locator(`button:has-text("${Labels.elementLabels['removeButton']}")`),
  quantity: root.getByTestId('item-quantity'),
});