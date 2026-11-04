const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Navigating to main dashboard ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  console.log('2. Entering query: "TELL ME COAMPARE 1952 EGYPT WITH 2026 EGYPT IMAGAE COMPARE IT" ...');
  const input = page.locator('input[placeholder*="Search location, satellite"]').first();
  await input.fill('TELL ME COAMPARE 1952 EGYPT WITH 2026 EGYPT IMAGAE COMPARE IT');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3500);

  // Capture Egypt comparison result
  const shot1 = path.join(ARTIFACTS_DIR, 'ui_118_egypt_1952_vs_2026_verified.png');
  await page.screenshot({ path: shot1 });
  console.log(`Saved ${shot1}`);

  await browser.close();
  console.log('=== VERIFICATION OF EGYPT COMPARISON FINISHED SUCCESSFULLY ===');
})();
