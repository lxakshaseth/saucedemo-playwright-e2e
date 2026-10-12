import type { Page } from '@playwright/test';

export const cartButtons = (page: Page) => ({
  continueShoppingBtn: page.getByTestId('continue-shopping'),
  continueBtn: page.getByTestId('continue'),
  checkoutBtn: page.getByTestId('checkout'),
  finishBtn: page.getByTestId('finish'),
  cancelBtn: page.getByTestId('cancel'),
});
