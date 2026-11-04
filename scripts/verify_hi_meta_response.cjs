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

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  console.log('2. Querying "hi meta"...');
  const searchInput = page.locator('input[placeholder*="Search location"]');
  await searchInput.click();
  await searchInput.fill('hi meta');
  await searchInput.press('Enter');
  await page.waitForTimeout(4000);

  const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_97_hi_meta_live_response.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved ${screenshotPath}`);

  await browser.close();
  console.log('=== VERIFICATION COMPLETED ===');
})();
