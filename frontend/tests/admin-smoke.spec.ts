import { test, expect } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL || '';
const password = process.env.E2E_ADMIN_PASSWORD || '';

test('admin can access dashboard and core pages', async ({ page }) => {
  if (!email || !password) {
    test.skip(true, 'Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD');
  }

  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

  await page.goto('/admin/reading');
  await expect(page.getByRole('heading', { name: 'Reading Logs' })).toBeVisible();

  await page.goto('/admin/outstanding');
  await expect(page.getByRole('heading', { name: 'Outstanding Payments' })).toBeVisible();

  await page.goto('/admin/checks');
  await expect(page.getByRole('heading', { name: 'Checks' })).toBeVisible();

  await page.goto('/admin-finance');
  await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();
});
