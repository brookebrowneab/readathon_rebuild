import { test, expect } from '@playwright/test';

const parentUserId = process.env.E2E_PARENT_USER_ID || '';
const childId = process.env.E2E_PARENT_CHILD_ID || '';
const parentUsername = process.env.E2E_PARENT_USERNAME || 'testparent';

test('parent can log, edit, and delete reading minutes', async ({ page }) => {
  if (!parentUserId || !childId) {
    test.skip(true, 'Missing E2E_PARENT_USER_ID or E2E_PARENT_CHILD_ID (run backend/tests/resolve_fixture_ids.php)');
  }

  await page.context().setExtraHTTPHeaders({ 'X-Test-User': parentUsername });

  const bookTitle = `Parent Test Book ${Date.now()}`;

  await page.goto(`/log-reading?child=${childId}`);
  await expect(page.getByRole('heading', { name: 'Log Reading' })).toBeVisible();

  await page.getByRole('button', { name: '30 min' }).click();
  await page.getByPlaceholder('Search for a book').fill(bookTitle);
  await page.getByRole('button', { name: 'Add New Book' }).click();
  await page.getByRole('button', { name: 'Log Reading' }).click();

  await expect(page.getByText(bookTitle)).toBeVisible();

  const entry = page.getByText(bookTitle).locator('..');
  await entry.getByRole('button', { name: 'Edit' }).click();

  const updatedTitle = `${bookTitle} Updated`;
  await page.getByRole('button', { name: '45 min' }).click();
  await page.getByPlaceholder('Search for a book').fill(updatedTitle);
  await page.getByRole('button', { name: 'Add New Book' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();

  await expect(page.getByText(updatedTitle)).toBeVisible();

  page.on('dialog', (dialog) => dialog.accept());
  const updatedEntry = page.getByText(updatedTitle).locator('..');
  await updatedEntry.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(updatedTitle)).toBeHidden();
});

test('parent pages visual snapshots', async ({ page }) => {
  if (!parentUserId || !childId) {
    test.skip(true, 'Missing E2E_PARENT_USER_ID or E2E_PARENT_CHILD_ID (run backend/tests/resolve_fixture_ids.php)');
  }

  await page.context().setExtraHTTPHeaders({ 'X-Test-User': parentUsername });

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`/log-reading?child=${childId}`);
  await expect(page.getByRole('heading', { name: 'Log Reading' })).toBeVisible();
  await expect(page).toHaveScreenshot('log-reading-page.png');

  await page.goto(`/children/${childId}`);
  await expect(page.getByRole('heading', { name: /Reading Logs/i })).toBeVisible();
  await expect(page).toHaveScreenshot('child-details-logs.png');
});
