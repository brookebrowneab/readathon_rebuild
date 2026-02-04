import { test, expect } from '@playwright/test';

const sponsorEmail = process.env.E2E_SPONSOR_EMAIL || '';
const sponsorPassword = process.env.E2E_SPONSOR_PASSWORD || '';
const familyUserId = process.env.E2E_SPONSOR_FAMILY_USER_ID || '';

const loginSponsor = async (page: any) => {
  await page.evaluate(
    async ({ email, password }) => {
      await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
    },
    { email: sponsorEmail, password: sponsorPassword }
  );
};

test('sponsor can pledge and pay', async ({ page }) => {
  if (!sponsorEmail || !sponsorPassword || !familyUserId) {
    test.skip(true, 'Missing E2E sponsor env vars');
  }

  await page.goto('/sponsor');
  await loginSponsor(page);

  await page.goto(`/f/${familyUserId}`);
  await expect(page.getByText('Support This Family')).toBeVisible();

  await page.getByLabel('Amount').fill('10');
  await page.getByRole('button', { name: 'Create Pledges' }).click();

  await expect(page).toHaveURL(/\/sponsor\/pledged/);
  await page.getByRole('button', { name: 'Pay Now' }).click();

  await expect(page).toHaveURL(/\/sponsor\/pay/);
  await page.getByLabel('Email for Receipt').fill('sponsor@example.com');
  await page.getByLabel('Cardholder Name').fill('Test Sponsor');
  await page.getByRole('button', { name: /Pay \$/ }).click();

  await expect(page).toHaveURL(/\/sponsor\/thank-you/);
  await expect(page.getByText('Thank You!')).toBeVisible();
});
