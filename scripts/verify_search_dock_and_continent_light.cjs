const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Initial Home Screen: search bar is at bottom center above the 3 cards
  const screenshotHome = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_37_home_search_at_bottom.png';
  await page.screenshot({ path: screenshotHome });
  console.log('Saved screenshot:', screenshotHome);

  // 2. Type "HI META" and hit Enter
  const bottomSearchInput = page.locator('input[placeholder*="Search"]').first();
  await bottomSearchInput.fill('HI META');
  console.log('Filled HI META, pressing Enter...');
  await page.keyboard.press('Enter');

  // Wait for the animated transition: search bar floats UP to TopNavbar, response appears on LEFT
  await page.waitForTimeout(3500);

  const screenshotDocked = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_38_search_docked_at_top_response_on_left.png';
  await page.screenshot({ path: screenshotDocked });
  console.log('Saved screenshot:', screenshotDocked);

  // 3. In the top search bar, search "Australia"
  const topSearchInput = page.locator('input[placeholder*="Search"]').first();
  await topSearchInput.fill('Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  // Wheel zoom out to see Australia and full continent lighting
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    for (let i = 0; i < 4; i++) {
      await page.mouse.move(cx, cy);
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(2500);

  const screenshotAustralia = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_39_australia_continent_fully_lit.png';
  await page.screenshot({ path: screenshotAustralia });
  console.log('Saved screenshot:', screenshotAustralia);

  await browser.close();
  console.log('Verification completed successfully!');
})();
