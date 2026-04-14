import { test, expect } from '@playwright/test';

test.describe('Study Flow', () => {
  test('shows consent screen on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Study Consent & Setup')).toBeVisible();
    await expect(page.getByLabel('Participant ID')).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
    await expect(page.getByRole('button', { name: /begin study/i })).toBeVisible();
  });

  test('shows validation error without participant ID', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /begin study/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('shows validation error without consent', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Participant ID').fill('P001');
    await page.getByRole('button', { name: /begin study/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('navigates to warmup after consent', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Participant ID').fill('E2E_TEST');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /begin study/i }).click();

    // Should show warmup phase (may take a moment to create session)
    await expect(page.getByText('Warm-up Phase')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/remaining/)).toBeVisible();
  });

  test('progress tracker shows correct steps', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Participant ID').fill('E2E_TEST2');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /begin study/i }).click();

    await expect(page.getByText('Warm-up Phase')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('navigation', { name: 'Study progress' })).toBeVisible();
  });
});
