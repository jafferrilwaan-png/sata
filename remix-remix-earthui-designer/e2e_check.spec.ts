import { test } from '@playwright/test';

test('check page errors', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message, err.stack));
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
});
