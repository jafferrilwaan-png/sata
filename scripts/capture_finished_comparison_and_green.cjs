const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Ask directly in top search:
  console.log('2. Entering: compare temperature of bay of bengal with chennai');
  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('compare temperature of bay of bengal with chennai');
  await page.keyboard.press('Enter');

  // Wait 8 seconds for multi-agent synthesis to complete
  await page.waitForTimeout(8000);

  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_78_comparison_bay_of_bengal_chennai_complete.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (Comparison Completed):', screenshot1);

  // Now ask: make greener this place
  console.log('3. Asking: make greener this place');
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('make greener this place');
  await page.keyboard.press('Enter');

  // Wait 7 seconds
  await page.waitForTimeout(7000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_79_make_greener_complete.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Make Greener Completed):', screenshot2);

  await browser.close();
  console.log('Verification finished successfully!');
})();
