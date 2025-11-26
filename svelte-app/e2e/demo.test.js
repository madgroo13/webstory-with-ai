import { expect, test } from '@playwright/test';

test('setup screen has expected h2', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h2', { hasText: 'SETUP DUNIA' })).toBeVisible();
});
