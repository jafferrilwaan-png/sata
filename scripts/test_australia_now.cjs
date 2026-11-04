const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Rotate globe or point to Australia (-25, 133)
  await page.evaluate(() => {
    // If globeRef exists or rotate to Australia
    const search = document.querySelector('input[placeholder*="Search"]');
    if (search) {
      search.value = 'Australia';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      // Press enter
    }
  });

  const searchInput = page.locator('input[placeholder*="Search"]');
  await searchInput.fill('Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  const screenshotPath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_test_australia_now.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved test screenshot:', screenshotPath);

  // Also close the intelligence console to see full Earth
  const closeBtn = page.locator('button[title*="Return to Home Overview"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(2000);
  }

  const screenshotHomePath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_test_australia_home_closed.png';
  await page.screenshot({ path: screenshotHomePath });
  console.log('Saved home closed screenshot:', screenshotHomePath);

  await browser.close();
})();
