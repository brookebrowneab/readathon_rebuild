import { test, expect } from '@playwright/test';

const teacherUsername = process.env.E2E_TEACHER_USERNAME || '';
const studentId = process.env.E2E_TEACHER_STUDENT_ID || '';

test('teacher can log minutes for roster student', async ({ page }) => {
  if (!teacherUsername || !studentId) {
    test.skip(true, 'Missing E2E_TEACHER_USERNAME or E2E_TEACHER_STUDENT_ID');
  }

  await page.addInitScript((username) => {
    (window as any).__TEST_TEACHER_USERNAME = username;
  }, teacherUsername);

  await page.goto('/teacher/log');
  await expect(page.getByText('Log Reading')).toBeVisible();

  await page.getByPlaceholder('Classroom read-aloud, silent reading...').fill('Class read time');
  await page.getByRole('button', { name: 'Log Reading' }).click();

  await expect(page.getByText(/Logged reading for/)).toBeVisible();
});
