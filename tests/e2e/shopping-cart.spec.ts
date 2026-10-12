import { test, expect } from '@/fixtures/index.ts';
import { Labels, checkoutUserData } from '@/data/index.ts';

test(
  'Succesfully finish shopping with full basket',
  { tag: '@smoke' },
  async ({ loggedIn, dashboardPage, shoppingCart, verifyShoppingCart, verifyProductDetail, productsData }) => {
    await loggedIn.verifyDashboard();
    const products = await dashboardPage.getAllProductItems();
    expect(productsData).toHaveLength(6);

    for (const product of products) {
      await product.addToCartBtn.click();
    }

    await test.step('On cart page', async () => {
      await verifyShoppingCart(6);
      await dashboardPage.clickShoppingBasket();
      await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
      await shoppingCart.countItemsInCart(6);
      await verifyProductDetail(productsData);
      await verifyShoppingCart(6);
      await shoppingCart.cartButtons.checkoutBtn.click();
    });

    await test.step('On checkout page', async () => {
      await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
      await verifyShoppingCart(6);
      await shoppingCart.fillInCheckout(
        checkoutUserData.valid.firstName,
        checkoutUserData.valid.lastName,
        checkoutUserData.valid.zipCode
      );
      await shoppingCart.cartButtons.continueBtn.click();
    });

    await test.step('Finalize order', async () => {
      await verifyShoppingCart(6);
      await shoppingCart.countItemsInCart(6);
      await shoppingCart.assertCartTitle(Labels.shoppingCart['overviewTitle']);
      await verifyProductDetail(productsData);
      await shoppingCart.cartButtons.finishBtn.click();
      await shoppingCart.verifyCompleteOrderPage();
    });
  }
);

test('Checkout information error messages validations', async ({
  loggedIn,
  dashboardPage,
  shoppingCart,
  verifyShoppingCart,
}) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.clickShoppingBasket();
  await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
  await shoppingCart.countItemsInCart(0);
  await verifyShoppingCart(0);
  await shoppingCart.cartButtons.checkoutBtn.click();
  await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);

  await test.step('Verify missing postal code message', async () => {
    await shoppingCart.fillInCheckout(
      checkoutUserData.emptyZipCode.firstName,
      checkoutUserData.emptyZipCode.lastName,
      checkoutUserData.emptyZipCode.zipCode
    );
    await shoppingCart.cartButtons.continueBtn.click();
    await shoppingCart.verifyErrorMessage(Labels.errorMessages['postalCodeRequired']);
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
  });
  await test.step('Verify missing fisrt name message', async () => {
    await shoppingCart.userData.zipCode.fill(checkoutUserData.valid.zipCode);
    await shoppingCart.userData.firstName.clear();
    await shoppingCart.cartButtons.continueBtn.click();
    await shoppingCart.verifyErrorMessage(Labels.errorMessages['firstNameRequired']);
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
  });

  await test.step('Verify missing last name message', async () => {
    await shoppingCart.userData.firstName.fill(checkoutUserData.valid.firstName);
    await shoppingCart.userData.lastName.clear();
    await shoppingCart.cartButtons.continueBtn.click();
    await shoppingCart.verifyErrorMessage(Labels.errorMessages['lastNameRequired']);
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
  });

  await shoppingCart.cartButtons.cancelBtn.click();
  await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
  await shoppingCart.cartButtons.checkoutBtn.click();
  await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);

  await test.step('Verify missing last name message when only first name is filled in', async () => {
    await shoppingCart.userData.firstName.fill(checkoutUserData.valid.firstName);
    await shoppingCart.cartButtons.continueBtn.click();
    await shoppingCart.verifyErrorMessage(Labels.errorMessages['lastNameRequired']);
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
  });
  await test.step('Verify missing first name message when second name and zip code is filled in', async () => {
    await shoppingCart.userData.firstName.clear();
    await shoppingCart.userData.lastName.fill(checkoutUserData.valid.firstName);
    await shoppingCart.userData.zipCode.fill(checkoutUserData.valid.zipCode);
    await shoppingCart.cartButtons.continueBtn.click();
    await shoppingCart.verifyErrorMessage(Labels.errorMessages['firstNameRequired']);
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
  });
});

test('Add and remove items from cart', async ({ loggedIn, dashboardPage, shoppingCart, verifyShoppingCart }) => {
  await loggedIn.verifyDashboard();
  const products = await dashboardPage.getAllProductItems();

  await test.step('Add first 3 items to cart', async () => {
    await products[0].addToCartBtn.click();
    await products[1].addToCartBtn.click();
    await products[2].addToCartBtn.click();
    await verifyShoppingCart(3);
  });

  await test.step('Navigate to cart', async () => {
    await dashboardPage.clickShoppingBasket();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
    await shoppingCart.countItemsInCart(3);
  });

  await test.step('Remove one item from cart', async () => {
    const cartProducts = await shoppingCart.productsItems.all();
    const firstItemRemoveBtn = cartProducts[0].locator(`button:has-text("${Labels.elementLabels['removeButton']}")`);
    await firstItemRemoveBtn.click();
    await shoppingCart.countItemsInCart(2);
    await verifyShoppingCart(2);
  });

  await test.step('Remove second item', async () => {
    const updatedCartProducts = await shoppingCart.productsItems.all();
    const secondItemRemoveBtn = updatedCartProducts[0].locator(
      `button:has-text("${Labels.elementLabels['removeButton']}")`
    );
    await secondItemRemoveBtn.click();
    await shoppingCart.countItemsInCart(1);
    await verifyShoppingCart(1);
  });

  await test.step('Remove last item', async () => {
    const lastCartProduct = await shoppingCart.productsItems.all();
    const lastItemRemoveBtn = lastCartProduct[0].locator(`button:has-text("${Labels.elementLabels['removeButton']}")`);
    await lastItemRemoveBtn.click();
    await shoppingCart.countItemsInCart(0);
    await verifyShoppingCart(0);
  });
});

