import { expect, test } from '@playwright/test';

import { alertLocator, demoResult, demoSection, gotoDocsPage, screenshotDir } from './helpers';

test.describe('Alert Modal', () => {
    test.beforeEach(async ({ page }) => {
        await gotoDocsPage(page, 'components/vf-alert-modal');
    });

    test('shows alert with title and message, closes on OK', async ({ page }) => {
        await demoSection(page, 'demo-alert').locator('button').click();
        await page.waitForSelector('.vf-alert');

        await expect(alertLocator(page)).toContainText('Hello!');
        await expect(alertLocator(page)).toContainText('This is an alert dialog.');

        await page.screenshot({ path: `${screenshotDir}/alert-modal-open.png` });

        await page.click('.vf-alert button:has-text("OK")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(demoResult(page, 'demo-alert')).toHaveText('Alert dismissed');
    });

    test('alert stays open on Escape (no closeOnMaskClick)', async ({ page }) => {
        await demoSection(page, 'demo-alert').locator('button').click();
        await page.waitForSelector('.vf-alert');

        await page.keyboard.press('Escape');
        // Alert should remain open
        await expect(alertLocator(page)).toHaveCount(1);

        await page.click('.vf-alert button:has-text("OK")');
        await expect(alertLocator(page)).toHaveCount(0);
    });
});
