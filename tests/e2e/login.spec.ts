import { test, expect } from '@/fixtures/index.ts';
import { Labels, testInputs } from '@/data/index.ts';
import { loadUsers } from '@/data/users.ts';

const { activeUsers, standardUser, lockedUser, nonExistingUser } = loadUsers();

activeUsers.forEach((user) => {
  test.describe('Login successfully with all active users', () => {
    test.use({
      username: user.username,
      password: user.password,
    });
    test(`Login successfully to saucedemo with ${user.username}`, async ({ loggedIn }) => {
      await loggedIn.verifyDashboard();
    });
  });
});

test('Successfull login works', { tag: '@smoke' }, async ({ loginPage, dashboardPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await test.step('Reload login page to verify if all elements reappear correctly', async () => {
    await loginPage.page.reload({ waitUntil: 'networkidle' });
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await loginPage.fillInLoginFields(standardUser.username, standardUser.password);
  await loginPage.loginButton.click();
  await dashboardPage.verifyDashboard();

  await test.step('Reload dashboard to verify if user stay logged in', async () => {
    await loginPage.page.reload({ waitUntil: 'networkidle' });
    await dashboardPage.verifyDashboard();
  });
});

test('Login with missing password or username', async ({ loginPage, loginErrorMsg, dashboardPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
  await loginPage.loginButton.click();
  expect.soft(loginErrorMsg.verifyErrorMessage(Labels.errorMessages['usernameRequired'])).toBe(true);

  await test.step('Login is not possible without password', async () => {
    await loginPage.usernameField.fill(standardUser.username);
    await loginPage.loginButton.click();
    await loginPage.verifyLoginPageContent();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['passwordRequired'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Login is not possible without username', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.fill(standardUser.password);
    await loginPage.loginButton.click();
    await loginPage.verifyLoginPageContent();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['usernameRequired'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Successfull login', async () => {
    await loginPage.usernameField.fill(standardUser.username);
    await loginPage.loginButton.click();
    await dashboardPage.verifyDashboard();
  });
});

test('Locked out and non existing user cannot login', async ({ loginPage, loginErrorMsg }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  test.step('Locked out user cannot login and correct error is displayed', async () => {
    await loginPage.fillInLoginFields(lockedUser.username, lockedUser.password);
    await loginPage.clickLoginBtnAndVerifyApi();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['lockedOutUser'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Try to login without password', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.usernameField.fill(lockedUser.username);
    await loginPage.loginButton.click();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['passwordRequired'])).toBe(true);
  });

  await test.step('Try to login second time with username and password', async () => {
    await loginPage.passwordField.fill(lockedUser.password);
    await loginPage.clickLoginBtnAndVerifyApi();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['lockedOutUser'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Non existing user cannot login', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.fillInLoginFields(nonExistingUser.username, nonExistingUser.password);
    await loginPage.clickLoginBtnAndVerifyApi();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });
});

test('Input special characters to username and password fields', async ({ loginPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await loginPage.usernameField.fill(testInputs.specialCharacters);
  await expect.soft(loginPage.usernameField).toHaveValue(testInputs.specialCharacters);

  await loginPage.passwordField.fill(testInputs.specialCharacters);
  await expect.soft(loginPage.passwordField).toHaveValue(testInputs.specialCharacters);
});

test('SQL injection attempt should not compromise the application', { tag: '@security' }, async ({ loginPage, loginErrorMsg }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await test.step('Attempt SQL injection in username field', async () => {
    await loginPage.usernameField.fill(testInputs.sqlInjection);
    await loginPage.passwordField.fill('password');
    await loginPage.loginButton.click();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
  });

  await test.step('Attempt SQL injection in password field', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.usernameField.fill('testuser');
    await loginPage.passwordField.fill(testInputs.sqlInjection);
    await loginPage.loginButton.click();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
  });

  await test.step('Attempt SQL injection in both fields', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.usernameField.fill(testInputs.sqlInjection);
    await loginPage.passwordField.fill(testInputs.sqlInjection);
    await loginPage.loginButton.click();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
  });

  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
});

test('XSS attack attempt should be safely handled', { tag: '@security' }, async ({ loginPage, loginErrorMsg }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await test.step('Attempt XSS in username field', async () => {
    await loginPage.usernameField.fill(testInputs.xssAttempt);
    await expect.soft(loginPage.usernameField).toHaveValue(testInputs.xssAttempt);
    await loginPage.passwordField.fill('password');
    await loginPage.loginButton.click();
    
    // Verify the application handles the XSS attempt safely
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
  });

  await test.step('Verify no script execution occurred', async () => {
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Attempt XSS in password field', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.usernameField.fill('testuser');
    await loginPage.passwordField.fill(testInputs.xssAttempt);
    await expect.soft(loginPage.passwordField).toHaveValue(testInputs.xssAttempt);
    await loginPage.loginButton.click();
    
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
  });

  // Final verification that page remains functional
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
});

test('Long input strings should be handled gracefully', { tag: '@security' }, async ({ loginPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await test.step('Input very long text in username field', async () => {
    await loginPage.usernameField.fill(testInputs.longText);
    await expect.soft(loginPage.usernameField).toHaveValue(testInputs.longText);
  });

  await test.step('Input very long text in password field', async () => {
    await loginPage.passwordField.fill(testInputs.longText);
    await expect.soft(loginPage.passwordField).toHaveValue(testInputs.longText);
  });

  // Verify page remains stable
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
});
