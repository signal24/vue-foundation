import { expect, test } from '@playwright/test';

import { alertLocator, screenshotDir, setupAlertTests } from './helpers';

test.describe('Alert Modal', () => {
    setupAlertTests();

    test('shows alert with title and message, closes on OK', async ({ page }) => {
        await page.click('button:has-text("Show Alert Modal")');
        await page.waitForSelector('.vf-alert');

        await expect(alertLocator(page)).toContainText('Alert Modal');
        await expect(alertLocator(page)).toContainText('This is a simple alert modal.');

        await page.screenshot({ path: `${screenshotDir}/alert-modal-open.png` });

        await page.click('.vf-alert button:has-text("OK")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(page.locator('#last-result')).toHaveText('Alert closed');
    });

    test('alert stays open on Escape (no closeOnMaskClick)', async ({ page }) => {
        await page.click('button:has-text("Show Alert Modal")');
        await page.waitForSelector('.vf-alert');

        await page.keyboard.press('Escape');
        // Alert should remain open
        await expect(alertLocator(page)).toHaveCount(1);

        await page.click('.vf-alert button:has-text("OK")');
        await expect(alertLocator(page)).toHaveCount(0);
    });
});