test('Continue shopping from cart page', async ({ loggedIn, dashboardPage, shoppingCart, verifyShoppingCart }) => {
  await loggedIn.verifyDashboard();
  const products = await dashboardPage.getAllProductItems();

  await test.step('Add 2 items to cart', async () => {
    await products[0].addToCartBtn.click();
    await products[1].addToCartBtn.click();
    await verifyShoppingCart(2);
  });

  await test.step('Go to cart', async () => {
    await dashboardPage.clickShoppingBasket();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
    await shoppingCart.countItemsInCart(2);
  });

  await test.step('Click continue shopping button', async () => {
    await shoppingCart.cartButtons.continueShoppingBtn.click();
    await dashboardPage.verifyDashboard();
    await verifyShoppingCart(2);
  });

  await test.step('Add one more item', async () => {
    await products[2].addToCartBtn.click();
    await verifyShoppingCart(3);
  });

  await test.step('Go back to cart and verify all items are still there', async () => {
    await dashboardPage.clickShoppingBasket();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
    await shoppingCart.countItemsInCart(3);
    await verifyShoppingCart(3);
  });
});

test('Cancel checkout at different stages and verify cart state', async ({
  loggedIn,
  dashboardPage,
  shoppingCart,
  verifyShoppingCart,
}) => {
  await loggedIn.verifyDashboard();
  const products = await dashboardPage.getAllProductItems();

  await test.step('Add 2 items to cart', async () => {
    await products[0].addToCartBtn.click();
    await products[1].addToCartBtn.click();
    await verifyShoppingCart(2);
  });
  await dashboardPage.clickShoppingBasket();
  await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
  await shoppingCart.countItemsInCart(2);

  await test.step('Go to checkout and cancel', async () => {
    await shoppingCart.cartButtons.checkoutBtn.click();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
    await shoppingCart.cartButtons.cancelBtn.click();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
    await shoppingCart.countItemsInCart(2);
    await verifyShoppingCart(2);
  });

  await test.step('Go to checkout, fill in data, then cancel', async () => {
    await shoppingCart.cartButtons.checkoutBtn.click();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
    await shoppingCart.fillInCheckout(
      checkoutUserData.valid.firstName,
      checkoutUserData.valid.lastName,
      checkoutUserData.valid.zipCode
    );
    await shoppingCart.cartButtons.cancelBtn.click();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
    await shoppingCart.countItemsInCart(2);
    await verifyShoppingCart(2);
  });

  await test.step('Complete checkout flow to overview and then cancel', async () => {
    await shoppingCart.cartButtons.checkoutBtn.click();
    await shoppingCart.fillInCheckout(
      checkoutUserData.valid.firstName,
      checkoutUserData.valid.lastName,
      checkoutUserData.valid.zipCode
    );
    await shoppingCart.cartButtons.continueBtn.click();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['overviewTitle']);
    await shoppingCart.countItemsInCart(2);
    await verifyShoppingCart(2);
    await shoppingCart.cartButtons.cancelBtn.click();
    await dashboardPage.verifyDashboard();
    await verifyShoppingCart(2);
  });
});

test('Complete order with single item', async ({
  loggedIn,
  dashboardPage,
  shoppingCart,
  verifyShoppingCart,
  verifyProductDetail,
  productsData,
}) => {
  await loggedIn.verifyDashboard();
  const products = await dashboardPage.getAllProductItems();

  await test.step('Add only one item to cart', async () => {
    await products[3].addToCartBtn.click();
    await verifyShoppingCart(1);
  });

  await test.step('Navigate to cart', async () => {
    await dashboardPage.clickShoppingBasket();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['yourCartTitle']);
    await shoppingCart.countItemsInCart(1);
  });

  const singleProduct = [productsData[3]];
  await verifyProductDetail(singleProduct);

  await test.step('Proceed to checkout', async () => {
    await shoppingCart.cartButtons.checkoutBtn.click();
    await shoppingCart.assertCartTitle(Labels.shoppingCart['checkoutTitle']);
    await shoppingCart.fillInCheckout(
      checkoutUserData.valid.firstName,
      checkoutUserData.valid.lastName,
      checkoutUserData.valid.zipCode
    );
    await shoppingCart.cartButtons.continueBtn.click();
  });

  await test.step('Verify overview', async () => {
    await shoppingCart.assertCartTitle(Labels.shoppingCart['overviewTitle']);
    await shoppingCart.countItemsInCart(1);
    await verifyProductDetail(singleProduct);
    await verifyShoppingCart(1);
  });

  await test.step('Complete order', async () => {
    await shoppingCart.cartButtons.finishBtn.click();
    await shoppingCart.verifyCompleteOrderPage();
  });
});
