import { Page, Locator, expect } from '@playwright/test';

export abstract class BaseComponent {
  protected readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.root = page.locator(rootSelector);
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }
}
