import { expect, test } from '@playwright/test';

import { demoResult, demoSection, gotoDocsPage, screenshotDir } from './helpers';

test.describe('Overlay Stacking', () => {
    test.beforeEach(async ({ page }) => {
        await gotoDocsPage(page, 'components/vf-alert-modal');
    });

    test('stacked overlays open sequentially', async ({ page }) => {
        await demoSection(page, 'demo-stacking').locator('button').click();
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
        await expect(demoResult(page, 'demo-stacking')).toHaveText('Stacked overlays completed');
    });

    test('wait modal shows and auto-dismisses', async ({ page }) => {
        await demoSection(page, 'demo-wait').locator('button').click();
        await page.waitForSelector('.wait');

        await expect(page.locator('.wait')).toContainText('Processing, please wait...');

        // Wait modal should have no buttons
        await expect(page.locator('.wait .vf-modal-footer')).toHaveCount(0);
        await page.screenshot({ path: `${screenshotDir}/wait-modal.png` });

        // Auto-dismiss after ~2 seconds
        await page.waitForSelector('.wait', { state: 'detached', timeout: 5000 });
    });

    test('mutable wait updates message', async ({ page }) => {
        await demoSection(page, 'demo-mutable-wait').locator('button').click();
        await page.waitForSelector('.wait');

        await expect(page.locator('.wait')).toContainText('Starting...');
        await page.screenshot({ path: `${screenshotDir}/mutable-wait-initial.png` });

        // Wait for message update (first update at 800ms)
        await expect(page.locator('.wait')).toContainText('Step 1 of 3...', { timeout: 3000 });
        await page.screenshot({ path: `${screenshotDir}/mutable-wait-updated.png` });

        // Wait for dismiss (at 3200ms)
        await page.waitForSelector('.wait', { state: 'detached', timeout: 5000 });
    });
});
