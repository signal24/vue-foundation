import { expect, test } from '@playwright/test';

import { demoSection, gotoDocsPage, screenshotDir } from './helpers';

test.describe('Toast', () => {
    test.beforeEach(async ({ page }) => {
        await gotoDocsPage(page, 'components/toast');
    });

    test('shows toast notification', async ({ page }) => {
        await demoSection(page, 'demo-toast').locator('[data-testid="toast-bottom"]').click();
        await page.waitForSelector('.vf-toast');

        await expect(page.locator('.vf-toast')).toContainText('Item saved successfully!');
        await page.screenshot({ path: `${screenshotDir}/toast-notification.png` });
    });

    test('toast auto-dismisses after duration', async ({ page }) => {
        await demoSection(page, 'demo-toast').locator('[data-testid="toast-bottom"]').click();
        await page.waitForSelector('.vf-toast');

        // Toast has 3 second duration
        await page.waitForSelector('.vf-toast', { state: 'detached', timeout: 5000 });
    });

    test('toast can be manually closed', async ({ page }) => {
        await demoSection(page, 'demo-toast').locator('[data-testid="toast-bottom"]').click();
        await page.waitForSelector('.vf-toast');

        await page.click('.vf-toast .close');
        await expect(page.locator('.vf-toast')).toHaveCount(0);
    });

    test('shows toast at top position', async ({ page }) => {
        await demoSection(page, 'demo-toast').locator('[data-testid="toast-top"]').click();
        await page.waitForSelector('.vf-toast');

        await expect(page.locator('.vf-toast')).toContainText('New notification received');
        await page.screenshot({ path: `${screenshotDir}/toast-top.png` });
    });

    test('persistent toast stays until closed', async ({ page }) => {
        await demoSection(page, 'demo-toast').locator('[data-testid="toast-persistent"]').click();
        await page.waitForSelector('.vf-toast');

        await expect(page.locator('.vf-toast')).toContainText('This toast stays until you close it');
        await page.screenshot({ path: `${screenshotDir}/toast-persistent.png` });

        // Close it manually
        await page.click('.vf-toast .close');
        await expect(page.locator('.vf-toast')).toHaveCount(0);
    });
});
