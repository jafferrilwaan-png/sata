const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Rotate globe slightly or capture home view
  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_84_home_transparent_glass.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (Home View Ultra-Transparent Glass):', screenshot1);

  // Now execute a search: "India"
  console.log('2. Entering: India in top search bar...');
  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('India');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_85_console_transparent_glass.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Console Transparent Glass):', screenshot2);

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
