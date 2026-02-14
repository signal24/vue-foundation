import { expect, test } from '@playwright/test';

const screenshotDir = 'e2e/screenshots';

test.describe('Alert Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('e2e/alerts');
        await page.waitForSelector('#demo-vf-alert-modal');
    });

    test('shows alert with title and message, closes on OK', async ({ page }) => {
        await page.click('button:has-text("Show Alert Modal")');
        await page.waitForSelector('.vf-alert');

        await expect(page.locator('.vf-alert')).toContainText('Alert Modal');
        await expect(page.locator('.vf-alert')).toContainText('This is a simple alert modal.');

        await page.screenshot({ path: `${screenshotDir}/alert-modal-open.png` });

        await page.click('.vf-alert button:has-text("OK")');
        await expect(page.locator('.vf-alert')).toHaveCount(0);
        await expect(page.locator('#last-result')).toHaveText('Alert closed');
    });

    test('alert stays open on Escape (no closeOnMaskClick)', async ({ page }) => {
        await page.click('button:has-text("Show Alert Modal")');
        await page.waitForSelector('.vf-alert');

        await page.keyboard.press('Escape');
        // Alert should remain open
        await expect(page.locator('.vf-alert')).toHaveCount(1);

        await page.click('.vf-alert button:has-text("OK")');
        await expect(page.locator('.vf-alert')).toHaveCount(0);
    });
});
