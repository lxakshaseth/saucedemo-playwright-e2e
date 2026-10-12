import { expect, type Page, type Locator } from '@playwright/test';
import { Labels, Colors } from '@/data/index.ts';
import { hexToRgb } from '@/utils/index.ts';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorIcons: Locator;
  readonly errorContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorIcons = page.locator('[data-icon="times-circle"]');
    this.errorContainer = page.locator('.error-message-container.error');
  }

  async openSaucedemoUrl() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL('/');
  }

  async fillInLoginFields(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async verifyPageHeader() {
    await expect.soft(this.page).toHaveTitle(Labels.elementLabels['pageHeader']);
  }

  async clickLoginBtnAndVerifyApi() {
    Promise.all([
      this.page.waitForRequest((req) => req.url().includes(process.env.TOKEN_EP!), { timeout: 10_000 }),
      await this.loginButton.click(),
    ]);
  }

  async verifyLoginPageContent() {
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await expect.soft(this.loginButton).toHaveAttribute('value', Labels.elementLabels['loginButton']);
    await expect.soft(this.loginButton).toHaveCSS('background-color', hexToRgb(Colors.eucalyptus));
  }

  async verifyErrorIconsCount(): Promise<void> {
    await expect(this.errorIcons).toHaveCount(2);
  }

  async verifyErrorbackgroundColor(): Promise<void> {
    await expect(this.errorContainer).toHaveCSS('background-color', hexToRgb(Colors.alizarinCrimson));
  }

  async verifyErrorIconsVisibility(): Promise<void> {
    await expect(this.errorIcons.first()).toBeVisible();
    await expect(this.errorIcons.last()).toBeVisible();
  }
}
