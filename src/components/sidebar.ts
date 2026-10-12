import { expect, type Locator, type Page } from '@playwright/test';
import { BaseComponent } from '@/components/base-component.ts';
import { Labels } from '@/data/index.ts';
import { component } from '@/locators/index.ts';

export class SideBar extends BaseComponent {
  readonly openSidebarBurger: Locator;
  readonly closeSidebarBurger: Locator;
  readonly sidebarBurgerItems: Locator;
  readonly allItemsBtn: Locator;
  readonly aboutBtn: Locator;
  readonly logoutBtn: Locator;
  readonly resetAppBtn: Locator;

  constructor(page: Page) {
    super(page, component.sidebar);
    this.openSidebarBurger = page.getByRole('button', { name: /Open Menu/i });
    this.closeSidebarBurger = page.getByRole('button', { name: /Close Menu/i });
    this.sidebarBurgerItems = page.locator('.bm-item-list').locator('a');
    this.allItemsBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['allItems'] });
    this.aboutBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['about'] });
    this.logoutBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['logout'] });
    this.resetAppBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['resetApp'] });
  }

  async clickSidebarBtnAndVerify() {
    await this.openSidebarBurger.click();
    expect(this.expectVisible()).toBeTruthy();
    await expect.soft(this.allItemsBtn).toBeVisible();
    await expect.soft(this.aboutBtn).toBeVisible();
    await expect.soft(this.aboutBtn).toHaveAttribute('href', process.env.ABOUT_URL!);
    await expect.soft(this.logoutBtn).toBeVisible();
    await expect.soft(this.resetAppBtn).toBeVisible();
  }

  async clickAllItemsBtn() {
    await expect(this.allItemsBtn).toBeEnabled();
    await this.allItemsBtn.click();
    await expect(this.root).toBeHidden();
  }

  async clickResetAppBtn() {
    await expect(this.resetAppBtn).toBeEnabled();
    await this.resetAppBtn.click();
  }

  async clickLogoutBtn() {
    await expect(this.logoutBtn).toBeEnabled();
    await this.logoutBtn.click();
  }
}
