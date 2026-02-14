import { expect, test } from '@playwright/test';

const screenshotDir = 'e2e/screenshots';

test.describe('Smart Select', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('e2e/smart-select');
        await page.waitForSelector('#demo-vf-smart-select');
    });

    test('opens dropdown on input click', async ({ page }) => {
        const input = page.locator('.vf-smart-select input').first();
        await input.click();

        await page.waitForSelector('.vf-smart-select-options');
        await page.screenshot({ path: `${screenshotDir}/smart-select-open.png` });
    });

    test('filters options when typing', async ({ page }) => {
        const input = page.locator('.vf-smart-select input').first();
        await input.click();
        await page.waitForSelector('.vf-smart-select-options');

        // Use pressSequentially to trigger keydown events which enable isSearching
        await input.pressSequentially('Option 10');

        // Should see only "Option 10" since no other label contains "10"
        const options = page.locator('.vf-smart-select-options .option');
        await expect(options).toHaveCount(1);
        await expect(options.first()).toContainText('Option 10');

        await page.screenshot({ path: `${screenshotDir}/smart-select-filtered.png` });
    });

    test('selects option on click', async ({ page }) => {
        const firstSelect = page.locator('.vf-smart-select').first();
        const input = firstSelect.locator('input');
        await input.click();
        await page.waitForSelector('.vf-smart-select-options');

        // Click first option
        await page.locator('.vf-smart-select-options .option').first().click();

        // Dropdown should close
        await expect(page.locator('.vf-smart-select-options')).toHaveCount(0);

        // Input should show selected value
        await expect(input).not.toHaveValue('');
    });

    test('navigates options with arrow keys', async ({ page }) => {
        const input = page.locator('.vf-smart-select input').first();
        await input.click();
        await page.waitForSelector('.vf-smart-select-options');

        // Navigate down
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        // Should have an active/highlighted option
        await expect(page.locator('.vf-smart-select-options .option.highlighted')).toHaveCount(1);

        // Select with Enter
        await page.keyboard.press('Enter');

        // Dropdown should close
        await expect(page.locator('.vf-smart-select-options')).toHaveCount(0);
        await expect(input).not.toHaveValue('');
    });

    test('closes dropdown on Escape', async ({ page }) => {
        const input = page.locator('.vf-smart-select input').first();
        await input.click();
        await page.waitForSelector('.vf-smart-select-options');

        await page.keyboard.press('Escape');
        await expect(page.locator('.vf-smart-select-options')).toHaveCount(0);
    });

    test('shows grouped options', async ({ page }) => {
        // Second select in the demo has groups
        const secondSelect = page.locator('.vf-smart-select').nth(1);
        const input = secondSelect.locator('input');
        await input.click();

        await page.waitForSelector('.vf-smart-select-options');

        // Check for group headers
        const groups = page.locator('.vf-smart-select-options .group');
        const groupCount = await groups.count();
        expect(groupCount).toBeGreaterThan(0);

        await page.screenshot({ path: `${screenshotDir}/smart-select-grouped.png` });
    });
});
