import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('shows passphrase form', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Researcher Dashboard')).toBeVisible();
    await expect(page.getByLabel('Enter passphrase')).toBeVisible();
  });

  test('authenticates with correct passphrase', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByLabel('Enter passphrase').fill('ale-researcher-2024');
    await page.getByRole('button', { name: /enter/i }).click();
    await expect(page.getByText('Sessions')).toBeVisible({ timeout: 5000 });
  });

  test('does not authenticate with wrong passphrase', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByLabel('Enter passphrase').fill('wrong');
    await page.getByRole('button', { name: /enter/i }).click();
    // Should still show passphrase form
    await expect(page.getByLabel('Enter passphrase')).toBeVisible();
  });
});
