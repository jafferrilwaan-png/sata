const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const input = page.locator('input[placeholder*="Search location, satellite"]').first();
  await input.fill('TELL ME COAMPARE 1952 EGYPT WITH 2026 EGYPT IMAGAE COMPARE IT');
  await page.keyboard.press('Enter');

  console.log('Waiting for "Multi-Temporal" or table to render in chat console...');
  await page.waitForSelector('text=Multi-Temporal', { timeout: 30000 });
  console.log('Found "Multi-Temporal" header in response!');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_121_egypt_comparison_table_rendered.png' });
  await browser.close();
  console.log('Captured completed Egypt comparison table!');
})();
