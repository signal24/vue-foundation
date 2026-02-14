import { expect, test } from '@playwright/test';

import { screenshotDir, setupAlertTests } from './helpers';

test.describe('Overlay Stacking', () => {
    setupAlertTests();

    test('stacked overlays open sequentially', async ({ page }) => {
        await page.click('button:has-text("Show Stacked Overlays")');
        await page.waitForSelector('.vf-alert');

        // First overlay
        await expect(page.locator('.vf-alert')).toContainText('First Overlay');
        await page.screenshot({ path: `${screenshotDir}/stacked-first.png` });

        // Close first overlay
        await page.click('.vf-alert button:has-text("OK")');

        // Second overlay should appear
        await page.waitForSelector('.vf-alert');
        await expect(page.locator('.vf-alert')).toContainText('Second Overlay');
        await page.screenshot({ path: `${screenshotDir}/stacked-second.png` });

        // Close second overlay
        await page.click('.vf-alert button:has-text("OK")');
        await expect(page.locator('.vf-alert')).toHaveCount(0);
        await expect(page.locator('#last-result')).toHaveText('Stacked closed');
    });

    test('wait modal shows and auto-dismisses', async ({ page }) => {
        await page.click('button:has-text("Show Wait Modal")');
        await page.waitForSelector('.wait');

        await expect(page.locator('.wait')).toContainText('Waiting 1 second...');

        // Wait modal should have no buttons
        await expect(page.locator('.wait .vf-modal-footer')).toHaveCount(0);
        await page.screenshot({ path: `${screenshotDir}/wait-modal.png` });

        // Auto-dismiss after ~1 second
        await page.waitForSelector('.wait', { state: 'detached', timeout: 3000 });
    });

    test('mutable wait updates message', async ({ page }) => {
        await page.click('button:has-text("Show Mutable Wait Modal")');
        await page.waitForSelector('.wait');

        await expect(page.locator('.wait')).toContainText('Waiting 1 second...');
        await page.screenshot({ path: `${screenshotDir}/mutable-wait-initial.png` });

        // Wait for message update
        await expect(page.locator('.wait')).toContainText('Another second...', { timeout: 3000 });
        await page.screenshot({ path: `${screenshotDir}/mutable-wait-updated.png` });

        // Wait for dismiss
        await page.waitForSelector('.wait', { state: 'detached', timeout: 3000 });
    });
});
