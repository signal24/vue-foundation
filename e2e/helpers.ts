import { type Page, test } from '@playwright/test';

export const screenshotDir = 'e2e/screenshots';

export function setupAlertTests() {
    test.beforeEach(async ({ page }) => {
        await page.goto('e2e/alerts');
        await page.waitForSelector('#demo-vf-alert-modal');
    });
}

export function alertLocator(page: Page) {
    return page.locator('.vf-alert');
}
