import { mergeTests } from '@playwright/test';
import { test as pageObjects } from './pages.ts';
import { test as loggedIn } from './logged-in.ts';
import { test as loginError } from './login-error.ts';
import { test as verifyDashboardItems } from './verify-dashboard-items.ts';
import { test as exportAllProducts } from './extract-all-products.ts';
import { test as verifyProductDetail } from './verify-product-detail.ts';
import { test as verifyShoppingCart } from './verify-shopping-cart.ts';
import { test as globalSetup } from './global-setup.ts';

export const test = mergeTests(
  loggedIn,
  loginError,
  pageObjects,
  verifyDashboardItems,
  exportAllProducts,
  verifyProductDetail,
  verifyShoppingCart,
  globalSetup,
);

export { expect } from '@playwright/test';
