import { test, expect } from '@/fixtures/index.ts';
import { SortProductsFilter } from '@/data/index.ts';
import { ProductData } from '@/types/index.ts';
import { sortProductData } from '@/utils/index.ts';
import { loadUsers } from '@/data/users.ts';

const EXPECTED_PRODUCT_COUNT = 6;
const { standardUser } = loadUsers();

test(
  'Compare dashboard products with products details',
  { tag: '@smoke' },
  async ({ loggedIn, dashboardPage, productsData, verifyDashboardItems, verifyProductDetail }) => {
    await loggedIn.verifyDashboard();
    await verifyDashboardItems();
    await dashboardPage.countInventory(EXPECTED_PRODUCT_COUNT);
    expect(productsData).toHaveLength(EXPECTED_PRODUCT_COUNT);

    await test.step('Compare data of each product from dashboard to what is displayed in detail', async () => {
      await verifyProductDetail(productsData);
    });
  }
);

test('Sorting of dashboard products with filter', async ({ loggedIn, dashboardPage, productsData }) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.countInventory(EXPECTED_PRODUCT_COUNT);
  expect(productsData).toHaveLength(EXPECTED_PRODUCT_COUNT);

  let defaultData: ProductData[] = productsData;

  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.za);
  defaultData = await sortProductData(SortProductsFilter.za, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.az);
  defaultData = await sortProductData(SortProductsFilter.az, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.highToLow);
  defaultData = await sortProductData(SortProductsFilter.highToLow, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.lowToHigh);
  defaultData = await sortProductData(SortProductsFilter.lowToHigh, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.az);
  defaultData = await sortProductData(SortProductsFilter.az, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.highToLow);
  defaultData = await sortProductData(SortProductsFilter.highToLow, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.az);
  defaultData = await sortProductData(SortProductsFilter.az, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);
});

test('Inventory sidebar buttons', async ({ loggedIn, dashboardPage, verifyDashboardItems, verifyShoppingCart }) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.sidebar.clickSidebarBtnAndVerify();
  await dashboardPage.sidebar.closeSidebarBurger.click();

  const products = await dashboardPage.getAllProductItems();

  await test.step('Verify all items button', async () => {
    for (const product of products) {
      await product.name.click();
      await dashboardPage.sidebar.clickSidebarBtnAndVerify();
      await dashboardPage.sidebar.clickAllItemsBtn();
      await verifyDashboardItems();
    }
  });

  await test.step('Verify reset app button', async () => {
    for (const product of products) {
      await product.addToCartBtn.click();
      await verifyShoppingCart(1);
      await dashboardPage.sidebar.clickSidebarBtnAndVerify();
      await dashboardPage.sidebar.clickResetAppBtn();
      await dashboardPage.sidebar.closeSidebarBurger.click();
      await verifyShoppingCart(0);
    }
  });

  await dashboardPage.page.reload({ waitUntil: 'networkidle' });

  await test.step('Press reset app button when cart is full', async () => {
    for (let i = 0; i < EXPECTED_PRODUCT_COUNT; i++) {
      await products[i].addToCartBtn.click();
      await verifyShoppingCart(i + 1);
    }
    await dashboardPage.sidebar.clickSidebarBtnAndVerify();
    await dashboardPage.sidebar.clickResetAppBtn();
    await verifyShoppingCart(0);
  });
});

test('Logout using sidebar logout button', async ({ loggedIn, loginPage, dashboardPage, verifyShoppingCart }) => {
  await loggedIn.verifyDashboard();

  const products = await dashboardPage.getAllProductItems();
  for (let i = 0; i < EXPECTED_PRODUCT_COUNT; i++) {
    await products[i].addToCartBtn.click();
    await verifyShoppingCart(i + 1);
  }

  await test.step('Login/logout button works', async () => {
    await dashboardPage.sidebar.clickSidebarBtnAndVerify();
    await dashboardPage.sidebar.clickLogoutBtn();

    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();

    await loginPage.fillInLoginFields(standardUser.username, standardUser.password);
    await loginPage.loginButton.click();
    await dashboardPage.verifyDashboard();
  });

  await test.step('Basket stay full after logout/login', async () => {
    await verifyShoppingCart(6);

    await dashboardPage.sidebar.clickSidebarBtnAndVerify();
    await dashboardPage.sidebar.clickResetAppBtn();
    await verifyShoppingCart(0);
  });

  await dashboardPage.sidebar.clickLogoutBtn();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
});

test('Shopping cart indication on dashboard', async ({ loggedIn, dashboardPage, verifyShoppingCart }) => {
  await loggedIn.verifyDashboard();

  const products = await dashboardPage.getAllProductItems();
  for (let i = 0; i < 3; i++) {
    await products[i].addToCartBtn.click();
    await verifyShoppingCart(i + 1);
  }

  await test.step('Add items to cart by dashboard add to cart button', async () => {
    await products[5].addToCartBtn.click();
    await verifyShoppingCart(4);

    await products[1].removeBtn.click();
    await products[2].removeBtn.click();
    await products[3].addToCartBtn.click();
    await verifyShoppingCart(3);

    await products[4].addToCartBtn.click();
    await verifyShoppingCart(4);

    await products[1].addToCartBtn.click();
    await products[2].addToCartBtn.click();
    await products[3].removeBtn.click();
    await products[4].removeBtn.click();
    await verifyShoppingCart(4);
  });

  await test.step('Reset dashboard and cart to its default state', async () => {
    await dashboardPage.sidebar.clickSidebarBtnAndVerify();
    await dashboardPage.sidebar.clickResetAppBtn();
    await dashboardPage.page.reload({ waitUntil: 'networkidle' });
  });

  await dashboardPage.page.reload({ waitUntil: 'networkidle' });

  await test.step('Add items to cart by item detail add to cart button', async () => {
    await products[2].name.click();
    await dashboardPage.productDetail.addToCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await verifyShoppingCart(1);

    await products[3].name.click();
    await dashboardPage.productDetail.addToCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await products[5].name.click();
    await dashboardPage.productDetail.addToCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await verifyShoppingCart(3);

    await products[5].name.click();
    await dashboardPage.productDetail.removeFromCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await products[4].name.click();
    await dashboardPage.productDetail.addToCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await verifyShoppingCart(3);

    await products[3].name.click();
    await dashboardPage.productDetail.removeFromCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await verifyShoppingCart(2);

    await products[0].name.click();
    await dashboardPage.productDetail.addToCart.click();
    await dashboardPage.productDetail.goBackFromItemDetail();
    await verifyShoppingCart(3);
  });
});
