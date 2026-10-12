import { test as base, expect } from '@playwright/test';
import { Colors } from '@/data/index.ts';
import { shoppingCart } from '@/locators/index.ts';
import { hexToRgb } from '@/utils/index.ts';

type VerifyShoppingCartFixture = {
  verifyShoppingCart: (items: number) => Promise<void>;
};

export const test = base.extend<VerifyShoppingCartFixture>({
  verifyShoppingCart: async ({ page }, use) => {
    await use(async (items: number) => {
      const cart = shoppingCart(page);
      if (items > 0) {
        await expect(cart.cartBadge).toBeVisible();
        await expect.soft(cart.cartBadge).toHaveCSS('background-color', hexToRgb(Colors.alizarinCrimson));
        await expect.soft(cart.cartLink).toHaveCSS('color', hexToRgb(Colors.darkTeal));
        await expect.soft(cart.cartBadge).toHaveText(String(items), {timeout: 11000});
      } else {
        await expect(cart.cartBadge).toBeHidden();
        await expect.soft(cart.cartLink).toHaveCSS('color', hexToRgb(Colors.darkTeal));
      }
    });
  },
});
