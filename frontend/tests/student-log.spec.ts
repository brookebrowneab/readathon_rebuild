import { test, expect } from '@playwright/test';

const username = process.env.E2E_STUDENT_USERNAME || '';
const password = process.env.E2E_STUDENT_PASSWORD || '';

test('student can log reading minutes', async ({ page }) => {
  if (!username || !password) {
    test.skip(true, 'Missing E2E_STUDENT_USERNAME or E2E_STUDENT_PASSWORD');
  }

  await page.goto('/student/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Start Reading!' }).click();

  await expect(page).toHaveURL(/\/student\/log/);

  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('Search for a book').fill('Test Book');
  await page.getByRole('button', { name: 'Add New Book' }).click();
  await page.getByRole('button', { name: 'Log Reading' }).click();

  await expect(page.getByText('20 minutes')).toBeVisible();
  await expect(page.getByText('Test Book')).toBeVisible();
});
