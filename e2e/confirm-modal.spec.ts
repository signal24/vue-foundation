import { expect, test } from '@playwright/test';

import { alertLocator, screenshotDir, setupAlertTests } from './helpers';

test.describe('Confirm Modal', () => {
    setupAlertTests();

    test('shows confirm with Confirm/Cancel buttons', async ({ page }) => {
        await page.click('button:has-text("Show Confirm Modal")');
        await page.waitForSelector('.vf-alert');

        await expect(alertLocator(page)).toContainText('Confirm Action');
        await expect(alertLocator(page)).toContainText('Are you sure you want to continue?');
        await expect(page.locator('.vf-alert button:has-text("Confirm")')).toBeVisible();
        await expect(page.locator('.vf-alert button:has-text("Cancel")')).toBeVisible();

        await page.screenshot({ path: `${screenshotDir}/confirm-modal.png` });

        await page.click('.vf-alert button:has-text("Confirm")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(page.locator('#last-result')).toHaveText('Confirm result: true');
    });

    test('cancel returns false', async ({ page }) => {
        await page.click('button:has-text("Show Confirm Modal")');
        await page.waitForSelector('.vf-alert');

        await page.click('.vf-alert button:has-text("Cancel")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(page.locator('#last-result')).toHaveText('Confirm result: false');
    });

    test('confirm destroy has destructive styling', async ({ page }) => {
        await page.click('button:has-text("Show Confirm Destroy Modal")');
        await page.waitForSelector('.vf-alert');

        await expect(page.locator('.vf-alert.destructive')).toBeVisible();
        await expect(alertLocator(page)).toContainText('Delete Item');

        await page.screenshot({ path: `${screenshotDir}/confirm-destroy-modal.png` });

        await page.click('.vf-alert button:has-text("Confirm")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(page.locator('#last-result')).toHaveText('Destroy result: true');
    });
});
