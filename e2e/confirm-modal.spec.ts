import { expect, test } from '@playwright/test';

import { alertLocator, demoResult, demoSection, gotoDocsPage, screenshotDir } from './helpers';

test.describe('Confirm Modal', () => {
    test.beforeEach(async ({ page }) => {
        await gotoDocsPage(page, 'components/vf-alert-modal');
    });

    test('shows confirm with Confirm/Cancel buttons', async ({ page }) => {
        await demoSection(page, 'demo-confirm').locator('button').click();
        await page.waitForSelector('.vf-alert');

        await expect(alertLocator(page)).toContainText('Confirm Action');
        await expect(alertLocator(page)).toContainText('Do you want to proceed?');
        await expect(page.locator('.vf-alert button:has-text("Confirm")')).toBeVisible();
        await expect(page.locator('.vf-alert button:has-text("Cancel")')).toBeVisible();

        await page.screenshot({ path: `${screenshotDir}/confirm-modal.png` });

        await page.click('.vf-alert button:has-text("Confirm")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(demoResult(page, 'demo-confirm')).toHaveText('Confirmed');
    });

    test('cancel returns false', async ({ page }) => {
        await demoSection(page, 'demo-confirm').locator('button').click();
        await page.waitForSelector('.vf-alert');

        await page.click('.vf-alert button:has-text("Cancel")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(demoResult(page, 'demo-confirm')).toHaveText('Cancelled');
    });

    test('confirm destroy has destructive styling', async ({ page }) => {
        await demoSection(page, 'demo-confirm-destroy').locator('button').click();
        await page.waitForSelector('.vf-alert');

        await expect(page.locator('.vf-alert.destructive')).toBeVisible();
        await expect(alertLocator(page)).toContainText('Destructive Action');

        await page.screenshot({ path: `${screenshotDir}/confirm-destroy-modal.png` });

        await page.click('.vf-alert button:has-text("Confirm")');
        await expect(alertLocator(page)).toHaveCount(0);
        await expect(demoResult(page, 'demo-confirm-destroy')).toHaveText('Destroyed');
    });
});
