import { type Locator, type Page } from '@playwright/test';

export const screenshotDir = 'e2e/screenshots';

/** Navigate to a docs page and wait for VitePress ClientOnly content to hydrate */
export async function gotoDocsPage(page: Page, path: string) {
    await page.goto(path);
    await page.waitForSelector('.demo-preview', { timeout: 10000 });
}

/** Get a demo section by data-testid */
export function demoSection(page: Page, testid: string): Locator {
    return page.locator(`[data-testid="${testid}"]`);
}

/** Get result element within a demo section */
export function demoResult(page: Page, testid: string): Locator {
    return demoSection(page, testid).locator('.result');
}

/** Get the global alert overlay */
export function alertLocator(page: Page): Locator {
    return page.locator('.vf-alert');
}
