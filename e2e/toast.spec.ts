import { expect, test } from '@playwright/test';

const screenshotDir = 'e2e/screenshots';

test.describe('Toast', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.selectOption('select', 'VfAlertModal');
        await page.waitForSelector('#demo-vf-alert-modal');
    });

    test('shows toast notification', async ({ page }) => {
        await page.click('button:has-text("Show Toast")');
        await page.waitForSelector('.vf-toast');

        await expect(page.locator('.vf-toast')).toContainText('Saved successfully!');
        await page.screenshot({ path: `${screenshotDir}/toast-notification.png` });
    });

    test('toast auto-dismisses after duration', async ({ page }) => {
        await page.click('button:has-text("Show Toast")');
        await page.waitForSelector('.vf-toast');

        // Toast has 3 second duration
        await page.waitForSelector('.vf-toast', { state: 'detached', timeout: 5000 });
    });

    test('toast can be manually closed', async ({ page }) => {
        await page.click('button:has-text("Show Toast")');
        await page.waitForSelector('.vf-toast');

        await page.click('.vf-toast .close');
        await expect(page.locator('.vf-toast')).toHaveCount(0);
    });
});
