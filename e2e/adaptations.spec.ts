import { test, expect } from '@playwright/test';

test.describe('Adaptations', () => {
  test('raw view loads with adaptive mode', async ({ page }) => {
    await page.goto('/raw?condition=adaptive');
    await expect(page.getByText('Adaptive Accessibility System (Raw View)')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('adaptive')).toBeVisible();
  });

  test('debug panel can be opened', async ({ page }) => {
    await page.goto('/raw?condition=adaptive');
    await expect(page.getByText('Adaptive Accessibility System (Raw View)')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: /debug panel/i }).click();
    await expect(page.getByText('Adaptation Monitor')).toBeVisible();
    await expect(page.getByText('Signals:')).toBeVisible();
    await expect(page.getByText('UI State:')).toBeVisible();
  });

  test('control mode keeps UI static', async ({ page }) => {
    await page.goto('/raw?condition=control');
    await expect(page.getByText('control')).toBeVisible({ timeout: 10000 });
  });
});
